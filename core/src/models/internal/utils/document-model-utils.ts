// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useMemo } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";
import type { ValueConversionConfig } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { isRecord } from "../../../back-end/utils/internal/guards.js";

/**
 * @internal
 * @ignore
 */
export namespace DocumentModelUtils {
	/** @internal */
	export function findByPath(
		documentModel: DocumentModel,
		targetPath: ModelPath
	): DocumentModel.Element {
		if (targetPath.length === 0) {
			return documentModel.content.modelRoot;
		}

		const element = new DocumentServiceFactory()
			.getDocumentModelSearchService(documentModel)
			.getByPath(targetPath);

		if (element === undefined) {
			throw new Error(`Invalid path: ${ModelPath.toString(targetPath)}`);
		}

		return element;
	}

	/**
	 * @internal
	 *
	 * Returns the path of the nearest ancestor group of the given element that is
	 * repeatable, excluding multi-selects. Can be the given element itself.
	 */
	export function computeGranularity(
		documentModel: DocumentModel,
		elementPath: ModelPath
	): ModelPath {
		const path = [...elementPath];
		while (path.length > 0) {
			const element = DocumentModelUtils.findByPath(documentModel, path);
			if (element.type === "Group" && element.repeatability > 1 && !isMultiSelect(element)) {
				return path;
			}
			path.pop();
		}

		return [];
	}

	/** @internal */
	export function isMultiSelect(element: DocumentModel.Element): element is DocumentModel.Group {
		return (
			element.type === "Group" &&
			element.usageType !== undefined &&
			element.usageType === "multi-select"
		);
	}

	/** @internal */
	export function isAttachment(element: DocumentModel.Element): element is DocumentModel.Group {
		return (
			element.type === "Group" &&
			element.usageType !== undefined &&
			element.usageType === "attachment"
		);
	}

	/** @internal */
	export function conversionConfig(
		documentModel: DocumentModel,
		path: ModelPath
	): ValueConversionConfig {
		const timeZone = documentModel.content.modelConfig.timeZone;
		const baseYear = documentModel.content.modelInfo.baseYear;
		const modelElement = findByPath(documentModel, path);

		if (modelElement.type === "Field") {
			return {
				...DocumentModel.extractConversionConfig(modelElement.fieldType, timeZone, baseYear),
				modelId: documentModel.header.id,
				modelPath: path
			};
		}

		throw new Error("Cannot return value conversion config for non-field model elements!");
	}

	export function useConversionConfig(
		documentModel: DocumentModel,
		path: ModelPath
	): ValueConversionConfig {
		return useMemo(() => conversionConfig(documentModel, path), [documentModel, path]);
	}

	export function isRepeatableGroup(documentModel: DocumentModel, modelPath: ModelPath): boolean {
		const element = DocumentModelUtils.findByPath(documentModel, modelPath);
		return element.type === "Group" && element.repeatability > 1;
	}
}

/** @internal */
export type StringValueDataType = DocumentModel.StringType | DocumentModel.EnumerationType;

/**
 * Data structure to define the value of a
 * MultiSelect.
 */
export type MultiSelectData = readonly { readonly [value: string]: string }[];

function isMultiSelect(element: unknown): element is MultiSelectData[number] {
	if (!isRecord(element)) {
		return false;
	}

	const values = Object.values(element);

	return values.length === 1 && typeof values[0] === "string";
}

/** @internal */
export function isMultiSelectData(value: unknown): value is MultiSelectData {
	return Array.isArray(value) && value.every(isMultiSelect);
}
