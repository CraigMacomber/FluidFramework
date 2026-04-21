/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { createDevtoolsLogger, initializeFluidDevtools } from "@fluidframework/devtools/alpha";
import {
	FormattedMainView,
	QuillMainView as PlainQuillView,
	// TODO: These imports use /internal entrypoints because the underlying APIs
	// haven't been promoted to public yet. Update to public entrypoints as the
	// APIs are stabalized.
	// eslint-disable-next-line import-x/no-internal-modules
} from "@fluidframework/quill-react/internal";
import {
	toPropTreeNode,
	UndoRedoStacks,
	type UndoRedo,
	PlainTextMainView,
	// eslint-disable-next-line import-x/no-internal-modules
} from "@fluidframework/react/internal";
import {
	createTinyliciousServiceClient,
	type TinyliciousServiceOptions,
} from "@fluidframework/tinylicious-driver/alpha";
// eslint-disable-next-line import-x/no-internal-modules
import { FormattedTextAsTree } from "@fluidframework/tree/internal";
import { SchemaFactory, TreeViewConfiguration, type TreeView } from "fluid-framework";
import {
	TextAsTree,
	treeDataStoreKind,
	type FluidContainerAttached,
} from "fluid-framework/alpha";
// eslint-disable-next-line import-x/no-internal-modules, import-x/no-unassigned-import
import "quill/dist/quill.snow.css";
import { type FC, useEffect, useMemo, useState } from "react";
// eslint-disable-next-line import-x/no-internal-modules
import { createRoot } from "react-dom/client";

const sf = new SchemaFactory("com.fluidframework.example.text-editor");

export class TextEditorRoot extends sf.object("TextEditorRoot", {
	plainText: TextAsTree.Tree,
	formattedText: FormattedTextAsTree.Tree,
}) {}

export const treeConfig = new TreeViewConfiguration({ schema: TextEditorRoot });

/**
 * Data store kind for the text editor application.
 * Defines the schema, view configuration, and initial (empty) state for both plain and formatted text trees.
 */
const textEditorKind = treeDataStoreKind({
	type: "text-editor",
	config: treeConfig,
	initializer: () =>
		new TextEditorRoot({
			plainText: TextAsTree.Tree.fromString(""),
			formattedText: FormattedTextAsTree.Tree.fromString(""),
		}),
});

type ViewType = "plainTextarea" | "plainQuill" | "formatted";

interface DualUserViews {
	user1: TreeView<typeof TextEditorRoot>;
	user2: TreeView<typeof TextEditorRoot>;
	containerId: string;
}

/**
 * Initializes Fluid containers and returns tree views for two simulated users.
 *
 * @remarks
 * Uses `location.hash` to determine whether to create a new container or load an existing one.
 * A second independent service client then loads the same container, providing a second user's view
 * for side-by-side collaboration testing in a single browser tab.
 */
async function initFluid(): Promise<DualUserViews> {
	// Initialize telemetry logger for use with Devtools
	const devtoolsLogger = createDevtoolsLogger();

	const options: TinyliciousServiceOptions = {
		minVersionForCollab: "2.100.0",
		// TODO: logger
		// TODO: user ids.
	};

	const service1 = createTinyliciousServiceClient(options);

	let user1Container: FluidContainerAttached<TreeView<typeof TextEditorRoot>>;
	if (location.hash) {
		// Load existing document for both users
		const rawContainerId = location.hash.slice(1);
		// Basic validation for container ID from URL hash before making network requests
		const isValidContainerId =
			rawContainerId.length > 0 && /^[\dA-Za-z-]{3,64}$/.test(rawContainerId);
		if (!isValidContainerId) {
			console.error(`Invalid container ID in URL hash: "${rawContainerId}"`);
			throw new Error(
				"Invalid container ID in URL hash. Expected 3-64 alphanumeric or '-' characters.",
			);
		}

		// User 1 connects to existing document
		user1Container = await service1.loadContainer(rawContainerId, textEditorKind);
	} else {
		// User 1 creates the document
		const container = await service1.createContainer(textEditorKind);
		user1Container = await container.attach();
		// eslint-disable-next-line require-atomic-updates
		location.hash = user1Container.id;
	}
	const containerId = user1Container.id;

	const service2 = createTinyliciousServiceClient(options);

	// User 2 connects to the loaded document
	const user2Container = await service2.loadContainer(containerId, textEditorKind);

	// Initialize Devtools
	await initializeFluidDevtools({
		logger: devtoolsLogger,
		initialContainers: [
			{
				container: user1Container,
				containerKey: "User 1 Container",
			},
			{
				container: user2Container,
				containerKey: "User 2 Container",
			},
		],
	});

	return {
		user1: user1Container.data,
		user2: user2Container.data,
		containerId,
	};
}

