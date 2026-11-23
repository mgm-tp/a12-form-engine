// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	DocumentModel,
	IGeneratedCodeAccessor
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { FormModel } from "../../../../models/internal/form-model.js";

import { engineState } from "./engineState.js";
import type { Selector } from "./selectors.js";

/**
 * All model related selector creators.
 */
export namespace ModelSelectors {
	/**
	 * @returns a selector that selects the form model from the state
	 */
	export function formModel(): Selector<FormModel> {
		return state => {
			return engineState(state).models.formModel;
		};
	}

	/**
	 * @returns a selector that selects the document model from the state
	 */
	export function documentModel(): Selector<DocumentModel> {
		return state => {
			return engineState(state).models.documentModel;
		};
	}

	/**
	 * @returns a selector that selects the validation code from the state
	 */
	export function validationCode(): Selector<IGeneratedCodeAccessor | undefined> {
		return state => {
			return engineState(state).models.validatorProvider;
		};
	}
}
