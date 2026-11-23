// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { FormModel } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	Commands,
	Events,
	FormEngineActions,
	FormEngineSelectors
} from "@com.mgmtp.a12.formengine/formengine-core";

export const uncollapseAllSectionsMiddleware: Middleware = api => next => action => {
	if (
		FormEngineActions.event.match(action) &&
		Events.eventButton.match(action.payload.engineEvent)
	) {
		const state = api.getState();
		const formModel = FormEngineSelectors.models(action.payload.activityId)(state)?.formModel;

		if (formModel && action.payload.engineEvent.payload.name === "open_all_sections") {
			const sections = findAllSectionNames(formModel);

			api.dispatch(
				Commands.setSectionsCollapsed({
					sections: sections.map(s => ({ path: s, collapse: false }))
				})
			);
		}
	}
	next(action);
};

export function findAllSectionNames(formModel: FormModel): ModelPath[] {
	const sections = [];
	const screens = formModel.content.screens;

	for (const screen of screens) {
		sections.push(
			...screen.screenElements
				.filter(s => s.type === "Section")
				.map(section => [{ elementName: screen.name }, { elementName: section.name }])
		);
	}
	return sections;
}
