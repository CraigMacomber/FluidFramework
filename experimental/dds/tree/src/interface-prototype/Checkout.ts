import { Serializable } from '@fluidframework/datastore-definitions';
import { EventEmitterWithErrorHandling } from '@fluidframework/telemetry-utils';
import { ICheckoutEvents } from '../Checkout';
import { Change, ConstraintEffect } from '../default-edits';
import { OrderedEditSet } from '../EditLog';
import { ChangeNode as BuildNode } from '../generic';
// This file uses these as opaque id types:
// the user of these APIs should not know or care if they are short IDs or not, other than that they must be converted to StableId if stored for use outside of the shared tree it was acquired from.
// In practice, these would most likely be implemented as ShortId numbers.
import { Definition, NodeId, TraitLabel, EditId, DetachedSequenceId } from '../Identifiers';
import { LogViewer } from '../LogViewer';

// TODO: we are just reusing the exiting Snapshot type.
// This existing type does not support partial checkout:
// It would be extended to support partial checkout by allowing it to return Placeholders when walking it.
// There would then be an API to asynchronously load a Placeholder.
// On top of this, we would provide two additional features:
// - A way to control where Placeholders are allowed to occur using the PrefetchingCheckout pattern
//   (preload enough chunks so that you only encounter Placeholders at explicitly allowed locations, ex: by Definition, TraitLabel etc).
// - An API (implemented using the other APIs) that appears synchronous, but may throw if a placeholder's content is needed but isn't available.
//
// Additionally we would will need to augment Snapshot with enough history to be able to resolve rebased anchors, and give it a nicer API,
// Probably something more like TreeNodeHandle and/or the non-mutating subset of TreeNode.
import { Snapshot } from '../Snapshot';
import { Anchor, AnchorData, PlaceData, RangeData, StableId, TreeNodeData } from './Anchors';
import { DetachedSequence, Place, Range, TreeNode } from './TreeAnchors';
import { areSafelyAssignable, isTrue } from './TypeCheck';

export type CommandId = StableId & { readonly CommandId: 'b1b691dc-9142-4ea2-a1aa-5f04c3808fea' };

interface AnchorSet {
	[key: string]: Anchor;
}

type DecontextualizedAnchorSet<TAnchorSet extends AnchorSet> = {
	[Property in keyof TAnchorSet]: Decontextualize<TAnchorSet[Property]>;
};

export interface Command<TOptions extends Serializable, TAnchorSet extends AnchorSet, TResult> {
	run(context: CommandContext, options: TOptions, anchors: TAnchorSet): TResult;
	id: CommandId;
	// Maybe include localized string information/metadata here?
}

// TODO: maybe add more things to this, or move it Anchor.
export interface CommandContext extends IdSerializer, LogViewer, OrderedEditSet<Change> {
	runCommand<TOptions extends Serializable, TAnchorSet extends AnchorSet, TResult>(
		command: Command<TOptions, TAnchorSet, TResult>,
		parameters: TOptions,
		anchors: DecontextualizedAnchorSet<TAnchorSet> // Anchors will be contextualized into the tree provided to the command.
	): TResult;

	/**
	 * Detach this range from the tree.
	 *
	 * This range will point to the detached nodes, but the same range is also returned as the a more strongly typed DetachedSequence.
	 */
	detach(range: RangeData): DetachedSequence;

	// Could include moveTo(place) here, though it would be redundant with place.insert(range)

	// Add a a constraint that this range is valid to the current transaction.
	useAsConstraint(range: RangeData, effect: ConstraintEffect): void;

	// Implicitly detaches or builds if needed then inserts (aka moves)?
	insert(
		destination: PlaceData,
		source: TreeNodeData | RangeData | DetachedSequence | DetachedSequenceId | BuildNode
	): Range;

	// If the insert API is ambiguous we can add a move.
	// move(destination: Place, source: TreeNodeData | RangeData | DetachedSequence | DetachedSequenceId);

	setValue(newValue: Serializable): void;
}

// TODO: actually implement this as a NodeId based anchor using the standard root node id.
export const root: TreeNodeData = (undefined as unknown) as TreeNodeData;

/**
 * A view of a tree.
 *
 * This view may change over time as edits are applied.
 */
export interface Tree extends EventEmitterWithErrorHandling<ICheckoutEvents> {
	/**
	 * The current view of this tree as an immutable snapshot.
	 * This is updated copy on write, and thus may be held onto arbitrarily but will not update:
	 * to observe actual updates, either hold onto the Tree itself, subscribe to the ViewChange event, or use a mutable view provided by the specific Tree.
	 */
	currentView: Snapshot;

	/**
	 * Get a handle into the tree from anchors which might have come from another context
	 * (ex: serialized, or just from another tree).
	 *
	 * Use {@lint root} to get the whole tree.
	 *
	 * Returned anchors will observe the current state of this tree, and update as this tree changes.
	 * They may be invalid, and the validity may change over time as the tree is edited.
	 *
	 * This converts PlaceData -> Place, RangeData -> Range etc.
	 */
	contextualizeAnchor<TData extends AnchorData>(anchor: TData): Contextualize<TData>;
}

type Contextualize<TData extends AnchorData> = TData extends PlaceData
	? Place
	: TData extends RangeData
	? Range
	: TData extends TreeNodeData
	? TreeNode
	: Anchor;

// We would use this more specific type, but it causes the mutable versions to not be subtypes of the views.
// export type ParentReadonly = Trait<TreeNodeViewReadonly, PlaceViewReadonly>;

