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
import { Expression } from "@com.mgmtp.a12.expression/expression-core";

import type { FormModel } from "../../models/index.js";

export function createHeaderFooter(config: {
	type: "header" | "footer";
	withButton?: boolean;
	stopButton?: boolean;
}): FormModel.HeaderFooterType {
	return {
		id: config.type,
		majorButtons: {
			button: config.withButton ? [createButton(config.stopButton ? "stop" : "button")] : []
		},
		minorButtons: {
			button: config.withButton ? [createButton()] : []
		}
	};
}

export function createButtonPanel(config: {
	id: string;
	buttons?: FormModel.ButtonType[];
	hideCondition?: FormModel.HideCondition;
}): FormModel.ButtonPanel {
	return {
		type: "ButtonPanel",
		name: "button-panel",
		id: config.id,
		button: config.buttons || [],
		hideCondition: config.hideCondition
	};
}

export function createButton(id?: string): FormModel.ButtonType {
	return {
		id: id ? id : "button",
		name: "button",
		type: "EVENT",
		scope: "HIDDEN_IN_READONLY_MODE"
	};
}

export function createControlGrid(config: {
	id: string;
	name?: string;
	rows?: FormModel.Row[];
	readonlyPresentation?: FormModel.ReadonlyPresentation;
	hideCondition?: FormModel.HideCondition;
}): FormModel.ControlGrid {
	return {
		type: "ControlGrid",
		id: config.id,
		name: config.name || "cg",
		row: config.rows || [],
		readonlyPresentation: config.readonlyPresentation,
		hideCondition: config.hideCondition
	};
}

export function createRow(config: { id: string; cells?: FormModel.CellType[] }): FormModel.Row {
	return {
		type: "Row",
		id: config.id,
		cell: config.cells || []
	};
}

export function createControl(
	id: string,
	readonlyPresentation?: FormModel.ReadonlyPresentation,
	hideCondition?: FormModel.HideCondition
): FormModel.Control {
	return {
		type: "Control",
		id,
		elementPath: ModelPath.fromString("a/b/c"),
		elementRef: "aField",
		occurrence: 1,
		readonlyPresentation: readonlyPresentation,
		hideCondition
	};
}

export function createScreen(config: {
	id: string;
	name?: string;
	screenElements?: FormModel.ScreenElement[];
	subHeaderBox?: FormModel.HeaderFooterType;
	footerBox?: FormModel.HeaderFooterType;
	initiallyFocusedElementId?: string;
}): FormModel.Screen {
	const { id, screenElements, subHeaderBox, footerBox, initiallyFocusedElementId } = config;
	return {
		id,
		name: config.name || `screen-${id}`,
		screenElements: screenElements || [],
		subHeaderBox,
		footerBox,
		initiallyFocusedElementId
	};
}

export function createFieldColumn(
	columnProps: Partial<FormModel.FieldOverviewColumn> = {}
): FormModel.FieldOverviewColumn {
	return {
		type: "FieldBasedRepeatOverviewColumn",
		id: "fieldColumn",
		elementPath: ModelPath.fromString("a/b/c"),
		elementRef: "aField",
		...columnProps
	};
}

export function createExpressionColumn(
	columnProps: Partial<FormModel.ExpressionOverviewColumn> = {}
): FormModel.ExpressionOverviewColumn {
	return {
		type: "ExpressionRepeatOverviewColumn",
		id: "expressionColumn",
		name: "expression-column",
		expression: "some expression",
		expressionTree: {
			type: Expression.NodeType.ROOT,
			children: []
		},
		...columnProps
	};
}

export function createDetachedRepeat(config: {
	id: string;
	columns?: FormModel.RepeatOverviewColumn[];
	detailScreen: FormModel.Screen;
	hideCondition?: FormModel.HideCondition;
}): FormModel.DetachedRepeat {
	const { id, columns, detailScreen, hideCondition } = config;
	return {
		type: "DetachedRepeat",
		id,
		name: `dr-${id}`,
		groupRef: "/some/group",
		groupPath: ModelPath.fromString("a/b/c"),
		detailScreen,
		repeatOverviewColumn: columns || [],
		hideCondition
	};
}

export function createEmbeddedRepeat(config: {
	id: string;
	columns?: FormModel.RepeatOverviewColumn[];
	controlGrid: FormModel.ControlGrid;
	hideCondition?: FormModel.HideCondition;
}): FormModel.EmbeddedRepeat {
	const { id, columns, controlGrid, hideCondition } = config;
	return {
		type: "EmbeddedRepeat",
		id,
		name: `er-${id}`,
		groupRef: "/some/group",
		groupPath: ModelPath.fromString("a/b/c"),
		controlGrid,
		repeatOverviewColumn: columns || [],
		hideCondition
	};
}

export function createInlineRepeat(config: {
	id: string;
	columns?: FormModel.RepeatOverviewColumn[];
	groupPath?: ModelPath;
	readonlyPresentation?: FormModel.ReadonlyPresentation;
	multiFileUpload?: boolean;
	hideCondition?: FormModel.HideCondition;
}): FormModel.InlineRepeat {
	const { id, columns, hideCondition } = config;
	return {
		type: "InlineRepeat",
		id,
		name: `ir-${id}`,
		groupRef: "/some/group",
		groupPath: config.groupPath || ModelPath.fromString("a/b/c"),
		repeatOverviewColumn: columns || [],
		readonlyPresentation: config.readonlyPresentation,
		multiFileUpload: config.multiFileUpload,
		multiFileUploadOptions: config.multiFileUpload
			? { elementRef: "", elementPath: [] }
			: undefined,
		hideCondition
	};
}

export function createSection(config: {
	id: string;
	screenElements?: FormModel.ScreenElement[];
	hideCondition?: FormModel.HideCondition;
}): FormModel.Section {
	const { id, screenElements, hideCondition } = config;
	return {
		type: "Section",
		id,
		name: `section-${id}`,
		screenElements,
		hideCondition
	};
}

export function createMultiColumnSection(config: {
	id: string;
	screenElements?: FormModel.ScreenElement[];
	hideCondition?: FormModel.HideCondition;
}): FormModel.MultiColumnSection {
	const { id, screenElements, hideCondition } = config;
	return {
		type: "MultiColumnSection",
		id,
		name: `section-${id}`,
		screenElements,
		layout: { lg: "6-6" },
		hideCondition
	};
}

export function createFormModel(modelConfig: {
	screens?: FormModel.Screen[];
	subHeaderBox?: FormModel.HeaderFooterType;
	footerBox?: FormModel.HeaderFooterType;
	readonlyPresentation?: FormModel.ReadonlyPresentation;
	inlineRepeatReadonlyPresentation?: FormModel.ReadonlyPresentation;
	fieldConfiguration?: FormModel.FieldConfiguration;
	groupConfiguration?: FormModel.GroupConfiguration;
}): FormModel {
	const formModel: FormModel = {
		content: {
			defaults: {},
			dependentScreenElements: {},
			conditionallyHiddenElements: {},
			fieldConfiguration: modelConfig.fieldConfiguration || { fieldMap: {} },
			footerBox: modelConfig.footerBox || { id: "footerbox" },
			groupConfiguration: modelConfig.groupConfiguration || { groupMap: {} },
			screens: modelConfig.screens || [],
			subHeaderBox: modelConfig.subHeaderBox || { id: "subheaderbox" },
			readonlyPresentation: modelConfig.readonlyPresentation,
			inlineRepeatReadonlyPresentation: modelConfig.inlineRepeatReadonlyPresentation
		},
		header: { id: "test", modelType: "form", modelVersion: "1" }
	};

	return formModel;
}
