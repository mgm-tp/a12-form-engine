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
 * 1. Open-Source License – EUPL v1.2
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
