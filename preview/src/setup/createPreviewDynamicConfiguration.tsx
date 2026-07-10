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

import type { ComponentType, JSX } from "react";

import type {
	DynamicConfiguration,
	DynamicMatchCondition,
	ViewNGProps
} from "@com.mgmtp.a12.client/client-core";
import { ModelSelectors, NullRegionLayoutNG } from "@com.mgmtp.a12.client/client-core";
import { FormEngineViews, isFormModel } from "@com.mgmtp.a12.formengine/formengine-core";

import type { PreviewApplicationProps } from "../ui/previewApplication.js";
import { PreviewApplication } from "../ui/previewApplication.js";

const PREVIEW_ROOT_REGION = "";
const matchesPreviewActivity: DynamicMatchCondition = descriptor =>
	descriptor.instance !== undefined;

export interface PreviewDynamicConfigurationOptions {
	/**
	 * Custom view component to render inside the preview region.
	 * When provided, `applicationHeader` and `additionalMenuItems` are ignored.
	 * Defaults to `PreviewApplication` wrapping `FormEngineViews.FormEngine`.
	 */
	readonly viewComponent?: ComponentType<ViewNGProps>;

	/** Header element rendered in the top bar of `PreviewApplication`. */
	readonly applicationHeader?: JSX.Element;

	/** Extra menu items appended to the `PreviewApplication` sidebar. */
	readonly additionalMenuItems?: PreviewApplicationProps["additionalMenuItems"];
}

/**
 * Creates a {@link DynamicConfiguration} that wires up the form engine preview:
 *
 * - Registers a root region with a null layout (the preview supplies its own layout)
 * - Registers a flow that creates a scene whenever a preview activity is active
 * - On scene entry, adds the view component to the root region together with
 *   the currently loaded form model (if any)
 *
 * The default view renders {@link PreviewApplication} wrapping
 * {@link FormEngineViews.FormEngine}. Provide a custom `viewComponent` to
 * replace it entirely, or pass `applicationHeader` / `additionalMenuItems`
 * to configure the default view.
 */
export function createPreviewDynamicConfiguration(
	options?: PreviewDynamicConfigurationOptions
): DynamicConfiguration {
	const ViewComponent = options?.viewComponent ?? createDefaultPreviewView(options);

	return {
		id: "preview-dynamic-configuration",
		regions() {
			return [{ name: PREVIEW_ROOT_REGION, layout: NullRegionLayoutNG }];
		},
		flows(state) {
			const formModel = Object.values(ModelSelectors.models()(state)).find(m => isFormModel(m));
			return [
				{
					name: "previewFlow",
					scenes: [
						{
							name: "previewScene",
							matches: matchesPreviewActivity,
							sceneChange: {
								onEnter: [
									{
										type: "DYNAMIC_ADD_VIEW",
										component: ViewComponent,
										region: PREVIEW_ROOT_REGION,
										models: formModel ? [{ modelType: "form", name: formModel.header.id }] : []
									}
								]
							}
						}
					]
				}
			];
		}
	};
}

function createDefaultPreviewView(
	options?: Pick<PreviewDynamicConfigurationOptions, "applicationHeader" | "additionalMenuItems">
): ComponentType<ViewNGProps> {
	return function DefaultPreviewView(props: ViewNGProps): JSX.Element {
		return (
			<PreviewApplication
				{...props}
				name="PreviewApplication"
				applicationHeader={options?.applicationHeader ?? <></>}
				additionalMenuItems={options?.additionalMenuItems}
			>
				<FormEngineViews.FormEngine {...props} />
			</PreviewApplication>
		);
	};
}
