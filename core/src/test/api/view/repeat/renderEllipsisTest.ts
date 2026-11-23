// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { within } from "@com.mgmtp.a12.devtools/react";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../back-end/store/index.js";
import { SetupHelpers } from "../../../utils/setup.js";

// common render function used by ellipsis tests
export async function renderEllipsisTest(options: {
	models: Models;
	document: GroupInstance;
	screenName?: string;
	id: string;
}): Promise<HTMLElement> {
	const { models, document, screenName, id } = options;
	const { baseElement } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
		models,
		data: { document },
		ui: screenName
			? {
					screenLocation: [{ locationPath: [{ elementName: screenName }], path: [] }]
				}
			: undefined
	});
	return within(baseElement).getById(id);
}
