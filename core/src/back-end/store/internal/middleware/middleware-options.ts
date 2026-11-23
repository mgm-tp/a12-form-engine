// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type ExternalEnumerationProvider from "../../../services/external-enumeration-provider.js";

import type { EngineStore } from "../store.js";

/**
 * Configuration parameters of the middlewares.
 *
 * Parameters that depend on the current models are passed as providers, so
 * that they can be replaced depending on the current models.
 *
 * @see Provider
 */
export interface MiddlewareOptions extends Localization, Conversion {
	/**
	 * Provides enumeration values for external enumerations. Must be given if the model contains external enumerations.
	 * The providers must be implemented synchronously.
	 * Asynchronous operations will result in misbehavior of the application.
	 *
	 * Mind: You need to register your external enumeration provider here, as well as
	 * in your configuration (`Config`) which you hand as props to the view!
	 */
	readonly externalEnumerationProvider?: ExternalEnumerationProvider;

	/**
	 * Provides the `now` value used in kernel computation/validation.
	 *
	 * Only used for the devapp/preview.
	 */
	readonly nowProvider?: EngineStore.Provider<Date | undefined>;

	/**
	 * Property to disable the validation:
	 *  ** of controls inside a row of an inline when the row is left
	 *  ** of controls inside a control-grid of an embedded repeat row when the row is left
	 *  ** of a inline or embedded repeat table when the table is left.
	 */
	readonly disableRepeatValidationOnLeaving?: boolean;
}

/**
 * Data structure for Conversion related types.
 * Note: This is only required in the Form-Engine backend because kernel validation has built-in l10n.
 */
export interface Conversion {
	/**
	 * Converter which is used to parse and format.
	 */
	readonly converter: EngineStore.Provider<ValueConversion>;
}

/**
 * Data structure for localization related types.
 * Note: This is only required in the backend because kernel validation has built-in l10n.
 */
export interface Localization {
	/**
	 * Localizer to localize texts like labels, information and validation messages
	 */
	readonly localizer: EngineStore.Provider<Localizer>;
}
