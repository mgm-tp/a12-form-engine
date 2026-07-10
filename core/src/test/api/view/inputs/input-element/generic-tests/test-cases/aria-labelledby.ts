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

import { strictEqual } from "node:assert/strict";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

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
