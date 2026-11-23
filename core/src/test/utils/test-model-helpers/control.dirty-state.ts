// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { DocumentHelpers } from "../document-helpers.js";
import { ModelHelpers } from "../model-helpers.js";

const { createDocumentPath } = DocumentHelpers;
const { createModelPath } = ModelHelpers;

export namespace DIRTY_STATE {
	export const SCREEN_NAME = "Screen1";
	export const DR_NAME = "detached-repeat-repeatableGroup";
	export const DR_FORM_MODEL_PATH = createModelPath(SCREEN_NAME, DR_NAME);
	export const DR_LOCATION_PATH = createModelPath(SCREEN_NAME, DR_NAME, `${DR_NAME}-detail-screen`);
	export const REP_GROUP_DOCUMENT_PATH = createDocumentPath(["root"], ["repeatableGroup", 1]);
	export const DR_COMMIT_EDIT_BUTTON = "a12-edit-apply-button-detachedrepeat-ad417";
	export const DR_CANCEL_EDIT_BUTTON = "a12-edit-cancel-button-detachedrepeat-ad417";

	export const NESTED_DR_NAME = "detached-repeat-nestedRepeatableGroup";
	export const NESTED_DR_FORM_MODEL_PATH = createModelPath(SCREEN_NAME, DR_NAME, NESTED_DR_NAME);
	export const NESTED_DR_LOCATION_PATH = createModelPath(
		SCREEN_NAME,
		DR_NAME,
		`${DR_NAME}-detail-screen`,
		NESTED_DR_NAME,
		`${NESTED_DR_NAME}-detail-screen`
	);
	export const NESTED_REP_GROUP_DOCUMENT_PATH = createDocumentPath(
		["root"],
		["repeatableGroup", 1],
		["nestedRepeatableGroup", 1]
	);
	export const NESTED_DR_COMMIT_EDIT_BUTTON = "a12-edit-apply-button-detachedrepeat-28d1f";
	export const NESTED_DR_CANCEL_EDIT_BUTTON = "a12-edit-cancel-button-detachedrepeat-28d1f";
}
