// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { NotificationActions } from "@com.mgmtp.a12.client/client-core/lib/core/notification/index.js";
import type { LocalizableArgs } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { Events } from "../../../back-end/store/index.js";
import { FormEngineActions } from "../../../client-extensions/index.js";

import { DEFAULT_PREVIEW_TRANSLATIONS } from "../resources/defaultTranslations.js";

export const notifyEventButtonClickedMiddleware: Middleware = api => next => action => {
	if (
		FormEngineActions.event.match(action) &&
		Events.eventButton.match(action.payload.engineEvent)
	) {
		const args: LocalizableArgs = {
			EVENT_BUTTON_NAME: { type: "plain", value: action.payload.engineEvent.payload.name }
		};

		api.dispatch(
			NotificationActions.add({
				activityId: action.payload.activityId,
				title: localizableFromLocalizationTreeMap(
					"preview.middleware.eventButton.title",
					DEFAULT_PREVIEW_TRANSLATIONS,
					args
				),
				message: localizableFromLocalizationTreeMap(
					"preview.middleware.eventButton.message",
					DEFAULT_PREVIEW_TRANSLATIONS,
					args
				),
				duration: 5000
			})
		);
	}
	next(action);
};
