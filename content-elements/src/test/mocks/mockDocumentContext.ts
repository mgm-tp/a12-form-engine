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

import { mock } from "node:test";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	DocumentContext,
	ModelRepresentation
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	DocumentModel,
	FieldInstanceValue,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { ValueConversionConfig } from "@com.mgmtp.a12.utils/utils-localization/lib/main/conversion.js";

export interface DocumentContextReturnValues {
	// model
	getModelPathById?: ModelPath;
	getElementById?: DocumentModel.Element;
	getElementByPath?: DocumentModel.Element;
	getConversionConfig?: ValueConversionConfig;
	getRequired?: boolean;
	getComputed?: boolean;
	getFieldDisplayLabel?: string;
	getDocumentModelName?: string;
	getTimeZone?: string;
	// document
	getElementValue?: FieldInstanceValue;
	getFieldDisplayValue?: string;
	getGroupInstanceRepeatability?: number;
	getMessages?: Message[];
	getAllMessages?: Message[];
	getNotRelevant?: boolean;
	getEnumerationValues?: DocumentModel.EnumValue[];
	getFieldModelPresentation?: ModelRepresentation;
	toModelPresentation?: ModelRepresentation;
	fromModelPresentation?: FieldInstanceValue;
}

export function mockDocumentContext(returnValues?: DocumentContextReturnValues): DocumentContext {
	return {
		docRef: "test/1",
		model: {
			getModelPathById: mock.fn(() => returnValues?.getModelPathById ?? []),
			getElementById: mock.fn(() => returnValues?.getElementById ?? ({} as DocumentModel.Element)),
			getElementByPath: mock.fn(
				() => returnValues?.getElementByPath ?? ({} as DocumentModel.Element)
			),
			getConversionConfig: mock.fn(
				() => returnValues?.getConversionConfig ?? { type: "StringType" }
			),
			getRequired: mock.fn(() => returnValues?.getRequired ?? false),
			getComputed: mock.fn(() => returnValues?.getComputed ?? false),
			getFieldDisplayLabel: mock.fn(() => returnValues?.getFieldDisplayLabel ?? undefined),
			getDocumentModelName: mock.fn(() => returnValues?.getDocumentModelName ?? undefined),
			getTimeZone: mock.fn(() => returnValues?.getTimeZone ?? "UTC")
		},
		document: {
			getElementValue: mock.fn(() => returnValues?.getElementValue ?? undefined),
			getFieldDisplayValue: mock.fn(() => returnValues?.getFieldDisplayValue ?? undefined),

			getGroupInstanceRepeatability: mock.fn(
				() => returnValues?.getGroupInstanceRepeatability ?? 1
			),
			getMessages: mock.fn(() => returnValues?.getMessages ?? []),
			getAllMessages: mock.fn(() => returnValues?.getAllMessages ?? []),
			getNotRelevant: mock.fn(() => returnValues?.getNotRelevant ?? false),
			getEnumerationValues: mock.fn(() => returnValues?.getEnumerationValues ?? []),
			getFieldModelPresentation: mock.fn(
				() => returnValues?.getFieldModelPresentation ?? undefined
			),

			toModelPresentation: mock.fn(() => returnValues?.toModelPresentation ?? null),
			fromModelPresentation: mock.fn(() => returnValues?.fromModelPresentation ?? undefined)
		},
		event: {
			onValueChanged: mock.fn(() => {}),
			onParsingFailed: mock.fn(),
			eventDispatcher: mock.fn()
		}
	};
}
