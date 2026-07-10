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

import type { EngineStore } from "../../../../../back-end/store/index.js";
import { Commands } from "../../../../../back-end/store/index.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { MiddlewareHelpers } from "../../../../utils/MiddlewareHelpers.js";
import { createTestStore } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";

describe("api.back-end.store.middleware", () => {
	describe("validatePartMiddlewareFactory", () => {
		describe("handles Commands.validatePart", () => {
			const middlewareSpy = setupFixture(() => MiddlewareHelpers.createMiddlewareSpy());

			const models = setupModelsFixture("computation-validation.errorValue");

			describe("Given a document with no errors", () => {
				beforeEach(() => {
					middlewareSpy.spy.mock.resetCalls();
				});

				describe("and no payload in the Commands.validatePart action", () => {
					it("dispatches no actions", () => {
						setupStore({ document: { Root: { aNumber: 123 } } }).dispatch(
							Commands.validatePart({})
						);

						MiddlewareHelpers.assertNumberOfActions(middlewareSpy.spy, []);
					});
				});

				describe("and 'focusFirstError' in the payload is true in the Commands.validatePart action", () => {
					it("dispatches no actions", () => {
						setupStore({ document: { Root: { aNumber: 123 } } }).dispatch(
							Commands.validatePart({ focusFirstError: true })
						);

						MiddlewareHelpers.assertNumberOfActions(middlewareSpy.spy, []);
					});
				});
			});

			describe("Given a document with errors", () => {
				const setMessageState = Commands.setMessageState({
					messages: {
						"/Root[1]/aString[1]": {
							validationMessages: [
								{
									element: [
										{
											elementName: "Root",
											index: 1
										},
										{
											elementName: "aString",
											index: 1
										}
									],
									errorCode: "Error rule_bba8e",
									errorKey: "/Root/AtLeastOneFilled",
									errorText: [
										{
											key: "documentModel.ruleErrorMessage.computation-validation\\perrorValue-document.Root.AtLeastOneFilled",
											args: {},
											defaults: {
												en: "At least one must be filled: aNumber or aString"
											}
										}
									],
									referencedFields: [
										[
											{
												elementName: "Root",
												index: 1
											},
											{
												elementName: "aNumber",
												index: 1
											}
										],
										[
											{
												elementName: "Root",
												index: 1
											},
											{
												elementName: "aString",
												index: 1
											}
										]
									],
									severity: "ERROR"
								}
							]
						}
					}
				});
				describe("and no payload in the Commands.validatePart action", () => {
					it("dispatches a setMessageState action with the error message(s)", () => {
						setupStore({
							document: { Root: { aBool: false } }
						}).dispatch(Commands.validatePart({}));

						MiddlewareHelpers.assertAction(middlewareSpy.spy, setMessageState);
					});
				});

				describe("and 'focusFirstError' in the payload is true in the Commands.validatePart action", () => {
					before("", () => {
						setupStore({
							document: { Root: { aBool: false } }
						}).dispatch(Commands.validatePart({ focusFirstError: true }));
					});
					it("dispatches a setMessageState action with the error message", () => {
						MiddlewareHelpers.assertAction(middlewareSpy.spy, setMessageState);
					});

					it("dispatches Commands.changeScreenState to set the focusedComponent to the invalid control", () => {
						const changeScreenState = Commands.changeScreenState({
							index: 0,
							focusedComponent: {
								formModelPath: [
									{
										elementName: "Screen1"
									},
									{
										elementName: "all fields"
									},
									{
										elementName: "row-5f2b7"
									},
									{
										elementName: "control-9c3e1"
									}
								]
							}
						});

						MiddlewareHelpers.assertAction(middlewareSpy.spy, changeScreenState);
					});
				});
			});

			function setupStore(options: {
				document: object;
				messages?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
			}) {
				const { document, messages } = options;
				return createTestStore({
					storeConfig: {
						models: models,
						data: { dirty: false, document },
						ui: { messages }
					},
					middlewares: [middlewareSpy.middleware]
				});
			}
		});
	});
});
