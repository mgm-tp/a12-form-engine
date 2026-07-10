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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { FormModel } from "../../../models/index.js";
import { findElementByFormModelPath } from "../../../models/index.js";
import {
	isFormModelEmbeddedRepeat,
	isFormModelFieldOverviewColumn,
	isFormModelInlineRepeat,
	isFormModelScreen,
	isFormModelScreenElement
} from "../../../models/internal/FormModelGuards.js";
import * as DocumentModelUtils from "../../../models/internal/utils/document-model-utils.js";
import { DocumentPath, DocumentUtils } from "../../../models/internal/utils/document-utils.js";
import { FormModelPath } from "../../../models/internal/utils/form-model-path.js";
import type {
	ModelVisitor,
	VisitProcess
} from "../../../models/internal/utils/form-model-walker.js";
import { ModelWalker } from "../../../models/internal/utils/form-model-walker.js";
import { isHidden } from "../../../view/internal/utilities/enablements/hidden.js";
import { getDocumentPath } from "../../utils/internal/path.js";

import { DataSelectors } from "./selectors/data.js";
import { ModelSelectors } from "./selectors/models.js";
import { UiStateSelectors } from "./selectors/ui-state.js";
import type { EngineState } from "./store.js";

/** @internal */
export interface RelevantFieldPaths {
	/** Document path of the field */
	readonly documentPath: EntityInstancePath;
	/**
	 * Form model path of a control/column, that references the field.
	 * If not given, the field is not visible.
	 */
	readonly formModelPath?: ModelPath;
}

class RelevantFieldsMap {
	private value: Map<string, RelevantFieldPaths>;

	constructor() {
		this.value = new Map();
	}

	/**
	 * Add a new entry to the map of relevant fields.
	 *
	 * If no entry for the given document path exists, simply add the new entry.
	 *
	 * If an entry for the given document path already exists, check if it
	 * should be replaced by the new entry. If it doesn't contain a form model
	 * path, but the new entry does, then the current entry is replaced.
	 * Otherwise, the map remains unchanged.
	 * Note, that the entry will be replaced by deleting the old entry and
	 * adding a new one to ensure the correct insertion order. This is
	 * important, because the relevant fields are used to focus the first
	 * visible error field after a partial validation.
	 */
	public add(newEntry: RelevantFieldPaths): void {
		const docPathString = DocumentPath.toString(newEntry.documentPath);
		const existingEntry = this.value.get(docPathString);

		if (existingEntry) {
			if (existingEntry.formModelPath || !newEntry.formModelPath) {
				return;
			} else if (!existingEntry.formModelPath) {
				this.value.delete(docPathString);
			}
		}

		this.value.set(docPathString, newEntry);
	}

	/**
	 * Convert the given map to an array of all contained values.
	 *
	 * The resulting array is ordered by the insertion order of the map.
	 */
	public toArray(): RelevantFieldPaths[] {
		return [...this.value.values()];
	}
}

/**
 * @internal
 *
 * collects all fields which are relevant for partial (screen) validation
 *
 * @param state The current state
 * @param initialFormModelPath The form-model path from which the collection should start
 * If none is given then the current screen location path will be taken
 * @param rowPath Path to the row for which the fields should be collected.
 * If none is given all fields for the whole table will be collected.
 */
export function collectRelevantFields(
	state: EngineState,
	initialFormModelPath?: ModelPath,
	rowPath?: EntityInstancePath
): RelevantFieldPaths[] {
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);
	const formModel = ModelSelectors.formModel()(state);
	const formModelPath = initialFormModelPath || currentScreenLocation.locationPath;

	const parentPath = formModelPath.slice(0, -1);

	const element = findElementByFormModelPath(formModel, formModelPath);
	if (element === undefined) {
		return [];
	}
	const elementPaths = new RelevantFieldsMap();

	const relevantFieldsVisitor = new RelevantFieldsVisitor(
		[parentPath],
		state,
		currentScreenLocation.path,
		elementPaths,
		rowPath
	);

	if (isFormModelScreen(element)) {
		new ModelWalker(relevantFieldsVisitor).acceptScreen(element);
	} else if (isFormModelScreenElement(element)) {
		new ModelWalker(relevantFieldsVisitor).acceptScreenElement(element);
	} else {
		throw new Error(
			`unexpected element encountered for screen validation: ${ModelPath.toString(formModelPath)}`
		);
	}
	return elementPaths.toArray();
}

