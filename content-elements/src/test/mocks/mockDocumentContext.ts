// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
