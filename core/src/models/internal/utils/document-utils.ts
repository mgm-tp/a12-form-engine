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
	FieldInstanceValue,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { getDocumentPath } from "../../../back-end/utils/internal/path.js";
import { isFormModelControl } from "../../../models/internal/FormModelGuards.js";

import { findElementByFormModelPath } from "../findElementByFormModelPath.js";
import type { FormModel } from "../form-model.js";

import * as DocumentModelUtils from "./document-model-utils.js";
import { createGroupInstance } from "./model-utils.js";

/**
 * Utility functions for the EntityInstancePath.
 */
export const DocumentPath = {
	/**
	 * @returns true if the first given EntityInstancePath contains the second given EntityInstancePath as a prefix
	 */
	contains(p1: EntityInstancePath, p2: EntityInstancePath): boolean {
		if (p2.length > p1.length) {
			return false;
		}
		return !p2.some(
			(element, idx) =>
				p1[idx].elementName !== element.elementName || p1[idx].index !== element.index
		);
	},

	/**
	 * Function to compare two EntityInstancePaths.
	 * @returns true if the given paths are equal
	 */
	equal(p1: EntityInstancePath, p2: EntityInstancePath): boolean {
		return (
			p1.length === p2.length &&
			p1.every((p1e, i) => p1e.elementName === p2[i].elementName && p1e.index === p2[i].index)
		);
	},

	/**
	 * Function to create an EntityInstancePath from string.
	 * @param str path as string
	 * @returns The created EntityInstancePath
	 */
	fromString(str: string): EntityInstancePath {
		const normalizedIdentifier = str.startsWith("/") ? str.slice(1) : str;
		return normalizedIdentifier.length > 0
			? normalizedIdentifier.split("/").map(segment => {
					const openBracket = segment.indexOf("[");
					const elementName = segment.substring(0, openBracket);
					const indexString = segment.substring(openBracket + 1, segment.length - 1);
					return { elementName, index: Number(indexString) };
				})
			: [];
	},

	/**
	 * Function to compare two EntityInstancePaths by matching an index of 0 to any other index
	 * @returns true if the given paths match
	 */
	matches(p1: EntityInstancePath, p2: EntityInstancePath): boolean {
		return (
			p1.length === p2.length &&
			p1.every(
				(p1e, i) => p1e.elementName === p2[i].elementName && indexMatch(p1e.index, p2[i].index)
			)
		);
	},

	/**
	 * Function to convert an EntityInstancePath to a string.
	 */
	toString(path: EntityInstancePath): string {
		return "/" + path.map(segment => `${segment.elementName}[${segment.index}]`).join("/");
	}
};

/** @internal */
export const InternalDocumentPath = {
	/**
	 * Create a regular expression where indices which are equal to 0 are
	 * replaced by '\d+'
	 */
	toRegExp(path: EntityInstancePath): RegExp {
		const regExpString = path
			.map(e => `${e.elementName}\\[${e.index === 0 ? "\\d+" : e.index}\\]`)
			.join("\\/");
		return new RegExp(regExpString);
	},

	toStringOrRegExp(path: EntityInstancePath): RegExp | string {
		return path.some(i => i.index === 0)
			? InternalDocumentPath.toRegExp(path)
			: DocumentPath.toString(path);
	},

	parentPath(path: EntityInstancePath): EntityInstancePath {
		return path.length > 0 ? path.slice(0, -1) : path;
	},

	allIndicesPath(path: EntityInstancePath): EntityInstancePath {
		return path.length > 0
			? [
					...InternalDocumentPath.parentPath(path),
					{
						elementName: path[path.length - 1].elementName,
						index: 0
					}
				]
			: path;
	},

	/**
	 * Returns the row index of the given repeat row document path
	 * or undefined if the path is empty or not of a concrete row.
	 */
	rowIndex(path: EntityInstancePath): number | undefined {
		return path.length > 0 && path[path.length - 1].index > 0
			? path[path.length - 1].index
			: undefined;
	}
};

function indexMatch(index1: number, index2: number): boolean {
	if (index1 === index2) {
		return true;
	}

	return index1 === 0 || index2 === 0;
}

/** @internal */
export type Visitor = (visit: {
	path: EntityInstancePath;
	element?: GroupInstance | FieldInstanceValue;
	modelElement: DocumentModel.Element;
}) => void;

