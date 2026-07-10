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

import { useCallback, useMemo } from "react";

import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { computeGranularity, granularityDistance } from "@com.mgmtp.a12.client/client-data";
import type {
	DocumentElementReference,
	DocumentModelService
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	ErrorMessages,
	ModelStateSelector,
	SettingEvents,
	SettingTemplate,
	Throwable,
	useContentEditorState,
	useSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { StringSettingState } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { Autocomplete } from "@com.mgmtp.a12.widgets/widgets-core";
import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";

import { ClearDatePickerConfig } from "../controllers/datePickerConfigActions.js";
import type { DatePickerSettingState } from "../controllers/datePickerConfigController.js";

import { candidateElements, closestUpperGroup } from "./candidates.js";

/** @internal */
export type ElementFilter = ElementFilterByType | ElementFilterByPredicate;

/** @internal */
export interface ElementFilterByType {
	readonly fieldTypes?: DocumentModel.FieldType["type"][];
	readonly groupUsageTypes?: string[];
}

/** @internal */
export interface ElementFilterByPredicate {
	readonly filterPredicate: (element: DocumentModel.Element) => boolean;
	readonly createErrorMessage: (element: DocumentModel.Element) => string;
}

function isElementFilterByPredicate(o?: object): o is ElementFilterByPredicate {
	return !!o && "filterPredicate" in o && typeof o.filterPredicate === "function";
}

/** @internal */
export interface ElementIdSettingProps {
	readonly nodeId: string;
	readonly elementFilter?: ElementFilterByType | ElementFilterByPredicate;
}

/** @internal */
export const ElementIdSetting = ({ nodeId, elementFilter }: ElementIdSettingProps) => {
	const [idSettingState, dispatchId] = useSettingState<StringSettingState>(["elementId"]);
	const [, dispatchDatePickerConfig] = useSettingState<DatePickerSettingState, Action<void>>([
		"datePickerConfig"
	]);
	const documentModelService = useContentEditorState(ModelStateSelector.documentModelService());
	const documentModel = useContentEditorState(ModelStateSelector.documentModel());
	const nodeData = useContentEditorState(ModelStateSelector.nodeDataById())(nodeId);
	const nodePath = nodeData?.nodePath;

	const contextGroupSelector = useContentEditorState(closestUpperGroup());
	const candidateElementsSelector = useContentEditorState(candidateElements());
	const modelPathSelector = useContentEditorState(ModelStateSelector.modelPathById());

	const dropDownItems: DropDownItem[] = useMemo(() => {
		if (!nodePath) {
			throw new Error(`Can not compute node path for node ${nodeId}`);
		}

		if (!documentModel) {
			return [];
		}

		const filterPredicate = getFilterPredicate(elementFilter);

		return candidateElementsSelector(nodePath, filterPredicate)
			.unwrapOr([])
			.map(({ element, path }) => ({
				value: element.id,
				label: ModelPath.toString(path)
			}));
	}, [candidateElementsSelector, documentModel, elementFilter, nodeId, nodePath]);

	const onDropDownValueChange = useCallback(
		(item: DropDownItem): void => {
			dispatchId(SettingEvents.onChangeInput({ input: item.value ?? "" }));

			/**
			 * FIXME: Clearing the datePickerConfig here is just a hack.
			 * We are missing Form Engine dependencies or something similar.
			 *
			 * Should the Content Editor be based on the Form Engine, like
			 * other editors in the SME?
			 */
			const dmElement = documentModelService?.getElementById(item.value ?? "");
			const shouldClearDatePickerConfig =
				dmElement?.type !== "Field" ||
				!["DateType", "DateTimeType", "DateRangeType"].includes(dmElement.fieldType.type);

			if (shouldClearDatePickerConfig) {
				dispatchDatePickerConfig(ClearDatePickerConfig());
			}
		},
		[dispatchId, dispatchDatePickerConfig, documentModelService]
	);

	const errorMessage = useMemo(() => {
		return getErrorMessage({
			settingState: idSettingState,
			documentModelService,
			documentModel,
			contextGroup: nodeData ? contextGroupSelector(nodeData).unwrapOr(undefined) : undefined,
			elementFilter
		});
	}, [
		idSettingState,
		documentModelService,
		documentModel,
		contextGroupSelector,
		nodeData,
		elementFilter
	]);

	const valueForInput = useMemo(() => {
		const modelPath = modelPathSelector(idSettingState.input);

		if (modelPath.isErr()) {
			return idSettingState.input;
		}

		return modelPath.value;
	}, [modelPathSelector, idSettingState.input]);

	return (
		<SettingTemplate.Setting>
			<Autocomplete
				allowAddingNewItem
				items={dropDownItems}
				error={!!errorMessage}
				label="Element Reference"
				errorMessage={errorMessage}
				hintTemplate="{count} matches"
				onValueChange={onDropDownValueChange}
				inputPlaceHolder="Please select or start typing"
				value={valueForInput}
			/>
		</SettingTemplate.Setting>
	);
};

function getErrorMessage(options: {
	settingState: StringSettingState;
	documentModelService?: DocumentModelService;
	documentModel?: DocumentModel;
	contextGroup?: DocumentElementReference<DocumentModel.Group>;
	elementFilter?: ElementFilter;
}): string | undefined {
	const { settingState, documentModelService, documentModel, contextGroup, elementFilter } =
		options;

	if (!documentModelService) {
		return ErrorMessages.missingDocumentModelService();
	}

	if (settingState.error) {
		return settingState.error;
	}

	const dmElementThrowable = Throwable.wrap(() =>
		documentModelService.getElementById(settingState.input)
	);

	if (dmElementThrowable.isErr()) {
		return dmElementThrowable.error.message;
	}

	const dmElement = dmElementThrowable.value;

	const elementPath = Throwable.wrap(() =>
		documentModelService.getModelPathById(settingState.input)
	).unwrapOr(undefined);

	if (documentModel && contextGroup && elementPath) {
		const elementGranularity = computeGranularity(documentModel, elementPath);
		const contextGranularity = computeGranularity(documentModel, contextGroup.path);

		if (granularityDistance(contextGranularity, elementGranularity) > 0) {
			return `Element "${ModelPath.toString(elementPath)}" is not compatible with the current data context "${ModelPath.toString(contextGroup.path)}"`;
		}
	}

	const isValidElement = getFilterPredicate(elementFilter);

	if (isValidElement && !isValidElement(dmElement)) {
		return createErrorMessage(dmElement, elementFilter);
	}

	return undefined;
}

function getFilterPredicate(
	elementFilter?: ElementFilter
): ((element: DocumentModel.Element) => boolean) | undefined {
	return isElementFilterByPredicate(elementFilter)
		? elementFilter.filterPredicate
		: elementFilter
			? createByTypeFilter(elementFilter)
			: undefined;
}

function createByTypeFilter(
	config: ElementFilterByType
): (element: DocumentModel.Element) => boolean {
	return element =>
		(element.type === "Field" && (config.fieldTypes?.includes(element.fieldType.type) ?? false)) ||
		(element.type === "Group" &&
			(config.groupUsageTypes?.includes(element.usageType ?? "") ?? false));
}

function createErrorMessage(
	dmElement: DocumentModel.Element,
	elementFilter?: ElementFilter
): string | undefined {
	return isElementFilterByPredicate(elementFilter)
		? elementFilter.createErrorMessage(dmElement)
		: elementFilter
			? createDefaultErrorMessage(dmElement, elementFilter)
			: undefined;
}

function createDefaultErrorMessage(
	dmElement: DocumentModel.Element,
	elementFilter: ElementFilterByType
): string | undefined {
	const expectedTypesList = [
		elementFilter.fieldTypes?.join(", "),
		elementFilter.groupUsageTypes?.join(", ")
	]
		.filter((e: string | undefined): e is string => !!e)
		.join(", ");

	const fieldOrUsageType =
		dmElement.type === "Field" ? dmElement.fieldType.type : dmElement.usageType;

	return `Unexpected ${dmElement.type.toLocaleLowerCase()} type: ${fieldOrUsageType}. Supported types for this element are: ${expectedTypesList}.`;
}
