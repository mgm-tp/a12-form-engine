// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { primitivePropsTest } from "../input-utils.js";

export function executeLabelHiddenButReadTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps
): void {
	async function test(propValue?: boolean) {
		await primitivePropsTest({
			propName: "hideLabel",
			models: models(),
			baseProps,
			path: baseProps.path,
			component: baseProps.component,
			modelElement: { labelHiddenButRead: propValue },
			propValue: propValue,
			formModelPath: []
		});
	}

	describe("false", async () => {
		await it(`renders a(n) ${baseProps.component} with prop hideLabel = false`, () => {
			test(false);
		});
	});

	describe("undefined", async () => {
		await it(`renders a(n) ${baseProps.component} with prop hideLabel = undefined`, () => {
			test(undefined);
		});
	});

	describe("true", () => {
		it(`renders a(n) ${baseProps.component} with prop hideLabel = true`, () => {
			test(true);
		});
	});
}
