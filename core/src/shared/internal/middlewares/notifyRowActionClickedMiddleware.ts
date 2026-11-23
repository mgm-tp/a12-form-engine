// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { NotificationActions } from "@com.mgmtp.a12.client/client-core/lib/core/notification/index.js";
import type { LocalizableArgs } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { EngineState } from "../../../back-end/store/index.js";
import { Events } from "../../../back-end/store/index.js";
import { FormEngineActions } from "../../../client-extensions/index.js";

import { DEFAULT_PREVIEW_TRANSLATIONS } from "../resources/defaultTranslations.js";

export const notifyRowActionClickedMiddleware: Middleware<{}, EngineState> =
	api => next => action => {
		if (
			FormEngineActions.event.match(action) &&
			Events.Repeat.customRowAction.match(action.payload.engineEvent)
		) {
			const name = action.payload.engineEvent.payload.eventName;
			const rowPath = action.payload.engineEvent.payload.rowPath;
			const idx = rowPath[rowPath.length - 1].index;

			const pathAsString = rowPath.map(p => [p.elementName, `[${p.index}]`].join("")).join("/");

			const args: LocalizableArgs = {
				ROW_ACTION_NAME: { type: "plain", value: name },
				ROW_IDX: { type: "plain", value: idx },
				ROW_PATH: { type: "plain", value: pathAsString }
			};

			api.dispatch(
				NotificationActions.add({
					activityId: action.payload.activityId,
					title: localizableFromLocalizationTreeMap(
						"preview.middleware.rowAction.title",
						DEFAULT_PREVIEW_TRANSLATIONS,
						args
					),
					message: localizableFromLocalizationTreeMap(
						"preview.middleware.rowAction.message",
						DEFAULT_PREVIEW_TRANSLATIONS,
						args
					),
					duration: 5000
				})
			);
		}
		next(action);
	};