/** @internal */
export type DescendPredicate = (visit: {
	path: EntityInstancePath;
	element?: GroupInstance;
	modelElement: DocumentModel.Group;
}) => boolean;

/** @internal */
export function walk(
	start: GroupInstance | null,
	startModel: DocumentModel.Group,
	visitor: Visitor,
	descend?: DescendPredicate
): void {
	function walkRecursively(
		element: GroupInstance | FieldInstanceValue | undefined,
		path: EntityInstancePath,
		modelElement: DocumentModel.Element
	): void {
		visitor({ path, element, modelElement });
		if (
			modelElement.type === "Group" &&
			(element === undefined || DocumentUtils.isGroupInstance(element)) &&
			// descend into a non-repeatable group even if it is missing in the document
			(modelElement.repeatability === 1 || element !== undefined) &&
			(descend === undefined || descend({ path, element, modelElement }))
		) {
			for (const childModelElement of modelElement.elements) {
				const child =
					element !== undefined && DocumentUtils.isGroupInstance(element)
						? element[childModelElement.name]
						: undefined;
				if (childModelElement.type === "Group" && childModelElement.repeatability === 1) {
					// unique group - with or without data
					walkRecursively(
						child as GroupInstance,
						[...path, { elementName: childModelElement.name, index: 1 }],
						childModelElement
					);
				} else if (childModelElement.type === "Field") {
					// field
					walkRecursively(
						child as GroupInstance,
						[...path, { elementName: childModelElement.name, index: 1 }],
						childModelElement
					);
				} else if (Array.isArray(child)) {
					/**
					 * Repeatable group with existing data in document.
					 *
					 * Note, that this condition needs to be evaluated after the condition, that
					 * checks for type === "Field" (field instance values can be arrays as well).
					 * Otherwise, date ranges would be interpreted as repeatable group instances.
					 */
					for (let index = 0; index < child.length; index++) {
						walkRecursively(
							child[index],
							[...path, { elementName: childModelElement.name, index: index + 1 }],
							childModelElement
						);
					}
				}
			}
		}
	}
	walkRecursively(start, [], startModel);
}

const documentService = new DocumentServiceFactory().getDocumentService();

/**
 * @internal
 */
