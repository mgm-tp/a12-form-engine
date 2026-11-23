// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { createEngineStore, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineState, Models } from "../../../../../back-end/store/internal/store.js";
import type { FormModel } from "../../../../../models/index.js";
import { findElementByFormModelPath } from "../../../../../models/index.js";
import { DocumentPath } from "../../../../../models/internal/utils/document-utils.js";
import { DE_LOCALE, US_LOCALE } from "../../../../utils/localization.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { BUTTONS } from "../../../../utils/test-model-helpers/button.melies.js";
import { createValidationMessage } from "../../../../utils/validation.js";

const { setupRenderConfiguration } = SetupHelpers;

function setupValidationTests(models: Models, documentPath: EntityInstancePath): EngineState {
	const errorMessage = createValidationMessage({ path: documentPath, type: "ERROR" });
	const warningMessage = createValidationMessage({ path: documentPath, type: "WARNING" });
	const infoMessage = createValidationMessage({ path: documentPath, type: "INFO" });
	const store = createEngineStore({
		models,
		locale: US_LOCALE,
		data: {},
		ui: {
			messages: {
				[DocumentPath.toString(documentPath)]: {
					validationMessages: [
						errorMessage,
						errorMessage,
						warningMessage,
						warningMessage,
						infoMessage,
						infoMessage
					]
				}
			}
		}
	});

	return store;
}

