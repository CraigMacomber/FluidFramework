/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { IComponentHandle } from "@prague/component-core-interfaces";
import {
    ConnectionState,
    ITelemetryErrorEvent,
    ITelemetryLogger,
} from "@prague/container-definitions";
import {
    ISequencedDocumentMessage,
    ITree,
    MessageType,
} from "@prague/protocol-definitions";
import {
    IChannelAttributes,
    IComponentRuntime,
    IObjectStorageService,
    ISharedObjectServices,
} from "@prague/runtime-definitions";
import { ChildLogger, EventEmitterWithErrorHandling } from "@prague/utils";
import * as assert from "assert";
import * as Deque from "double-ended-queue";
// tslint:disable-next-line:no-submodule-imports
import * as uuid from "uuid/v4";
import { debug } from "./debug";
import { SharedObjectComponentHandle } from "./handle";
import { ISharedObject } from "./types";

/**
 *  Base class from which all shared objects derive
 */
export abstract class SharedObject extends EventEmitterWithErrorHandling implements ISharedObject {
    /**
     *
     * @param obj - The object to check if it is a SharedObject
     * @returns Returns true if the object is a SharedObject
     */
    public static is(obj: any): obj is SharedObject {
        if (obj !== undefined
            && obj !== null
            && obj.__sharedObject__ === true) {
            return true;
        }
        return false;
    }

    /**
     * Get an id for a sharedobject for creation
     *
     * @param id - user specified id or undefined if it is not specified
     * @returns generated id if the parameter `id` is undefined, value of `id` otherwise
     */
    protected static getIdForCreate(id?: string): string {
        return id === undefined ? uuid() : id;
    }

    public get ISharedObject() { return this; }
    public get IChannel() { return this; }
    public get IComponentLoadable() { return this; }

    /**
     * Marker to clearly identify the object as a shared object
     */
    // tslint:disable-next-line:variable-name
    public readonly __sharedObject__ = true;

    public readonly handle: IComponentHandle;

    /**
     * Telemetry logger for the shared object
     */
    protected readonly logger: ITelemetryLogger;

    /**
     * Connection state
     */
    private _state = ConnectionState.Disconnected;

    /**
     * Locally applied operations not yet ACK'd by the server
     */
    private readonly pendingOps = new Deque<{ clientSequenceNumber: number; content: any }>();

    /**
     * Services used by the shared object
     */
    private services: ISharedObjectServices | undefined;

    /**
     * True if register() has been called.
     */
    private registered: boolean = false;

    /**
     * Gets the connection state
     *
     * @returns the state of the connection
     */
    public get state(): ConnectionState {
        return this._state;
    }

    public get url(): string {
        return this.handle.path;
    }

    /**
     * @param id - the id of the shared object
     * @param runtime - the IComponentRuntime which contains the shared object
     * @param attributes - attributes of the shared object
     */
    constructor(
        public id: string,
        protected runtime: IComponentRuntime,
        public readonly attributes: IChannelAttributes) {

        super();

        this.handle = new SharedObjectComponentHandle(
            this,
            id,
            runtime.IComponentHandleContext);

        // runtime could be null since some package hasn't turn on strictNullChecks yet
        // We should remove the null check once that is done
        this.logger = ChildLogger.create(
            runtime !== null ? runtime.logger : undefined, this.attributes.type, { SharedObjectId: id });

        this.on("error", (error: any) => {
            runtime.emit("error", error);
        });
    }

    /**
     * Creates a JSON object with information about the shared object
     *
     * @returns a JSON object containing the ValueType (always Shared) and the id of the shared object
     */
    public toJSON() {
        throw new Error("Only the handle can be converted to JSON");
    }

    /**
     * A shared object, after construction, can either be loaded in the case that it is already part of
     * a shared document. Or later attached if it is being newly added.
     *
     * @param branchId - branch ID
     * @param services - services used by the shared object
     */
    public async load(
        branchId: string,
        services: ISharedObjectServices): Promise<void> {

        this.services = services;

        await this.getOwnerSnapshot(services.objectStorage);

        await this.loadCore(
            branchId,
            services.objectStorage);
        this.attachDeltaHandler();
    }

