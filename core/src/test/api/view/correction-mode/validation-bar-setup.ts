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

import { mock, type Mock } from "node:test";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { Models } from "../../../../back-end/store/internal/store.js";
import type { DispatchConfiguration } from "../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../view/index.js";
import type { RtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import { SetupHelpers } from "../../../utils/setup.js";
import {
	createDocument,
	DOCUMENT
} from "../../../utils/test-model-helpers/validation.errors_and_warnings_and_infos.js";
import { createValidationMessage } from "../../../utils/validation.js";

export type StubbedDispatchConfig = DispatchConfiguration & {
	correctionMode: {
		onGoToElement: Mock<DispatchConfiguration.CorrectionMode["onGoToElement"]>;
		correctionView: {
			onShow: Mock<DispatchConfiguration.CorrectionMode.CorrectionView["onShow"]>;
		};
		validationBar: {
			onShowMessage: Mock<DispatchConfiguration.CorrectionMode.ValidationBar["onShowMessage"]>;
			onExpand: Mock<DispatchConfiguration.CorrectionMode.ValidationBar["onExpand"]>;
		};
	};
};

/**
 * Test setup
 * If onlyInfos = true: Creates 7 info messages
 * If onlyWarnings = true: Creates 7 warning messages
 * If onlyError = true: Creates 7 error messages
 * If non of them are true: Creates 3 error, 2 warning and 2 info messages
 */
export function setupValidationBarTests(props: {
	models: Models;
	setupDevApp?: boolean;
	expanded?: boolean;
	multipleCauses?: boolean;
	validationBarNotVisible?: boolean;
	disabled?: boolean;
	onlyInfos?: boolean;
	onlyWarnings?: boolean;
	onlyErrors?: boolean;
	only?: "";
	currentMessageKey?: string;
	locale?: Locale;
	dispatchConfig?: StubbedDispatchConfig;
	onlyTopLevelMessages?: boolean;
	onlyRepeatMessages?: boolean;
	onlyNestedRepeatMessages?: boolean;
}): RtlRenderWrapper {
	const validationMessages = {
		[ModelPath.toString(DOCUMENT.pathString)]: {
			validationMessages: [
				createValidationMessage({
					type: props.onlyInfos ? "INFO" : props.onlyWarnings ? "WARNING" : "ERROR",
					path: DOCUMENT.pathString,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Error String 1" }
						}
					],
					errorKey: "1",
					referencedFields: props.multipleCauses
						? [DOCUMENT.pathString, DOCUMENT.pathNumber]
						: [DOCUMENT.pathString]
				}),
				createValidationMessage({
					type: props.onlyInfos ? "INFO" : props.onlyWarnings ? "WARNING" : "ERROR",
					path: DOCUMENT.pathString,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Error String 2" }
						}
					],
					errorKey: "2"
				}),
				createValidationMessage({
					type: props.onlyInfos ? "INFO" : props.onlyWarnings ? "WARNING" : "ERROR",
					path: DOCUMENT.pathString,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Error String 3" }
						}
					],
					errorKey: "3"
				})
			]
		},
		[ModelPath.toString(DOCUMENT.pathNumber)]: {
			validationMessages: [
				createValidationMessage({
					type: props.onlyInfos ? "INFO" : props.onlyErrors ? "ERROR" : "WARNING",
					path: DOCUMENT.pathNumber,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Warning String 4" }
						}
					],
					errorKey: "1"
				}),
				createValidationMessage({
					type: props.onlyInfos ? "INFO" : props.onlyErrors ? "ERROR" : "WARNING",
					path: DOCUMENT.pathNumber,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Warning String 5" }
						}
					],
					errorKey: "2"
				}),
				createValidationMessage({
					type: props.onlyErrors ? "ERROR" : props.onlyWarnings ? "WARNING" : "INFO",
					path: DOCUMENT.pathNumber,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Info String 6" }
						}
					],
					errorKey: "3"
				}),
				createValidationMessage({
					type: props.onlyErrors ? "ERROR" : props.onlyWarnings ? "WARNING" : "INFO",
					path: DOCUMENT.pathNumber,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Info String 7" }
						}
					],
					errorKey: "4"
				})
			]
		}
	};

	const repeatMessages = {
		[ModelPath.toString(DOCUMENT.pathRepeatString2)]: {
			validationMessages: [
				createValidationMessage({
					type: props.onlyInfos ? "INFO" : props.onlyWarnings ? "WARNING" : "ERROR",
					path: DOCUMENT.pathRepeatString2,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Error String 1" }
						}
					],
					errorKey: "1",
					referencedFields: props.multipleCauses
						? [DOCUMENT.pathRepeatString2, DOCUMENT.pathRepeatNumber]
						: [DOCUMENT.pathRepeatString2]
				}),
				createValidationMessage({
					type: props.onlyInfos ? "INFO" : props.onlyWarnings ? "WARNING" : "ERROR",
					path: DOCUMENT.pathRepeatString2,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Error String 2" }
						}
					],
					errorKey: "2"
				}),
				createValidationMessage({
					type: props.onlyInfos ? "INFO" : props.onlyWarnings ? "WARNING" : "ERROR",
					path: DOCUMENT.pathRepeatString2,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Error String 3" }
						}
					],
					errorKey: "3"
				})
			]
		}
	};

	const nestedRepeatMessages = {
		[ModelPath.toString(DOCUMENT.pathNestedRepeatString)]: {
			validationMessages: [
				createValidationMessage({
					type: props.onlyInfos ? "INFO" : props.onlyWarnings ? "WARNING" : "ERROR",
					path: DOCUMENT.pathNestedRepeatString,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Error String 1" }
						}
					],
					errorKey: "1",
					referencedFields: props.multipleCauses
						? [DOCUMENT.pathNestedRepeatString, DOCUMENT.pathRepeatNumber]
						: [DOCUMENT.pathNestedRepeatString]
				}),
				createValidationMessage({
					type: props.onlyInfos ? "INFO" : props.onlyWarnings ? "WARNING" : "ERROR",
					path: DOCUMENT.pathNestedRepeatString,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Error String 2" }
						}
					],
					errorKey: "2"
				}),
				createValidationMessage({
					type: props.onlyInfos ? "INFO" : props.onlyWarnings ? "WARNING" : "ERROR",
					path: DOCUMENT.pathNestedRepeatString,
					errorText: [
						{
							key: "foo",
							defaults: { en: "Error String 3" }
						}
					],
					errorKey: "3"
				})
			]
		}
	};

	const config = {
		models: props.models,
		data: { document: createDocument(0, 2, 1) },
		ui: {
			disabled: props.disabled,
			messages: props.onlyTopLevelMessages
				? validationMessages
				: props.onlyRepeatMessages
					? repeatMessages
					: props.onlyNestedRepeatMessages
						? nestedRepeatMessages
						: { ...validationMessages, ...repeatMessages, ...nestedRepeatMessages },
			validationBar: {
				visible: !props.validationBarNotVisible,
				expanded: props.expanded === true,
				currentMessageKey: props.currentMessageKey
			}
		},
		dispatchConfig: props.dispatchConfig,
		locale: props.locale
	};
	return (
		props.setupDevApp
			? SetupHelpers.setupConnectedFormEngineWithRtl
			: SetupHelpers.setupContentBoxRendererWithRtl
	)(config);
}

export function createStubbedDispatchConfig(): StubbedDispatchConfig {
	const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
	const stubbedDispatchConfig = {
		...stubbedDispatch.eventHandlers,
		correctionMode: {
			...stubbedDispatch.eventHandlers.correctionMode,
			onGoToElement: mock.fn(),
			correctionView: {
				...stubbedDispatch.eventHandlers.correctionMode.correctionView,
				onShow: mock.fn()
			},
			validationBar: {
				onShowMessage: mock.fn(),
				onExpand: mock.fn()
			}
		}
	};

	return stubbedDispatchConfig;
}