export const DocumentUtils = {
	getRows(
		json: GroupInstance,
		path: EntityInstancePath
	): ReadonlyArray<{ [key: string]: FieldInstanceValue | GroupInstance | undefined }> {
		const rows = DocumentUtils.getValue({ document: json, path });
		return Array.isArray(rows)
			? (rows as { [key: string]: FieldInstanceValue | GroupInstance }[])
			: [];
	},

	getGroupValue(json: GroupInstance, path: EntityInstancePath): GroupInstance | null {
		const value = DocumentUtils.getValue({ document: json, path: path });
		// the value either has to be an object or not present
		if (DocumentUtils.isGroupInstance(value) || value === null) {
			return value;
		} else {
			throw new Error("data context is no group: " + DocumentPath.toString(path));
		}
	},

	getAssignedObject(
		document: GroupInstance,
		path: EntityInstancePath
	): GroupInstance[] | GroupInstance | FieldInstanceValue | undefined {
		/**
		 * getAssignedObject(json, path) expects path to NOT contain any segments
		 * with an index of 0 (except for the last segment)
		 */
		if (path.some(({ index }, pathIdx) => pathIdx < path.length - 1 && index === 0)) {
			return undefined;
		}
		return documentService.getAssignedObject(document, path);
	},

	/**
	 * @internal
	 * Function to retrieve the value of the document.
	 */
	getValue({
		document: json,
		path
	}: {
		readonly document: GroupInstance;
		readonly path: EntityInstancePath;
	}): GroupInstance[] | GroupInstance | FieldInstanceValue {
		const value = DocumentUtils.getAssignedObject(json, path);

		return value ?? null;
	},

	exists(json: GroupInstance, path: EntityInstancePath): boolean {
		return DocumentUtils.getAssignedObject(json, path) !== undefined;
	},

	addNewRow(
		documentElement: GroupInstance,
		path: EntityInstancePath,
		row: GroupInstance,
		modelElement: DocumentModel,
		formModel: FormModel
	): GroupInstance {
		const groupPath = [
			...path.slice(0, path.length - 1),
			{ elementName: path[path.length - 1].elementName, index: 0 }
		];
		const rows = DocumentUtils.getValue({ document: documentElement, path: groupPath });

		const newRows = rows !== null && areGroupInstances(rows) ? [...rows, row] : [row];
		let newDocument = DocumentUtils.setValue(documentElement, groupPath, newRows, modelElement);

		newDocument = initializeContextsWithInitialValues(formModel, modelElement, newDocument, [
			...path.slice(0, path.length - 1),
			{ elementName: path[path.length - 1].elementName, index: newRows.length }
		]);

		return newDocument;
	},

	removeRow(
		json: GroupInstance,
		path: EntityInstancePath,
		modelElement: DocumentModel
	): GroupInstance {
		const rowIndex = path[path.length - 1].index - 1;
		const groupPath = [
			...path.slice(0, path.length - 1),
			{ elementName: path[path.length - 1].elementName, index: 0 }
		];

		if (rowIndex >= 0) {
			const rows = DocumentUtils.getValue({ document: json, path: groupPath });
			if (rows !== null && areGroupInstances(rows)) {
				const newRows = [...rows.slice(0, rowIndex), ...rows.slice(rowIndex + 1)];
				const newValue = newRows.length === 0 ? undefined : newRows;
				return DocumentUtils.setValue(json, groupPath, newValue, modelElement);
			}
		} else if (rowIndex === -1) {
			return DocumentUtils.setValue(json, groupPath, undefined, modelElement);
		} else {
			throw new Error("cannot handle index < -1");
		}

		return json;
	},

	moveRow(
		json: GroupInstance,
		path: EntityInstancePath,
		delta: number,
		modelElement: DocumentModel
	): GroupInstance {
		const rowIndex = path[path.length - 1].index - 1;
		const groupPath = [
			...path.slice(0, path.length - 1),
			{ elementName: path[path.length - 1].elementName, index: 0 }
		];
		const rows = DocumentUtils.getValue({ document: json, path: groupPath });
		if (rows !== null && areGroupInstances(rows)) {
			const arWithOutEntry = rows.filter((_, i) => i !== rowIndex);
			const newRows = [
				...arWithOutEntry.slice(0, rowIndex + delta),
				rows[rowIndex],
				...arWithOutEntry.slice(rowIndex + delta)
			];

			const newDocument = DocumentUtils.setValue(json, groupPath, newRows, modelElement);
			return newDocument;
		}

		return json;
	},

	// Just sets the value if it changed
	setValue(
		documentElement: GroupInstance,
		path: EntityInstancePath,
		value: FieldInstanceValue | readonly GroupInstance[] | Readonly<GroupInstance> | undefined,
		modelElement: DocumentModel
	): GroupInstance {
		const oldValue = DocumentUtils.getAssignedObject(documentElement, path);

		const element = DocumentModelUtils.findByPath(modelElement, path);
		const isRepeatableGroupUpdate =
			element.type === "Group" && element.repeatability > 1 && Array.isArray(value);

		return DocumentUtils.isValueEqual(value, oldValue)
			? documentElement
			: documentService.updateEntityInstance(
					documentElement,
					isRepeatableGroupUpdate
						? [...path.slice(0, -1), { elementName: path[path.length - 1].elementName, index: 0 }]
						: path,
					value,
					modelElement
				);
	},

	isValueEqual(
		value:
			| ReadonlyArray<GroupInstance | undefined>
			| Readonly<GroupInstance>
			| FieldInstanceValue
			| undefined,
		oldValue?: FieldInstanceValue | object
	): boolean {
		return (
			oldValue === value ||
			(oldValue instanceof Date && value instanceof Date && oldValue.getTime() === value.getTime())
		);
	},

	isGroupInstance(
		element: GroupInstance | FieldInstanceValue | object | undefined
	): element is GroupInstance {
		return (
			element !== null &&
			typeof element === "object" &&
			!Array.isArray(element) &&
			!(element instanceof Date)
		);
	},

	isGroupInstances(element: unknown): element is GroupInstance[] {
		return Array.isArray(element) && element.every(DocumentUtils.isGroupInstance);
	},

	isFieldInstanceValue(
		element: GroupInstance | FieldInstanceValue | object | undefined
	): element is FieldInstanceValue {
		return (
			element === null ||
			typeof element === "string" ||
			typeof element === "number" ||
			typeof element === "boolean" ||
			element instanceof Date ||
			(Array.isArray(element) && element.every(e => e instanceof Date))
		);
	}
};