isTrue<areSafelyAssignable<Place, Contextualize<Place>>>();
isTrue<areSafelyAssignable<Range, Contextualize<Range>>>();
isTrue<areSafelyAssignable<TreeNode, Contextualize<TreeNode>>>();

isTrue<areSafelyAssignable<Place, Contextualize<PlaceData>>>();
isTrue<areSafelyAssignable<Range, Contextualize<RangeData>>>();
isTrue<areSafelyAssignable<TreeNode, Contextualize<TreeNodeData>>>();

type Decontextualize<TData extends AnchorData> = TData extends PlaceData
	? PlaceData
	: TData extends RangeData
	? RangeData
	: TData extends TreeNodeData
	? TreeNodeData
	: AnchorData;

// ////////////////////////////////////////////////////////////////////////////////

// Document and Snapshots

export interface SharedTree extends Tree {
	// createBranch(...);
	// mergeBranch(...);
	// deleteBranch(...);
	// squash(firstRevision: ShortId, lastRevision: ShortId); // Revision id is changeId of preceding edit
	// addSnapshot(revision: ShortId): SharedTreeSnapshot;
	// getSnapshot(revision: ShortId): SharedTreeSnapshot;
	// removeSnapshot(revision: ShortId): void;
	// readonly firstRevision: ShortId;  // Or a constant value, e.g. 0x1?
	// getChange(changeId: ShortId): TreeNode;
	// nextChange(changeId: ShortId): ShortId; // Must take branching into account once we have that
	// previousChange(changeId: ShortId): ShortId;
	// createDiff(...);
	// ...

	// Synchronously produce a checkout where placeholders show up wherever they are in the actual data.
	checkout(r: CommandRegistry): Checkout;
	// Get a checkout with control over where the placeholders are.
	checkout(r: CommandRegistry, prefetchFilter: PrefetchFilter): Promise<Checkout>;
	// TODO: maybe option to get checkout with different API for when enforcing no placeholders at all (aka prefetching everything)
}

/**
 * Specifies what data to prefetch.
 * Where the filters return false, Placeholders are allowed.
 * Returning true for all with fetch everything and produce no placeholders.
 */
export interface PrefetchFilter {
	value: Filter<Definition>;
	children: Filter<Definition>;
	traitChunks: Filter<TraitLabel>;
}

type Filter<T> = (_: T) => boolean;

interface Aborted {
	error: Error | string;
}

/**
 * Head of a branch. Provides APIs for:
 *  - Viewing the version of the tree (via `Tree`). Includes locating existing Anchors in this tree.
 *  - Notifications for changes (via `viewChange` event).
 *  - Modifying the tree via commands which add a transaction (via `runCommand`).
 */
export interface Checkout extends Tree {
	/**
	 * Run a command to transactionally modify the tree.
	 *
	 * TODO: decide if changes made during the transaction should be reflected in the output of the checkout while being applied.
	 * Maybe sometimes, but not always?
	 * Maybe different change event for during transactions, and/or annotate videChange with extra data about transaction?
	 * If receiver of the event tracks the before snapshot, this pattern might work better.
	 */
	runCommand<TOptions extends Serializable, TAnchorSet extends AnchorSet, TResult>(
		command: Command<TOptions, TAnchorSet, TResult>,
		parameters: TOptions,
		anchors: DecontextualizedAnchorSet<TAnchorSet>
	): { editId: EditId; result: TResult } | Aborted;

	// TODO: need API for async command application (runs async commands and also supports running synchronous commands with retry after loading data)
}

interface IdSerializer {
	// might want different entry points for different types
	stabilize(id: Definition | TraitLabel | NodeId | EditId): StableId;

	loadDefinition(id: StableId): Definition;
	loadTraitLabel(id: StableId): TraitLabel;
	loadNodeId(id: StableId): NodeId;
	loadEditId(id: StableId): EditId;
}
/**
 * This allows interop between snapshot and anchor APIs.
 * Eventually this should be unneeded because either:
 * - We stop exposing NodeId's at this API level, so we always already have TreeNodeData instead,
 * OR
 * - We make NodeId usable as a TreeNodeData directly.
 */
export function anchorDataFromNodeId(id: NodeId): TreeNodeData {
	// TODO: implement or make unneeded.
	throw new Error('not implemented');
}

// Misc things
export class RecoverableError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'RecoverableError';
		if (Error.captureStackTrace !== undefined) {
			Error.captureStackTrace(this);
		}
	}
}

export class PlaceholderNotLoaded extends RecoverableError {
	public constructor(readonly placeholder: Anchor) {
		super('placeholder not loaded');
	}
}

export type CommandRegistry = readonly Command<any, any, any>[];

// callbacks to inform the registry about commands being used.
// TODO: do we need these? if so, use events instead?
// beforeCommandApplied(commandId: CommandId, anchors?: object, parameters?: object);
// afterCommandApplied(commandId: CommandId, anchors?: object, parameters?: object);

// Could add events like these.
// These really only make sense for linear histories, so could apply within a transaction, or to sequenced edits, but not to checkouts in general.
interface ChangeListener {
	AfterCreate(nodes: TreeNode[]);
	AfterInsert(range: Range);
	BeforeDetach(range: Range);
	BeforeDestroy(nodes: TreeNode[]);
	ValueChange<T>(node: TreeNode, oldValue: T, newValue: T);
}
