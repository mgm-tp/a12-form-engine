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
import {
	dmReferenceChanged,
	initContentEditorSlices,
	type InitContentEditorSlicesPayload
} from "./actions.js";

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