function hasRepeatableAncestor(documentModel: DocumentModel, path: ModelPath): boolean {
	let currentElement: DocumentModel.Element = documentModel.content.modelRoot;
	for (const segment of path) {
		if (currentElement.type === "Group") {
			if (currentElement.repeatability > 1) {
				return true;
			} else {
				const next: DocumentModel.Group | DocumentModel.Field | undefined =
					currentElement.elements.find(child => child.name === segment.elementName);
				if (next !== undefined) {
					currentElement = next;
				} else {
					throw new Error("Model element not found: " + segment.elementName);
				}
			}
		}
	}
	return false;
}

/**
 * Function to create an empty document which
 * is filled with the initial values from the
 * form-model.
 * @param documentModel The document model to use
 * @param formModel The form model containing the initial values
 */
export function createEmptyDocument(documentModel: DocumentModel, formModel: FormModel): object {
	let doc = {};
	for (const elementPath of Object.keys(formModel.content.fieldConfiguration.fieldMap)) {
		const fce = formModel.content.fieldConfiguration.fieldMap[elementPath];
		if (
			fce?.initialValueTyped !== undefined &&
			!hasRepeatableAncestor(documentModel, fce.elementPath)
		) {
			const docPath = fce.elementPath.map(segment => ({
				elementName: segment.elementName,
				index: 1
			}));
			doc = DocumentUtils.setValue(doc, docPath, fce.initialValueTyped, documentModel);
		}
	}

	doc = initializeContextsWithInitialValues(formModel, documentModel, doc, []);

	doc = createInitialRows({ documentModel, formModel, document: doc });

	return doc;
}

/**@internal */
export const EmptyDocument = {
	/**
	 * Function to create an empty document which
	 * is filled with the initial values from the
	 * form-model.
	 * @param documentModel: The document model to use
	 * @param formModel: The form model containing the initial values
	 */
	createEmptyDocument
};

/** @internal */
export interface CreateInitialRowProps {
	readonly documentModel: DocumentModel;
	readonly formModel: FormModel;
	readonly document: GroupInstance;
	readonly rowPathOuterGroup?: EntityInstancePath;
}

function excludeRootGroup(stringPath: string): boolean {
	return stringPath !== "/";
}

/** @internal */
export function createInitialRows(props: CreateInitialRowProps): GroupInstance {
	let newDocument = props.document;

	// Exclude root group because it does not have rows.
	for (const groupPath of Object.keys(props.formModel.content.groupConfiguration.groupMap).filter(
		excludeRootGroup
	)) {
		const gce = props.formModel.content.groupConfiguration.groupMap[groupPath];
		if (!gce?.numberOfInitialRows) {
			continue;
		}

		const documentModelGroup = DocumentModelUtils.findByPath(props.documentModel, gce.groupPath);

		const outerGroup = props.rowPathOuterGroup
			? DocumentModelUtils.findByPath(props.documentModel, props.rowPathOuterGroup)
			: undefined;

		const repeatable =
			documentModelGroup.type === "Group" ? documentModelGroup.repeatability > 1 : false;

		// index of the last element will be overridden by "addNewRow",
		// the index of the groups nested in outer group must be 1 since they can not be repeatable
		const docPath = props.rowPathOuterGroup
			? [
					...props.rowPathOuterGroup,
					...gce.groupPath
						.slice(props.rowPathOuterGroup.length, gce.groupPath.length)
						.map(segment => ({
							elementName: segment.elementName,
							index: 1
						}))
				]
			: gce.groupPath.map(segment => ({
					elementName: segment.elementName,
					index: 1
				}));

		const parentPath = DocumentModelUtils.computeGranularity(
			props.documentModel,
			gce.groupPath.slice(0, -1)
		);
		const parentGroup = DocumentModelUtils.findByPath(props.documentModel, parentPath);

		const isNotNested = !outerGroup && !hasRepeatableAncestor(props.documentModel, gce.groupPath);
		const isChildOfOuterGroup = outerGroup && outerGroup.id === parentGroup.id;

		if (repeatable && (isNotNested || isChildOfOuterGroup)) {
			for (let i = 0; i < gce.numberOfInitialRows; i++) {
				const newRow = createGroupInstance(documentModelGroup, props.formModel, gce.groupPath);
				newDocument = DocumentUtils.addNewRow(
					newDocument,
					docPath,
					newRow,
					props.documentModel,
					props.formModel
				);
			}
		}
	}

	return newDocument;
}