const viewLabels = {
	plainTextarea: {
		description: "Plain Textarea",
		component: (
			root: TextEditorRoot,
			_treeView: TreeView<typeof TextEditorRoot>,
			_undoRedo?: UndoRedo,
		) => <PlainTextMainView root={toPropTreeNode(root.plainText)} />,
	},
	plainQuill: {
		description: "Plain Quill Editor",
		component: (
			root: TextEditorRoot,
			_treeView: TreeView<typeof TextEditorRoot>,
			_undoRedo?: UndoRedo,
		) => <PlainQuillView root={toPropTreeNode(root.plainText)} />,
	},
	formatted: {
		description: "Formatted Quill Editor",
		component: (
			root: TextEditorRoot,
			_treeView: TreeView<typeof TextEditorRoot>,
			undoRedo?: UndoRedo,
		) => <FormattedMainView root={toPropTreeNode(root.formattedText)} undoRedo={undoRedo} />,
	},
} as const;

const UserPanel: FC<{
	label: string;
	color: string;
	viewType: ViewType;
	treeView: TreeView<typeof TextEditorRoot>;
}> = ({ label, color, viewType, treeView }) => {
	// Create undo/redo stack for this user's tree view
	const undoRedo = useMemo(() => new UndoRedoStacks(treeView.events), [treeView.events]);

	// Cleanup on unmount
	useEffect(() => {
		return () => undoRedo.dispose();
	}, [undoRedo]);

	// TODO: handle root invalidation, schema upgrades and out of schema documents.
	const renderView = (): JSX.Element => {
		const root = treeView.root;
		return viewLabels[viewType].component(root, treeView, undoRedo);
	};

	return (
		<div
			style={{
				width: "calc(50% - 10px)",
				minWidth: 0,
				border: `2px solid ${color}`,
				borderRadius: "8px",
				padding: "10px",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					marginBottom: "10px",
					fontWeight: "bold",
					color,
				}}
			>
				{label}
			</div>
			<div style={{ flex: 1 }}>{renderView()}</div>
		</div>
	);
};

export const App: FC<{ views: DualUserViews }> = ({ views }) => {
	const [viewType, setViewType] = useState<ViewType>("formatted");

	return (
		<div
			style={{
				padding: "20px",
				height: "100vh",
				boxSizing: "border-box",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div style={{ marginBottom: "15px" }}>
				<label htmlFor="view-select" style={{ marginRight: "10px", fontWeight: "bold" }}>
					View:
				</label>
				<select
					id="view-select"
					value={viewType}
					onChange={(e) => setViewType(e.target.value as ViewType)}
					style={{
						padding: "8px 12px",
						fontSize: "14px",
						borderRadius: "4px",
						border: "1px solid #ccc",
					}}
				>
					{(Object.keys(viewLabels) as ViewType[]).map((type) => (
						<option key={type} value={type}>
							{viewLabels[type].description}
						</option>
					))}
				</select>
			</div>
			<div
				style={{
					flex: 1,
					display: "flex",
					gap: "20px",
					alignItems: "stretch",
				}}
			>
				<UserPanel label="User 1" color="#4a90d9" viewType={viewType} treeView={views.user1} />
				<UserPanel label="User 2" color="#28a745" viewType={viewType} treeView={views.user2} />
			</div>
		</div>
	);
};

async function start(): Promise<void> {
	const rootElement = document.querySelector("#content");
	if (!rootElement) return;

	try {
		const views = await initFluid();
		const root = createRoot(rootElement);
		root.render(<App views={views} />);
	} catch (error) {
		console.error("Failed to start:", error);
		rootElement.innerHTML = `<div style="color: #721c24; background: #f8d7da; padding: 20px; border-radius: 4px; border: 1px solid #f5c6cb;">
			<h2>Failed to connect to Tinylicious</h2>
			<p><strong>Error:</strong> ${error instanceof Error ? error.message : String(error)}</p>
			<h3>Troubleshooting:</h3>
			<ol>
				<li>Make sure Tinylicious is running: <code>pnpm tinylicious</code></li>
				<li>In Codespaces: Forward port 7070 and set visibility to <strong>Public</strong></li>
			</ol>
		</div>`;
	}
}

// eslint-disable-next-line unicorn/prefer-top-level-await
start().catch(console.error);
