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
import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizer, ValueConversion } from "@com.mgmtp.a12.utils/utils-localization";

import type { CorrectionModeItem } from "../../../../../back-end/store/internal/CorrectionModeItem.js";
import { calculateViewIndexOfRow } from "../../../../../back-end/store/internal/middleware/calculateViewIndexOfRow.js";
import { DataSelectors } from "../../../../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../back-end/store/internal/selectors/ui-state.js";
import type { SortingOrder } from "../../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineState, EngineStore } from "../../../../../back-end/store/internal/store.js";
import { getDocumentPath } from "../../../../../back-end/utils/internal/path.js";
import { findElementByFormModelPath } from "../../../../../models/internal/findElementByFormModelPath.js";
import type { FormModel } from "../../../../../models/internal/form-model.js";
import {
	isFormModelEmbeddedRepeat,
	isFormModelFieldOverviewColumn,
	isFormModelInlineRepeat,
	isFormModelRepeat,
	isFormModelScreen,
	isFormModelSection
} from "../../../../../models/internal/FormModelGuards.js";
import * as DocumentModelUtils from "../../../../../models/internal/utils/document-model-utils.js";
import {
	DocumentPath,
	DocumentUtils,
	IndexedControl,
	InternalDocumentPath
} from "../../../../../models/internal/utils/document-utils.js";
import { findEditableElements } from "../../../../../models/internal/utils/EditableElement.js";
import type { EditableElement } from "../../../../../models/internal/utils/EditableElement.js";
import type { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { isHidden } from "../../../utilities/enablements/hidden.js";

/**
 * @internal
 */
export type UIIssueReport =
	| {
			readonly items: ReadonlyArray<CorrectionModeItem>;
			readonly fixable: true;
	  }
	| {
			readonly fixable: false;
	  };

/**
 * @internal
 *
 * There are different scenarios for the errors
 *
 * 1. Error is in not in a repeatable group
 * 		 errorPath: rootGroup[1]/anyGroup[1]/F1[1]
 * 	1.1. and the control is not in an inline-repeat or detached-repeat screen
 * 			formModelPath: TopLvlScreen/cg1/ctrl1
 * 			--> nothing to do, the control can just be taken
 * 	1.2. and the control is in an inline-repeat
 * 			formModelPath: TopLvlScreen/IR1/ctrl1
 * 			--> the link to this control should just be shown
 * 				if the repeatable-group of IR has at least one row
 * 	1.3. and the control is in an detached-repeat screen
 * 			formModelPath: TopLvlScreen/DR1/DR-Screen/ctrl1
 * 			--> like in 1.2 the link should just be shown if the repeatable
 * 				group has at least one row
 * 			--> furthermore screen location stack to get to this control has
 * 				to be prepared
 * 2. Error is in a repeatable group
 *  	 errorPath: rootGroup[1]/repeatableGroup[2]/F2[1]
 * 	2.1. and the context exists
 * 			context: rootGroup[1]/repeatableGroup[2]
 * 			document: {
 * 				rootGroup: {
 * 						repeatableGroup: [
 * 							{F2: "a"}, // first row
 * 							{F2: "b"}  // second row
 * 						]
 * 					}
 * 			}
 * 		2.1.1 and the control is in an inline-repeat
 * 			 formModelPath: TopLvlScreen/IR1/ctrl2
 * 			--> nothing to do, control can just be taken
 * 		2.1.2 and the control is in a detached-repeat screen
 * 			 formModelPath: TopLvlScreen/DR1/DR-Screen/ctrl1
 * 			--> furthermore screen location stack to get to this control has
 * 			to be prepared
 * 	2.2 and the context does not exists
 * 			context: rootGroup[1]/repeatableGroup[2]
 * 			document: {
 * 				rootGroup: {
 * 						repeatableGroup: [
 * 							{F2: "a"}, // first row
 * 						]
 * 					}
 * 			}
 * 		--> no link to this error can be shown
 * 		--> this case can happen if a rule lays outside of the
 * 			repeatable group, tests the whole group (e.g GroupNotFilled)
 * 			and references a field inside the group as an error field
 */
export function getUIIssueReport(
	message: EngineStore.Validation.Message,
	renderOptions: FormModelMap.RenderOptions,
	localizer: Localizer,
	converter: ValueConversion
): UIIssueReport {
	const documentModel = ModelSelectors.documentModel()(renderOptions.state);
	const document = DataSelectors.relevantDocument()(renderOptions.state) as GroupInstance;
	const formModel = ModelSelectors.formModel()(renderOptions.state);
	const currentScreenState = UiStateSelectors.currentScreenLocation()(renderOptions.state);

	let fixable = false;

	const correctionModeItemMap: Map<string, CorrectionModeItem> = new Map();

	for (const referenceFieldPath of message.referencedFields) {
		const matches = (elementPath: ModelPath, controlIndex?: FormModel.ControlIndex) => {
			// use contains instead of equal to link to attachments/multi-selects if
			// an error is in one of their fields
			const modelPathMatches = ModelPath.contains(referenceFieldPath, elementPath);

			return modelPathMatches && (!controlIndex || documentPathMatches());

			function documentPathMatches() {
				// path to the repeatable group, that's referenced by the control index
				const elementGranularity = DocumentModelUtils.computeGranularity(
					documentModel,
					elementPath
				);
				// path to the repeatable group, where the indexed control is located
				const outerGranularity = DocumentModelUtils.computeGranularity(
					documentModel,
					elementGranularity.slice(0, -1)
				);
				// data context of the screen, where the indexed control is located
				const outerContext = getDocumentPath(documentModel, outerGranularity, referenceFieldPath);

				const contextPath = IndexedControl.getContextOfControlWithIndex({
					elementPath,
					controlIndex,
					documentModel,
					document,
					currentDataContext: outerContext
				});
				const resolvedPath = getDocumentPath(documentModel, elementPath, contextPath);

				return DocumentPath.contains(referenceFieldPath, resolvedPath);
			}
		};

		/**
		 * Find all Controls and FieldOverviewColumns which reference the given path
		 */
		const editableElements = findEditableElements(formModel, matches);
		if (editableElements.length === 0) {
			continue;
		}
		fixable = true;

		const allElementContexts = resolveAllRepeatContextsOfElement(
			documentModel,
			document,
			referenceFieldPath
		);
		if (allElementContexts === undefined) {
			continue;
		}

		/**
		 * Create the needed LocationStack for the different controls, which
		 * is needed to jump in a deeper level and prepare the section state,
		 * which opens all needed sections if the needed control is inside.
		 */
		for (const editableElement of editableElements) {
			const correctionModeItem = createCorrectionModeItem(
				referenceFieldPath,
				editableElement,
				allElementContexts,
				currentScreenState,
				renderOptions,
				localizer,
				converter
			);
			if (correctionModeItem) {
				correctionModeItemMap.set(editableElement.formModelElement.id, correctionModeItem);
			}
		}
	}

	return fixable
		? {
				fixable,
				items: [...correctionModeItemMap.values()]
			}
		: { fixable };
}

/**
 * Determine all contexts of repeatable groups on the given document path,
 * that correspond to a repeat in the form model. For each of those paths it
 * is ensured, that the corresponding element exists in the given document.
 *
 * If the element exists in the document, an array of EntityInstancePaths is
 * returned, where each path corresponds to one context level. The first
 * path is always empty (root context).
 *
 * Example: For the document path
 * [
 * 	   { elementName: root, index: 1 },
 * 	   { elementName: repeatable_1, index: 4 },
 * 	   { elementName: nonRepeatable, index: 1 },
 * 	   { elementName: repeatable_2, index: 2 },
 * 	   { elementName: field, index: 1 }
 * ]
 * the result would be
 * [
 * 	   [],
 * 	   [
 * 	       { elementName: root, index: 1 },
 *         { elementName: repeatable_1, index: 4 }
 *     ],
 * 	   [
 *         { elementName: root, index: 1 },
 * 	       { elementName: repeatable_1, index: 4 },
 * 	       { elementName: nonRepeatable, index: 1 },
 * 	       { elementName: repeatable_2, index: 2 }
 *     ]
 * ]
 *
 * If the document does not contain the referenced instance of a repeatable
 * group, undefined is returned.
 *
 * The returned contexts are used to:
 * - determine whether a link to a control/column for the referenced field
 *   can be displayed (only possible if the result is not undefined)
 * - create a locationStack for CorrectionModeItems, that can be used to
 *   jump to nested errors
 *
 * Multi select groups have to be ignored here, because:
 * - a missing instance of a multi select does not imply, that no links can
 *   be provided
 * - they are not relevant for the location stack
 */
function resolveAllRepeatContextsOfElement(
	documentModel: DocumentModel,
	document: GroupInstance,
	documentPath: EntityInstancePath
): EntityInstancePath[] | undefined {
	// First entry in contexts is the root, which we reference with an empty array
	const contexts: EntityInstancePath[] = [[]];
	for (let i = 0; i < documentPath.length; i++) {
		const path = documentPath.slice(0, i + 1);
		// consider all repeatable groups except multi selects
		if (!isRepeatableGroup(documentModel, path) || isMultiSelect(documentModel, path)) {
			continue;
		}

		// check if the repeatable group exists in the document
		if (!DocumentUtils.exists(document, path)) {
			return undefined;
		}

		// check if the referenced repetition exists in the document
		if (!isRepeatRowPresent(document, path)) {
			return undefined;
		}

		contexts.push(path);
	}

	return contexts;
}

/** @internal  */
function isRepeatableGroup(documentModel: DocumentModel, p: EntityInstancePath): boolean {
	const element = DocumentModelUtils.findByPath(documentModel, p);
	return element.type === "Group" && element.repeatability > 1;
}

/** @internal  */
function isMultiSelect(documentModel: DocumentModel, p: EntityInstancePath): boolean {
	const element = DocumentModelUtils.findByPath(documentModel, p);
	return DocumentModelUtils.isMultiSelect(element);
}

/** @internal  */
function createCorrectionModeItem(
	referenceFieldPath: EntityInstancePath,
	editableElement: EditableElement,
	allElementContexts: ReadonlyArray<EntityInstancePath>,
	currentLocation: EngineStore.ScreenState,
	renderOptions: FormModelMap.RenderOptions,
	localizer: Localizer,
	converter: ValueConversion
): CorrectionModeItem | undefined {
	const state = renderOptions.state;
	const screenPaths = getScreenPaths(state, editableElement);

	const lastElementIndex = screenPaths.length - 1;
	const { formModelElement, relativeFormModelPath: formModelPath } = editableElement;

	/**
	 * Only the state of the last screen state matters.
	 * Therefore, we create simple ones for the first n -1.
	 */
	const locationStack = createSimpleLocationStack(
		state,
		screenPaths.slice(0, screenPaths.length - 1),
		allElementContexts
	);

	if (locationStack === undefined) {
		return undefined;
	}

	const lastScreenPath = screenPaths[lastElementIndex];
	const screenDataContext =
		allElementContexts[lastElementIndex] ||
		findContextOfScreen(state, lastScreenPath, locationStack[lastElementIndex - 1].path);
	if (screenDataContext === undefined) {
		return undefined;
	}

	/**
	 * The last entry in allElementContexts points to the context group of the
	 * referenced field (see resolveAllRepeatContextsOfElement). This may be
	 * - equal to the screenDataContext
	 * - outside of the screenDataContext
	 * - a suffix of the screenDataContext
	 *     - (IR columns, controls in ER control grids and indexed controls)
	 */
	const elementDataContext = allElementContexts.at(-1) ?? screenDataContext;

	/**
	 * Check for all parents of the element if they are visible.
	 * This check is needed due to possible hidden elements due
	 * to dependent controls.
	 */
	if (
		!allParentsVisible({
			formModelPath,
			state,
			allElementContexts,
			screenPaths
		})
	) {
		return undefined;
	}

	const repeat = potentialParentRepeat(ModelSelectors.formModel()(state), formModelPath);
	let repeatStaticState: ReadonlyObjectMap<EngineStore.Repeat.StaticState> | undefined = undefined;

	/**
	 * If the referenced field is a FieldOverviewColumn in an inline repeat or
	 * a control in an embedded repeat then we need set the index for the respective row
	 * in the focus component to target the right row.
	 * For a control in an embedded repeat we also need to set the expanded row information.
	 */
	if (
		repeat !== undefined &&
		(isFormModelFieldOverviewColumn(formModelElement) || isFormModelEmbeddedRepeat(repeat?.element))
	) {
		const screenState = createScreenStateForInlineAndEmbeddedRepeat({
			currentLocation,
			screenDataContext,
			elementDataContext,
			editableElement,
			lastScreenPath,
			referenceFieldPath,
			renderOptions,
			parentRepeat: repeat,
			localizer,
			converter
		});

		if (screenState === undefined) {
			return undefined;
		}

		repeatStaticState = createRepeatStaticState(repeat.element, repeat.formModelPath);

		locationStack.push(screenState);
	} else {
		if (
			isHidden({
				formModelElement: editableElement.formModelElement,
				dataContext: elementDataContext,
				state
			})
		) {
			return undefined;
		}

		locationStack.push(
			createScreenState(lastScreenPath, screenDataContext, currentLocation, { formModelPath })
		);
	}

	return {
		formModelPath: editableElement.relativeFormModelPath,
		locationStack,
		sectionsCollapse: createOpenSectionStates(state, editableElement),
		repeatStaticState
	};
}

/**
 * The screen path consists of every model path of screen that have to be
 * visited to reach a certain editable element.
 *
 * Returns the screen paths from top to bottom, e.g. the first entry
 * is always the top level screen.
 */
function getScreenPaths(
	state: EngineState,
	{ relativeFormModelPath }: EditableElement
): ReadonlyArray<ModelPath> {
	const formModel = ModelSelectors.formModel()(state);
	const screenPath: ModelPath[] = [];
	for (let i = 0; i < relativeFormModelPath.length; i++) {
		const path = relativeFormModelPath.slice(0, i);
		const element = findElementByFormModelPath(formModel, path);
		if (isFormModelScreen(element)) {
			screenPath.push(path);
		}
	}

	return screenPath;
}

/**
 * Create a simple location stack.
 * This means that only the current locationPath and
 * path are set.
 * No focused component or repeat state are defined for these
 * stack entries.
 */
function createSimpleLocationStack(
	state: EngineState,
	screenPaths: ReadonlyArray<ModelPath>,
	contexts: ReadonlyArray<EntityInstancePath>
): EngineStore.ScreenState[] | undefined {
	const locationStack = contexts
		.slice(0, Math.min(contexts.length, screenPaths.length))
		.map((c, i) => createScreenState(screenPaths[i], c));

	/**
	 * Adds missing screen states to the location stack.
	 * This is the case if contexts.length < screenPaths.length - 1.
	 */
	for (let i = contexts.length; i < screenPaths.length; i++) {
		const context = findContextOfScreen(state, screenPaths[i], locationStack[i - 1].path);
		if (context === undefined) {
			return undefined;
		}
		locationStack.push(createScreenState(screenPaths[i], context));
	}

	return locationStack;
}

function findContextOfScreen(
	state: EngineState,
	screenPath: ModelPath,
	parentContext: EntityInstancePath
): EntityInstancePath | undefined {
	const formModel = ModelSelectors.formModel()(state);
	const documentModel = ModelSelectors.documentModel()(state);
	const document = DataSelectors.relevantDocument()(state) as GroupInstance;

	const repeatPath = screenPath.slice(0, screenPath.length - 1);
	const element = findElementByFormModelPath(formModel, repeatPath);
	if (element === undefined || !isFormModelRepeat(element)) {
		return undefined;
	}

	const path = getDocumentPath(documentModel, element.groupPath, parentContext);

	// If the group document path references all rows, set it to the first row
	const contextPath = [
		...path.slice(0, path.length - 1),
		setIndexToAtLeastOne(path[path.length - 1])
	];
	return DocumentUtils.exists(document, contextPath) ? contextPath : undefined;
}

/** @internal  */
function createScreenState(
	locationPath: ModelPath,
	path: EntityInstancePath,
	screenState?: EngineStore.ScreenState,
	focusedComponent?: EngineStore.FocusedComponent,
	repeatInstanceState?: ReadonlyObjectMap<EngineStore.Repeat.InstanceState>
): EngineStore.ScreenState {
	return {
		locationPath,
		path: path.map(setIndexToAtLeastOne),
		focusedComponent,
		focusedComponentRequestCount: screenState
			? focusedComponent
				? (screenState.focusedComponentRequestCount || 0) + 1
				: screenState.focusedComponentRequestCount
			: undefined,
		repeatInstanceState
	};
}

/** @internal */
function setIndexToAtLeastOne({
	elementName,
	index
}: {
	readonly elementName: string;
	readonly index: number;
}): { readonly elementName: string; readonly index: number } {
	return { elementName, index: Math.max(index, 1) };
}
/**
 * @internal
 *
 * Creates all necessary section states for a given component, so that the element is not hidden by
 * a collapsible parent section.
 */
function createOpenSectionStates(
	state: EngineState,
	editableElement: EditableElement
): ReadonlyArray<{ path: ModelPath; collapse: boolean }> {
	const formModel = ModelSelectors.formModel()(state);

	const elementPath = editableElement.relativeFormModelPath;
	const sectionsCollapsed = [];
	for (let i = 0; i < elementPath.length - 1; i++) {
		const path = elementPath.slice(0, i + 1);
		const parent = findElementByFormModelPath(formModel, path);
		if (parent && isFormModelSection(parent)) {
			sectionsCollapsed.push({
				path,
				collapse: false
			});
		}
	}

	return sectionsCollapsed;
}

/** @internal  */
function createRepeatInstanceState(
	repeat: FormModel.Repeat,
	modelPath: ModelPath,
	rowIndex: number,
	expandedRowPath?: EntityInstancePath
): ReadonlyObjectMap<EngineStore.Repeat.InstanceState> {
	return {
		[ModelPath.toString(modelPath)]: {
			page:
				repeat.pageSize && repeat.pageSize > 0
					? Math.floor(rowIndex / repeat.pageSize) + 1
					: undefined,
			expandedRowPath
		}
	};
}

function createRepeatStaticState(
	repeat: FormModel.Repeat,
	modelPath: ModelPath
): ReadonlyObjectMap<EngineStore.Repeat.StaticState> | undefined {
	if (repeat.initialSorting) {
		const col =
			repeat.repeatOverviewColumn &&
			repeat.repeatOverviewColumn.find(c => c.id === repeat.initialSorting);

		const columnPath = [...modelPath, { elementName: repeat.initialSorting }];

		const repeatStaticStateEntry: EngineStore.Repeat.StaticState = col
			? {
					sortingState: {
						orderPath: columnPath,
						sorting: col.preferredSorting
							? (col.preferredSorting.toLowerCase() as SortingOrder)
							: "asc"
					}
				}
			: {};

		return {
			[ModelPath.toString(modelPath)]: repeatStaticStateEntry
		};
	} else {
		return undefined;
	}
}

/**
 * Checks if a repetition of a repeatable group exists in the document.
 *
 * @param document The document which is checked
 * @param groupRepetitionDocumentPath The EntityInstancePath referencing the group repetition for which is checked
 *
 * @internal
 */
function isRepeatRowPresent(
	document: GroupInstance,
	groupRepetitionDocumentPath: EntityInstancePath
): boolean {
	/*
	 * First, check if the group has repetitions at all.
	 * This is necessary since the kernel for some group related rules
	 * returns error field paths containing references to repeatable groups
	 * without specifying the repetition (index: 0).
	 * But we can only show correction mode items for fields in existing repetitions.
	 */
	const groupDocumentPath = getGroupPathFromGroupRepetitionPath(groupRepetitionDocumentPath);
	const rows = DocumentUtils.getRows(document, groupDocumentPath);
	if (rows.length === 0) {
		return false;
	}
	// Check for the concrete repetition
	if (!DocumentUtils.exists(document, groupRepetitionDocumentPath)) {
		return false;
	}

	return true;
}

/**
 * Returns a EntityInstancePath referencing a concrete repetition of a repeatable group.
 *
 * This is either done by taking the path slice to the repeatable group of
 * the given referenced field path, when the field is defined on the repeatable group.
 * Or it is done by generating the path to the first repetition of the group
 * defined by the given group path, when the field is from another context.
 *
 * @param referenceFieldPath The document path to the error field
 * @param groupDocumentPath The document path to the repeatable group
 *
 * @internal
 */
function getGroupRepetitionDocumentPath(
	referenceFieldPath: EntityInstancePath,
	groupDocumentPath: EntityInstancePath
): EntityInstancePath {
	let groupRepetitionDocumentPath: EntityInstancePath;

	// Assuming the referenceFieldPath references a field of the repeated group,
	// the parent should be a group repetition
	const referenceFieldParentPathSlice = referenceFieldPath.slice(0, referenceFieldPath.length - 1);
	// We derive the group path from the repetition path by setting the last index to zero
	const referenceFieldParentPath = getGroupPathFromGroupRepetitionPath(
		referenceFieldParentPathSlice
	);

	/*
	 * If the assumption was correct, the given groupDocumentPath and
	 * the derived EntityInstancePath should be equal. Then we can return the parent.
	 *
	 * Else the assumption was wrong. Then the referenceFieldPath references
	 * a field from a higher context, which is used in the repeat.
	 * In this case we create a repetition path by setting the last index of
	 * the group path to 1. This means showing a link only for the first repeat row.
	 */
	if (DocumentPath.equal(groupDocumentPath, referenceFieldParentPath)) {
		groupRepetitionDocumentPath = referenceFieldParentPathSlice;
	} else {
		groupRepetitionDocumentPath = [
			...groupDocumentPath.slice(0, groupDocumentPath.length - 1),
			setIndexToAtLeastOne(groupDocumentPath[groupDocumentPath.length - 1])
		];
	}

	return groupRepetitionDocumentPath;
}

/**
 * Turns the EntityInstancePath of a group repetition into a EntityInstancePath of a group
 * by setting the last index to zero.
 * @param groupRepetitionDocumentPath The EntityInstancePath of the group repetition
 *
 * @internal
 */
function getGroupPathFromGroupRepetitionPath(
	groupRepetitionDocumentPath: EntityInstancePath
): EntityInstancePath {
	return [
		...groupRepetitionDocumentPath.slice(0, groupRepetitionDocumentPath.length - 1),
		{
			elementName: groupRepetitionDocumentPath[groupRepetitionDocumentPath.length - 1].elementName,
			index: 0
		}
	];
}

function createScreenStateForInlineAndEmbeddedRepeat(options: {
	screenDataContext: EntityInstancePath;
	elementDataContext: EntityInstancePath;
	referenceFieldPath: EntityInstancePath;
	editableElement: EditableElement;
	currentLocation: EngineStore.ScreenState;
	renderOptions: FormModelMap.RenderOptions;
	lastScreenPath: ModelPath;
	parentRepeat: { element: FormModel.Repeat; formModelPath: ModelPath };
	localizer: Localizer;
	converter: ValueConversion;
}): EngineStore.ScreenState | undefined {
	const {
		screenDataContext,
		elementDataContext,
		referenceFieldPath,
		renderOptions,
		editableElement,
		lastScreenPath,
		currentLocation,
		parentRepeat
	} = options;
	const formModelPath = editableElement.relativeFormModelPath;

	const documentModel = ModelSelectors.documentModel()(renderOptions.state);
	const document = DataSelectors.relevantDocument()(renderOptions.state) as GroupInstance;

	// check if the repeatable group exists in the document
	const groupDocumentPath = getDocumentPath(
		documentModel,
		parentRepeat.element.groupPath,
		screenDataContext
	);
	if (!DocumentUtils.exists(document, groupDocumentPath)) {
		return undefined;
	}

	// check if the referenced repetition exists in the document
	const groupRepetitionDocumentPath = getGroupRepetitionDocumentPath(
		referenceFieldPath,
		groupDocumentPath
	);
	if (!isRepeatRowPresent(document, groupRepetitionDocumentPath)) {
		return undefined;
	}

	if (
		isHidden({
			formModelElement: editableElement.formModelElement,
			dataContext: elementDataContext,
			state: renderOptions.state
		})
	) {
		return undefined;
	}

	// Scroll handler indices start with zero
	const index = ModelPath.equal(
		referenceFieldPath.slice(0, groupRepetitionDocumentPath.length),
		groupRepetitionDocumentPath
	)
		? Math.max(0, referenceFieldPath[groupRepetitionDocumentPath.length - 1].index - 1)
		: 0;

	const repeatDocumentPath = InternalDocumentPath.allIndicesPath(groupDocumentPath);
	const fieldIndex = ModelPath.equal(
		referenceFieldPath.slice(0, groupRepetitionDocumentPath.length),
		groupRepetitionDocumentPath
	)
		? referenceFieldPath[groupRepetitionDocumentPath.length - 1].index
		: 0;

	const rowIndex = calculateViewIndexOfRow(
		parentRepeat.element,
		parentRepeat.formModelPath,
		repeatDocumentPath,
		renderOptions.state,
		options.converter,
		options.localizer,
		renderOptions.config.externalEnumerationProvider,
		fieldIndex - 1
	);

	const expandedRowPath = isFormModelEmbeddedRepeat(parentRepeat.element)
		? groupRepetitionDocumentPath
		: undefined;

	const repeatInstanceState = createRepeatInstanceState(
		parentRepeat.element,
		parentRepeat.formModelPath,
		rowIndex ?? 0,
		expandedRowPath
	);
	return createScreenState(
		lastScreenPath,
		screenDataContext,
		currentLocation,
		{ formModelPath, index },
		repeatInstanceState
	);
}

function allParentsVisible(options: {
	formModelPath: ModelPath;
	state: EngineState;
	allElementContexts: ReadonlyArray<EntityInstancePath>;
	screenPaths: ReadonlyArray<ModelPath>;
}): boolean {
	const { formModelPath, state, allElementContexts, screenPaths } = options;
	const formModel = ModelSelectors.formModel()(state);
	for (let i = 1; i < formModelPath.length - 1; i++) {
		const parentFormModelPath = formModelPath.slice(0, i);
		const element = findElementByFormModelPath(formModel, parentFormModelPath);

		// screens are given from top down, so we have to search in reverse
		// to find the most specific one for the current element
		const currentScreenIndex = screenPaths.findLastIndex(screenPath =>
			ModelPath.contains(parentFormModelPath, screenPath)
		);
		const screenDataContext = allElementContexts.at(currentScreenIndex);

		if (
			element !== undefined &&
			screenDataContext !== undefined &&
			isHidden({
				formModelElement: element,
				dataContext: screenDataContext,
				state
			})
		) {
			return false;
		}
	}

	return true;
}

function potentialParentRepeat(
	formModel: FormModel,
	formModelPath: ModelPath
): { element: FormModel.Repeat; formModelPath: ModelPath } | undefined {
	const workingPath = [...formModelPath];

	while (workingPath.length > 0) {
		const element = findElementByFormModelPath(formModel, workingPath);
		if (element === undefined) {
			return undefined;
		}

		if (isFormModelEmbeddedRepeat(element) || isFormModelInlineRepeat(element)) {
			return { element: element, formModelPath: workingPath };
		}

		workingPath.pop();
	}
	return undefined;
}
