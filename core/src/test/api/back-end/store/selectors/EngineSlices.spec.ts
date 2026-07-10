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

import { strictEqual, throws } from "node:assert/strict";

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";

import type { EngineStore } from "../../../../../back-end/store/index.js";
import {
	dataSlice,
	engineState,
	localeSlice,
	modelsSlice,
	uiSlice
} from "../../../../../back-end/store/index.js";
import { DE_LOCALE } from "../../../../utils/localization.js";
import { setupFixture } from "../../../../utils/setupFixture.js";

describe("api.back-end.store.selectors", () => {
	describe("EngineSlices", () => {
		const testUIState: Partial<EngineStore.UIState> = setupFixture(() => ({
			dirty: true,
			disabled: true,
			readonly: true,
			backup: [],
			sectionState: {},
			screenLocation: [],
			correctionScreen: {
				visible: false,
				showDetailsState: {}
			},
			validationBar: {
				visible: false,
				expanded: false,
				currentMessageKey: ""
			}
		}));

		describe("engineState", () => {
			const testEngineState = {
				ui: testUIState,
				data: { document: {} },
				models: { documentModel: {}, formModel: {} },
				locale: DE_LOCALE
			};

			it("returns the given object if it is of type EngineState", () => {
				strictEqual(engineState(testEngineState), testEngineState);
			});

			it("throws an error if the given object is not of type EngineState", () => {
				const { locale, ...engineStateWithoutLocaleLanguage } = testEngineState;
				const state = {
					...engineStateWithoutLocaleLanguage,
					locale: { country: "DE" }
				};
				throws(() => engineState(state), new Error("Not a valid EngineState"));
			});
		});

		describe("uiSlice", () => {
			it("returns the given object if it is of type EngineStore.UIState", () => {
				strictEqual(uiSlice(testUIState), testUIState);
			});

			it("throws an error if the given object is not of type EngineStore.UIState since it's missing dirty", () => {
				const uiState = { ...testUIState };
				delete uiState.dirty;
				throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
			});

			it("throws an error if the given object is not of type EngineStore.UIState since it's missing disabled", () => {
				const uiState = { ...testUIState };
				delete uiState.disabled;
				throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
			});

			it("throws an error if the given object is not of type EngineStore.UIState since it's missing readonly", () => {
				const uiState = { ...testUIState };
				delete uiState.readonly;
				throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
			});

			it("throws an error if the given object is not of type EngineStore.UIState since it's missing backup", () => {
				const uiState = { ...testUIState };
				delete uiState.backup;
				throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
			});

			it("throws an error if the given object is not of type EngineStore.UIState since it's missing sectionState", () => {
				const uiState = { ...testUIState };
				delete uiState.sectionState;
				throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
			});

			it("throws an error if the given object is not of type EngineStore.UIState since it's missing screenLocation", () => {
				const uiState = { ...testUIState };
				delete uiState.screenLocation;
				throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
			});

			it(
				"throws an error if the given object is not of type EngineStore.UIState " +
					"since it's missing correctionScreenState",
				() => {
					const uiState = { ...testUIState };
					delete uiState.correctionScreen;
					throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
				}
			);

			it(
				"throws an error if the given object is not of type EngineStore.UIState " +
					"since it's missing correctionScreenState.visible",
				() => {
					const { correctionScreen, ...uiStateWithoutCorrectionScreen } = testUIState;
					const uiState = {
						...uiStateWithoutCorrectionScreen,
						correctionScreen: {
							showDetailsState: {}
						}
					};
					throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
				}
			);

			it("throws an error if the given object is not of type EngineStore.UIState ince it's missing validationBar", () => {
				const uiState = { ...testUIState };
				delete uiState.validationBar;
				throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
			});

			it(
				"throws an error if the given object is not of type EngineStore.UIState " +
					"since it's missing validationBar.visible",
				() => {
					const { validationBar, ...uiStateWithoutValidationBar } = testUIState;
					const uiState = {
						...uiStateWithoutValidationBar,
						validationBar: {
							expanded: false
						}
					};
					throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
				}
			);

			it(
				"throws an error if the given object is not of type EngineStore.UIState " +
					"since it's missing validationBar.expanded",
				() => {
					const { validationBar, ...uiStateWithoutValidationBar } = testUIState;
					const uiState = {
						...uiStateWithoutValidationBar,
						validationBar: {
							visible: false
						}
					};
					throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
				}
			);

			it(
				"throws an error if the given object is not of type EngineStore.UIState " +
					"since it's missing correctionModeBackup.sections",
				() => {
					const { correctionModeBackup, ...uiStateWithoutVCorrectionModeBackup } = testUIState;
					const uiState = {
						...uiStateWithoutVCorrectionModeBackup,
						correctionModeBackup: {
							location: []
						}
					};
					throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
				}
			);

			it(
				"throws an error if the given object is not of type EngineStore.UIState " +
					"since it's missing correctionModeBackup.location",
				() => {
					const { correctionModeBackup, ...uiStateWithoutVCorrectionModeBackup } = testUIState;
					const uiState = {
						...uiStateWithoutVCorrectionModeBackup,
						correctionModeBackup: {
							sections: {}
						}
					};
					throws(() => uiSlice(uiState), new Error("Not a valid UI EngineState Slice"));
				}
			);
		});

		describe("dataSlice", () => {
			it("returns the given object if it is of type EngineStore.DataState", () => {
				const testData = { document: {} };
				strictEqual(dataSlice(testData), testData);
			});

			it("throws an error if the given object is not of type EngineStore.DataState since it's missing document", () => {
				const testData = {};
				throws(() => dataSlice(testData), new Error("Not a valid Data EngineState Slice"));
			});
		});

		describe("modelsSlice", () => {
			it("returns the given object if it is of type Models", () => {
				const testModels = { documentModel: {}, formModel: {} };
				strictEqual(modelsSlice(testModels), testModels);
			});

			it("throws an error if the given object is not of type Models since it's missing formModel", () => {
				const testModels = { documentModel: {} };
				throws(() => modelsSlice(testModels), new Error("Not a valid Models Slice"));
			});

			it("throws an error if the given object is not of type Models since it's missing documentModel", () => {
				const testModels = { formModel: {} };
				throws(() => modelsSlice(testModels), new Error("Not a valid Models Slice"));
			});
		});

		describe("localeSlice", () => {
			it("returns the given object if it is of type Locale", () => {
				const testLocale: Locale = DE_LOCALE;
				strictEqual(localeSlice(testLocale), testLocale);
			});

			it("throws an error if the given object is not of type Locale since it's missing language", () => {
				const testLocale: Partial<Locale> = { country: "DE" };
				throws(() => localeSlice(testLocale), new Error("Not a valid Locale Slice"));
			});

			it("throws an error if the given object is not of type Locale since it's missing country", () => {
				const testLocale: Partial<Locale> = { language: "de" };
				throws(() => localeSlice(testLocale), new Error("Not a valid Locale Slice"));
			});
		});
	});
});
