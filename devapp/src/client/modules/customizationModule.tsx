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

import type { ComponentType } from "react";

import type { LayoutNG, Module } from "@com.mgmtp.a12.client/client-core";
import { ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core";
import type { FormEngineViews, Config } from "@com.mgmtp.a12.formengine/formengine-core";

import { selectCurrentFormName } from "./utils.js";

/**
 * Provides a way to register customizations for devapp examples on a
 * "per-name" basis
 *
 * Configuration/Options are merged with the default values, allowing to override them
 */
export interface DevappCustomization extends Omit<Module, "id"> {
	/**
	 * The specific form model for which the customization should be applied
	 */
	readonly formModelName: string;

	readonly config?: Partial<Config>;

	/**
	 * Overrides the layout used for the `/CONTENT` region while this form model is open, e.g. to
	 * use `MasterDetailRegionLayoutNG` for examples that add further views into that region.
	 */
	readonly layout?: LayoutNG;

	/**
	 * Skips wrapping the form in the devapp preview application (header/menu/sidebar). Needed for
	 * examples that render multiple views into `/CONTENT` at once, since nesting multiple
	 * `PreviewApplication`s is not supported.
	 */
	readonly withoutPreview?: boolean;

	readonly FormEngineView?: ComponentType<FormEngineViews.FormEngineProps>;
}

export function getCustomization(currentForm?: string) {
	return ModuleRegistryProvider.getInstance()
		.getAllModules()
		.find(mod => "formModelName" in mod && currentForm === mod.formModelName) as
		DevappCustomization | undefined;
}

/**
 * Convenience helper method to register a devapp customization
 *
 * Given middlewares are wrapped to ensure that multiple examples will not
 * conflict with each other, e.g:
 *
 * - customization A provides a middleware that modifies event actions
 * - customization B also provides a middleware that modifies event actions
 *
 * If form model A is now opened, only the middleware for A should be "active"
 */
export function registerCustomization(customization: DevappCustomization) {
	const { middlewares, formModelName } = customization;

	return ModuleRegistryProvider.getInstance().addModule({
		id: `customization-for-${customization.formModelName}`,
		...customization,
		middlewares(state) {
			const currentForm = selectCurrentFormName(state);

			return formModelName === currentForm ? (middlewares?.(state) ?? []) : [];
		}
	});
}
