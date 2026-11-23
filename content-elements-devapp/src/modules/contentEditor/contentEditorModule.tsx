// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { DynamicConfiguration } from "@com.mgmtp.a12.client/client-core/lib/core/configurationNG/index.js";
import { ContentEditorClientFactories } from "@com.mgmtp.a12.contentengine/contentengine-editor";

import { MockContentEditorDataProvider } from "./dataProvider.js";
import { dmReferenceChangedReducer, initContentEditorSlicesReducer } from "./dataReducer.js";
import { isEditorDescriptor } from "./descriptor.js";
import { ContentEditorView } from "./view.js";

export const contentEditorModule: DynamicConfiguration = {
	id: "content-editor-module",
	flows(state) {
		const contentModelName = selectCurrentContentModelName(state);

		return [
			{
				name: "content-editor-flow",
				scenes: [
					{
						name: "content-editor-scene",
						matches: isEditorDescriptor,
						sceneChange: contentModelName
							? {
									onEnter: [
										{
											type: "DYNAMIC_ADD_VIEW",
											component: ContentEditorView,
											region: "/CONTENT",
											models: [{ modelType: "content", name: contentModelName }]
										}
									]
								}
							: {}
					}
				]
			}
		];
	},
	middlewares: () => [ContentEditorClientFactories.createMiddleware()],
	dataReducers: () => [
		ContentEditorClientFactories.createDataReducer(),
		initContentEditorSlicesReducer,
		dmReferenceChangedReducer
	],
	dataProviders: () => [MockContentEditorDataProvider]
};

function selectCurrentContentModelName(state: object): string | undefined {
	const activityId = Object.values(ActivitySelectors.activities()(state)).find(
		a => a && isEditorDescriptor(a.descriptor)
	)?.id;

	return activityId
		? ActivitySelectors.activityPropById(activityId, a => a.descriptor.contentModelName)(state)
		: undefined;
}
