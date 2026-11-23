// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
