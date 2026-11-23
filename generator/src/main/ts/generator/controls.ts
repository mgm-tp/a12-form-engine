// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