    /**
     * Initializes the object as a local, non-shared object. This object can become shared after
     * it is attached to the document.
     */
    public initializeLocal() {
        this.initializeLocalCore();
    }

    /**
     * Registers the channel with the runtime. The channel will get attach when the runtime is.
     */
    public register(): void {
        if (this.isRegistered()) {
            return;
        }

        this.registered = true;

        this.setOwner();

        // Allow derived classes to perform custom processing prior to registering this object
        this.registerCore();

        this.runtime.registerChannel(this);
    }

    /**
     * Enables the channel to send and receive ops
     */
    public connect(services: ISharedObjectServices) {
        this.services = services;
        this.attachDeltaHandler();
    }

    /**
     * Returns whether the given shared object is local
     *
     * @returns true if the given shared object is local
     */
    public isLocal(): boolean {
        return !this.services;
    }

    /**
     * Returns whether the given shared object is registered
     */
    public isRegistered(): boolean {
        return (!this.isLocal() || this.registered);
    }

    /**
     * Registers a listener on the specified events
     *
     * @param event - the event to listen for
     * @param listener - the listener to register
     */
    public on(
        event: "pre-op" | "op",
        listener: (op: ISequencedDocumentMessage, local: boolean, target: this) => void): this;
    public on(event: "error", listener: (error: any) => void): this;
    public on(event: string | symbol, listener: (...args: any[]) => void): this;

    /* tslint:disable:no-unnecessary-override */
    public on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    /**
     * Gets a form of the object that can be serialized.
     *
     * @returns a tree representing the snapshot of the shared object
     */
    public abstract snapshot(): ITree;

    /**
     * Set the owner of the object if it is an OwnedSharedObject
     *
     * @returns the owner of the object if it is an OwnedSharedObject, otherwise undefined
     */
    protected setOwner(): string | undefined {
        return;
    }

    /**
     * Reads and sets the owner from storage if this is an ownedSharedObject
     *
     * @param storage - the storage used by the shared object
     */
    protected async getOwnerSnapshot(storage: IObjectStorageService): Promise<void> {
        return;
    }

    /**
     * Allows the distributed data type to perform custom loading
     *
     * @param branchId - branch ID
     * @param services - storage used by the shared object
     */
    protected abstract loadCore(
        branchId: string,
        services: IObjectStorageService): Promise<void>;

    /**
     * Allows the distributed data type to perform custom local loading
     */
    protected initializeLocalCore() {
        return;
    }

    /**
     * Allows the distributed data type the ability to perform custom processing once an attach has happened
     */
    protected abstract registerCore();

    /**
     * Allows the distributive data type the ability to perform custom processing once an attach has happened.
     * Also called after non-local data type get loaded.
     */
    protected didAttach() {
        return;
    }

    /**
     * Derived classes must override this to do custom processing on a remote message
     *
     * @param message - the message to prepare
     * @param local - true if the shared object is local
     * @param context - additional context for the message
     */
    protected abstract processCore(message: ISequencedDocumentMessage, local: boolean);

    /**
     * Called when the object has disconnected from the delta stream
     */
    protected abstract onDisconnect();

    /**
     * Processes a message by the local client
     *
     * @param content - content of the message
     * @returns client sequence number
     */
    protected submitLocalMessage(content: any): number {
        if (this.isLocal()) {
            return -1;
        }

        // Send if we are connected - otherwise just add to the sent list
        let clientSequenceNumber = -1;
        if (this.state === ConnectionState.Connected) {
            // This assert !isLocal above means services can't be undefined.
            // tslint:disable-next-line: no-non-null-assertion
            clientSequenceNumber = this.services!.deltaConnection.submit(content);
        } else {
            debug(`${this.id} Not fully connected - adding to pending list`, content);
            this.runtime.notifyPendingMessages();
            // Store the message for when it is ACKed and then submit to the server if connected
        }

        this.pendingOps.push({ clientSequenceNumber, content });
        return clientSequenceNumber;
    }

