// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { setupModelsFixture } from "../../../../../../utils/setupFixture.js";
import { IDS } from "../../../../../../utils/test-model-helpers/repeat.row-actions.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { mountComponent } from "../input-utils.js";

export function executeAriaLabelledbyTest<T extends DocumentModel.FieldType>(
	baseProps: FieldBasedProps<T> | GroupBasedProps
): void {
	const uiId = "MyId";

	const models = setupModelsFixture("repeat.row-actions");

	async function test(withScreenReaderColumn: boolean): Promise<void> {
		const wrapper = await mountComponent({
			component: baseProps.component,
			documentElement: baseProps.documentElement,
			documentElementDataType: baseProps.documentElementDataType,
			models,
			path: baseProps.path,
			renderFunction: baseProps.renderFunction,
			modelElement: {},
			uiId,
			formModelPath: withScreenReaderColumn
				? IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.checkboxColumnModelPath
				: IDS.SCREEN_READER_COLUMN_TEST.IR_WITHOUT_SCREEN_READER_COLUMN.checkboxColumnModelPath
		});

		const ariaLabelledBy = wrapper.input.inputProps?.["aria-labelledby"];

		strictEqual(
			ariaLabelledBy,
			withScreenReaderColumn
				? `${uiId} ${IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.columnRef}`
				: uiId
		);
	}

	it("is rendered with two ids in aria-labelledby when inside a repeat that has a screenReaderColumnRef", async () => {
		await test(true);
	});

	it("is rendered with only its own id in aria-labelledby when inside a repeat without screenReaderColumnRef", async () => {
		await test(false);
	});
}