describe("api.back-end.store.selectors", () => {
	const models = setupModelsFixture("buttons");
	const modelsLocalization = setupModelsFixture("localization");
	const modelsPlaceholder = setupModelsFixture("controls.placeholder");

	describe("UiStateSelectors", () => {
		describe("dirty", () => {
			it("returns the ui dirty state", () => {
				const store = createEngineStore({
					models,
					locale: US_LOCALE,
					data: {}
				});

				strictEqual(
					UiStateSelectors.dirty()({ ...store, ui: { ...store.ui, dirty: false } }),
					false
				);
				strictEqual(UiStateSelectors.dirty()({ ...store, ui: { ...store.ui, dirty: true } }), true);
			});
		});

		describe("InputLocalization", () => {
			describe("localizeInputLabel", () => {
				describe("Language: en", () => {
					it("localizes the label of an input correctly", () => {
						const locale = US_LOCALE;
						const renderConfiguration = setupRenderConfiguration({
							models: modelsLocalization,
							locale
						});
						const formModelPath = ModelHelpers.createModelPath(
							"Screen1",
							"sec1",
							"cg2",
							"row1",
							"control-22a04"
						);
						const input = findElementByFormModelPath(modelsLocalization.formModel, formModelPath);
						const localizables = UiStateSelectors.InputLocalization.labelLocalizables(
							formModelPath,
							input as FormModel.FieldBasedInputType
						)(renderConfiguration.renderOptions.state);

						const label = defaultLocalizerFactory({ locale })(...localizables);
						strictEqual(label, "DocumentModelLabel.en");
					});
				});

				describe("Language: de", () => {
					it("returns the correct localizables for the label of an input correctly", () => {
						const locale = DE_LOCALE;
						const renderConfiguration = setupRenderConfiguration({
							models: modelsLocalization,
							locale
						});
						const formModelPath = ModelHelpers.createModelPath(
							"Screen1",
							"sec1",
							"cg2",
							"row1",
							"control-22a04"
						);
						const input = findElementByFormModelPath(modelsLocalization.formModel, formModelPath);
						const localizables = UiStateSelectors.InputLocalization.labelLocalizables(
							formModelPath,
							input as FormModel.FieldBasedInputType
						)(renderConfiguration.renderOptions.state);

						const label = defaultLocalizerFactory({ locale })(...localizables);
						strictEqual(label, "DocumentModelLabel.de");
					});
				});
			});

			describe("localizePlaceholder", () => {
				describe("Language: en", () => {
					it("returns the correct localizables for the placeholder of an input correctly", () => {
						const locale = US_LOCALE;
						const renderConfiguration = setupRenderConfiguration({
							models: modelsPlaceholder,
							locale
						});
						const formModelPath = ModelHelpers.createModelPath(
							"Screen1",
							"cg",
							"row1",
							"control-3c65f"
						);
						const input = findElementByFormModelPath(modelsPlaceholder.formModel, formModelPath);
						const localizables = UiStateSelectors.InputLocalization.placeholderLocalizables(
							formModelPath,
							input as FormModel.FieldBasedInputType
						)(renderConfiguration.renderOptions.state);

						const label = defaultLocalizerFactory({ locale })(...localizables);
						strictEqual(label, "Please insert a text");
					});
				});

				describe("Language: de", () => {
					it("returns the correct localizables for the placeholder of an input correctly", () => {
						const locale = DE_LOCALE;
						const renderConfiguration = setupRenderConfiguration({
							models: modelsPlaceholder,
							locale
						});
						const formModelPath = ModelHelpers.createModelPath(
							"Screen1",
							"cg",
							"row1",
							"control-3c65f"
						);
						const input = findElementByFormModelPath(modelsPlaceholder.formModel, formModelPath);
						const localizables = UiStateSelectors.InputLocalization.placeholderLocalizables(
							formModelPath,
							input as FormModel.FieldBasedInputType
						)(renderConfiguration.renderOptions.state);

						const label = defaultLocalizerFactory({ locale })(...localizables);
						strictEqual(label, "Bitte Text einfügen");
					});
				});
			});

			describe("localizeHint", () => {
				describe("Language: en", () => {
					it("returns the correct localizables for the hint of an input correctly", () => {
						const locale = US_LOCALE;
						const renderConfiguration = setupRenderConfiguration({
							models: modelsLocalization,
							locale
						});
						const formModelPath = ModelHelpers.createModelPath(
							"Screen1",
							"sec1",
							"cg2",
							"row1",
							"control-22a04"
						);
						const input = findElementByFormModelPath(modelsLocalization.formModel, formModelPath);
						const localizables = UiStateSelectors.InputLocalization.hintLocalizables(
							formModelPath,
							input as FormModel.FieldBasedInputType
						)(renderConfiguration.renderOptions.state);

						const label = defaultLocalizerFactory({ locale })(...localizables);
						strictEqual(label, "DocumentModelHint.en");
					});
				});

				describe("Language: de", () => {
					it("returns the correct localizables for the hint of an input correctly", () => {
						const locale = DE_LOCALE;
						const renderConfiguration = setupRenderConfiguration({
							models: modelsLocalization,
							locale
						});
						const formModelPath = ModelHelpers.createModelPath(
							"Screen1",
							"sec1",
							"cg2",
							"row1",
							"control-22a04"
						);
						const input = findElementByFormModelPath(modelsLocalization.formModel, formModelPath);
						const localizables = UiStateSelectors.InputLocalization.hintLocalizables(
							formModelPath,
							input as FormModel.FieldBasedInputType
						)(renderConfiguration.renderOptions.state);

						const label = defaultLocalizerFactory({ locale })(...localizables);
						strictEqual(label, "DocumentModelHint.de");
					});
				});
			});
		});

		describe("validation", () => {
			describe("messagesByPath", () => {
				describe("with no validation messages for the given field in the ui state", () => {
					it("returns an empty array, ", () => {
						const store = setupValidationTests(models, BUTTONS.REQUIRED_FIELD_DOCUMENT_PATH);

						const validationMessages = UiStateSelectors.messagesByPath(
							BUTTONS.NUMBER_FIELD_DOCUMENT_PATH,
							BUTTONS.NUMBER_FIELD_MODEL_PATH
						)(store);

						strictEqual(validationMessages.length, 0);
					});
				});

				describe("with validation messages for the given field in the ui state", () => {
					it("returns all validation messages for the given field, when no filter is given", () => {
						const store = setupValidationTests(models, BUTTONS.NUMBER_FIELD_DOCUMENT_PATH);

						const validationMessages = UiStateSelectors.messagesByPath(
							BUTTONS.NUMBER_FIELD_DOCUMENT_PATH,
							BUTTONS.NUMBER_FIELD_MODEL_PATH
						)(store);

						strictEqual(validationMessages.length, 6);
					});

					it("returns all info messages for the given field, when filter === 'info'", () => {
						const store = setupValidationTests(models, BUTTONS.NUMBER_FIELD_DOCUMENT_PATH);

						const validationMessages = UiStateSelectors.messagesByPath(
							BUTTONS.NUMBER_FIELD_DOCUMENT_PATH,
							BUTTONS.NUMBER_FIELD_MODEL_PATH,
							"info"
						)(store);

						strictEqual(validationMessages.length, 2);
						validationMessages.forEach(msg => {
							strictEqual(msg.severity, "INFO");
						});
					});

					it("returns all warning messages for the given field, when filter === 'warning'", () => {
						const store = setupValidationTests(models, BUTTONS.NUMBER_FIELD_DOCUMENT_PATH);

						const validationMessages = UiStateSelectors.messagesByPath(
							BUTTONS.NUMBER_FIELD_DOCUMENT_PATH,
							BUTTONS.NUMBER_FIELD_MODEL_PATH,
							"warning"
						)(store);

						strictEqual(validationMessages.length, 2);
						validationMessages.forEach(msg => {
							strictEqual(msg.severity, "WARNING");
						});
					});

					it("returns all error messages for the given field, when filter === 'error'", () => {
						const store = setupValidationTests(models, BUTTONS.NUMBER_FIELD_DOCUMENT_PATH);

						const validationMessages = UiStateSelectors.messagesByPath(
							BUTTONS.NUMBER_FIELD_DOCUMENT_PATH,
							BUTTONS.NUMBER_FIELD_MODEL_PATH,
							"error"
						)(store);

						strictEqual(validationMessages.length, 2);
						validationMessages.forEach(msg => {
							strictEqual(msg.severity, "ERROR");
						});
					});
				});
			});
		});
	});
});
