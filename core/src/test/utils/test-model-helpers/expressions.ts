// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelHelpers } from "../model-helpers.js";

const { createModelPath } = ModelHelpers;

export namespace EXPRESSIONS {
	export const screenName = "Expressions Sample Screen";
	export const ROOT = "RootGroup";
	export const repeatableGroup = "ContactGroup";
	export const er_locationPath = createModelPath(screenName, "EmbeddedRepeat");
	export const dr_locationPath = createModelPath(screenName, "DetachedRepeat", "Details");

	export const ID_NAME = "expressionCell-83438";
}
