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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization";

import type { FormModel } from "../../../models/internal/form-model.js";
import * as DocumentModelUtils from "../../../models/internal/utils/document-model-utils.js";
import { InternalEnumerableHelper } from "../../../view/internal/utilities/enumerable/enumerableHelper.js";
import { getDocumentPath } from "../../utils/internal/path.js";

import { ModelSelectors } from "./selectors/models.js";
import type { Selector } from "./selectors/selectors.js";
import { UiStateSelectors } from "./selectors/ui-state.js";
import type { EngineState } from "./store.js";

export const FormModelSelectors = {
	/**
	 * @param documentModelPath The document model path of the element
	 * @param localizer The localizer which should be used to localize the suffix
	 * @returns a selector that selects the localized suffix for an element from the model.
	 * The function will return the 'amountSuffix' from the form-model if no suffix exists for
	 * the given language and the underlying field is an amount number field.
	 */
	suffix(documentModelPath: ModelPath, localizer: Localizer): Selector<string | undefined> {
		const selectFormModel = ModelSelectors.formModel();
		const selectDocumentModel = ModelSelectors.documentModel();
		return state => {
			const dM = selectDocumentModel(state);
			const documentElement = DocumentModelUtils.findByPath(dM, documentModelPath);

			if (documentElement.type !== "Field") {
				return undefined;
			}

			const fM = selectFormModel(state);

			if (documentElement.fieldType.type !== "NumberType") {
				return undefined;
			}
			const fceSuffixLocalizables =
				UiStateSelectors.InputLocalization.suffixTextLocalizables(documentModelPath)(state);
			const localizedSuffix = localizer(...fceSuffixLocalizables);

			return documentElement.fieldType.trait === "amount"
				? (localizedSuffix ?? getAmountSuffixFromModel(state, localizer, fM, dM))
				: localizedSuffix;
		};
	}
};

/**
 * Returns the modeled amount suffix
 * - when static: returns the value
 * - when dynamic: returns the localized value of the referenced field
 *
 * Since a dynamic suffix can only reference a non-repeatable field, calling
 * `getDocumentPath` does not require index information -> therefore context is empty.
 */
function getAmountSuffixFromModel(
	state: EngineState,
	localizer: Localizer,
	formModel: FormModel,
	documentModel: DocumentModel
): string | undefined {
	return formModel.content.amountSuffix
		? formModel.content.amountSuffix.type === "static"
			? formModel.content.amountSuffix.value
			: InternalEnumerableHelper.getEnumerationValue({
					state,
					localizer,
					model: documentModel,
					path: getDocumentPath(documentModel, formModel.content.amountSuffixFieldPath!, [])
				})
		: undefined;
}
