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