function areGroupInstances(
	value: GroupInstance[] | GroupInstance | FieldInstanceValue | undefined
): value is GroupInstance[] {
	return Array.isArray(value) && !(value[0] instanceof Date);
}

// functions for indexed controls -->

/** @internal */
export const IndexedControl = {
	getContextOfControlWithIndex,
	initializeRowOfControlWithIndex,
	getSemanticIndexField
};

/**
 * @internal
 *
 * Returns the context path for the given field path and a control index.
 *
 * The `currentDataContext` is outside of the actual context of the field.
 * Therefore, it is necessary to calculate the index of the row in which the
 * field is contained.
 */
function getContextOfControlWithIndex(options: {
	elementPath: ModelPath;
	controlIndex?: FormModel.ControlIndex;
	documentModel: DocumentModel;
	document: GroupInstance;
	currentDataContext: EntityInstancePath;
}): EntityInstancePath {
	const { elementPath, controlIndex, documentModel, document, currentDataContext } = options;

	if (controlIndex === undefined) {
		return currentDataContext;
	}

	const granularity = DocumentModelUtils.computeGranularity(documentModel, elementPath);
	const granularityDocumentPath = getDocumentPath(documentModel, granularity, currentDataContext);

	if (granularityDocumentPath.length === 0 || granularityDocumentPath.at(-1)?.index !== 0) {
		throw Error(
			`Cannot find the nested context in ${DocumentPath.toString(granularityDocumentPath)}`
		);
	}

	const index = calculateContextIndex(
		documentModel,
		document,
		granularityDocumentPath,
		controlIndex
	);

	return [
		...granularityDocumentPath.slice(0, -1),
		{ ...granularityDocumentPath[granularityDocumentPath.length - 1], index }
	];
}

/**
 * The current context is outside of the actual context of the field.
 * Therefore, it is necessary to calculate the index of the row in which the
 * field is contained.
 *
 * If no matching row is found and the index is semantic, then the current row
 * count plus one is used.
 */
function calculateContextIndex(
	documentModel: DocumentModel,
	document: GroupInstance,
	contextDocumentPath: EntityInstancePath,
	controlIndex: FormModel.ControlIndex
): number {
	if (controlIndex.type === "NUMERIC") {
		return controlIndex.typedValue;
	} else {
		const indexField = getSemanticIndexField(documentModel, contextDocumentPath);
		if (indexField === undefined) {
			throw Error(`Cannot find index field of ${ModelPath.toString(contextDocumentPath)}.`);
		}

		const rows = DocumentUtils.getRows(document, contextDocumentPath);
		const rowIndex = rows.findIndex(x => x[indexField.name] === controlIndex.typedValue);

		// The index is kernel based (starting with 1 not 0)
		return rowIndex < 0 ? rows.length + 1 : rowIndex + 1;
	}
}

/**
 * @internal
 *
 * Returns the index field of a repeatable group
 */
function getSemanticIndexField(
	documentModel: DocumentModel,
	groupPath: ModelPath
): DocumentModel.Field | undefined {
	const element = DocumentModelUtils.findByPath(documentModel, groupPath);
	return element.type === "Group" && element.indexFieldName
		? element.elements.find(
				(e): e is DocumentModel.Field => e.type === "Field" && e.name === element.indexFieldName
			)
		: undefined;
}

/**
 * @internal
 *
 * Initialize a newly created document with the control with index. If rows are
 * missing for controls with index, then this function creates the required rows.
 */
