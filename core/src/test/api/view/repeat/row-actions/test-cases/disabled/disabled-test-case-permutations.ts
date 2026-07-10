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

import type { RtlRenderWrapper } from "../../../../../../rtl-utils/render-wrapper.js";
import * as RtlRenderGroup from "../../../../../../utils/rtl-render-group.js";

import * as ConditionalIt from "./conditional-it.js";

/**
 * This code is part of the disabled tests and not meant for reuse!
 */

/**
 * Just a grouping
 */
export type TestGroup =
	| "wrappers"
	| "roWrappers"
	| "wrappersForDisabledRowActionButtons"
	| "roWrappersForDisabledRowActionButtons";

/**
 * Basic set of test render configurations (inside each TestGroup).
 */
export type TestCase =
	| "enabledEngine"
	| "enabledEngineWithMapForAllRows"
	| "enabledEngineWithMapForRow2"
	| "enabledEngineWithMapForAllRowsAndRow2"
	| "disabledEngine"
	| "disabledEngineWithMapForAllRows"
	| "disabledEngineWithMapForRow2"
	| "disabledEngineWithMapForAllRowsAndRow2"
	| "engineWithMaxRepDocuments"
	| "disabledEngineWithMaxRepDocumentsAndMapForRow2"
	| "disabledEngineWithMaxRepDocumentsAndMapForAllRows";

/**
 * Prepared render callbacks for all test groups.
 */
export type TestGroupFactory = {
	[K in TestGroup]: TestCaseFactory;
};

/**
 * Prepared render callbacks for all test cases inside a group.
 */
export type TestCaseFactory = {
	[K in TestCase]: () => RtlRenderWrapper;
};

export interface RenderPermutation {
	holder: TestGroupFactory;
	key1: keyof TestGroupFactory;
	key2: TestCase;
}

export interface PickRenderResult {
	render: TestGroupRender;
	itCond: ConditionalIt.ItCondFunc;
}

/**
 * Structure of what the individual describe function receive
 * (RenderGroupFixture RenderHolder).
 */
export type TestCaseRender = {
	[K in TestCase]?: RtlRenderGroup.RenderHolder | undefined;
};

/**
 * Grouping structure for WrappersRender.
 */
export type TestGroupRender = {
	[K in TestGroup]?: TestCaseRender | undefined;
};

export function pickRender(opts: RenderPermutation): PickRenderResult {
	// get the render which should be executed
	const wrapperFactory = opts.holder[opts.key1][opts.key2];

	// create a cleanup group for it
	const context = RtlRenderGroup.RenderGroupFixture(wrapperFactory);
	const itCond = ConditionalIt.ItCond(context.it);

	// setup a holder structure that resembles the old Enzyme code but only
	// contains a single render
	return {
		render: {
			[opts.key1]: {
				[opts.key2]: context.render
			}
		},
		itCond
	};
}

export function noRender(): PickRenderResult {
	return {
		itCond: () => () => undefined,
		render: {}
	};
}
