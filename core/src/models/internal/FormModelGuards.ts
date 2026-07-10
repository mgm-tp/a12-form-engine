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

import { isModelInstance } from "@com.mgmtp.a12.base/base-model-api";

import { isRecord } from "../../back-end/utils/internal/guards.js";

import type { FormModel } from "./form-model.js";

/**
 * Function to check if a given value is an instance of {@link FormModel}.
 * @param ignoreRuntimeProperties This needs to be set to true, if you only want to check
 * the persistence properties and not the added run-time properties (e.g. fieldPath).
 */
export function isFormModel(value: unknown, ignoreRuntimeProperties = true): value is FormModel {
	return (
		isModelInstance(value) &&
		value.header.modelType === "form" &&
		isFormModelContent(value.content, ignoreRuntimeProperties)
	);
}

/**
 * Function to check if a given value is an instance of {@link FormModel.Content}.
 *
 * @param ignoreRuntimeProperties This needs to be set to true, if you only want to check
 * the persistence properties and not the added run-time properties (e.g. fieldPath).
 */
export function isFormModelContent(
	value: unknown,
	ignoreRuntimeProperties?: boolean
): value is FormModel.Content {
	return (
		isRecord(value) &&
		"subHeaderBox" in value &&
		"footerBox" in value &&
		"screens" in value &&
		"fieldConfiguration" in value &&
		"groupConfiguration" in value &&
		"defaults" in value &&
		(ignoreRuntimeProperties || "dependentScreenElements" in value)
	);
}

/**
 * Function to check if a given value is an instance of {@link FormModel.HeaderFooterType}.
 *
 */
export function isFormModelHeaderFooterType(value: unknown): value is FormModel.HeaderFooterType {
	return isRecord(value) && ("minorButtons" in value || "majorButtons" in value);
}

/**
 * Function to check if a given value is an instance of {@link FormModel.Screen}.
 *
 */
export function isFormModelScreen(value: unknown): value is FormModel.Screen {
	return (
		isRecord(value) &&
		value.screenElements !== undefined &&
		!isFormModelSection(value) &&
		!isFormModelMultiColumnSection(value)
	);
}

/**
 * Function to check if a given value is an instance of {@link FormModel.ScreenElement}.
 *
 */
export function isFormModelScreenElement(value: unknown): value is FormModel.ScreenElement {
	return (
		isFormModelSection(value) ||
		isFormModelControlGrid(value) ||
		isFormModelMultiColumnSection(value) ||
		isFormModelButtonPanel(value) ||
		isFormModelRepeat(value) ||
		isFormModelCustomScreenElement(value)
	);
}

/**
 * Function to check if a given value is an instance of {@link FormModel.CustomScreenElement}.
 *
 */
export function isFormModelCustomScreenElement(
	value: unknown
): value is FormModel.CustomScreenElement {
	return isRecord(value) && value.type === "CustomScreenElement";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.Section}.
 *
 */
export function isFormModelSection(value: unknown): value is FormModel.Section {
	return isRecord(value) && value.type === "Section";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.MultiColumnSection}.
 *
 */
export function isFormModelMultiColumnSection(
	value: unknown
): value is FormModel.MultiColumnSection {
	return isRecord(value) && value.type === "MultiColumnSection";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.RowAction}.
 *
 */
export function isFormModelRowAction(value: unknown): value is FormModel.RowAction {
	return (
		isRecord(value) && !("type" in value) && typeof value.event === "string" && "scope" in value
	);
}

/**
 * Function to check if a given value is an instance of {@link FormModel.DetachedRepeat} or {@link FormModel.InlineRepeat}
 * or {@link FormModel.EmbeddedRepeat}.
 *
 */
export function isFormModelRepeat(
	value: unknown
): value is FormModel.InlineRepeat | FormModel.DetachedRepeat | FormModel.EmbeddedRepeat {
	return (
		isFormModelDetachedRepeat(value) ||
		isFormModelInlineRepeat(value) ||
		isFormModelEmbeddedRepeat(value)
	);
}

/**
 * Function to check if a given value is an instance of {@link FormModel.DetachedRepeat}.
 *
 */
export function isFormModelDetachedRepeat(value: unknown): value is FormModel.DetachedRepeat {
	return isRecord(value) && value.type === "DetachedRepeat";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.RepeatOverviewColumn}.
 * @param value the value to check
 */
