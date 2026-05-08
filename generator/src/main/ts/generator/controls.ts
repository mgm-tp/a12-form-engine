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

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { DocumentModelPredicate } from "../dm/dm_context.js";
import type { FieldLike } from "../dm/dm_types.js";
import { isField } from "../dm/dm_types.js";
import type { FormModel } from "../form_model.js";

import { createLabelFromDMElement } from "./label.js";

/**
 * Create a new control for the given "field" and add it to the given screen
 * elements.
 *
 * The list of locales is passed to create labels.
 *
 * To set a control to readonly, a predicate is passed.
 *
 * If the screen elements already end with a control grid, the control is
 * added to the existing control grid, otherwise a new one is created. This
 * is done to reduce the number of generated control grids.
 *
 * The control grid is named after a group, which therefore needs to be passed.
 * If the fields inside a group are fragmented, e.g. by a repeatable group, then
 * multiple control grids are created and suffixed with a running number.
 */
export function ControlFactory(locales: string[], isReadonly: DocumentModelPredicate) {
	return {
		addControl,
		createControlGridForSingleField
	};

	function addControl(
		screenElements: FormModel.ScreenElement[],
		fieldLike: FieldLike,
		group: DocumentModel.Group
	): FormModel.ScreenElement[] {
		const lastScreenElement = screenElements.at(-1);
		const inControlGrid = lastScreenElement?.type === "ControlGrid";

		const count = screenElements.filter(nameStartsWithPredicate(controlGridBaseName(group))).length;
		const controlGrid = inControlGrid ? lastScreenElement : createEmptyControlGrid(group, count);
		const control = createControl(fieldLike);

		const controlGridWithControl = addControlToGrid(control, controlGrid);

		return inControlGrid
			? [...[...screenElements].slice(0, -1), controlGridWithControl]
			: [...screenElements, controlGridWithControl];
	}

	function addControlToGrid(
		control: FormModel.Control,
		grid: FormModel.ControlGrid
	): FormModel.ControlGrid {
		const row = createRow(control);
		return {
			...grid,
			row: [...(grid.row || []), row]
		};
	}

	function createControlGridForSingleField(fieldLike: FieldLike) {
		const emptyGrid = createEmptyControlGrid(fieldLike, 0);
		const control = createControl(fieldLike);
		const row = createRow(control);
		return {
			...emptyGrid,
			row: [row]
		};
	}

	function createEmptyControlGrid(
		group: DocumentModel.Element,
		existing: number
	): FormModel.ControlGrid {
		const baseName = controlGridBaseName(group);
		const suffix = existing > 0 ? `_${existing}` : "";
		return {
			type: "ControlGrid",
			id: `ControlGrid_for_${group.id}${suffix}`,
			name: `${baseName}${suffix}`
		};
	}

	function controlGridBaseName(group: DocumentModel.Element) {
		return `${group.name}_Controls`;
	}

	function createControl(fieldLike: FieldLike): FormModel.Control {
		// for physical fields, only generate labels if the field doesn't have
		// one (the form engine already has a fallback mechanism)
		const label =
			isField(fieldLike) && fieldLike.label
				? undefined
				: createLabelFromDMElement(locales)(fieldLike);

		const readonly = isReadonly(fieldLike);

		return {
			type: "Control",
			id: `Control_for_${fieldLike.id}`,
			elementRef: fieldLike.id,
			...(readonly ? { readonly } : {}),
			...(label ? { label } : {})
		};
	}

	function createRow(control: FormModel.Control): FormModel.Row {
		return {
			type: "Row",
			id: `Row_for_${control.elementRef}`,
			cell: [control]
		};
	}
}

function nameStartsWithPredicate(baseName: string) {
	return function (element: FormModel.IdNamed) {
		return element.name.startsWith(baseName);
	};
}