class RelevantFieldsVisitor implements ModelVisitor {
	private readonly formModel: FormModel;
	private readonly documentModel: DocumentModel;
	private readonly document: GroupInstance;
	private readonly formModelPathStack: NonEmptyArray<ModelPath>;
	private readonly state: EngineState;
	private readonly context: EntityInstancePath;
	private readonly elementPaths: RelevantFieldsMap;
	private readonly rowPath?: EntityInstancePath;

	constructor(
		formModelPathStack: NonEmptyArray<ModelPath>,
		state: EngineState,
		context: EntityInstancePath,
		elementPaths: RelevantFieldsMap,
		rowPath?: EntityInstancePath
	) {
		this.formModelPathStack = formModelPathStack;
		this.state = state;
		this.context = context;
		this.elementPaths = elementPaths;
		this.rowPath = rowPath;
		this.formModel = ModelSelectors.formModel()(state);
		this.documentModel = ModelSelectors.documentModel()(state);
		this.document = DataSelectors.document()(state) as GroupInstance;
	}

	visitSection(section: FormModel.Section): VisitProcess {
		const sectionPath = last(this.formModelPathStack);
		const collapsedState = UiStateSelectors.sectionState()(this.state)[
			ModelPath.toString(sectionPath)
		];
		const isCollapsed =
			collapsedState === undefined
				? section.collapsible && section.initiallyCollapsed
				: collapsedState;
		return isCollapsed ||
			isHidden({
				formModelElement: section,
				dataContext: this.context,
				state: this.state
			})
			? "ContinueButDoNotGoDeeper"
			: "ContinueTraversal";
	}

	visitDetachedRepeat(): VisitProcess {
		return "ContinueButDoNotGoDeeper";
	}

	visitInlineRepeat(repeat: FormModel.InlineRepeat): VisitProcess {
		if (
			isHidden({
				formModelElement: repeat,
				dataContext: this.context,
				state: this.state
			})
		) {
			return "ContinueButDoNotGoDeeper";
		}
		const documentPath = getDocumentPath(this.documentModel, repeat.groupPath, this.context);
		const rows = DocumentUtils.getRows(this.document, documentPath);
		return rows.length > 0 ? "ContinueTraversal" : "ContinueButDoNotGoDeeper";
	}

	visitEmbeddedRepeat(repeat: FormModel.EmbeddedRepeat): VisitProcess {
		if (
			isHidden({
				formModelElement: repeat,
				dataContext: this.context,
				state: this.state
			})
		) {
			return "ContinueButDoNotGoDeeper";
		}
		const documentPath = getDocumentPath(this.documentModel, repeat.groupPath, this.context);
		const rows = DocumentUtils.getRows(this.document, documentPath);
		return rows.length > 0 ? "ContinueTraversal" : "ContinueButDoNotGoDeeper";
	}

	visitControlGrid(grid: FormModel.ControlGrid): VisitProcess {
		return isHidden({
			formModelElement: grid,
			dataContext: this.context,
			state: this.state
		})
			? "ContinueButDoNotGoDeeper"
			: "ContinueTraversal";
	}

	visitMultiColumnSection(section: FormModel.MultiColumnSection): VisitProcess {
		return isHidden({
			formModelElement: section,
			dataContext: this.context,
			state: this.state
		})
			? "ContinueButDoNotGoDeeper"
			: "ContinueTraversal";
	}

