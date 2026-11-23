// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NotificationActions } from "@com.mgmtp.a12.client/client-core/lib/core/notification/index.js";
import type { LocalizableArgs } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { DEFAULT_PREVIEW_TRANSLATIONS } from "../resources/defaultTranslations.js";

export const notifyDocumentSaveMiddleware: Middleware = api => next => action => {
	if (ActivityActions.save.done.match(action)) {
		const args: LocalizableArgs = {
			DOCUMENT_NAME: { type: "plain", value: action.payload.result.instance }
		};

		api.dispatch(
			NotificationActions.add({
				activityId: action.payload.params.activityId,
				severity: "success",
				title: localizableFromLocalizationTreeMap(
					"preview.middleware.save.title",
					DEFAULT_PREVIEW_TRANSLATIONS,
					args
				),
				message: localizableFromLocalizationTreeMap(
					"preview.middleware.save.message",
					DEFAULT_PREVIEW_TRANSLATIONS,
					args
				),
				duration: 5000
			})
		);
	}
	next(action);
};
