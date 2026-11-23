// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepEqual, equal } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore, Models } from "../../../../../../../back-end/store/internal/store.js";
import { DocumentPath } from "../../../../../../../models/internal/utils/document-utils.js";
import { BULLET_LIST_ITEM, BULLET_LIST_UNORDERED } from "../../../../../../rtl-utils/data-roles.js";
import type { RtlRenderWrapper } from "../../../../../../rtl-utils/render-wrapper.js";
import {
	createValidationEntry,
	createValidationMessage
} from "../../../../../../utils/validation.js";

import type { FieldBasedProps, GroupBasedProps } from "../input-utils.js";
import { mountComponent, primitivePropsTest } from "../input-utils.js";

export function executeValidationMessagesTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps,
	executeErrorWarningPropTest: boolean
): void {
	const validationMessagesWithError = {
		messages: {
			[DocumentPath.toString(baseProps.path)]: {
				validationMessages: [createValidationMessage({ path: baseProps.path })]
			}
		}
	};
	const validationMessageWithWarning = {
		messages: createValidationEntry({ path: baseProps.path, type: "WARNING" })
	};
	const validationMessageWithInfo = {
		messages: createValidationEntry({ path: baseProps.path, type: "INFO" })
	};

	describe("messageExposition = none", () => {
		// test single message
		function assertErrorText(
			expected: string,
			severity: EngineStore.Validation.MessageSeverity,
			wrapper: RtlRenderWrapper
		): void {
			const errorText = within(wrapper.baseElement).getByDataRole(`${severity.toLowerCase()}-text`);
			equal(errorText.textContent, expected);
		}

		// test list of messages
		function assertErrorTexts(
			expected: string[],
			severity: EngineStore.Validation.MessageSeverity,
			wrapper: RtlRenderWrapper
		): void {
			const errorText = within(wrapper.baseElement).getByDataRole(`${severity.toLowerCase()}-text`);
			const list = within(errorText).getByDataRole(BULLET_LIST_UNORDERED);
			const items = within(list).getAllByDataRole(BULLET_LIST_ITEM);
			const messages = items.map(item => item.textContent);

			deepEqual(messages, expected);
		}

		describe("error", () => {
			const errorBaseProps = {
				path: baseProps.path,
				component: baseProps.componentErrorProp || baseProps.component,
				documentElement: baseProps.documentElement,
				documentElementDataType: baseProps.documentElementDataType,
				renderFunction: baseProps.renderFunction,
				formModelPath: []
			};

			describe("when there is one validation message with type 'error'", () => {
				if (executeErrorWarningPropTest) {
					it(`renders a(n) ${baseProps.component} with prop error=true`, async () => {
						await primitivePropsTest({
							models: models(),
							baseProps,
							modelElement: {},
							propName: "error",
							propValue: true,
							ui: validationMessagesWithError,
							path: baseProps.path,
							component: baseProps.componentErrorProp,
							formModelPath: []
						});
					});
				}

				it(`renders a(n) ${baseProps.component} with a message box with a normal text`, async () => {
					const wrapper = await mountComponent({
						...errorBaseProps,
						models: models(),
						validationMessages: {
							errors: [[{ key: "foo", defaults: { en: "error1" } }]]
						}
					});

					assertErrorText("error1", "ERROR", wrapper);
				});
			});

			describe("when there are multiple validation message with type 'error'", () => {
				it(`renders a(n) ${baseProps.component} with a message box with a list`, async () => {
					const wrapper = await mountComponent({
						...errorBaseProps,
						models: models(),
						validationMessages: {
							errors: [
								[{ key: "foo", defaults: { en: "error1" } }],
								[{ key: "foo", defaults: { en: "error2" } }]
							]
						}
					});

					assertErrorTexts(["error1", "error2"], "ERROR", wrapper);
				});
			});
		});

		describe("warning", () => {
			const errorBaseProps = {
				path: baseProps.path,
				component: baseProps.componentErrorProp || baseProps.component,
				documentElement: baseProps.documentElement,
				documentElementDataType: baseProps.documentElementDataType,
				renderFunction: baseProps.renderFunction,
				formModelPath: []
			};

			describe("when there is one validation message with type 'warning'", () => {
				if (executeErrorWarningPropTest) {
					it(`renders a(n) ${baseProps.component} with prop warning=true`, async () => {
						await primitivePropsTest({
							models: models(),
							baseProps,
							modelElement: {},
							propName: "warning",
							propValue: true,
							ui: validationMessageWithWarning,
							path: baseProps.path,
							component: baseProps.componentErrorProp,
							formModelPath: []
						});
					});
				}

				it(`renders a(n) ${baseProps.component} with a message box with a normal text`, async () => {
					const wrapper = await mountComponent({
						...errorBaseProps,
						models: models(),
						validationMessages: {
							warnings: [[{ key: "foo", defaults: { en: "warning1" } }]]
						}
					});

					assertErrorText("warning1", "WARNING", wrapper);
				});
			});

			describe("when there are multiple validation message with type 'warning'", () => {
				it(`renders a(n) ${baseProps.component} with a message box with a list`, async () => {
					const wrapper = await mountComponent({
						...errorBaseProps,
						models: models(),
						validationMessages: {
							warnings: [
								[{ key: "foo", defaults: { en: "warning1" } }],
								[{ key: "foo", defaults: { en: "warning2" } }]
							]
						}
					});

					assertErrorTexts(["warning1", "warning2"], "WARNING", wrapper);
				});
			});
		});

		// data display widgets don't have infoMessages
		if (baseProps.component !== "TextOutput") {
			describe("info", () => {
				const errorBaseProps = {
					path: baseProps.path,
					component: baseProps.componentErrorProp || baseProps.component,
					documentElement: baseProps.documentElement,
					documentElementDataType: baseProps.documentElementDataType,
					renderFunction: baseProps.renderFunction,
					formModelPath: []
				};

				describe("when there is one validation message with type 'info'", () => {
					if (executeErrorWarningPropTest) {
						it(`renders a(n) ${baseProps.component} with prop info=true`, async () => {
							await primitivePropsTest({
								models: models(),
								baseProps,
								modelElement: {},
								propName: "info",
								propValue: true,
								ui: validationMessageWithInfo,
								path: baseProps.path,
								component: baseProps.componentErrorProp,
								formModelPath: []
							});
						});
					}
					it(`renders a(n) ${baseProps.component} with a message box with a normal text`, async () => {
						const wrapper = await mountComponent({
							...errorBaseProps,
							models: models(),
							validationMessages: {
								infos: [[{ key: "foo", defaults: { en: "info1" } }]]
							}
						});

						assertErrorText("info1", "INFO", wrapper);
					});
				});

				describe("when there are multiple validation message with type 'info'", () => {
					it(`renders a(n) ${baseProps.component} with a message box with a list`, async () => {
						const wrapper = await mountComponent({
							...errorBaseProps,
							models: models(),
							validationMessages: {
								infos: [
									[{ key: "foo", defaults: { en: "info1" } }],
									[{ key: "foo", defaults: { en: "info2" } }]
								]
							}
						});

						assertErrorTexts(["info1", "info2"], "INFO", wrapper);
					});
				});
			});
		}
	});
}
