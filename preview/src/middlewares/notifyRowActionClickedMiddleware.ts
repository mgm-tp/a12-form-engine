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
 * 1. Open-Source License - EUPL v1.2
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

import type { Middleware } from "redux";

import { NotificationActions } from "@com.mgmtp.a12.client/client-core";
import { Events, FormEngineActions } from "@com.mgmtp.a12.formengine/formengine-core";
import type { EngineState } from "@com.mgmtp.a12.formengine/formengine-core";
import type { LocalizableArgs } from "@com.mgmtp.a12.utils/utils-localization";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization";

import { DEFAULT_PREVIEW_TRANSLATIONS } from "../resources/defaultTranslations.js";

export const notifyRowActionClickedMiddleware: Middleware<{}, EngineState> =
	api => next => action => {
		if (
			FormEngineActions.event.match(action) &&
			Events.Repeat.customRowAction.match(action.payload.engineEvent)
		) {
			const name = action.payload.engineEvent.payload.eventName;
			const rowPath = action.payload.engineEvent.payload.rowPath;
			const idx = rowPath.at(-1)?.index;

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
