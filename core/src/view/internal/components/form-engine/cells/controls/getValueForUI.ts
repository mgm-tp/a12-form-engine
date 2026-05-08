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
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type IExternalEnumerationProvider from "../../../../../../back-end/services/external-enumeration-provider.js";
import { DataSelectors } from "../../../../../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../../../../../back-end/store/internal/selectors/models.js";
import type { Selector } from "../../../../../../back-end/store/internal/selectors/selectors.js";
import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import { getValueByPath } from "../../../../utilities/getValueByPath.js";
import type { Value } from "../../../../utilities/value.js";

/** @internal */
export function getValueForUI(
	converter: ValueConversion,
	documentElementPath: EntityInstancePath,
	localizer: Localizer,
	externalEnumerationProvider?: IExternalEnumerationProvider
): Selector<Value> {
	const localeSelector = UiStateSelectors.locale();
	return state => {
		const locale = localeSelector(state);
		const documentModel = ModelSelectors.documentModel()(state);
		const formModel = ModelSelectors.formModel()(state);

		const messages = UiStateSelectors.messages()(state);
		const document = DataSelectors.document()(state);

		return getValueByPath({
			path: documentElementPath,
			locale,
			converter,
			document: document as GroupInstance,
			messages,
			documentModel,
			formModel,
			externalEnumerationProvider,
			localizer
		});
	};
}
