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

import type { Logger } from "@com.mgmtp.a12.migrationtool/migrationtool-core/types";

import type { FormModel as OldFormModel } from "../version-37.0.0-pre.3/FormModel.js";

import type { FormModel } from "./FormModel.js";

export default function (model: OldFormModel, logger: Logger): FormModel {
	return migrateDependentHideAndClear(model, logger);
}

function migrateDependentHideAndClear(oldModel: OldFormModel, logger: Logger): FormModel {
	const fieldConfig = oldModel.content.fieldConfiguration;
	if (fieldConfig) {
		(fieldConfig as { field: FormModel.FieldConfiguration["field"] }).field =
			transformDependentFields(fieldConfig.field);
	}

	const groupConfig = oldModel.content.groupConfiguration;
	if (groupConfig) {
		(groupConfig as { group: FormModel.GroupConfiguration["group"] }).group =
			transformDependentGroups(groupConfig.group);
	}

	return oldModel as FormModel;

	function transformDependentFields(
		old: OldFormModel.FieldConfiguration["field"]
	): FormModel.FieldConfiguration["field"] {
		if (old) {
			// all properties are listed here explicitly in order to ensure that there's no reordering
			return old.map(
				({
					suffix,
					label,
					hint,
					initialValue,
					exposition,
					readonly,
					secret,
					placeholder,
					dependentEnumeration,
					externalEnumeration,
					dependentField,
					annotation,
					elementRef,
					enableSelectAll,
					attachmentConfig
				}) => ({
					suffix,
					label,
					hint,
					initialValue,
					exposition,
					readonly,
					secret,
					placeholder,
					dependentEnumeration,
					externalEnumeration,
					dependentField: dependentField
						? transformDependentField(dependentField, initialValue)
						: undefined,
					annotation,
					elementRef,
					enableSelectAll,
					attachmentConfig
				})
			);
		}
		return old;
	}

	function transformDependentField(
		old: OldFormModel.DependentField,
		initialValue: string = ""
	): FormModel.DependentField {
		return {
			...old,
			case: old.case.map(oldCase => {
				const {
					clear,
					fieldRef: oldFieldRef,
					hidden,
					masterValue,
					readonly,
					value: oldValue
				} = oldCase;

				const value = hidden ? undefined : clear ? initialValue : oldValue;
				const fieldRef = hidden ? undefined : oldFieldRef;

				const notRelevant = hidden;
				return { masterValue, notRelevant, readonly, value, fieldRef };
			})
		};
	}

	function transformDependentGroups(
		old: OldFormModel.GroupConfiguration["group"]
	): FormModel.GroupConfiguration["group"] {
		if (old) {
			return old.map(({ dependentGroup, annotation, groupRef, numberOfInitialRows }) => {
				const transformedDependentGroup = dependentGroup
					? transformDependentGroup(dependentGroup)
					: undefined;
				return {
					dependentGroup: transformedDependentGroup?.case.length
						? transformedDependentGroup
						: undefined,
					annotation,
					groupRef,
					numberOfInitialRows
				};
			});
		}
		return old;
	}

	function transformDependentGroup(old: OldFormModel.DependentGroup): FormModel.DependentGroup {
		return {
			...old,
			case: old.case.reduce((acc, oldCase) => {
				const { hidden, clear, masterValue, readonly } = oldCase;
				// we ignore "clear" here
				// if it was set without hidden being set as well, the use case is unclear and should rather be manually adapted
				if (clear && !hidden) {
					logger.log(
						"A dependent group has been found with clear=true and hidden=false." +
							" The clear flag will now be removed without replacement." +
							' Please check why this "clear" was required and whether you can manually migrate to the new "notRelevant" flag instead.'
					);
				}
				const notRelevant = hidden;
				if (notRelevant || readonly) {
					acc.push({ masterValue, notRelevant, readonly });
				}
				return acc;
			}, [] as FormModel.DependentGroupCase[])
		};
	}
}