	visitRepeatOverviewColumn(repeatColumn: FormModel.RepeatOverviewColumn): VisitProcess {
		if (!isFormModelFieldOverviewColumn(repeatColumn)) {
			return "ContinueButDoNotGoDeeper";
		}

		// find out whether this is a column in an inline repeat
		// other repeat types don't have editable columns and can be ignored
		const formModelPath = last(this.formModelPathStack);
		const repeatFormModelPath = formModelPath.slice(0, -1);
		const repeat = findElementByFormModelPath(this.formModel, repeatFormModelPath);

		if (repeat !== undefined && isFormModelInlineRepeat(repeat)) {
			// the visibility of this column's cells has to be checked for each repeatable group instance individually
			// since the data within each group instance can influence the evaluation of e.g. dependent field
			const repeatDocumentPath = getDocumentPath(
				this.documentModel,
				repeat.groupPath,
				this.context
			);

			const repeatableGroupInstances = DocumentUtils.getRows(this.document, repeatDocumentPath);

			const resultBuffer: RelevantFieldPaths[] = [];

			repeatableGroupInstances.forEach((_, index) => {
				// Replace the last index to get the row document path. Add 1 to the index, because it is 1-based.
				const repeatRowDocumentPath = this.setLastDocumentPathIndex(repeatDocumentPath, index + 1);

				// if a specific rowPath was passed to the collectRelevantFields call:
				// we should only consider this specific row and skip everything else
				if (this.rowPath && !DocumentPath.equal(repeatRowDocumentPath, this.rowPath)) {
					return;
				}

				const elementIsHidden = isHidden({
					formModelElement: repeatColumn,
					dataContext: repeatRowDocumentPath,
					state: this.state
				});

				if (!elementIsHidden) {
					// the document path of the field referenced by the column can be more than one additional segment
					// added to the path of the repeat row since there could be non-repeatable groups in between
					const columnFieldDocumentPath = getDocumentPath(
						this.documentModel,
						repeatColumn.elementPath,
						repeatRowDocumentPath
					);

					resultBuffer.push({ documentPath: columnFieldDocumentPath, formModelPath });
				}
			});

			/**
			 * If the column is visible in all rows, add a single entry with row index 0
			 * instead of individual entries. This is necessary to support rules, which
			 * iterate over all rows.
			 */
			if (resultBuffer.length > 0 && resultBuffer.length === repeatableGroupInstances.length) {
				const pathForAllPossibleInstances = getDocumentPath(
					this.documentModel,
					repeatColumn.elementPath,
					repeatDocumentPath
				);

				this.elementPaths.add({
					documentPath: pathForAllPossibleInstances,
					formModelPath
				});
			} else {
				resultBuffer.forEach(e => {
					this.elementPaths.add(e);
				});
			}
		}

		return "ContinueTraversal";
	}

	visitControl(control: FormModel.Control): VisitProcess {
		const formModelPath = last(this.formModelPathStack);
		const parentOfCgPath = formModelPath.slice(0, -3);
		const parentOfCg = findElementByFormModelPath(this.formModel, parentOfCgPath);

		if (isFormModelEmbeddedRepeat(parentOfCg)) {
			const repeatDocumentPath = getDocumentPath(
				this.documentModel,
				parentOfCg.groupPath,
				this.context
			);

			const repeatableGroupInstances = DocumentUtils.getRows(this.document, repeatDocumentPath);

			const resultBuffer: RelevantFieldPaths[] = [];

			repeatableGroupInstances.forEach((_, index) => {
				// Replace the last index to get the row document path. Add 1 to the index, because it is 1-based.
				const repeatRowDocumentPath = this.setLastDocumentPathIndex(repeatDocumentPath, index + 1);

				/**
				 * If a specific rowPath was passed to the collectRelevantFields
				 * call, we should skip all other rows.
				 */
				if (this.rowPath && !DocumentPath.equal(repeatRowDocumentPath, this.rowPath)) {
					return;
				}

				const paths = this.getControlFieldAndIndexPaths(
					control,
					repeatRowDocumentPath,
					formModelPath
				);
				paths.forEach(e => resultBuffer.push(e));
			});

			/**
			 * If the control has no index information and is visible in all rows, add a single
			 * entry with row index 0 instead of individual entries. This is necessary to support
			 * rules, which iterate over all rows.
			 */
			if (
				!control.index &&
				resultBuffer.length > 0 &&
				resultBuffer.length === repeatableGroupInstances.length
			) {
				const pathForAllPossibleInstances = getDocumentPath(
					this.documentModel,
					control.elementPath,
					repeatDocumentPath
				);

				this.elementPaths.add({
					documentPath: pathForAllPossibleInstances,
					formModelPath
				});
			} else {
				resultBuffer.forEach(e => {
					this.elementPaths.add(e);
				});
			}
		} else {
			const paths = this.getControlFieldAndIndexPaths(control, this.context, formModelPath);
			paths.forEach(p => this.elementPaths.add(p));
		}

		return "ContinueTraversal";
	}

