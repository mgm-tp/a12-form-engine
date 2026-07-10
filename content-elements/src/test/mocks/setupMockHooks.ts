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

import { mock } from "node:test";

import {
	USE_COMMON_CONTROL_SETTINGS_WRAPPER,
	USE_COMMON_WIDGET_SETTINGS_WRAPPER,
	USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER
} from "../../index.js";
import type { BaseControlSettings, BaseWidgetSettings, EnumerationItem } from "../../index.js";

export function setupMockHooks(options: {
	controlSettings: BaseControlSettings;
	widgetSettings: BaseWidgetSettings;
	enumerationValues?: EnumerationItem[];
}) {
	return {
		useControlSettingsMock: mock.method(
			USE_COMMON_CONTROL_SETTINGS_WRAPPER,
			"useCommonControlSettings",
			() => options.controlSettings
		),
		useWidgetSettingsMock: mock.method(
			USE_COMMON_WIDGET_SETTINGS_WRAPPER,
			"useCommonWidgetSettings",
			() => options.widgetSettings
		),
		useEnumerationValuesMock: mock.method(
			USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER,
			"useLocalizedEnumerationValues",
			() => options.enumerationValues ?? []
		)
	};
}
