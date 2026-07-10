/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import { StrictMode } from "react";
import type { ComponentType, JSX } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import type { DynamicConfiguration, ViewNGProps } from "@com.mgmtp.a12.client/client-core";
import { ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";

import type { PreviewApplicationProps } from "../ui/previewApplication.js";
import { PreviewClientApp } from "../ui/previewClientApp.js";

import { createPreviewApplicationSetup } from "./createPreviewApplicationSetup.js";
import type { PreviewApplicationSetupOptions } from "./createPreviewApplicationSetup.js";
import { createPreviewDynamicConfiguration } from "./createPreviewDynamicConfiguration.js";

export interface MountPreviewApplicationOptions extends PreviewApplicationSetupOptions {
	/** Header element rendered in the top bar of the preview. */
	readonly applicationHeader?: JSX.Element;

	/** Extra menu items appended to the preview sidebar. */
	readonly additionalMenuItems?: PreviewApplicationProps["additionalMenuItems"];

	/**
	 * Replaces the entire default view component (PreviewApplication + FormEngine).
	 * When provided, `applicationHeader` and `additionalMenuItems` are ignored.
	 */
	readonly viewComponent?: ComponentType<ViewNGProps>;

	/**
	 * Override the DynamicConfiguration module that registers the preview scene.
	 * Use this when you need full control over regions, flows, or scene matching.
	 * Defaults to {@link createPreviewDynamicConfiguration} with the options above.
	 */
	readonly dynamicConfiguration?: DynamicConfiguration;

	/**
	 * Locale for the notification frame and dirty-handling dialog.
	 * Defaults to en_US.
	 */
	readonly locale?: Locale;

	/**
	 * Called once synchronously after {@link createRoot} renders.
	 * Use this to send initial messages (e.g. `postMessageToCore`).
	 */
	readonly onMounted?: () => void;
}

/**
 * Mounts a self-contained form engine preview into the given DOM element.
 *
 * This is the top-level entry point for preview consumers. It handles:
 *
 * 1. Registering the preview {@link DynamicConfiguration} module
 * 2. Creating the Redux store via {@link createPreviewApplicationSetup}
 * 3. Rendering the full app shell ({@link PreviewClientApp}) inside a Redux {@link Provider}
 * 4. Calling the optional {@link MountPreviewApplicationOptions.onMounted} callback
 */
export function mountPreviewApplication(
	mountPoint: Element,
	options: MountPreviewApplicationOptions
): void {
	const module =
		options.dynamicConfiguration ??
		createPreviewDynamicConfiguration({
			viewComponent: options.viewComponent,
			applicationHeader: options.applicationHeader,
			additionalMenuItems: options.additionalMenuItems
		});
	ModuleRegistryProvider.getInstance().addModule(module);

	const { store } = createPreviewApplicationSetup(options);

	createRoot(mountPoint).render(
		<StrictMode>
			<Provider store={store}>
				<PreviewClientApp locale={options.locale} />
			</Provider>
		</StrictMode>
	);

	options.onMounted?.();
}
