// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	RenderHolder,
	SimplifiedTestFunction
} from "../../../../../../utils/rtl-render-group.js";

/**
 * This code is part of the disabled tests and not meant for reuse!
 */

/**
 * Takes an it function and returns a function to create a "conditional it"
 * function.
 */
export type ItCondFact = (it: SimplifiedTestFunction) => ItCondFunc;

/**
 * Takes a render function and returns an "condition it", i.e. one that only
 * creates an actual it, when render is present.
 */
export type ItCondFunc = (render: RenderHolder | undefined) => CondItFunc;

/**
 * A conditional it function that receives the render to use.
 */
export type CondItFunc = (
	desc: string,
	test: (render: RenderHolder) => void
) => Mocha.Test | undefined;

export const ItCond: ItCondFact = it => {
	return render => {
		const condIt: CondItFunc = (desc, test) => {
			const shouldDescribeIt = render !== undefined;
			return shouldDescribeIt
				? it(desc, () => {
						return test(render);
					})
				: undefined;
		};
		return condIt;
	};
};
