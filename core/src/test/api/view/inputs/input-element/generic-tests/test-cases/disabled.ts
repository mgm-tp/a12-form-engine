// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { primitivePropsTest } from "../input-utils.js";

export function executeDisabledTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps
): void {
	async function test(propValue?: boolean) {
		await primitivePropsTest({
			baseProps,
			path: baseProps.path,
			propName: "disabled",
			models: models(),
			modelElement: { disabled: propValue },
			propValue,
			formModelPath: []
		});
	}

	describe("true", () => {
		it(`renders a(n) ${baseProps.component} with prop disabled=true`, async () => {
			await test(true);
		});
	});

	describe("false", () => {
		it(`renders a(n) ${baseProps.component} with prop disabled=false`, async () => {
			await test(false);
		});
	});
}
