// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { createLocalizableFactory } from "../../../../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import type { Value } from "../../../../../utilities/value.js";

/** @internal */
export function getDisplayLabels(
	renderOptions: FormModelMap.RenderOptions,
	value: Value,
	isConfirm?: boolean
): { checkedOption: Localizable[]; uncheckedOption: Localizable[] } {
	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(renderOptions.state),
		ModelSelectors.formModel()(renderOptions.state)
	);

	return {
		checkedOption: isConfirm
			? localizableFactory.confirmUIValue(value.path, true)
			: localizableFactory.booleanValue(value.path, true),
		uncheckedOption: isConfirm
			? localizableFactory.confirmUIValue(value.path, null)
			: localizableFactory.booleanValue(value.path, false)
	};
}
