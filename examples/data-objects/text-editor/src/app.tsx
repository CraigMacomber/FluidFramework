/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

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
// eslint-disable-next-line import-x/no-internal-modules
import { createTinyliciousServiceClient } from "@fluidframework/tinylicious-driver/internal";
// eslint-disable-next-line import-x/no-internal-modules
import { FormattedTextAsTree } from "@fluidframework/tree/internal";
import { SchemaFactory, TreeViewConfiguration, type TreeView } from "fluid-framework";
import { TextAsTree, treeDataStoreKind } from "fluid-framework/alpha";
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
	const service1 = createTinyliciousServiceClient();

	let containerId: string;
	let user1View: TreeView<typeof TextEditorRoot>;

	if (location.hash) {
		const rawContainerId = location.hash.slice(1);
		const isValidContainerId =
			rawContainerId.length > 0 && /^[\dA-Za-z-]{3,64}$/.test(rawContainerId);
		if (!isValidContainerId) {
			throw new Error(
				"Invalid container ID in URL hash. Expected 3-64 alphanumeric or '-' characters.",
			);
		}
		containerId = rawContainerId;
		const container = await service1.loadContainer(containerId, textEditorKind);
		user1View = container.data;
	} else {
		const container = await service1.createContainer(textEditorKind);
		const attached = await container.attach();
		containerId = attached.id;
		// eslint-disable-next-line require-atomic-updates
		location.hash = containerId;
		user1View = attached.data;
	}

	const service2 = createTinyliciousServiceClient();
	const user2Container = await service2.loadContainer(containerId, textEditorKind);

	return {
		user1: user1View,
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
	const undoRedo = useMemo(() => new UndoRedoStacks(treeView.events), [treeView.events]);

	useEffect(() => {
		return () => undoRedo.dispose();
	}, [undoRedo]);

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
