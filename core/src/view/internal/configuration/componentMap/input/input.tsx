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

import { createContext, useContext, type ReactElement } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { ModelSelectors } from "../../../../../back-end/store/internal/selectors/models.js";
import { getExternalEnumerationSource } from "../../../../../models/internal/enumeration/getExternalEnumerationSource.js";
import type { FormModel } from "../../../../../models/internal/form-model.js";
import { DocumentModelUtils } from "../../../../../models/internal/utils/document-model-utils.js";
import { AttachmentInput } from "../../../components/form-engine/cells/controls/attachment/attachment-input.js";
import { BooleanRadioInput } from "../../../components/form-engine/cells/controls/boolean/boolean-radio-input.js";
import { BooleanSelectInput } from "../../../components/form-engine/cells/controls/boolean/boolean-select-input.js";
import { CheckboxInput } from "../../../components/form-engine/cells/controls/boolean/checkbox-input.js";
import { SwitchInput } from "../../../components/form-engine/cells/controls/boolean/switch-input.js";
import { DateFragmentInput } from "../../../components/form-engine/cells/controls/date/date-fragment-input.js";
import { DateInput } from "../../../components/form-engine/cells/controls/date/date-input.js";
import { DateRangeInput } from "../../../components/form-engine/cells/controls/date/date-range-input.js";
import { DateTimeInput } from "../../../components/form-engine/cells/controls/date/date-time-input.js";
import { TimeInput } from "../../../components/form-engine/cells/controls/date/time-input.js";
import { AutoCompleteInput } from "../../../components/form-engine/cells/controls/enumeration/autocomplete-input.js";
import { RadioInput } from "../../../components/form-engine/cells/controls/enumeration/radio-input.js";
import { DropDownInput } from "../../../components/form-engine/cells/controls/enumeration/select-input.js";
import { CheckboxGroupInput } from "../../../components/form-engine/cells/controls/multi-select/checkbox-group-input.js";
import { MultiSelectInput } from "../../../components/form-engine/cells/controls/multi-select/multi-select-input.js";
import { NumberInput } from "../../../components/form-engine/cells/controls/number/number-input.js";
import { MultilineInput } from "../../../components/form-engine/cells/controls/string/multi-line-input.js";
import { StringWithHintListInput } from "../../../components/form-engine/cells/controls/string/string-hintlist-input.js";
import { StringInput } from "../../../components/form-engine/cells/controls/string/string-input.js";
import type { Inputs } from "../../engine-configuration.js";

import type { InputMap } from "./input-map.js";

/** @internal */
export type InputPropsType = Inputs.InputProps<DocumentModel.FieldType | DocumentModel.Group> & {
	documentElement: DocumentModel.Element;
};

/** @internal */
export const DefaultInputMap: InputMap = {
	Input,

	AttachmentInput,
	BooleanSelectInput,
	CheckboxInput,
	SwitchInput,
	BooleanRadioInput,
	DateFragmentInput,
	DateInput,
	DateRangeInput,
	DateTimeInput,
	TimeInput,
	AutoCompleteInput,
	RadioInput,
	DropDownInput,
	CheckboxGroupInput,
	MultiSelectInput,
	NumberInput,
	MultilineInput,
	StringWithHintListInput,
	StringInput
};

/** @internal */
export const InputMapContext = createContext(DefaultInputMap);

/** @internal */
export function Input(props: InputPropsType): ReactElement | null {
	const { documentElement } = props;

	const inputMap = useContext(InputMapContext);
	const {
		AttachmentInput,
		DateFragmentInput,
		DateInput,
		DateRangeInput,
		DateTimeInput,
		TimeInput,
		NumberInput,
		StringInput
	} = inputMap;

	if (documentElement.type === "Field") {
		switch (documentElement.fieldType.type) {
			case "NumberType":
				return <NumberInput {...props} documentElementDataType={documentElement.fieldType} />;
			case "BooleanType":
				return createBooleanTypeInput(inputMap, {
					...props,
					documentElementDataType: documentElement.fieldType
				});
			case "ConfirmType":
				return createConfirmTypeInput(inputMap, {
					...props,
					documentElementDataType: documentElement.fieldType
				});
			case "StringType":
				return documentElement.fieldType.hintList
					? createStringWithHintListInput(inputMap, {
							...props,
							documentElementDataType: documentElement.fieldType
						})
					: createStringDataTypeInput(inputMap, {
							...props,
							documentElementDataType: documentElement.fieldType
						});
			case "CustomFieldType":
				return <StringInput {...props} documentElementDataType={documentElement.fieldType} />;
			case "DateType":
				return <DateInput {...props} documentElementDataType={documentElement.fieldType} />;
			case "DateFragmentType":
				return <DateFragmentInput {...props} documentElementDataType={documentElement.fieldType} />;
			case "DateRangeType":
				return <DateRangeInput {...props} documentElementDataType={documentElement.fieldType} />;
			case "EnumerationType":
				return createEnumerationInput(inputMap, {
					...props,
					documentElementDataType: documentElement.fieldType
				});
			case "TimeType":
				return <TimeInput {...props} documentElementDataType={documentElement.fieldType} />;
			case "DateTimeType":
				return <DateTimeInput {...props} documentElementDataType={documentElement.fieldType} />;
			default:
				throw Error("Unknown datatype " + documentElement.fieldType);
		}
	} else if (DocumentModelUtils.isAttachment(documentElement)) {
		return <AttachmentInput {...props} documentElementDataType={documentElement} />;
	} else if (DocumentModelUtils.isMultiSelect(documentElement)) {
		return createMultiSelectInput(inputMap, {
			...props,
			documentElementDataType: documentElement
		});
	}

	return null;
}

