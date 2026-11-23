// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import {
	extractModelsInScenePayload,
	ReferencedModel
} from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";

/** @internal */
export function referencesDirectFormModelInScene(
	action?: ActivityActions.DataReducerAction
): boolean {
	const { modelsInScene } = extractModelsInScenePayload(action) ?? {};

	return modelsInScene?.some(r => r.direct && getModelType(r) === "form") ?? false;
}

function getModelType(r: ReferencedModel.Instance): string | undefined {
	return ReferencedModel.isLoaded(r)
		? r.model.header.modelType
		: ReferencedModel.isNotLoaded(r)
			? r.model.modelType
			: undefined;
}
