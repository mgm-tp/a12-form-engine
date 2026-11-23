// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelHelpers } from "../model-helpers.js";

const { createModelPath } = ModelHelpers;

export namespace CONTROLS_INDEX {
	export const ID_APPLICANT_NAME_CONTROL = "a12-name-field_a16d5";

	export const APPLICANT_NAME_CONTROL = createModelPath(
		"Screen1",
		"applicant",
		"grid",
		"row-9187d",
		"control-79b6d"
	);

	export const SECOND_CONTACT_NAME_CONTROL = createModelPath(
		"Screen1",
		"second_contact",
		"grid",
		"row-cca92",
		"control-db541"
	);

	export const SECOND_CONTACT_PHOTO_CONTROL = createModelPath(
		"Screen5",
		"second_contact",
		"grid",
		"row-a4b43",
		"control-af3c4"
	);

	export const SECOND_CONTACT_ISSUES_CONTROL = createModelPath(
		"Screen5",
		"second_contact",
		"grid",
		"row-f337b",
		"control-0f50b"
	);
}
