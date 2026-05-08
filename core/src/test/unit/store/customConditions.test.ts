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

import { Commands, Events } from "../../../back-end/store/index.js";
import { MiddlewareHelpers } from "../../utils/back-end-helpers.js";
import { DocumentHelpers } from "../../utils/document-helpers.js";
import { SetupHelpers } from "../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../utils/setupFixture.js";
import { createValidationEntry } from "../../utils/validation.js";

import { customConditionsFactory } from "./custom-conditions.js";

const { createTestStore } = SetupHelpers;

describe("unit.back-end.store.customConditions", () => {
	const models = setupModelsFixture("customization.custom-conditions");

	const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

	afterEach(() => {
		middlewareSpy.spy.mock.resetCalls();
	});

	describe("Field Value Change", () => {
		it("uses the custom conditions when validating the field value change", () => {
			const path = DocumentHelpers.createDocumentPath(["root"], ["SomeField"]);
			setupStore().dispatch(Events.valueChange({ path, value: "abc", formModelElementPath: [] }));

			const expectedCommand = Commands.setMessageState({
				messages: {
					...createValidationEntry({
						path,
						errorCode: "Error rule_16818",
						errorKey: "/root/TestRule",
						errorText: [
							{
								key: "documentModel.ruleErrorMessage.customization\\pcustom-conditions-document.root.TestRule",
								args: {},
								defaults: { en: "CustomCondition hits for field value change!" }
							}
						]
					})
				}
			});

			MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
		});

		it("uses the custom conditions when validating a field change due to a dependency", () => {
			const path = DocumentHelpers.createDocumentPath(
				["root"],
				["dependenciesWithCustomConditions"],
				["booleanField"]
			);
			setupStore().dispatch(Events.valueChange({ path, value: true, formModelElementPath: [] }));

			const expectedCommand = Commands.setMessageState({
				messages: {
					...createValidationEntry({
						path: DocumentHelpers.createDocumentPath(
							["root"],
							["dependenciesWithCustomConditions"],
							["stringField"]
						),
						errorCode: "Error rule_16818",
						errorKey: "/root/dependenciesWithCustomConditions/TestRule",
						errorText: [
							{
								key: "documentModel.ruleErrorMessage.customization\\pcustom-conditions-document.root.dependenciesWithCustomConditions.TestRule",
								args: {},
								defaults: { en: "CustomCondition hits for dependencies!" }
							}
						]
					})
				}
			});

			MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
		});

		it("uses the custom conditions when validating a field change due to a computation", () => {
			const path = DocumentHelpers.createDocumentPath(
				["root"],
				["computationWithCustomCondition"],
				["string1"]
			);
			setupStore().dispatch(Events.valueChange({ path, value: "abc", formModelElementPath: [] }));

			const expectedCommand = Commands.setMessageState({
				messages: {
					...createValidationEntry({
						path: DocumentHelpers.createDocumentPath(
							["root"],
							["computationWithCustomCondition"],
							["string2"]
						),
						errorCode: "Error rule_16818",
						errorKey: "/root/computationWithCustomCondition/TestRule",
						errorText: [
							{
								key: "documentModel.ruleErrorMessage.customization\\pcustom-conditions-document.root.computationWithCustomCondition.TestRule",
								args: {},
								defaults: { en: "CustomCondition hits for computation!" }
							}
						]
					})
				}
			});

			MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
		});
	});

	describe("Attachment Value Change", () => {
		it("uses the custom conditions when validating the field value change", () => {
			const path = DocumentHelpers.createDocumentPath(
				["root"],
				["attachmentWithCustomCondition"],
				["attachment1"]
			);

			const attachmentValue = {
				attachment_id: "1",
				original_filename: "abc.png",
				category: null,
				description: null,
				size: 100,
				content: "",
				mime_type: "image/jpeg"
			};
			setupStore().dispatch(
				Events.attachmentValueChange({
					path,
					value: attachmentValue,
					formModelElementPath: []
				})
			);

			const expectedCommand = Commands.setMessageState({
				messages: {
					...createValidationEntry({
						path: DocumentHelpers.createDocumentPath(
							["root"],
							["attachmentWithCustomCondition"],
							["attachment1"],
							["original_filename"]
						),
						errorCode: "Error rule_16818",
						errorKey: "/root/attachmentWithCustomCondition/TestRule",
						errorText: [
							{
								key: "documentModel.ruleErrorMessage.customization\\pcustom-conditions-document.root.attachmentWithCustomCondition.TestRule",
								args: {},
								defaults: { en: "CustomCondition hits for Attachment!" }
							}
						]
					})
				}
			});

			MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
		});
	});

	describe("Multi Select Value Change", () => {
		it("uses the custom conditions when validating the field value change", () => {
			const path = DocumentHelpers.createDocumentPath(
				["root"],
				["multiSelectWithCustomCondition"],
				["MultiSelect1", 0]
			);
			setupStore().dispatch(
				Events.multiSelectValueChange({
					path,
					value: [{ value: "key1" }],
					formModelElementPath: []
				})
			);

			const expectedCommand = Commands.setMessageState({
				messages: {
					...createValidationEntry({
						path: DocumentHelpers.createDocumentPath(
							["root"],
							["multiSelectWithCustomCondition"],
							["MultiSelect1"],
							["value"]
						),
						errorCode: "Error rule_16818",
						errorKey: "/root/multiSelectWithCustomCondition/TestRule",
						errorText: [
							{
								key: "documentModel.ruleErrorMessage.customization\\pcustom-conditions-document.root.multiSelectWithCustomCondition.TestRule",
								args: {},
								defaults: { en: "CustomCondition hits for MultiSelect!" }
							}
						]
					})
				}
			});

			MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
		});
	});

	function setupStore() {
		return createTestStore({
			storeConfig: { models: models },
			middlewares: [middlewareSpy.middleware],
			customConditionsFactory
		});
	}
});
