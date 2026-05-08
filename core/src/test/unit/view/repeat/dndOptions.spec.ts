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

import { deepStrictEqual, notStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import type { Dispatch } from "redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { TableRenderPropsType } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table-renderer.api.js";

import { Events } from "../../../../back-end/store/index.js";
import { assertCondition } from "../../../../back-end/utils/internal/assertions.js";
import { findElementByFormModelPath } from "../../../../models/internal/findElementByFormModelPath.js";
import { FormModel } from "../../../../models/internal/form-model.js";
import {
	createDndOptions,
	getDndOptions
} from "../../../../view/internal/components/form-engine/repeat/components/dndOptions.js";
import type { RepeatRow } from "../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import { defaultMapDispatchToProps } from "../../../../view/internal/configuration/Defaults.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupFixtureObject, setupModelsFixture } from "../../../utils/setupFixture.js";
import {
	FORM_MODEL,
	ROW_DOCUMENT_PATH
} from "../../../utils/test-model-helpers/repeat.row-actions.js";

describe("unit.view.repeat.dndOptions", () => {
	const repeatModels = setupModelsFixture("repeat.row-actions");
	const defaultRepeat = setupFixtureObject(() =>
		getRepeat(repeatModels.formModel, FORM_MODEL.repeatWithMove)
	);
	const defaultConfig = setupFixtureObject(() =>
		SetupHelpers.setupRenderConfiguration({
			models: repeatModels,
			parentPath: FORM_MODEL.repeatWithMove
		})
	);

	const repeatUid = "test-repeat";

	describe("getDndOptions", () => {
		it("returns options if re-order is neither disabled nor hidden", () => {
			const opts = getDndOptions(defaultRepeat, repeatUid, defaultConfig, false);

			notStrictEqual(opts, undefined);
		});

		describe("returns undefined if", () => {
			it("correction mode is visible", () => {
				const correctionModeConfig = SetupHelpers.setupRenderConfiguration({
					models: repeatModels,
					parentPath: FORM_MODEL.repeatWithMove,
					ui: {
						correctionModeBackup: { location: [], sections: {} }
					}
				});
				const opts = getDndOptions(defaultRepeat, repeatUid, correctionModeConfig, false);

				strictEqual(opts, undefined);
			});

			it("re-order is not modeled for the given repeat", () => {
				const repeatWithoutReorder = getRepeat(repeatModels.formModel, FORM_MODEL.repeatAllFalse);
				const opts = getDndOptions(repeatWithoutReorder, repeatUid, defaultConfig, false);

				strictEqual(opts, undefined);
			});

			it("form is readonly", () => {
				const readonlyConfig = SetupHelpers.setupRenderConfiguration({
					models: repeatModels,
					parentPath: FORM_MODEL.repeatWithMove,
					ui: { readonly: true }
				});
				const opts = getDndOptions(defaultRepeat, repeatUid, readonlyConfig, false);

				strictEqual(opts, undefined);
			});

			it("given repeat is readonly", () => {
				const opts = getDndOptions(defaultRepeat, repeatUid, defaultConfig, true);

				strictEqual(opts, undefined);
			});

			it("given repeat is currently sorted", () => {
				const sortConfig = SetupHelpers.setupRenderConfiguration({
					models: repeatModels,
					parentPath: FORM_MODEL.repeatWithMove,
					ui: {
						screenLocation: [
							{
								path: [],
								locationPath: [{ elementName: FORM_MODEL.rowActionScreen }]
							}
						],
						repeatStaticState: {
							[ModelPath.toString(FORM_MODEL.repeatWithMove)]: {
								sortingState: {
									orderPath: FORM_MODEL.repeatWithMoveFirstColumn,
									sorting: "asc"
								}
							}
						}
					}
				});
				const opts = getDndOptions(defaultRepeat, repeatUid, sortConfig, false);

				strictEqual(opts, undefined);
			});

			it("given repeat is currently filtered", () => {
				const filterConfig = SetupHelpers.setupRenderConfiguration({
					models: repeatModels,
					parentPath: FORM_MODEL.repeatWithMove,
					ui: {
						screenLocation: [
							{
								path: [],
								locationPath: [{ elementName: FORM_MODEL.rowActionScreen }]
							}
						],
						repeatStaticState: {
							[ModelPath.toString(FORM_MODEL.repeatWithMove)]: {
								filters: {
									[ModelPath.toString(FORM_MODEL.repeatWithMove)]: {
										columnPath: FORM_MODEL.repeatWithMoveFirstColumn,
										filter: { filterValue: "test" }
									}
								}
							}
						}
					}
				});
				const opts = getDndOptions(defaultRepeat, repeatUid, filterConfig, false);

				strictEqual(opts, undefined);
			});

			it("given repeat has expression filter", () => {
				const repeatWithFilterExpression = getRepeat(
					repeatModels.formModel,
					FORM_MODEL.repeatWithFilterExpression
				);
				const opts = getDndOptions(repeatWithFilterExpression, repeatUid, defaultConfig, false);

				strictEqual(opts, undefined);
			});
		});
	});

	describe("createDndOptions", () => {
		it("returns an options object containing relevant methods and props", () => {
			const opts = createDndOptions(defaultRepeat, repeatUid, defaultConfig);

			strictEqual(opts.acceptType, repeatUid);
			strictEqual(typeof opts.canDrag, "function");
			strictEqual(typeof opts.onDrop, "function");
		});

		describe("#canDrag", () => {
			it("disallows dragging when the form is disabled", () => {
				const disabledConfig = SetupHelpers.setupRenderConfiguration({
					models: repeatModels,
					parentPath: FORM_MODEL.repeatWithMove,
					ui: { disabled: true }
				});
				const opts = createDndOptions(defaultRepeat, repeatUid, disabledConfig);

				const result = opts.canDrag?.({
					dragItem: createItem()
				});

				strictEqual(result, false);
			});

			it("disallows dragging when correction model is visible", () => {
				const correctionModeConfig = SetupHelpers.setupRenderConfiguration({
					models: repeatModels,
					parentPath: FORM_MODEL.repeatWithMove,
					ui: {
						correctionModeBackup: { location: [], sections: {} }
					}
				});
				const opts = createDndOptions(defaultRepeat, repeatUid, correctionModeConfig);

				const result = opts.canDrag?.({
					dragItem: createItem()
				});

				strictEqual(result, false);
			});

			it("allows dragging otherwise", () => {
				const opts = createDndOptions(defaultRepeat, repeatUid, defaultConfig);

				const result = opts.canDrag?.({
					dragItem: createItem()
				});

				strictEqual(result, true);
			});
		});

		describe("#onDrop", () => {
			const dispatchStub = mock.fn<Dispatch>();

			const stubConfig = setupFixtureObject(() =>
				SetupHelpers.setupRenderConfiguration({
					models: repeatModels,
					parentPath: FORM_MODEL.repeatWithMove,
					dispatchConfig: defaultMapDispatchToProps(dispatchStub).eventHandlers
				})
			);

			afterEach(() => {
				dispatchStub.mock.resetCalls();
			});

			it("calls onMoveRow with the correct delta when dropping in a row above", () => {
				const opts = createDndOptions(defaultRepeat, repeatUid, stubConfig);

				opts.onDrop?.({
					dragItem: createItem({ index: 3 }),
					dropResult: createItem({ index: 1 })
				});

				deepStrictEqual(dispatchStub.mock.calls.at(0)?.arguments, [
					Events.Repeat.moveRowTriggered({
						repeatFormModelPath: stubConfig.parentPath,
						rowPath: ROW_DOCUMENT_PATH,
						delta: -2
					})
				]);
			});

			it("calls onMoveRow with the correct delta when dropping in a row below", () => {
				const opts = createDndOptions(defaultRepeat, repeatUid, stubConfig);

				opts.onDrop?.({
					dragItem: createItem({ index: 1 }),
					dropResult: createItem({ index: 3 })
				});

				deepStrictEqual(dispatchStub.mock.calls.at(0)?.arguments, [
					Events.Repeat.moveRowTriggered({
						repeatFormModelPath: stubConfig.parentPath,
						rowPath: ROW_DOCUMENT_PATH,
						delta: 1
					})
				]);
			});

			it("does not call onMoveRow when dropping the row in the same place", () => {
				const opts = createDndOptions(defaultRepeat, repeatUid, stubConfig);

				opts.onDrop?.({
					dragItem: createItem({ index: 2 }),
					dropResult: createItem({ index: 2 })
				});

				strictEqual(dispatchStub.mock.callCount(), 0);
			});
		});
	});
});

function createItem({
	path = ROW_DOCUMENT_PATH,
	index = 0
}: {
	readonly path?: EntityInstancePath;
	readonly index?: number;
} = {}): TableRenderPropsType.DragObject<RepeatRow> {
	return {
		row: { path, values: [], rowIndexInDocument: 0 },
		rowIndex: index
	};
}

function getRepeat(formModel: FormModel, path: ModelPath): FormModel.Repeat {
	const repeat = findElementByFormModelPath(formModel, path);

	assertCondition(FormModel.Repeat.isInstance(repeat));

	return repeat;
}