function createBooleanTypeInput(
	inputMap: InputMap,
	props: Inputs.InputProps<DocumentModel.BooleanType>
): ReactElement {
	const { BooleanSelectInput, CheckboxInput, SwitchInput, BooleanRadioInput } = inputMap;
	const exposition = props.modelElement.exposition;
	if (exposition === undefined || exposition === "BOOLEAN_SELECT") {
		return <BooleanSelectInput {...props} />;
	} else if (exposition === "CHECKBOX") {
		return <CheckboxInput {...props} />;
	} else if (exposition === "SWITCH" || exposition === "SWITCH_WITH_VALUES") {
		return <SwitchInput {...props} />;
	} else if (exposition === "FULL" || exposition === "INLINE") {
		return <BooleanRadioInput {...props} />;
	} else {
		throw new Error("Unknown exposition for boolean inputs: " + exposition);
	}
}

function createConfirmTypeInput(
	inputMap: InputMap,
	props: Inputs.InputProps<DocumentModel.ConfirmType>
): ReactElement {
	const { CheckboxInput, SwitchInput } = inputMap;
	const exposition = props.modelElement.exposition;
	if (exposition === "CHECKBOX") {
		return <CheckboxInput {...props} coalescing />;
	} else if (exposition === "SWITCH" || exposition === "SWITCH_WITH_VALUES") {
		return <SwitchInput {...props} coalescing />;
	} else {
		throw new Error("Unknown exposition for confirm inputs: " + exposition);
	}
}

function createEnumerationInput(
	inputMap: InputMap,
	props: Inputs.InputProps<DocumentModel.EnumerationType>
): ReactElement {
	const { AutoCompleteInput, RadioInput, DropDownInput } = inputMap;
	const exposition = props.modelElement.exposition;
	if (exposition === "AUTOCOMPLETE") {
		return <AutoCompleteInput {...props} />;
	} else if (exposition === undefined || exposition === "COMPACT") {
		return <DropDownInput {...props} />;
	} else if (exposition === "FULL" || exposition === "INLINE") {
		return <RadioInput {...props} />;
	} else {
		throw new Error("Unknown exposition for enumeration inputs: " + exposition);
	}
}

function createStringWithHintListInput(
	inputMap: InputMap,
	props: Inputs.InputProps<DocumentModel.StringType>
): ReactElement {
	const { StringWithHintListInput } = inputMap;
	return <StringWithHintListInput {...props} />;
}

function isExternalEnum(
	formModel: FormModel,
	elementPath: ModelPath,
	fieldDataType: DocumentModel.FieldType
): boolean {
	return (
		fieldDataType.type === "StringType" &&
		getExternalEnumerationSource(formModel, elementPath) !== undefined
	);
}

function createStringDataTypeInput(
	inputMap: InputMap,
	props: Inputs.InputProps<DocumentModel.StringType>
): ReactElement | null {
	const { MultilineInput, StringInput } = inputMap;
	const { modelElement, renderConfiguration, documentElement } = props;
	if (documentElement.type === "Field") {
		if (
			isExternalEnum(
				ModelSelectors.formModel()(renderConfiguration.renderOptions.state),
				modelElement.elementPath,
				documentElement.fieldType
			)
		) {
			return createEnumerationInput(inputMap, createStringPropsFromEnumPropsForExtEnum(props));
		} else {
			const Component =
				props.documentElementDataType.lineBreaksPermitted ||
				props.modelElement.exposition === "AREA"
					? MultilineInput
					: StringInput;
			return <Component {...props} />;
		}
	}

	return null;
}

/**
 * This function creates enum input props from the given string input props.
 *
 * It is used to allow a string input with an external enumeration and exposition
 * full or inline to render a RadioInput component which normally only accepts
 * enum input props with enum values.
 */
function createStringPropsFromEnumPropsForExtEnum(
	props: Inputs.InputProps<DocumentModel.StringType>
): Inputs.InputProps<DocumentModel.EnumerationType> {
	return {
		...props,
		documentElementDataType: {
			type: "EnumerationType",
			alphabeticalSorting: props.documentElementDataType.alphabeticalSorting,
			errorMessage: props.documentElementDataType.errorMessage,
			values: [] // the actually used values are taken from the externalEnumerationProvider anyway
		}
	};
}

function createMultiSelectInput(
	inputMap: InputMap,
	props: Inputs.InputProps<DocumentModel.Group>
): ReactElement {
	const { MultiSelectInput, CheckboxGroupInput } = inputMap;
	const exposition = props.modelElement.exposition;
	if (exposition === "AUTOCOMPLETE") {
		return <MultiSelectInput {...props} />;
	} else if (exposition === "FULL" || exposition === "INLINE") {
		return <CheckboxGroupInput {...props} />;
	} else {
		throw new Error("Unknown exposition for multiselect inputs: " + exposition);
	}
}