function initializeContextsWithInitialValues(
	formModel: FormModel,
	documentModel: DocumentModel,
	document: GroupInstance,
	contextPath: EntityInstancePath
): GroupInstance {
	let doc = document;

	const gc = formModel.content.groupConfiguration.groupMap[ModelPath.toString(contextPath)];
	if (gc?.indicesOfControlsOfNestedGroups === undefined) {
		return doc;
	}

	for (const { groupPath, semantic, numeric } of gc.indicesOfControlsOfNestedGroups) {
		const group = DocumentModelUtils.findByPath(documentModel, groupPath);

		if (semantic.length > 0) {
			const indexField = getSemanticIndexField(documentModel, groupPath);
			if (indexField === undefined) {
				throw Error(`Cannot find index field of ${ModelPath.toString(groupPath)}`);
			}

			// First add row for semantic index
			for (let i = 0; i < semantic.length; i++) {
				const rowPath = buildPath(contextPath, groupPath, i + 1);
				const row = createGroupInstance(group, formModel, rowPath);
				doc = DocumentUtils.addNewRow(
					doc,
					rowPath,
					{ ...row, [indexField.name]: semantic[i] },
					documentModel,
					formModel
				);
			}
		}

		// Add further rows until the number of rows is equal the max value of all numeric indices
		for (let index = semantic.length + 1; index <= Math.max(...numeric); index++) {
			const rowPath = buildPath(contextPath, groupPath, index);
			const row = createGroupInstance(group, formModel, rowPath);
			doc = DocumentUtils.addNewRow(doc, rowPath, row, documentModel, formModel);
		}
	}

	return doc;
}

function buildPath(
	contextPath: EntityInstancePath,
	groupPath: ModelPath,
	index: number
): EntityInstancePath {
	return [
		...contextPath,
		...groupPath
			.slice(contextPath.length, groupPath.length - 1)
			.map(x => ({ ...x, index: 1 }))
			.concat([{ ...groupPath[groupPath.length - 1], index }])
	];
}

/**
 * @internal
 *
 * This function is used if a value of a control with index changes.
 *
 * If rows are missing for controls with index, then this function creates the required rows.
 */
function initializeRowOfControlWithIndex(
	formModel: FormModel,
	formModelElementPath: ModelPath,
	documentModel: DocumentModel,
	document: GroupInstance,
	fieldPath: EntityInstancePath
): GroupInstance {
	let newDocument = document;

	const formModelElement = findElementByFormModelPath(formModel, formModelElementPath);
	if (formModelElement === undefined || !isFormModelControl(formModelElement)) {
		return newDocument;
	}

	const controlIndex = formModelElement.index;
	if (controlIndex === undefined) {
		return newDocument;
	}

	const contextGroupPath = DocumentModelUtils.computeGranularity(documentModel, fieldPath);
	const contextGroup = DocumentModelUtils.findByPath(documentModel, contextGroupPath);

	if (controlIndex.type === "SEMANTIC") {
		const indexField = getSemanticIndexField(documentModel, contextGroupPath);
		if (indexField === undefined) {
			throw Error(`Cannot find index field of ${ModelPath.toString(contextGroupPath)}`);
		}

		const contextEntityInstancePath = fieldPath.slice(0, contextGroupPath.length);
		const row = DocumentUtils.getValue({
			document: newDocument,
			path: contextEntityInstancePath
		});

		// Only set value if it does not exists
		if (row === null) {
			const row = createGroupInstance(contextGroup, formModel, contextEntityInstancePath);
			newDocument = DocumentUtils.addNewRow(
				newDocument,
				contextEntityInstancePath,
				{ ...row, [indexField.name]: controlIndex.typedValue },
				documentModel,
				formModel
			);
		}
	} else {
		const { elementName, index } = fieldPath[contextGroupPath.length - 1];

		const allRowPath = [
			...fieldPath.slice(0, contextGroupPath.length - 1),
			{ elementName, index: 0 }
		];

		const rowCount = DocumentUtils.getRows(newDocument, allRowPath).length;

		for (let i = rowCount + 1; i <= index; i++) {
			const rowPath = [
				...fieldPath.slice(0, contextGroupPath.length - 1),
				{ elementName, index: i }
			];
			const row = createGroupInstance(contextGroup, formModel, rowPath);
			newDocument = DocumentUtils.addNewRow(newDocument, rowPath, row, documentModel, formModel);
		}
	}

	return newDocument;
}
