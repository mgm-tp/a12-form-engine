// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext } from "react";

import type { FormElementConfig } from "./formElementConfig.js";

export interface FormElementContextValue {
	/**
	 * TODO: Should this stay here?
	 * Alternatively the model name could be retrieved from the app model
	 * scene/case.
	 */
	readonly contentModelName: string;

	readonly config: FormElementConfig;
}

export const FormElementContext = createContext<FormElementContextValue>({
	contentModelName: "",
	config: { timeMode: "12h" }
});
