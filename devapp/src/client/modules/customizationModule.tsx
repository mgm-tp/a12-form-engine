// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ComponentType } from "react";

import type { Module } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import { ModuleRegistryProvider } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import type {
	MiddlewareOptions,
	FormEngineViews,
	Config
} from "@com.mgmtp.a12.formengine/formengine-core";

import { selectCurrentFormName } from "./utils.js";

/**
 * Provides a way to register customizations for devapp examples on a
 * "per-name" basis
 *
 * Configuration/Options are merged with the default values, allowing to override them
 *
 * NOTE about middlewares:
 *
 * The form engine middlewares must NOT be registered here, because they are registered by default already.
 * To customize them, use the `middlewareOptions`
 */
export interface DevappCustomization extends Omit<Module, "id"> {
	/**
	 * The specific form model for which the customization should be applied
	 */
	readonly formModelName: string;

	readonly middlewareOptions?: Partial<MiddlewareOptions>;
	readonly config?: Partial<Config>;

	readonly FormEngineView?: ComponentType<FormEngineViews.FormEngineProps>;
}

export function getCustomization(currentForm?: string) {
	return ModuleRegistryProvider.getInstance()
		.getAllModules()
		.find(mod => "formModelName" in mod && currentForm === mod.formModelName) as
		| DevappCustomization
		| undefined;
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
