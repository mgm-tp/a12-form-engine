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
import { last } from "fp-ts/lib/NonEmptyArray.js";
import type { NonEmptyArray } from "fp-ts/lib/NonEmptyArray.js";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import {
	isFormModelFieldOverviewColumn,
	isFormModelInlineRepeat
} from "../../../models/internal/FormModelGuards.js";

import type { FormModel } from "../form-model.js";

import { FormModelPath } from "./form-model-path.js";
import type { ModelVisitor, VisitProcess } from "./form-model-walker.js";
import { ModelWalker } from "./form-model-walker.js";

/** @internal */
export interface EditableElement {
	readonly formModelElement: FormModel.FieldBasedInputType;
	/**
	 * The path from a given parent, including the name of the parent
	 */
	readonly relativeFormModelPath: ModelPath;
}

/** @internal */
export type EditableFieldsPredicate = (
	elementPath: ModelPath,
	index?: FormModel.ControlIndex
) => boolean;

/**
 * @internal
 *
 * @param parent: The parent from which the search starts
 * @param matches: A predicate to restrict the search
 * @param firstOccurrence Whether to stop the search after the first element
 */
export function findEditableElements(
	parent: object,
	matches: EditableFieldsPredicate,
	firstOccurrence?: boolean
): EditableElement[] {
	const editableElementsCollector = new EditableFieldsCollector(matches, firstOccurrence);
	new ModelWalker(editableElementsCollector).acceptGeneric(parent);
	return editableElementsCollector.allFields;
}

class EditableFieldsCollector implements ModelVisitor {
	public allFields: EditableElement[] = [];
	private elementStack: object[] = [];
	private formModelPathStack: ModelPath[] = [];
	private matches: EditableFieldsPredicate;
	private firstOccurrence?: boolean;

	constructor(matches: EditableFieldsPredicate, firstOccurrence?: boolean) {
		this.matches = matches;
		this.firstOccurrence = firstOccurrence;
	}

	private addIfMatchesAndSignalProcess(
		element: FormModel.FieldBasedInputType,
		index?: FormModel.ControlIndex
	): boolean {
		if (this.matches(element.elementPath, index)) {
			this.allFields.push({
				formModelElement: element,
				relativeFormModelPath: this.formModelPathStack.at(-1) ?? []
			});
			if (this.firstOccurrence) {
				return true;
			}
		}
		return false;
	}

	private isFieldOverviewColumnOfInlineRepeat(
		repeatColumn: FormModel.RepeatOverviewColumn
	): repeatColumn is FormModel.FieldOverviewColumn {
		return (
			isFormModelFieldOverviewColumn(repeatColumn) &&
			isFormModelInlineRepeat(this.elementStack[this.elementStack.length - 2])
		);
	}

	visitControl(control: FormModel.Control): VisitProcess {
		const stopTraversal = this.addIfMatchesAndSignalProcess(control, control.index);
		return stopTraversal ? "Stop" : "ContinueTraversal";
	}

	visitRepeatOverviewColumn(repeatColumn: FormModel.RepeatOverviewColumn): VisitProcess {
		if (this.isFieldOverviewColumnOfInlineRepeat(repeatColumn)) {
			const stopTraversal = this.addIfMatchesAndSignalProcess(repeatColumn);
			if (stopTraversal) {
				return "Stop";
			}
		}
		return "ContinueTraversal";
	}

	enter(elementStack: NonEmptyArray<object>): void {
		this.elementStack = elementStack;
		const currentElementPath = FormModelPath.extend(
			this.formModelPathStack.at(-1) ?? [],
			last(elementStack)
		);
		this.formModelPathStack.push(currentElementPath);
	}

	leave() {
		this.formModelPathStack.pop();
	}
}
