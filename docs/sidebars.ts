/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
	/**
	 * Sidebar associated with `/docs`
	 */
	docsSidebar: [
		{ type: "doc", id: "home" },
		{
			type: "category",
			label: "Getting Started",
			items: [{ type: "autogenerated", dirName: "start" }],
			link: { type: "doc", id: "start/quick-start" },
		},
		{
			type: "category",
			label: "Build With Fluid",
			items: [{ type: "autogenerated", dirName: "build" }],
			link: { type: "doc", id: "build/overview" },
		},
		{
			type: "category",
			label: "Testing",
			items: [{ type: "autogenerated", dirName: "testing" }],
			link: { type: "doc", id: "testing/tinylicious" },
		},
		{
			type: "category",
			label: "Deployment",
			items: [{ type: "autogenerated", dirName: "deployment" }],
			link: { type: "doc", id: "deployment/service-options" },
		},
		{
			type: "category",
			label: "Data Structures",
			items: [{ type: "autogenerated", dirName: "data-structures" }],
			link: { type: "doc", id: "data-structures/overview" },
		},
		{
			type: "category",
			label: "Concepts",
			items: [{ type: "autogenerated", dirName: "concepts" }],
			link: { type: "doc", id: "concepts/architecture" },
		},
		{ type: "doc", id: "faq" },
		{ type: "doc", id: "glossary" },
		{
			type: "link",
			label: "Release Notes",
			href: "https://github.com/microsoft/FluidFramework/releases/tag/client_v2.0.0",
		},
		{
			type: "category",
			label: "API Documentation",
			items: [
				{
					type: "category",
					label: "fluid-framework",
					items: [{ type: "autogenerated", dirName: "api/fluid-framework" }],
					link: { type: "doc", id: "api/fluid-framework/index" },
				},

				{
					type: "category",
					label: "@fluidframework/azure-client",
					items: [{ type: "autogenerated", dirName: "api/azure-client" }],
					link: { type: "doc", id: "api/azure-client/index" },
				},
				{
					type: "category",
					label: "@fluidframework/odsp-client",
					items: [{ type: "autogenerated", dirName: "api/odsp-client" }],
					link: { type: "doc", id: "api/odsp-client/index" },
				},
				{
					type: "category",
					label: "@fluidframework/tinylicious-client",
					items: [{ type: "autogenerated", dirName: "api/tinylicious-client" }],
					link: { type: "doc", id: "api/tinylicious-client/index" },
				},
				{
					type: "category",
					label: "@fluidframework/devtools",
					items: [{ type: "autogenerated", dirName: "api/devtools" }],
					link: { type: "doc", id: "api/devtools/index" },
				},
				{
					type: "category",
					label: "@fluidframework/presence",
					items: [{ type: "autogenerated", dirName: "api/presence" }],
					link: { type: "doc", id: "api/presence/index" },
				},
				{
					type: "category",
					label: "@fluidframework/ai-collab",
					items: [{ type: "autogenerated", dirName: "api/ai-collab" }],
					link: { type: "doc", id: "api/ai-collab/index" },
				},
			],
			link: { type: "doc", id: "api/index" },
		},
	],
};

export default sidebars;
