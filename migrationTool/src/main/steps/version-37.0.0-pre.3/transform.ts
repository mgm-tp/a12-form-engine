// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Logger } from "@com.mgmtp.a12.migrationtool/migrationtool-core/types";

import type { FormModel as OldFormModel } from "../version-37.0.0-pre.2/FormModel.js";

import type { FormModel } from "./FormModel.js";

export default function (model: OldFormModel, _logger: Logger): FormModel {
	const annotation = model.header.annotations?.find(
		annotation => annotation.name === "bindingConfiguration"
	);

	if (!annotation?.value) {
		return model;
	}

	// Extract just the bindings from the binding configuration
	const bindingConfig = JSON.parse(annotation.value);
	(annotation as { value: string }).value = JSON.stringify(bindingConfig.bindings);

	return model as FormModel;
}
