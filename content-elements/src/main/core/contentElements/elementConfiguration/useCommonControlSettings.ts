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

import { useContext } from "react";
import { useSelector } from "react-redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DataReference } from "@com.mgmtp.a12.client/client-data";
import {
	DocumentPath,
	getDocumentPath,
	getDocumentPathForRepeatableGroup,
	isDateRangeArray,
	isMultiSelectData,
	isMultiSelectDataEqual,
	messagesForDataContext,
	validationMessagesForFieldReference as messagesForFieldReference
} from "@com.mgmtp.a12.client/client-data";
import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import {
	useDocumentContext,
	useDocumentPathContext
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { SupportedType, ValueConversionConfig } from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import type { AmountSuffix } from "../../configuration/formElementConfig.js";
import { FormElementContext } from "../../configuration/formElementContext.js";
import type { BaseControlProps } from "../../types/controlProps.js";
import type { BaseControlSettings } from "../../types/controlSettings.js";
import { assertObject } from "../../utils/assertions.js";

import { arraysDeepEqual } from "../arraysDeepEqual.js";
import { UiId } from "../generateUiId.js";
import { MessageGroupContext } from "../modules/messageGroupContainer/messageGroupContext.js";
import type { MessageGroupFilter } from "../modules/messageGroupContainer/messageGroupContext.js";

import { GET_LOCALIZED_MODEL_TEXTS_WRAPPER } from "./getLocalizedModelTexts.js";

/** @internal */
export const USE_COMMON_CONTROL_SETTINGS_WRAPPER = {
	useCommonControlSettings
};

/**
 * TODO: internal? When this is part of the core we need to eliminate all useSelector calls here
 *
 * Note: This is subject to change.
 */
export function useCommonControlSettings(
	node: ContentModel.Node<BaseControlProps>
): BaseControlSettings {
	const { getElementByPath, getModelPathById, getConversionConfig, getDocumentModelName } =
		useDocumentContext(c => c.model);
	const { getElementValue, getFieldDisplayValue, getNotRelevant } = useDocumentContext(
		c => c.document
	);

	const dataContextString = useDocumentPathContext(c => c.groupPath);
	const dataContext = DocumentPath.fromString(dataContextString);
	const { localizer } = useContext(LocalizerContext);
	const { contentModelName, config } = useContext(FormElementContext);

	const { uiIdPrefix, markingOfRequiredFields, amountSuffix } = config;

	const elementModelPath = useSelector(
		state => getModelPathById(state, node.props.elementId),
		(left, right) => ModelPath.equal(left, right)
	);
	const elementDocumentPath = getDocumentPath(elementModelPath, dataContext);
	const initialDataReference = DocumentPath.toString(elementDocumentPath);

	const dmElement = useSelector(state => getElementByPath(state, elementModelPath));
	assertObject(
		dmElement,
		`No document model element found for dataReference ${initialDataReference}`
	);

	const isRepeatableGroupLike = isRepeatableGroupLikeElement(dmElement);

	const dataReference = isRepeatableGroupLike
		? DocumentPath.toString(
				getDocumentPathForRepeatableGroup(elementDocumentPath, elementDocumentPath)
			)
		: initialDataReference;

	const uiId = UiId.generateForControl({
		controlId: node.id,
		elementPath: elementModelPath,
		uiIdPrefix
	});

	const messageGroupContext = useContext(MessageGroupContext);
	const filteredMessages = useFilteredMessages(
		DocumentPath.fromString(dataReference),
		isRepeatableGroupLike
	);

	const { groupedValidationMessages, ungroupedValidationMessages } =
		separateValidationMessagesByGrouping(messageGroupContext, filteredMessages);

	const value = useSelector(state => getElementValue(state, dataReference), isValueEqual);

	const formattedValue = useSelector(state => getFieldDisplayValue(state, dataReference));

	const { required, computed, timeZone } = useSettingsFromDocumentModel(dataReference);

	const readonly = !!node.props.readonly || computed;

	const documentModelName = useSelector(getDocumentModelName);

	const amountSuffixValue = useAmountSuffixValue({
		amountSuffix,
		dataReference
	});

	const localizedModelTexts = GET_LOCALIZED_MODEL_TEXTS_WRAPPER.getLocalizedModelTexts({
		contentModelName,
		node,
		documentModelName: documentModelName ?? "",
		dmElement,
		dataReference,
		readonly,
		required,
		markingOfRequiredFields,
		amountSuffixValue,
		localizer
	});

	const conversionConfig = useSelector(
		state => getConversionConfig(state, DocumentPath.fromString(dataReference)),
		isConversionConfigOfSameElement
	);

	const notRelevant = useSelector(state => getNotRelevant(state, dataReference));

	return {
		uiIdPrefix,
		uiId,
		value,
		formattedValue,
		messageGroupId: messageGroupContext.id,
		groupedValidationMessages,
		ungroupedValidationMessages,
		required,
		readonly,
		notRelevant,
		hideLabel: node.props.hideLabel,
		showMessagesAsTooltip: node.props.messageExposition === "TOOLTIP",
		tooltipsOnTop: node.props.tooltipsOnTop,
		truncateSuffix: node.props.truncateSuffix,
		autoComplete: node.props.autoComplete,
		secret: node.props.secret,
		autoExpand: node.props.autoExpand,
		timeZone,
		datePickerConfig: node.props.datePickerConfig,
		enableSelectAll: node.props.enableSelectAll,
		inline: node.props.inline,
		dmElement,
		conversionConfig,
		dataReference,
		...localizedModelTexts
	};
}

function useFilteredMessages(
	elementRef: EntityInstancePath,
	isRepeatableGroupLike: boolean
): Message[] {
	const { getAllMessages } = useDocumentContext(c => c.document);

	return useSelector(state => selectFilteredMessages(state, elementRef), arraysDeepEqual);

	function selectFilteredMessages(state: object, elementRef: EntityInstancePath): Message[] {
		const allMessages = getAllMessages(state);
		return isRepeatableGroupLike
			? messagesForDataContext(allMessages, elementRef)
			: messagesForFieldReference(allMessages, elementRef);
	}
}

function separateValidationMessagesByGrouping(
	messageGroupContext: MessageGroupFilter,
	allMessages: Message[]
): {
	groupedValidationMessages: Message[];
	ungroupedValidationMessages: Message[];
} {
	const messageGroupContextIsSet = messageGroupContext.id !== undefined;
	if (messageGroupContextIsSet) {
		return {
			groupedValidationMessages: messageGroupContext.getGroupedValidationMessages(allMessages),
			ungroupedValidationMessages: messageGroupContext.getUngroupedValidationMessages(allMessages)
		};
	} else {
		return {
			groupedValidationMessages: [],
			ungroupedValidationMessages: allMessages
		};
	}
}

function useAmountSuffixValue(options: {
	amountSuffix?: AmountSuffix;
	dataReference: DataReference;
}): string | undefined {
	const { getFieldDisplayValue } = useDocumentContext(c => c.document);

	const { amountSuffix, dataReference } = options;

	const dynamicAmountSuffixValue = useSelector(state => getFieldDisplayValue(state, dataReference));

	return amountSuffix
		? amountSuffix.type === "static"
			? amountSuffix.value
			: dynamicAmountSuffixValue
		: undefined;
}

function useSettingsFromDocumentModel(dataReference: DataReference): {
	required: boolean;
	computed: boolean;
	timeZone?: string;
} {
	const { getTimeZone, getRequired, getComputed } = useDocumentContext(c => c.model);

	const docPath = DocumentPath.fromString(dataReference);

	const required = useSelector(state => getRequired(state, docPath));
	const computed = useSelector(state => getComputed(state, docPath));
	const timeZone = useSelector(getTimeZone);

	return {
		required,
		computed,
		timeZone
	};
}

function isRepeatableGroupLikeElement(dmElement?: DocumentModel.Element): boolean {
	return (
		dmElement?.type === "Group" && dmElement.repeatability > 1 && dmElement.usageType !== undefined
	);
}

/**
 * This is necessary, because getAssignedObject (from the Kernel) always creates
 * a shallow copy for group values. Therefore, it always returns a new object
 * for multi-selects.
 */
function isValueEqual(
	left?: GroupInstance | GroupInstance[] | SupportedType,
	right?: GroupInstance | GroupInstance[] | SupportedType
): boolean {
	if (left instanceof Date && right instanceof Date) {
		return left.getTime() === right.getTime();
	} else if (isDateRangeArray(left) && isDateRangeArray(right)) {
		return areDateRangesEqual(left, right);
	} else if (isMultiSelectData(left) && isMultiSelectData(right)) {
		return isMultiSelectDataEqual(left, right);
	}

	return left === right;
}

function areDateRangesEqual(left: Date[], right: Date[]): boolean {
	return (
		left.length === 2 &&
		right.length === 2 &&
		left[0].getTime() === right[0].getTime() &&
		left[1].getTime() === right[1].getTime()
	);
}

/**
 * The Kernel always creates a new object for the conversion config.
 */
function isConversionConfigOfSameElement(
	left?: ValueConversionConfig,
	right?: ValueConversionConfig
): boolean {
	return (
		left?.modelId === right?.modelId &&
		ModelPath.equal(left?.modelPath ?? [], right?.modelPath ?? [])
	);
}
