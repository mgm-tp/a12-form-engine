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

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";

import type { EngineStore, Models } from "../../../back-end/store/internal/store.js";
import type { Config, DispatchConfiguration } from "../../../view/index.js";
import type { ComponentMap } from "../../../view/internal/configuration/componentMap/component-map.js";
import type { InputMap } from "../../../view/internal/configuration/componentMap/input/input-map.js";
import type { RtlRenderWrapper } from "../../rtl-utils/render-wrapper.js";

import { setupFormEngineRendererWithRtl } from "../setup.js";

export const DM_TYPES = {
	SECTION_STRING: "a12-section-fc723",
	STRING_05: "a12-String05-fieldimpl_575a4",
	STRING_01: "a12-String01-id3948",
	STRING_01_SECRET: "a12-String01-id3948-2",
	STRING_04: "a12-String04-id6147",
	STRING_04_AUTO_EXPAND: "a12-String04-id6147-2",
	NUMBER_01: "a12-Number01-id3939",
	NUMBER_WITH_CENT_02: "a12-NumberWithCent02-id4691",
	DATE_01: "a12-Date01-id3963",
	DATUM_ZEIT_01: "a12-DateTime01-field_e69f0",
	ZEIT_01: "a12-Time01-fieldimpl_9fcad",
	DATE_FRAGMENT_01: "a12-DateFragment01-field_85af6",
	DATE_RANGE_01: "a12-DateRange01-fieldimpl_4eb18",
	BOOLEAN_01: "a12-Boolean01-F22",
	BOOLEAN_02: "a12-Boolean02-F23",
	BOOLEAN_03: "a12-Boolean03-F24",
	BOOLEAN_04: "a12-Boolean04-F25",
	BOOLEAN_SELECT_01: "a12-BooleanSelect01-field_c03f4",
	BOOLEAN_SELECT_02: "a12-BooleanSelect02-field_14434",
	BOOLEAN_RADIO_FULL: "a12-BooleanRadio1-field_1a91b",
	BOOLEAN_RADIO_INLINE: "a12-BooleanRadio2-field_d9195",
	CONFIRM_01: "a12-Confirm01-F28",
	CONFIRM_02: "a12-Confirm02-F29",
	CONFIRM_03: "a12-Confirm03-F30",
	CONFIRM_04: "a12-Confirm04-F31",
	CUSTOM_01: "a12-Custom01-field_85d45",
	ENUMERATION_COMPACT: "a12-Enumeration011-field_658d8",
	ENUMERATION_AUTOCOMPLETE: "a12-Enumeration02-field_597fb",
	ENUMERATION_RADIO_INLINE: "a12-Enumeration04-field_f3f68",
	ENUMERATION_RADIO_FULL: "a12-Enumeration03-field_c8dc3",
	ATTACHMENT_01: "a12-Attachment01-group_8c46f",
	ATTACHMENT_02: "a12-Attachment02-group_82f13",
	MULTI_SELECT01: "a12-MultiSelect01-group_a8832",
	MULTI_SELECT02: "a12-MultiSelect02-groupimpl_792db",
	MULTI_SELECT03: "a12-MultiSelect03-groupimpl_1f688"
} as const;

export function setupDmTypeTest(options: {
	readonly models: Models;
	readonly locale?: Locale;
	readonly data?: Partial<EngineStore.DataState>;
	readonly ui?: Partial<EngineStore.UIState>;
	readonly dispatchConfig?: DispatchConfiguration;
	readonly config?: Partial<Config>;
	readonly withWidgets?: true;
	readonly inputMap?: InputMap;
	readonly componentMap?: ComponentMap;
}): RtlRenderWrapper {
	const inputMap = options.inputMap;
	return setupFormEngineRendererWithRtl({
		...options,
		ui: {
			...options.ui,
			...dmTypesUiState()
		},
		componentMap: options.componentMap,
		inputMap
	});
}

function dmTypesUiState() {
	return {
		sectionState: {
			"/Screen1/Screen 0/Enumeration": false,
			"/Screen1/Screen 0/MultiSelect": false,
			"/Screen1/Screen 0/Attachment": false,
			"/Screen1/Screen 0/Typedefinition": false,
			"/Screen1/Screen 0/Readonly": false,
			"/Screen1/Screen 0/Date": false,
			"/Screen1/Screen 0/Number": false,
			"/Screen1/Screen 0/String": false,
			"/Screen1/Screen 0/expressionCell": false,
			"/Screen1/Screen 0/BooleanAndConfirm": false,
			"/Screen1/Screen 0/Custom": false
		}
	};
}
