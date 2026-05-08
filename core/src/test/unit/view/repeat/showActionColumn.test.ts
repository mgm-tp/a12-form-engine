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
 * 1. Open-Source License – EUPL v1.2
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

import type { ComponentType } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { createEngineStore } from "../../../../back-end/store/index.js";
import type { FormModel } from "../../../../models/index.js";
import type { Config, DispatchConfiguration, FormModelMap } from "../../../../view/index.js";
import type { PaginatedRepeatData } from "../../../../view/internal/components/form-engine/repeat/components/repeat-data.js";
import type { RowActionButtonsProps } from "../../../../view/internal/components/form-engine/repeat/components/row-actions/standard/StandardRowActionButtons.js";
import { showActionColumn } from "../../../../view/internal/components/form-engine/repeat/components/tableColumnsFunctions.js";
import type { RepeatRow } from "../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { US_LOCALE } from "../../../utils/localization.js";
import { setupFixture, setupModelsFixture } from "../../../utils/setupFixture.js";

describe("unit.view.repeat.showActionColumn", () => {
	const models = setupModelsFixture("repeat.row-actions");
	const fixture = setupFixture(() => {
		const engineState = createEngineStore({
			data: {},
			locale: US_LOCALE,
			models
		});
		const renderOptionsConfigMock = {} as Config;
		const eventHandlersMock = {} as DispatchConfiguration;
		const localizerMock = () => "";

		const configMock = {
			renderOptions: {
				state: engineState,
				config: renderOptionsConfigMock,
				eventHandlers: eventHandlersMock,
				localizer: localizerMock
			},
			parentPath: []
		} as FormModelMap.RenderConfiguration;

		const repeatFormModelPathMock = [] as ModelPath;
		const processedDataMock = {
			rows: [
				{ path: [{ elementName: "foo", index: 1 }], values: [], rowIndexInDocument: 1 }
			] as ReadonlyArray<RepeatRow>
		} as PaginatedRepeatData;

		return {
			options: {
				config: configMock,
				repeatFormModelPath: repeatFormModelPathMock,
				filterableColumnExists: false,
				processedData: processedDataMock
			}
		};
	});

	describe("given a repeat with a filterable column", () => {
		it("returns true", () => {
			const repeat = setupRepeat({});
			strictEqual(
				showActionColumn({ ...fixture.options, filterableColumnExists: true, repeat }),
				true
			);
		});
	});

	describe("given a repeat without filterable columns for which in a row", () => {
		describe("no standard or custom row action should be shown in any row", () => {
			it("returns false", () => {
				const repeat = setupRepeat({});
				strictEqual(showActionColumn({ ...fixture.options, repeat }), false);
			});
		});

		describe("only the move button should be shown", () => {
			it("returns true if enableReorder is set in the model to true", () => {
				const repeat = setupRepeat({ enableReorder: true });
				strictEqual(showActionColumn({ ...fixture.options, repeat }), true);
			});
		});

		describe("only the copy button should be shown", () => {
			it("returns true if enableCopy is set in the model to true", () => {
				const repeat = setupRepeat({ enableCopy: true });
				strictEqual(showActionColumn({ ...fixture.options, repeat }), true);
			});
		});

		describe("only the delete button should be shown", () => {
			it("returns true if enableRemove is set in the model to true", () => {
				const repeat = setupRepeat({ enableRemove: true });
				strictEqual(showActionColumn({ ...fixture.options, repeat }), true);
			});
		});

		describe("the edit button should be shown and an edit react element is defined", () => {
			it("returns true", () => {
				const editViewButtonMock = {} as ComponentType<RowActionButtonsProps>;
				const repeat = setupRepeat({});

				strictEqual(
					showActionColumn({
						...fixture.options,
						EditViewButton: editViewButtonMock,
						repeat
					}),
					true
				);
			});
		});

		describe("only the edit button should be shown but no edit react element is defined", () => {
			it("returns false", () => {
				const repeat = setupRepeat({});
				strictEqual(
					showActionColumn({ ...fixture.options, EditViewButton: undefined, repeat }),
					false
				);
			});
		});

		describe("only a custom row action button should be shown", () => {
			it("returns true", () => {
				const repeat = setupRepeat({ customRowActions: true });
				strictEqual(showActionColumn({ ...fixture.options, repeat }), true);
			});
		});
	});

	function setupRepeat(options: {
		enableRemove?: boolean;
		enableCopy?: boolean;
		enableReorder?: boolean;
		customRowActions?: boolean;
	}): FormModel.Repeat {
		return {
			groupPath: [],
			groupRef: "",
			id: "my-repeat",
			name: "my-repeat",
			enableRemove: options.enableRemove,
			enableCopy: options.enableCopy,
			enableReorder: options.enableReorder,
			rowActionGroup: options.customRowActions
				? {
						action: [{ event: "peace", scope: "ALWAYS" }]
					}
				: undefined
		};
	}
});
