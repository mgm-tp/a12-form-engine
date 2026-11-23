// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { EngineStore, Models } from "../../../back-end/store/index.js";
import { createEngineStore } from "../../../back-end/store/internal/storeFactory.js";
import type { ReadonlyObjectMap } from "../../../models/index.js";
import type { Value } from "../../../view/index.js";
import { createConfig } from "../../../view/internal/configuration/Defaults.js";
import { getValueByPath } from "../../../view/internal/utilities/getValueByPath.js";
import { US_LOCALE } from "../../utils/localization.js";
import { SetupHelpers } from "../../utils/setup.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";
import {
	createDocumentForRepeat,
	createNestedL1Entry
} from "../../utils/test-model-helpers/repeat.js";
import {
	createValidationEntry,
	createValidationEntryWithParsingError
} from "../../utils/validation.js";

import { externalEnumerationProvider } from "./configurable_externalenumeration.js";

const { setupRenderConfiguration } = SetupHelpers;

describe("unit.view.getValueByPath", () => {
	const picusTypesModelFixture = setupModelsFixture("controls.picustypes");
	const inlineRepeatModelFixture = setupModelsFixture("repeat", "inline");

	describe("given a path to a non-repeatable field", () => {
		describe("and no validation messages exist for that field", () => {
			describe("and the field is of type string", () => {
				describe("with no external enumeration defined", () => {
					it("returns the correct Value object", () => {
						const path = [
							{ elementName: "A12T_PicusTypes", index: 1 },
							{ elementName: "String", index: 1 },
							{ elementName: "String01", index: 1 }
						];

						executeTest({
							models: picusTypesModelFixture,
							document: { A12T_PicusTypes: { String: { String01: "Test" } } },
							path,
							expectedValue: {
								ui: "Test",
								data: "Test",
								path
							}
						});
					});
				});

				describe("with an external enumeration defined", () => {
					it("returns the correct Value object", () => {
						const path = [
							{ elementName: "A12T_PicusTypes", index: 1 },
							{ elementName: "Enumeration", index: 1 },
							{ elementName: "Enumeration05", index: 1 }
						];

						executeTest({
							models: picusTypesModelFixture,
							document: { A12T_PicusTypes: { Enumeration: { Enumeration05: "Berlin_key" } } },
							path,
							expectedValue: {
								ui: "Berlin",
								data: "Berlin_key",
								path
							}
						});
					});
				});
			});

			describe("and the field is of type number", () => {
				it("returns the correct Value object", () => {
					const path = [
						{ elementName: "A12T_PicusTypes", index: 1 },
						{ elementName: "Number", index: 1 },
						{ elementName: "Number02", index: 1 }
					];

					executeTest({
						models: picusTypesModelFixture,
						document: { A12T_PicusTypes: { Number: { Number02: 69420 } } },
						path,
						expectedValue: {
							ui: "69,420.0",
							data: 69420,
							path
						}
					});
				});
			});
		});

		describe("and at least one validation message exists for that field", () => {
			describe("and it is not a parse error", () => {
				it("returns the correct Value object", () => {
					const path = [
						{ elementName: "A12T_PicusTypes", index: 1 },
						{ elementName: "Number", index: 1 },
						{ elementName: "Number02", index: 1 }
					];

					executeTest({
						models: picusTypesModelFixture,
						document: { A12T_PicusTypes: { Number: { Number02: 69420 } } },
						path,
						messages: createValidationEntry({ path }),
						expectedValue: {
							ui: "69,420.0",
							data: 69420,
							path
						}
					});
				});
			});

			describe("and it is a parse error", () => {
				it("returns the correct Value object", () => {
					const path = [
						{ elementName: "A12T_PicusTypes", index: 1 },
						{ elementName: "Number", index: 1 },
						{ elementName: "Number02", index: 1 }
					];

					executeTest({
						models: picusTypesModelFixture,
						document: { A12T_PicusTypes: { Number: { Number02: "69420a" } } },
						path,
						messages: createValidationEntryWithParsingError(
							path,
							"69420a",
							"numberContainsIllegalSymbols"
						),
						expectedValue: {
							ui: "69420a",
							data: "69420a",
							path
						}
					});
				});
			});
		});
	});

	describe("given a path to a repeatable field", () => {
		describe("and no validation messages exist for that field", () => {
			describe("and the field is of type string", () => {
				describe("with no external enumeration defined", () => {
					it("returns the correct Value object", () => {
						const path = [
							{ elementName: "Root", index: 1 },
							{ elementName: "Nested_L1", index: 2 },
							{ elementName: "L1_String", index: 1 }
						];

						executeTest({
							models: inlineRepeatModelFixture,
							document: createDocumentForRepeat({
								nestedL1: [
									createNestedL1Entry({ L1_String: "Test1", L1_Number: 17 }),
									createNestedL1Entry({ L1_String: "Test2", L1_Number: 17 })
								]
							}),
							path,
							expectedValue: {
								ui: "Test2",
								data: "Test2",
								path
							}
						});
					});
				});

				describe("with an external enumeration defined", () => {
					it("returns the correct Value object", () => {
						const path = [
							{ elementName: "Root", index: 1 },
							{ elementName: "Nested_L1", index: 2 },
							{ elementName: "L1_ExternalEnumeration", index: 1 }
						];

						executeTest({
							models: inlineRepeatModelFixture,
							document: createDocumentForRepeat({
								nestedL1: [
									createNestedL1Entry({ L1_ExternalEnumeration: "Berlin_key", L1_Number: 17 }),
									createNestedL1Entry({ L1_ExternalEnumeration: "Munich_key", L1_Number: 17 })
								]
							}),
							path,
							expectedValue: {
								ui: "Munich",
								data: "Munich_key",
								path
							}
						});
					});
				});
			});

			describe("and the field is of type number", () => {
				it("returns the correct Value object", () => {
					const path = [
						{ elementName: "Root", index: 1 },
						{ elementName: "Nested_L1", index: 2 },
						{ elementName: "L1_Number", index: 1 }
					];

					executeTest({
						models: inlineRepeatModelFixture,
						document: createDocumentForRepeat({
							nestedL1: [
								createNestedL1Entry({ L1_Number: 69420 }),
								createNestedL1Entry({ L1_Number: 80085 })
							]
						}),
						path,
						expectedValue: {
							ui: "80,085",
							data: 80085,
							path
						}
					});
				});
			});
		});

		describe("and at least one validation message exists for that field", () => {
			describe("and it is not a parse error", () => {
				it("returns the correct Value object", () => {
					const path = [
						{ elementName: "Root", index: 1 },
						{ elementName: "Nested_L1", index: 2 },
						{ elementName: "L1_Number", index: 1 }
					];

					executeTest({
						models: inlineRepeatModelFixture,
						document: createDocumentForRepeat({
							nestedL1: [
								createNestedL1Entry({ L1_Number: 69420 }),
								createNestedL1Entry({ L1_Number: 80085 })
							]
						}),
						path,
						messages: createValidationEntry({ path }),
						expectedValue: {
							ui: "80,085",
							data: 80085,
							path
						}
					});
				});
			});

			describe("and it is a parse error", () => {
				it("returns the correct Value object", () => {
					const path = [
						{ elementName: "Root", index: 1 },
						{ elementName: "Nested_L1", index: 2 },
						{ elementName: "L1_Number", index: 1 }
					];

					executeTest({
						models: inlineRepeatModelFixture,
						document: createDocumentForRepeat({
							nestedL1: [createNestedL1Entry({ L1_Number: 69420 }), { L1_Number: "80085a" }]
						}),
						path,
						messages: createValidationEntryWithParsingError(
							path,
							"80085a",
							"numberContainsIllegalSymbols"
						),
						expectedValue: {
							ui: "80085a",
							data: "80085a",
							path
						}
					});
				});
			});
		});
	});

	function executeTest(options: {
		models: Models;
		document: {};
		path: EntityInstancePath;
		messages?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
		expectedValue: Value;
	}) {
		const { models, document, path, messages, expectedValue } = options;
		const initialState = createEngineStore({
			models,
			locale: US_LOCALE,
			data: { document }
		});

		const renderConfig = setupRenderConfiguration({
			models,
			config: createConfig({ externalEnumerationProvider }, initialState)
		});

		const actualValue = getValueByPath({
			documentModel: models.documentModel,
			formModel: models.formModel,
			document,
			path,
			messages: messages ?? {},
			converter: defaultValueConversion(defaultDataFormats(US_LOCALE)),
			locale: US_LOCALE,
			localizer: defaultLocalizerFactory({
				locale: US_LOCALE,
				dataFormats: defaultDataFormats(US_LOCALE)
			}),
			externalEnumerationProvider: renderConfig.renderOptions.config.externalEnumerationProvider
		});

		deepStrictEqual(actualValue, expectedValue);
	}
});
