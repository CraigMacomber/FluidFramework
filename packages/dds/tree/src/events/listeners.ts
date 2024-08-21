/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * `true` iff the given type is an acceptable shape for a {@link Listeners | event} listener
 * @public
 */
export type IsListener<TListener> = TListener extends (...args: any[]) => void ? true : false;

/**
 * Used to specify the kinds of events emitted by a {@link Listenable}.
 *
 * @remarks
 * Any object type is a valid {@link Listeners}, but only the {@link IsListener | event-like} properties of that
 * type will be included.
 *
 * @example
 * ```typescript
 * interface MyEvents {
 *   load: (user: string, data: IUserData) => void;
 *   error: (errorCode: number) => void;
 * }
 * ```
 *
 * @public
 */
export type Listeners<T extends object> = {
	[P in (string | symbol) & keyof T as IsListener<T[P]> extends true ? P : never]: T[P];
};

/**
 * An object which allows the registration of listeners so that subscribers can be notified when an event happens.
 * @param TListeners - All the {@link Listeners | events} that this subscribable supports
 *
 * @privateRemarks
 * `EventEmitter` can be used as a base class to implement this via extension.
 * ```ts
 * type MyEventEmitter = IEventEmitter<{
 *   load: (user: string, data: IUserData) => void;
 *   error: (errorCode: number) => void;
 * }>
 * ```
 * {@link createEmitter} can help implement this interface via delegation.
 *
 * @sealed @public
 */
export interface Listenable<TListeners extends object> {
	/**
	 * Register an event listener.
	 * @param eventName - the name of the event
	 * @param listener - the handler to run when the event is fired by the emitter
	 * @returns a {@link Off | function} which will deregister the listener when called.
	 * This deregistration function is idempotent and therefore may be safely called more than once with no effect.
	 * @remarks Do not register the exact same `listener` object for the same event more than once.
	 * Doing so will result in undefined behavior, and is not guaranteed to behave the same in future versions of this library.
	 */
	on<K extends keyof Listeners<TListeners>>(eventName: K, listener: TListeners[K]): Off;
}

/**
 * A function that, when called, will deregister an event listener subscription that was previously registered.
 * @remarks
 * It is returned by the {@link Listenable.on | event registration function} when event registration occurs.
 * @public
 */
export type Off = () => void;