export function isFormModelRepeatOverviewColumn(
	value: unknown
): value is FormModel.RepeatOverviewColumn {
	return isFormModelFieldOverviewColumn(value) || isFormModelExpressionOverviewColumn(value);
}

/**
 * Function to check if a given value is an instance of {@link FormModel.FieldOverviewColumn}.
 * @param value the value to check
 */
export function isFormModelFieldOverviewColumn(
	value: unknown
): value is FormModel.FieldOverviewColumn {
	return isRecord(value) && value.type === "FieldBasedRepeatOverviewColumn";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.ExpressionOverviewColumn}.
 * @param value the value to check
 */
export function isFormModelExpressionOverviewColumn(
	value: unknown
): value is FormModel.ExpressionOverviewColumn {
	return isRecord(value) && value.type === "ExpressionRepeatOverviewColumn";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.InlineRepeat}.
 *
 */
export function isFormModelInlineRepeat(value: unknown): value is FormModel.InlineRepeat {
	return isRecord(value) && value.type === "InlineRepeat";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.EmbeddedRepeat}.
 *
 */
export function isFormModelEmbeddedRepeat(value: unknown): value is FormModel.EmbeddedRepeat {
	return isRecord(value) && value.type === "EmbeddedRepeat";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.ControlGrid}.
 *
 */
export function isFormModelControlGrid(value: unknown): value is FormModel.ControlGrid {
	return isRecord(value) && value.type === "ControlGrid";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.Row}.
 *
 */
export function isFormModelRow(value: unknown): value is FormModel.Row {
	return isRecord(value) && value.type === "Row";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.CustomCell}.
 *
 */
export function isFormModelCustomCell(value: unknown): value is FormModel.CustomCell {
	return isRecord(value) && value.type === "CustomCell";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.TextCell}.
 *
 */
export function isFormModelTextCell(value: unknown): value is FormModel.TextCell {
	return isRecord(value) && value.type === "TextCell";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.ExpressionCell}.
 *
 */
export function isFormModelExpressionCell(value: unknown): value is FormModel.ExpressionCell {
	return (
		isRecord(value) &&
		(value.type === "ExpressionCell" || value.type === "ExpressionRepeatOverviewColumn")
	);
}

/**
 * Function to check if a given value is an instance of {@link FormModel.FieldBasedInputType}.
 *
 */
export function isFormModelFieldBasedInputType(
	value: unknown
): value is FormModel.FieldBasedInputType {
	return isFormModelControl(value) || isFormModelFieldOverviewColumn(value);
}

/**
 * Function to check if a given value is an instance of {@link FormModel.Control}.
 *
 */
export function isFormModelControl(value: unknown): value is FormModel.Control {
	return isRecord(value) && value.type === "Control";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.ButtonPanel}.
 *
 */
export function isFormModelButtonPanel(value: unknown): value is FormModel.ButtonPanel {
	return isRecord(value) && value.type === "ButtonPanel";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.ButtonType}.
 *
 */
export function isFormModelButtonType(value: unknown): value is FormModel.ButtonType {
	return isFormModelNavigationButton(value) || isFormModelEventButton(value);
}

/**
 * Checks if the button is a navigation button
 */
export function isFormModelNavigationButton(value: unknown): value is FormModel.NavigationButton {
	return isRecord(value) && value.type === "NAVIGATION";
}

/**
 * Checks if the button is an event button
 */
export function isFormModelEventButton(value: unknown): value is FormModel.EventButton {
	return isRecord(value) && value.type === "EVENT";
}

/**
 * Function to check if a given value is an instance of {@link FormModel.TitledComponent}.
 *
 */
export function isFormModelTitledComponent(value: unknown): value is FormModel.TitledComponent {
	return isRecord(value) && "title" in value;
}

/**
 * Function to check if a given value is an instance of {@link FormModel.LabeledComponent}.
 *
 */
export function isFormModelLabeledComponent(value: unknown): value is FormModel.LabeledComponent {
	return (
		isRecord(value) &&
		("label" in value || (isRecord(value.buttonStyling) && "label" in value.buttonStyling))
	);
}

/**
 * Function to check if a given value is an instance of {@link FormModel.ComponentWithDescription}.
 *
 */
export function isFormModelComponentWithDescription(
	value: unknown
): value is FormModel.ComponentWithDescription {
	return isRecord(value) && isRecord(value.buttonStyling) && "description" in value.buttonStyling;
}
