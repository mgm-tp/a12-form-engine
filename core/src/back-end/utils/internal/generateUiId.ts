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

import type { Header } from "@com.mgmtp.a12.base/base-model-api";

import {
	isFormModelControl,
	isFormModelExpressionCell,
	isFormModelRepeatOverviewColumn,
	isFormModelScreen,
	isFormModelTextCell
} from "../../../models/internal/FormModelGuards.js";
import type { FormModel } from "../../../models/internal/form-model.js";

import { assertExists, assertUnreachable } from "./assertions.js";

interface UiIdGeneratorProps {
	readonly element: FormModel | FormModel.TypedComponent | { readonly id: string };
	readonly uiIdPrefix?: string;
	readonly infix?: string;
	readonly suffix?: string;
	readonly rowIndex?: number;
}

/**
 * @internal
 * FIXME: Move to Runtime Form Model
 */
export const UiId = {
	generate({ element, uiIdPrefix, infix, suffix = "", rowIndex }: UiIdGeneratorProps): string {
		if ("type" in element) {
			if (isFormModelControl(element)) {
				const { elementPath, elementRef, occurrence } = element;

				const fieldName = elementPath.at(-1)?.elementName;
				assertExists(fieldName);

				return (
					generateForControl({
						fieldId: elementRef,
						fieldName,
						occurrence,
						uiIdPrefix
					}) + suffix
				);
			} else if (isFormModelRepeatOverviewColumn(element)) {
				return UiId.generateForRepeatOverviewColumn({
					id: element.id,
					uiIdPrefix,
					rowIndex
				});
			} else if (isFormModelTextCell(element)) {
				return (
					generateForComponent({
						id: element.id,
						uiIdPrefix,
						infix
					}) + "-content"
				);
			} else if (isFormModelExpressionCell(element)) {
				return (
					generateForComponent({
						id: element.id,
						uiIdPrefix,
						infix
					}) + "-expression"
				);
			}
		}

		if (isFormModelScreen(element)) {
			return generateForScreen({ id: element.id, uiIdPrefix });
		}

		if ("header" in element) {
			return generateForFormModel({ header: element.header, uiIdPrefix });
		}

		if ("id" in element) {
			return (
				generateForComponent({
					id: element.id,
					uiIdPrefix,
					infix
				}) + suffix
			);
		}

		// ensure every element receives an id
		assertUnreachable(element);
	},

	generateForRowActionButton(params: {
		repeat: FormModel.Repeat;
		uiIdPrefix?: string;
		rowIndex: number;
		eventType?: string;
		buttonType: "button" | "list-item";
	}): string {
		return (
			UiId.generate({
				element: params.repeat,
				uiIdPrefix: params.uiIdPrefix,
				infix: params.eventType + `-${params.buttonType}`
			}) + `-${params.rowIndex}`
		);
	},

	generateForAddButton(params: { repeat: FormModel.Repeat; uiIdPrefix?: string }): string {
		return UiId.generate({
			element: params.repeat,
			uiIdPrefix: params.uiIdPrefix,
			infix: "add-button"
		});
	},

	generateForBtnGroup(params: { id: string; uiIdPrefix?: string; alignment: string }): string {
		return generateForComponent(params) + "-btn-group-" + params.alignment;
	},

	generateForDetachedRepeatScreen(params: { repeatId: string; uiIdPrefix?: string }): string {
		return getPrefix(params.uiIdPrefix) + "case-" + params.repeatId;
	},

	generateForCorrectionModeDetailScreen(params: { uiIdPrefix?: string }): string {
		return generateForComponent({ ...params, id: "correction-screen" });
	},

	generateForEmbeddedRepeatExpandedRow(params: {
		repeat: FormModel.Repeat;
		uiIdPrefix?: string;
		rowIndex: number;
	}): string {
		return (
			UiId.generate({ element: params.repeat, uiIdPrefix: params.uiIdPrefix }) +
			"-expandedrow" +
			"-" +
			params.rowIndex
		);
	},

	generateForMultiAttachmentUpload(params: {
		repeat: FormModel.Repeat;
		uiIdPrefix?: string;
	}): string {
		return (
			UiId.generate({ element: params.repeat, uiIdPrefix: params.uiIdPrefix }) +
			"-multi-attachment-upload"
		);
	},

	generateForRepeatTableBodyCell(params: {
		id: string;
		uiIdPrefix?: string;
		rowIndex?: number;
	}): string {
		return generateForComponent(params) + "-bodycell-" + params.rowIndex;
	},

	generateForRepeatTableBodyRow(params: {
		id: string;
		uiIdPrefix?: string;
		rowIndex?: number;
	}): string {
		return generateForComponent(params) + "-bodyrow-" + params.rowIndex;
	},

	generateForRepeatTable(params: { id: string; uiIdPrefix?: string; rowIndex?: number }): string {
		return generateForComponent(params) + "-table";
	},

	generateForTitle(params: { id: string; uiIdPrefix?: string }): string {
		return generateForComponent(params) + "-title";
	},

	generateForFieldOverviewColumnFilter(params: {
		id: string;
		uiIdPrefix?: string;
		suffix?: string;
	}): string {
		return generateForComponent(params) + "-filter" + `${params.suffix ? params.suffix : ""}`;
	},

	generateForValidationBar(params: { uiIdPrefix?: string }): string {
		return getPrefix(params.uiIdPrefix) + "a12-validation-bar";
	},

	generateForCorrectionScreenBar(params: { uiIdPrefix?: string }): string {
		return getPrefix(params.uiIdPrefix) + "a12-correction-screen-bar";
	},

	generateForMobileValidationBarModal(params: { uiIdPrefix?: string }): string {
		return getPrefix(params.uiIdPrefix) + "a12-validation-bar-modal";
	},

	generateForErrorTooltip(params: { inputId: string }): string {
		return `${params.inputId}-errors-tooltip`;
	},

	generateForWarningTooltip(params: { inputId: string }): string {
		return `${params.inputId}-warnings-tooltip`;
	},

	generateForInfoTooltip(params: { inputId: string }): string {
		return `${params.inputId}-infos-tooltip`;
	},

	generateForHintTooltip(params: { inputId: string }): string {
		return `${params.inputId}-hint-tooltip`;
	},

	generateForSuffix(params: { inputId: string }): string {
		return `${params.inputId}-suffix`;
	},

	generateForRepeatOverviewColumn(params: {
		id: string;
		uiIdPrefix?: string;
		rowIndex?: number;
	}): string {
		return generateForComponent(params) + "-cell-" + params.rowIndex;
	}
};

function generateForComponent(params: { id: string; infix?: string; uiIdPrefix?: string }): string {
	return (
		getPrefix(params.uiIdPrefix) +
		`a12-${params.infix !== undefined ? params.infix + "-" : ""}${params.id}`
	);
}

function generateForControl(params: {
	fieldId: string;
	fieldName: string;
	occurrence: number;
	uiIdPrefix?: string;
}): string {
	return (
		getPrefix(params.uiIdPrefix) +
		"a12" +
		"-" +
		params.fieldName +
		"-" +
		params.fieldId +
		(params.occurrence > 1 ? "-" + params.occurrence : "")
	);
}

function generateForScreen(params: { id: string; uiIdPrefix?: string }): string {
	return getPrefix(params.uiIdPrefix) + "case-" + params.id;
}

function generateForFormModel(params: { header: Header; uiIdPrefix?: string }): string {
	return getPrefix(params.uiIdPrefix) + params.header.id;
}

function getPrefix(uiIdPrefix?: string): string {
	return `${uiIdPrefix !== undefined ? uiIdPrefix + "-" : ""}`;
}