    /**
     * Called when the object has fully connected to the delta stream
     * Default implementation for DDS, override if different behavior is required.
     *
     * @param pending - messages received while disconnected
     */
    protected onConnect(pending: any[]) {
        for (const message of pending) {
            this.submitLocalMessage(message);
        }

        return;
    }

    /**
     * Report ignorable errors in code logic or data integrity to the logger.
     * Hosting app / container may want to optimize out these call sites and make them no-op.
     * It may also show assert dialog in non-production builds of application.
     *
     * @param condition - if false, assert is logged
     * @param message - actual message to log; ideally should be unique message to identify call site
     */
    protected debugAssert(condition: boolean, event: ITelemetryErrorEvent) {
        this.logger.debugAssert(condition, event);
    }

    private attachDeltaHandler() {
        // Allows objects to start listening for events
        this.didAttach();

        // attachDeltaHandler is only called after services is assigned
        // tslint:disable-next-line: no-non-null-assertion
        this.services!.deltaConnection.attach({
            process: (message, local) => {
                this.process(message, local);
            },
            setConnectionState: (state: ConnectionState) => {
                this.setConnectionState(state);
            },
        });

        // Trigger initial state
        // attachDeltaHandler is only called after services is assigned
        // tslint:disable-next-line: no-non-null-assertion
        this.setConnectionState(this.services!.deltaConnection.state);
    }

    private setConnectionState(state: ConnectionState) {
        if (this._state === state) {
            // Not changing state, nothing the same.
            return;
        }

        // Should I change the state at the end? So that we *can't* send new stuff before we send old?
        this._state = state;

        switch (state) {
            case ConnectionState.Disconnected:
                // Things that are true now...
                // - if we had a connection we can no longer send messages over it
                // - if we had outbound messages some may or may not be ACK'd. Won't know until next message
                //
                // - nack could get a new msn - but might as well do it in the join?
                this.onDisconnect();
                break;

            case ConnectionState.Connecting:
                // Things that are now true...
                // - we will begin to receive inbound messages
                // - we know what our new client id is.
                // - still not safe to send messages

                // While connecting we are still ticking off the previous messages
                debug(`${this.id} is now connecting`);
                break;

            case ConnectionState.Connected:
                // Extract all un-ack'd payload operation
                const pendingOps = this.pendingOps.toArray().map((value) => value.content);
                this.pendingOps.clear();

                // And now we are fully connected
                // - we have a client ID
                // - we are caught up enough to attempt to send messages
                this.onConnect(pendingOps);

                break;

            default:
                assert.ok(false, `Unknown ConnectionState ${state}`);
        }
    }

    /**
     * Handles a message being received from the remote delta server
     */
    private process(message: ISequencedDocumentMessage, local: boolean) {
        if (message.type === MessageType.Operation && local) {
            this.processPendingOp(message);
        }

        this.emit("pre-op", message, local);
        this.processCore(message, local);
        this.emit("op", message, local);
    }

    private processPendingOp(message: ISequencedDocumentMessage) {
        const firstPendingOp = this.pendingOps.peekFront();

        // disconnected ops should never be processed. They should have been fully sent on connected
        if (firstPendingOp !== undefined) {
            assert(firstPendingOp.clientSequenceNumber !== -1,
                `processing disconnected op ${firstPendingOp.clientSequenceNumber}`);

            // One of our messages was sequenced. We can remove it from the local message list. Given these arrive
            // in order we only need to check the beginning of the local list.

            if (firstPendingOp.clientSequenceNumber === message.clientSequenceNumber) {
                this.pendingOps.shift();
                if (this.pendingOps.length === 0) {
                    this.emit("processed");
                }
                return;
            }
        }

        this.logger.sendErrorEvent({ eventName: "DuplicateAckReceived" });
    }
}
