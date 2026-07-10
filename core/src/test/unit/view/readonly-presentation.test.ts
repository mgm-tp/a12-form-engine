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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import { createEngineStore } from "../../../back-end/store/index.js";
import type { EngineState } from "../../../back-end/store/internal/store.js";
import type { FormModel } from "../../../models/index.js";
import { evaluateReadonlyPresentation } from "../../../view/internal/utilities/enablements/readonly-presentation.js";
import { createModelPath } from "../../utils/createModelPath.js";
import { DocumentModelHelpers } from "../../utils/DocumentModelHelpers.js";
import {
	createControl,
	createControlGrid,
	createFieldColumn,
	createFormModel,
	createInlineRepeat,
	createRow,
	createScreen
} from "../../utils/form-model-factory.js";
import { US_LOCALE } from "../../utils/localization.js";

describe("unit.view.inputs", () => {
	describe("evaluateReadonlyPresentation", () => {
		const NAME_CG = "CG";
		const ID_ROW = "ROW";
		const ID_CONTROL = "CONTROL";
		const ID_INLINE_REPEAT = "INLINE_REPEAT";
		const ID_COLUMN = "COLUMN";
		const NAME_SCREEN = "SCREEN";
		let controlModelPath: ModelPath;
		let columnModelPath: ModelPath;

		before(() => {
			controlModelPath = createModelPath(NAME_SCREEN, NAME_CG, ID_ROW, ID_CONTROL);
			columnModelPath = createModelPath(NAME_SCREEN, `ir-${ID_INLINE_REPEAT}`, ID_COLUMN);
		});

		function setup(options: {
			modelReadonlyPresentation?: FormModel.ReadonlyPresentation;
			modelInlineRepeatReadonlyPresentation?: FormModel.ReadonlyPresentation;
			controlGridReadonlyPresentation?: FormModel.ReadonlyPresentation;
			controlReadonlyPresentation?: FormModel.ReadonlyPresentation;
			inlineRepeatReadonlyPresentation?: FormModel.ReadonlyPresentation;
			columnReadonlyPresentation?: FormModel.ReadonlyPresentation;
		}): EngineState {
			const control = createControl(ID_CONTROL, options.controlReadonlyPresentation);
			const row = createRow({ id: ID_ROW, cells: [control] });
			const controlGrid = createControlGrid({
				id: NAME_CG,
				name: NAME_CG,
				readonlyPresentation: options.controlGridReadonlyPresentation,
				rows: [row]
			});
			const column = createFieldColumn({
				id: ID_COLUMN,
				readonlyPresentation: options.columnReadonlyPresentation
			});
			const repeat = createInlineRepeat({
				id: ID_INLINE_REPEAT,
				readonlyPresentation: options.inlineRepeatReadonlyPresentation,
				columns: [column]
			});
			const screen = createScreen({
				id: NAME_SCREEN,
				name: NAME_SCREEN,
				screenElements: [controlGrid, repeat]
			});

			const formModel = createFormModel({
				readonlyPresentation: options.modelReadonlyPresentation,
				inlineRepeatReadonlyPresentation: options.modelInlineRepeatReadonlyPresentation,
				screens: [screen]
			});

			const documentModel = DocumentModelHelpers.createDocumentModel(DocumentModelHelpers.Group());

			return createEngineStore({
				models: { formModel, documentModel },
				data: {},
				locale: US_LOCALE
			});
		}

		describe("Given a Control", () => {
			describe("no readonly presentation set for the model or parent", () => {
				describe("no readonly presentation set for the control", () => {
					it("returns undefined", () => {
						const state = setup({});
						const readonlyPresentation = evaluateReadonlyPresentation(controlModelPath, state);
						strictEqual(readonlyPresentation, undefined);
					});
				});

				describe("readonly presentation 'INPUT' set for the control", () => {
					it("returns 'INPUT'", () => {
						const state = setup({
							controlReadonlyPresentation: "INPUT"
						});
						const readonlyPresentation = evaluateReadonlyPresentation(controlModelPath, state);
						strictEqual(readonlyPresentation, "INPUT");
					});
				});

				describe("readonly presentation 'TEXT' set for the control", () => {
					it("returns 'TEXT'", () => {
						const state = setup({
							controlReadonlyPresentation: "TEXT"
						});
						const readonlyPresentation = evaluateReadonlyPresentation(controlModelPath, state);
						strictEqual(readonlyPresentation, "TEXT");
					});
				});
			});

			describe("readonly presentation set for the parent", () => {
				describe("no readonly presentation set for the control", () => {
					it("returns readonly presentation of the parent", () => {
						const state = setup({
							controlGridReadonlyPresentation: "TEXT"
						});
						const readonlyPresentation = evaluateReadonlyPresentation(controlModelPath, state);
						strictEqual(readonlyPresentation, "TEXT");
					});
				});

				describe("readonly presentation  set for the control", () => {
					it("returns readonly presentation of the control", () => {
						const state = setup({
							controlGridReadonlyPresentation: "TEXT",
							controlReadonlyPresentation: "INPUT"
						});
						const readonlyPresentation = evaluateReadonlyPresentation(controlModelPath, state);
						strictEqual(readonlyPresentation, "INPUT");
					});
				});
			});

			describe("readonly presentation set for the model", () => {
				describe("no readonly presentation set for the control or any other parent", () => {
					it("returns the readonly presentation of the model", () => {
						const state = setup({
							modelReadonlyPresentation: "TEXT"
						});
						const readonlyPresentation = evaluateReadonlyPresentation(controlModelPath, state);
						strictEqual(readonlyPresentation, "TEXT");
					});
				});

				describe("readonly presentation set for the control", () => {
					it("returns the readonly presentation of the control", () => {
						const state = setup({
							modelReadonlyPresentation: "TEXT",
							controlReadonlyPresentation: "INPUT"
						});
						const readonlyPresentation = evaluateReadonlyPresentation(controlModelPath, state);
						strictEqual(readonlyPresentation, "INPUT");
					});
				});

				describe("readonly presentation set for the parent control-grid", () => {
					it("returns the readonly presentation of the parent", () => {
						const state = setup({
							modelReadonlyPresentation: "TEXT",
							controlGridReadonlyPresentation: "INPUT"
						});
						const readonlyPresentation = evaluateReadonlyPresentation(controlModelPath, state);
						strictEqual(readonlyPresentation, "INPUT");
					});
				});
			});
		});

		describe("Given a FieldOverviewColumn", () => {
			describe("no readonly presentation set for the model or parent repeat", () => {
				describe("no readonly presentation set for the column", () => {
					it("returns undefined", () => {
						const state = setup({});
						const readonlyPresentation = evaluateReadonlyPresentation(columnModelPath, state);
						strictEqual(readonlyPresentation, undefined);
					});
				});

				describe("readonly presentation 'INPUT' set for the column", () => {
					it("returns 'INPUT'", () => {
						const state = setup({ columnReadonlyPresentation: "INPUT" });
						const readonlyPresentation = evaluateReadonlyPresentation(columnModelPath, state);
						strictEqual(readonlyPresentation, "INPUT");
					});
				});

				describe("readonly presentation 'TEXT' set for the column", () => {
					it("returns 'TEXT'", () => {
						const state = setup({ columnReadonlyPresentation: "TEXT" });
						const readonlyPresentation = evaluateReadonlyPresentation(columnModelPath, state);
						strictEqual(readonlyPresentation, "TEXT");
					});
				});
			});

			describe("readonly presentation set for the parent repeat", () => {
				describe("no readonly presentation set for the column", () => {
					it("returns readonly presentation of the parent repeat", () => {
						const state = setup({ inlineRepeatReadonlyPresentation: "TEXT" });
						const readonlyPresentation = evaluateReadonlyPresentation(columnModelPath, state);
						strictEqual(readonlyPresentation, "TEXT");
					});
				});

				describe("readonly presentation  set for the column", () => {
					it("returns readonly presentation of the column", () => {
						const state = setup({
							inlineRepeatReadonlyPresentation: "TEXT",
							columnReadonlyPresentation: "INPUT"
						});
						const readonlyPresentation = evaluateReadonlyPresentation(columnModelPath, state);
						strictEqual(readonlyPresentation, "INPUT");
					});
				});
			});

			describe("readonly presentation set for the model", () => {
				describe("no readonly presentation set for the column or parent repeat", () => {
					it("returns the readonly presentation of the model", () => {
						const state = setup({
							modelInlineRepeatReadonlyPresentation: "TEXT"
						});
						const readonlyPresentation = evaluateReadonlyPresentation(columnModelPath, state);
						strictEqual(readonlyPresentation, "TEXT");
					});
				});

				describe("readonly presentation set for the column", () => {
					it("returns the readonly presentation of the column", () => {
						const state = setup({
							modelInlineRepeatReadonlyPresentation: "TEXT",
							columnReadonlyPresentation: "INPUT"
						});
						const readonlyPresentation = evaluateReadonlyPresentation(columnModelPath, state);
						strictEqual(readonlyPresentation, "INPUT");
					});
				});

				describe("readonly presentation set for the parent repeat", () => {
					it("returns the readonly presentation of the parent", () => {
						const state = setup({
							modelInlineRepeatReadonlyPresentation: "TEXT",
							inlineRepeatReadonlyPresentation: "INPUT"
						});
						const readonlyPresentation = evaluateReadonlyPresentation(columnModelPath, state);
						strictEqual(readonlyPresentation, "INPUT");
					});
				});
			});
		});
	});
});
