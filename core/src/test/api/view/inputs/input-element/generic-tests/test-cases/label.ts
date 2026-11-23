// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { primitivePropsTest } from "../input-utils.js";

export function executeTestForLabel<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps
): void {
	async function test(propValue?: string) {
		await primitivePropsTest({
			baseProps,
			path: baseProps.path,
			propName: "label",
			models: models(),
			component: baseProps.component,
			modelElement: { label: propValue },
			propValue: propValue,
			formModelPath: []
		});
	}

	describe("if given", async () => {
		await it(`renders a(n) ${baseProps.component} with prop label = the given label`, () => {
			test("testLabel");
		});
	});
	describe("if not given", async () => {
		await it(`renders a(n) ${baseProps.component} with prop label = undefined`, () => {
			test(undefined);
		});
	});
}
