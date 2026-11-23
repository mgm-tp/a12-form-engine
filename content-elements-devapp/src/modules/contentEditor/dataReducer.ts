// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import type {
	Activity,
	ActivityReducers
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import {
	ContentEditorDataHolder,
	ContentEditorState,
	createInitialContentEditorState,
	DefaultEditorElementLibrary
} from "@com.mgmtp.a12.contentengine/contentengine-editor";

import type { DmReferenceChangedPayload } from "./actions.js";
import { dmReferenceChanged, initContentEditorSlices } from "./actions.js";
import type { InitContentEditorSlicesPayload } from "./actions.js";

export const initContentEditorSlicesReducer: ActivityReducers.DataReducer = {
	reduce(dataHolders, action, defaultDataHolder) {
		return initContentEditorSlices.match(action)
			? dataHolders?.map(handleInitContentEditorSlices(action, defaultDataHolder))
			: dataHolders;
	}
};

function handleInitContentEditorSlices(
	action: Action<InitContentEditorSlicesPayload>,
	defaultDataHolder?: Activity.DataHolder
): (dh: Activity.DataHolder) => Activity.DataHolder {
	return dh =>
		dh === defaultDataHolder
			? {
					...dh,
					loadingState: "loaded",
					slices: ContentEditorDataHolder.Slices.create(
						createInitialContentEditorState({
							libraryId: DefaultEditorElementLibrary.get().id,
							contentModel: action.payload.contentModel,
							documentModel: action.payload.documentModel
						})
					)
				}
			: dh;
}

export const dmReferenceChangedReducer: ActivityReducers.DataReducer = {
	reduce(dataHolders, action, defaultDataHolder) {
		return dmReferenceChanged.match(action)
			? dataHolders?.map(handleDmReferenceChanged(action, defaultDataHolder))
			: dataHolders;
	}
};

function handleDmReferenceChanged(
	action: Action<DmReferenceChangedPayload>,
	defaultDataHolder?: Activity.DataHolder
): (dh: Activity.DataHolder) => Activity.DataHolder {
	return dh =>
		dh === defaultDataHolder
			? {
					...dh,
					slices: ContentEditorState.isInstance(dh.slices)
						? ({
								...dh.slices,
								documentModel: action.payload.documentModel
							} as Activity.DataHolder["slices"])
						: dh.slices
				}
			: dh;
}