	/**
	 * Determine the paths of the field, that's referenced by a control and the
	 * path to the index field of the corresponding group if the control uses a
	 * semantic index.
	 *
	 * The index field of the corresponding repeatable group needs to be added
	 * to the relevant fields. This is necessary to allow parallel iteration
	 * to be executed correctly during a partial validation and to access the
	 * value of the index field if it is used in the error message of a rule.
	 *
	 * Since the index field might not be visible, it will be added without a
	 * form model path. If it is visible, the entry will be replaced later.
	 */
	private getControlFieldAndIndexPaths(
		control: FormModel.Control,
		dataContext: EntityInstancePath,
		formModelPath: ModelPath
	): RelevantFieldPaths[] {
		const controlContext = control.index
			? this.getIndexedControlContext(control, dataContext)
			: dataContext;

		/**
		 * We skip the control if its context doesn't exist. This
		 * can only happen if no corresponding row could be found for
		 * an indexed control.
		 */
		if (controlContext) {
			const elementIsHidden = isHidden({
				formModelElement: control,
				dataContext: controlContext,
				state: this.state
			});

			if (!elementIsHidden) {
				const fieldDocumentPath = getDocumentPath(
					this.documentModel,
					control.elementPath,
					controlContext
				);
				const semanticIndexPath = this.getSemanticIndexPath(control);

				return semanticIndexPath
					? [
							{ documentPath: fieldDocumentPath, formModelPath },
							{
								documentPath: getDocumentPath(this.documentModel, semanticIndexPath, controlContext)
							}
						]
					: [{ documentPath: fieldDocumentPath, formModelPath }];
			}
		}

		return [];
	}

	/**
	 * Determine the path to the index field for controls with a semantic index.
	 * Returns undefined if the path could not be found or if no index is configured
	 * for the given control.
	 */
	private getSemanticIndexPath(control: FormModel.Control): ModelPath | undefined {
		if (control.index?.type === "SEMANTIC") {
			const contextGroupPath = DocumentModelUtils.computeGranularity(
				this.documentModel,
				control.elementPath
			);
			const contextGroup = DocumentModelUtils.findByPath(this.documentModel, contextGroupPath);

			if (contextGroup.type === "Group" && contextGroup.indexFieldName) {
				return [...contextGroupPath, { elementName: contextGroup.indexFieldName }] as ModelPath;
			}
		}

		return undefined;
	}

	/**
	 * Determine the data context of an indexed control.
	 * Returns the path to the correct repeatable group instance or undefined,
	 * if no such instance could be found in the document.
	 */
	private getIndexedControlContext(
		control: FormModel.Control,
		context: EntityInstancePath
	): EntityInstancePath | undefined {
		let rowIndex: number;

		const contextGroupPath = DocumentModelUtils.computeGranularity(
			this.documentModel,
			control.elementPath
		);

		const repeatDocumentPath = getDocumentPath(this.documentModel, contextGroupPath, context);

		const repeatableGroupInstances = DocumentUtils.getAssignedObject(
			this.document,
			repeatDocumentPath
		) as GroupInstance[] | undefined;

		if (control.index?.type === "NUMERIC") {
			rowIndex = control.index.typedValue;

			if ((repeatableGroupInstances?.length ?? 0) >= rowIndex) {
				return this.setLastDocumentPathIndex(repeatDocumentPath, rowIndex);
			}
		} else if (control.index?.type === "SEMANTIC") {
			const indexFieldPath = this.getSemanticIndexPath(control);
			const indexField = DocumentModelUtils.findByPath(this.documentModel, indexFieldPath ?? []);

			if (indexField && indexField.type === "Field") {
				/**
				 * Note, that the Kernel APIs expect 1-based indices. That's
				 * why we need to add 1 to the array index to get the actual
				 * row index for the document path.
				 */
				rowIndex = repeatableGroupInstances
					? repeatableGroupInstances.findIndex(
							e => e[indexField.name] === control.index?.typedValue
						) + 1
					: -1;

				// 0 means "all rows" and is therefore not a valid row index here
				if (rowIndex > 0) {
					return this.setLastDocumentPathIndex(repeatDocumentPath, rowIndex);
				}
			}
		}

		return undefined;
	}

	/**
	 * Sets the index of the last path entry to the given index.
	 */
	private setLastDocumentPathIndex(path: EntityInstancePath, index: number): EntityInstancePath {
		return path.map((val, idx) => ({
			...val,
			index: idx === path.length - 1 ? index : val.index
		}));
	}

	enter(elementStack: NonEmptyArray<object>): void {
		this.formModelPathStack.push(
			FormModelPath.extend(last(this.formModelPathStack), last(elementStack))
		);
	}

	leave(): void {
		this.formModelPathStack.pop();
	}
}
