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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import type { DeepMutable } from "../../../back-end/utils/internal/types.js";

import type { FormModel } from "../form-model.js";

import type { ValueParser } from "./unmarshallFormModel.js";

/** @internal */
export function generateConfigurationMaps(formModel: FormModel, valueParser: ValueParser): void {
	const mutableFormModel = formModel as DeepMutable<FormModel>;
	generateFieldConfigurationMap(mutableFormModel);
	generateGroupConfigurationMap(mutableFormModel);
	parseInitialValues(mutableFormModel, valueParser);
	parseDependentFieldsValues(mutableFormModel, valueParser);
	parseDependentFieldsMasterValues(mutableFormModel, valueParser);
	parseDependentGroupsMasterValues(mutableFormModel, valueParser);
}

function parseInitialValues(formModel: DeepMutable<FormModel>, valueParser: ValueParser): void {
	for (const fce of formModel.content.fieldConfiguration.field || []) {
		if (fce.initialValue !== undefined) {
			fce.initialValueTyped = valueParser(fce.elementPath, fce.initialValue);
		}
	}
}

function generateFieldConfigurationMap(formModel: DeepMutable<FormModel>): void {
	const fieldConfiguration = formModel.content.fieldConfiguration;
	fieldConfiguration.fieldMap = {};
	if (fieldConfiguration.field === undefined) {
		return;
	}

	for (const entry of fieldConfiguration.field) {
		fieldConfiguration.fieldMap[ModelPath.toString(entry.elementPath)] = entry;
	}
}

function parseDependentFieldsValues(
	formModel: DeepMutable<FormModel>,
	valueParser: ValueParser
): void {
	for (const fce of formModel.content.fieldConfiguration.field || []) {
		if (fce.dependentField) {
			parseDependentFieldValues(fce.elementPath, fce.dependentField, valueParser);
		}
	}
}

function parseDependentFieldValues(
	fieldRef: ModelPath,
	depField: DeepMutable<FormModel.DependentField>,
	valueParser: ValueParser
): void {
	for (const caze of depField.case) {
		if (caze.value !== undefined) {
			caze.valueTyped = valueParser(fieldRef, caze.value);
		}
	}
}

function parseDependentFieldsMasterValues(
	formModel: DeepMutable<FormModel>,
	valueParser: ValueParser
): void {
	for (const fce of formModel.content.fieldConfiguration.field || []) {
		if (fce.dependentField) {
			parseMasterFieldValue(fce.dependentField, valueParser);
		}
	}
}

function parseMasterFieldValue(
	depField: DeepMutable<FormModel.DependentField>,
	valueParser: ValueParser
): void {
	for (const caze of depField.case) {
		if (caze.masterValue !== undefined) {
			caze.masterValueTyped =
				caze.masterValue !== null ? valueParser(depField.masterFieldPath, caze.masterValue) : null;
		}
	}
}

function parseDependentGroupsMasterValues(
	formModel: DeepMutable<FormModel>,
	valueParser: ValueParser
): void {
	for (const fce of formModel.content.groupConfiguration.group || []) {
		if (fce.dependentGroup) {
			parseMasterGroupValue(fce.dependentGroup, valueParser);
		}
	}
}

function parseMasterGroupValue(
	depField: DeepMutable<FormModel.DependentGroup>,
	valueParser: ValueParser
): void {
	for (const caze of depField.case) {
		if (caze.masterValue !== undefined) {
			caze.masterValueTyped =
				caze.masterValue !== null ? valueParser(depField.masterFieldPath, caze.masterValue) : null;
		}
	}
}

function generateGroupConfigurationMap(formModel: DeepMutable<FormModel>): void {
	const groupConfiguration = formModel.content.groupConfiguration;
	groupConfiguration.groupMap = {};
	if (groupConfiguration.group === undefined) {
		return;
	}

	for (const entry of groupConfiguration.group) {
		groupConfiguration.groupMap[ModelPath.toString(entry.groupPath)] = entry;
	}
}
