// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { createLocalizableFactory } from "../../../../back-end/localization/internal/localization.js";
import type { FormModel } from "../../../../models/internal/form-model.js";

import type { EnumerationValue } from "./enumValue.js";

/** @internal */
export function localizeEnumerationValue(options: {
	documentModel: DocumentModel;
	formModel: FormModel;
	localizer: Localizer;
	value: string;
	enumValues: readonly DocumentModel.EnumValue[];
	path: ModelPath;
}): EnumerationValue {
	const { enumValues, value, path, documentModel, formModel } = options;
	const enumerationValue = enumValues.find(x => x.value === value);

	if (enumerationValue === undefined) {
		return { value, label: "" };
	}

	const localizableFactory = createLocalizableFactory(documentModel, formModel);

	const localizable = localizableFactory.enumerationValue(path, enumerationValue);
	const label = options.localizer(...localizable);

	return {
		value,
		label: label ?? ""
	};
}
