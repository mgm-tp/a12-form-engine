// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ComponentType } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { StringValueDataType } from "../../../../../shared/internal/document-model-utils.js";
import type { BooleanOrConfirmInputProps } from "../../../components/form-engine/cells/controls/boolean/types.js";
import type { Inputs } from "../../engine-configuration.js";

import type { InputPropsType } from "./input.js";

/** @internal */
export interface InputMap {
	// Control-level input (type-agnostic)
	readonly Input: ComponentType<InputPropsType>;

	// Control-level input (type-specific)
	readonly AttachmentInput: ComponentType<Inputs.InputProps<DocumentModel.Group>>;
	readonly BooleanSelectInput: ComponentType<Inputs.InputProps<DocumentModel.BooleanType>>;
	readonly CheckboxInput: ComponentType<BooleanOrConfirmInputProps>;
	readonly SwitchInput: ComponentType<BooleanOrConfirmInputProps>;
	readonly BooleanRadioInput: ComponentType<Inputs.InputProps<DocumentModel.BooleanType>>;
	readonly DateFragmentInput: ComponentType<Inputs.InputProps<DocumentModel.DateFragmentType>>;
	readonly DateInput: ComponentType<Inputs.InputProps<DocumentModel.DateType>>;
	readonly DateRangeInput: ComponentType<Inputs.InputProps<DocumentModel.DateRangeType>>;
	readonly DateTimeInput: ComponentType<Inputs.InputProps<DocumentModel.DateTimeType>>;
	readonly TimeInput: ComponentType<Inputs.InputProps<DocumentModel.TimeType>>;
	readonly AutoCompleteInput: ComponentType<Inputs.InputProps<StringValueDataType>>;
	readonly RadioInput: ComponentType<Inputs.InputProps<DocumentModel.EnumerationType>>;
	readonly DropDownInput: ComponentType<Inputs.InputProps<DocumentModel.EnumerationType>>;
	readonly CheckboxGroupInput: ComponentType<Inputs.InputProps<DocumentModel.Group>>;
	readonly MultiSelectInput: ComponentType<Inputs.InputProps<DocumentModel.Group>>;
	readonly NumberInput: ComponentType<Inputs.InputProps<DocumentModel.NumberType>>;
	readonly MultilineInput: ComponentType<Inputs.InputProps<DocumentModel.StringType>>;
	readonly StringWithHintListInput: ComponentType<Inputs.InputProps<DocumentModel.StringType>>;
	readonly StringInput: ComponentType<
		Inputs.InputProps<DocumentModel.StringType | DocumentModel.CustomFieldType>
	>;
}
