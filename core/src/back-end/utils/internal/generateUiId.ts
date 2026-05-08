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

import type { Header } from "@com.mgmtp.a12.base/base-model-api/lib/main/header/index.js";

import { FormModel } from "../../../models/internal/form-model.js";

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
export namespace UiId {
	export function generate({
		element,
		uiIdPrefix,
		infix,
		suffix = "",
		rowIndex
	}: UiIdGeneratorProps): string {
		if ("type" in element) {
			if (FormModel.Control.isInstance(element)) {
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
			} else if (FormModel.RepeatOverviewColumn.isInstance(element)) {
				return generateForRepeatOverviewColumn({
					id: element.id,
					uiIdPrefix,
					rowIndex
				});
			} else if (FormModel.TextCell.isInstance(element)) {
				return (
					generateForComponent({
						id: element.id,
						uiIdPrefix,
						infix
					}) + "-content"
				);
			} else if (FormModel.ExpressionCell.isInstance(element)) {
				return (
					generateForComponent({
						id: element.id,
						uiIdPrefix,
						infix
					}) + "-expression"
				);
			}
		}

		if (FormModel.Screen.isInstance(element)) {
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
	}

	export function generateForRowActionButton(params: {
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
	}

	export function generateForAddButton(params: {
		repeat: FormModel.Repeat;
		uiIdPrefix?: string;
	}): string {
		return UiId.generate({
			element: params.repeat,
			uiIdPrefix: params.uiIdPrefix,
			infix: "add-button"
		});
	}

	export function generateForBtnGroup(params: {
		id: string;
		uiIdPrefix?: string;
		alignment: string;
	}): string {
		return generateForComponent(params) + "-btn-group-" + params.alignment;
	}

	export function generateForDetachedRepeatScreen(params: {
		repeatId: string;
		uiIdPrefix?: string;
	}): string {
		return getPrefix(params.uiIdPrefix) + "case-" + params.repeatId;
	}

	export function generateForCorrectionModeDetailScreen(params: { uiIdPrefix?: string }): string {
		return generateForComponent({ ...params, id: "correction-screen" });
	}

	export function generateForEmbeddedRepeatExpandedRow(params: {
		repeat: FormModel.Repeat;
		uiIdPrefix?: string;
		rowIndex: number;
	}): string {
		return (
			generate({ element: params.repeat, uiIdPrefix: params.uiIdPrefix }) +
			"-expandedrow" +
			"-" +
			params.rowIndex
		);
	}

	export function generateForMultiAttachmentUpload(params: {
		repeat: FormModel.Repeat;
		uiIdPrefix?: string;
	}): string {
		return (
			generate({ element: params.repeat, uiIdPrefix: params.uiIdPrefix }) +
			"-multi-attachment-upload"
		);
	}

	function generateForComponent(params: {
		id: string;
		infix?: string;
		uiIdPrefix?: string;
	}): string {
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

	export function generateForRepeatOverviewColumn(params: {
		id: string;
		uiIdPrefix?: string;
		rowIndex?: number;
	}): string {
		return generateForComponent(params) + "-cell-" + params.rowIndex;
	}

	export function generateForRepeatTableBodyCell(params: {
		id: string;
		uiIdPrefix?: string;
		rowIndex?: number;
	}): string {
		return generateForComponent(params) + "-bodycell-" + params.rowIndex;
	}

	export function generateForRepeatTableBodyRow(params: {
		id: string;
		uiIdPrefix?: string;
		rowIndex?: number;
	}): string {
		return generateForComponent(params) + "-bodyrow-" + params.rowIndex;
	}

	export function generateForRepeatTable(params: {
		id: string;
		uiIdPrefix?: string;
		rowIndex?: number;
	}): string {
		return generateForComponent(params) + "-table";
	}

	export function generateForTitle(params: { id: string; uiIdPrefix?: string }): string {
		return generateForComponent(params) + "-title";
	}

	function generateForFormModel(params: { header: Header; uiIdPrefix?: string }): string {
		return getPrefix(params.uiIdPrefix) + params.header.id;
	}

	function getPrefix(uiIdPrefix?: string): string {
		return `${uiIdPrefix !== undefined ? uiIdPrefix + "-" : ""}`;
	}

	export function generateForFieldOverviewColumnFilter(params: {
		id: string;
		uiIdPrefix?: string;
		suffix?: string;
	}): string {
		return generateForComponent(params) + "-filter" + `${params.suffix ? params.suffix : ""}`;
	}

	export function generateForValidationBar(params: { uiIdPrefix?: string }): string {
		return getPrefix(params.uiIdPrefix) + "a12-validation-bar";
	}

	export function generateForCorrectionScreenBar(params: { uiIdPrefix?: string }): string {
		return getPrefix(params.uiIdPrefix) + "a12-correction-screen-bar";
	}

	export function generateForMobileValidationBarModal(params: { uiIdPrefix?: string }): string {
		return getPrefix(params.uiIdPrefix) + "a12-validation-bar-modal";
	}

	export function generateForErrorTooltip(params: { inputId: string }): string {
		return `${params.inputId}-errors-tooltip`;
	}

	export function generateForWarningTooltip(params: { inputId: string }): string {
		return `${params.inputId}-warnings-tooltip`;
	}

	export function generateForInfoTooltip(params: { inputId: string }): string {
		return `${params.inputId}-infos-tooltip`;
	}

	export function generateForHintTooltip(params: { inputId: string }): string {
		return `${params.inputId}-hint-tooltip`;
	}

	export function generateForSuffix(params: { inputId: string }): string {
		return `${params.inputId}-suffix`;
	}
}
