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

import type { JSX } from "react";
import { useSelector } from "react-redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type {
	EnablementByButtonName,
	EnablementByRow
} from "@com.mgmtp.a12.formengine/formengine-core";
import {
	DefaultRepeatButtonNames,
	FormEngineSelectors,
	FormEngineViews
} from "@com.mgmtp.a12.formengine/formengine-core";
import type {
	DocumentModel,
	EntityInstancePath,
	FieldInstanceValue,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";

const documentService = new DocumentServiceFactory().getDocumentService();

export function TestCustomButtonEnablementEngine(
	props: FormEngineViews.FormEngineProps
): JSX.Element {
	const document = useSelector(FormEngineSelectors.dataState(props.activityId))
		.document as GroupInstance;
	const documentModel = useSelector(FormEngineSelectors.models(props.activityId))?.documentModel;

	if (!documentModel) {
		return <></>;
	}

	const byButtonNameMap = calculateButtonNameMap(document);
	const byRowMap = calculateByRowMap(document, documentModel);

	const newProps: FormEngineViews.FormEngineProps = {
		...props,
		enablements: {
			byButtonName: byButtonNameMap,
			byRow: byRowMap
		}
	};

	return <FormEngineViews.FormEngine {...newProps} />;
}

/**
 * Calculate a new EnablementByButtonName map depending on the current document.
 *
 * An entry for every event and navigation button on the first screen of the
 * form will be created with the corresponding values.
 */
function calculateButtonNameMap(document: GroupInstance): EnablementByButtonName {
	const disableButtonDocumentPath = createEntityInstancePath(["root"], ["disableButtons"]);
	const hideButtonDocumentPath = createEntityInstancePath(["root"], ["hideButtons"]);

	const disableButtonValue = documentService.getAssignedObject(document, disableButtonDocumentPath);
	const hiddenButtonValue = documentService.getAssignedObject(document, hideButtonDocumentPath);

	const disabled = disableButtonValue ? disableButtonValue === "disable" : undefined;
	const hidden = hiddenButtonValue ? hiddenButtonValue === "hidden" : undefined;

	return {
		["buttonAlwaysShown"]: {
			disabled,
			hidden
		},
		["buttonHiddenInReadonlyMode"]: {
			disabled,
			hidden
		},
		["buttonHiddenInEditMode"]: {
			disabled,
			hidden
		},
		["buttonDisabledInEditMode"]: {
			disabled,
			hidden
		},
		["buttonDisabledInReadonlyMode"]: {
			disabled,
			hidden
		},
		["navigationButtonAlwaysShown"]: {
			disabled,
			hidden
		},
		["navigationButtonHiddenInReadonlyMode"]: {
			disabled,
			hidden
		},
		["navigationButtonHiddenInEditMode"]: {
			disabled,
			hidden
		},
		["navigationButtonDisabledInEditMode"]: {
			disabled,
			hidden
		},
		["navigationButtonDisabledInReadonlyMode"]: {
			disabled,
			hidden
		}
	};
}

/**
 * Calculate a new EnablementByRow map depending on the current document.
 */
function calculateByRowMap(document: GroupInstance, documentModel: DocumentModel): EnablementByRow {
	let byRowMap: EnablementByRow = {};

	const inlineRepeatPath = createEntityInstancePath(["root"], ["repeatableGroupInlineRepeat", 0]);
	const inlineRepeatValue = getAndPrepareRepeatValue(document, documentModel, inlineRepeatPath);

	/**
	 * Calculate the map entries for the repeat "inline-repeat".
	 *
	 * Iterate over all instances of the corresponding repeatable group, i.e.
	 * all rows of the repeat. Determine if any of the row action buttons in
	 * these rows should be shown/hidden or enabled/disabled and update the
	 * current map accordingly.
	 */
	if (areGroupInstances(inlineRepeatValue)) {
		for (let i = 0; i < inlineRepeatValue.length; i++) {
			byRowMap = updateRowAction({
				currentMap: byRowMap,
				document,
				repeat: inlineRepeatValue,
				elementNameAllRows: "disableRowActionForAllRows",
				elementNameOneRow: "disableRowAction",
				elementNameValueEnablement: "shouldDisable",
				row: i,
				enablement: "disabled",
				repeatName: "inline-repeat"
			});

			byRowMap = updateRowAction({
				currentMap: byRowMap,
				document,
				repeat: inlineRepeatValue,
				elementNameAllRows: "hideRowActionForAllRows",
				elementNameOneRow: "hideRowAction",
				elementNameValueEnablement: "shouldHide",
				row: i,
				enablement: "hidden",
				repeatName: "inline-repeat"
			});
		}
	}

	const repeatAttachmentCollectionPath = createEntityInstancePath(
		["root"],
		["repeatableGroupAttachmentCollection", 0]
	);
	const repeatAttachmentCollectionValue = getAndPrepareRepeatValue(
		document,
		documentModel,
		repeatAttachmentCollectionPath
	);

	/**
	 * Calculate the map entries for the repeat "inline-repeat-attachmentCollection".
	 *
	 * Iterate over all instances of the corresponding repeatable group, i.e.
	 * all rows of the repeat. Determine if any of the row action buttons in
	 * these rows should be hidden or disabled and update the current map
	 * accordingly.
	 */
	if (areGroupInstances(repeatAttachmentCollectionValue)) {
		for (let i = 0; i < repeatAttachmentCollectionValue.length; i++) {
			byRowMap = updateRowAction({
				currentMap: byRowMap,
				document,
				repeat: repeatAttachmentCollectionValue,
				elementNameAllRows: "disableRowActionForAllRows",
				elementNameOneRow: "disableRowAction",
				row: i,
				enablement: "disabled",
				repeatName: "inline-repeat-attachmentCollection"
			});

			byRowMap = updateRowAction({
				currentMap: byRowMap,
				document,
				repeat: repeatAttachmentCollectionValue,
				elementNameAllRows: "hideRowActionForAllRows",
				elementNameOneRow: "hideRowAction",
				row: i,
				enablement: "hidden",
				repeatName: "inline-repeat-attachmentCollection"
			});
		}
	}

	const detachedRepeatPath = createEntityInstancePath(
		["root"],
		["repeatableGroupDetachedRepeat", 0]
	);
	const detachedRepeatValue = getAndPrepareRepeatValue(document, documentModel, detachedRepeatPath);

	/**
	 * Calculate the map entries for the repeat "detached-repeat".
	 *
	 * Iterate over all instances of the corresponding repeatable group, i.e.
	 * all rows of the repeat. Determine if any of the row action buttons or
	 * detached repeat buttons (cancel, commit) in these rows should be
	 * hidden or disabled and update the current map accordingly.
	 */
	if (areGroupInstances(detachedRepeatValue)) {
		for (let i = 0; i < detachedRepeatValue.length; i++) {
			byRowMap = updateRowAction({
				currentMap: byRowMap,
				document,
				repeat: detachedRepeatValue,
				elementNameAllRows: "disableRowActionForAllRows",
				elementNameOneRow: "disableDetachedRepeatButtons",
				row: i,
				enablement: "disabled",
				repeatName: "detached-repeat"
			});

			byRowMap = updateRowAction({
				currentMap: byRowMap,
				document,
				repeat: detachedRepeatValue,
				elementNameAllRows: "hideRowActionForAllRows",
				elementNameOneRow: "hideDetachedRepeatButtons",
				row: i,
				enablement: "hidden",
				repeatName: "detached-repeat"
			});
		}
	}

	const embeddedRepeatPath = createEntityInstancePath(["root"], ["repeatGroupEmbeddedRepeat", 0]);
	const embeddedRepeatValue = getAndPrepareRepeatValue(document, documentModel, embeddedRepeatPath);

	/**
	 * Calculate the map entries for the repeat "embedded-repeat".
	 *
	 * Iterate over all instances of the corresponding repeatable group, i.e.
	 * all rows of the repeat. Determine if the edit button in these rows should
	 * be hidden and update the current map accordingly.
	 */
	if (areGroupInstances(embeddedRepeatValue)) {
		for (let i = 0; i < embeddedRepeatValue.length; i++) {
			const hideEditFieldInstance = documentService.getAssignedObject(embeddedRepeatValue[i], [
				{ elementName: "hideEdit", index: 1 }
			]);

			byRowMap = updateEntry({
				currentMap: byRowMap,
				eventNameToChange: DefaultRepeatButtonNames.edit,
				set: !!hideEditFieldInstance,
				enablement: "hidden",
				row: i,
				repeatName: "embedded-repeat"
			});
		}
	}

	return byRowMap;
}

/**
 * Retrieve the value of the repeatable group from the given document.
 *
 * Note: EnablementByRow can contain values for individual repeat rows
 * (indices 1 to n) and an entry for all rows (index 0). Therefore, an empty
 * element is added at index 0 to adjust the structure of the returned value to
 * the structure of the enablement map. This is only done for convenience.
 */
function getAndPrepareRepeatValue(
	document: GroupInstance,
	documentModel: DocumentModel,
	groupPath: EntityInstancePath
): GroupInstance | FieldInstanceValue | GroupInstance[] | undefined {
	const value = documentService.getAssignedObject(document, groupPath);
	const modelElement = findByPath(documentModel, groupPath);

	// Add empty element at row index 0
	return modelElement.type === "Group" && modelElement.repeatability > 1
		? areGroupInstances(value)
			? [{}, ...value]
			: [{}]
		: value;
}

function findByPath(documentModel: DocumentModel, targetPath: ModelPath): DocumentModel.Element {
	if (targetPath.length === 0) {
		return documentModel.content.modelRoot;
	}

	const element = new DocumentServiceFactory()
		.getDocumentModelSearchService(documentModel)
		.getByPath(targetPath);

	if (element === undefined) {
		throw new Error(`Invalid path: ${ModelPath.toString(targetPath)}`);
	}

	return element;
}

/**
 * Retrieves the event names from the document, that were selected in the form.
 * Afterwards a single entry is updated for this event and the given row index.
 */
function updateRowAction(options: {
	currentMap: EnablementByRow;
	repeat: GroupInstance[];
	document: GroupInstance;
	enablement: "hidden" | "disabled";
	row: number;
	elementNameAllRows?: string;
	elementNameOneRow: string;
	elementNameValueEnablement?: string;
	repeatName: string;
}): EnablementByRow {
	const {
		currentMap,
		repeat,
		document,
		enablement,
		row,
		elementNameAllRows,
		elementNameOneRow,
		elementNameValueEnablement,
		repeatName
	} = options;

	/**
	 * If the row index is 0 and elementNameAllRows is given, retrieve the event
	 * name from the document and update the corresponding map entry.
	 */
	if (row === 0 && elementNameAllRows !== undefined) {
		const rowActionForAllRows = documentService.getAssignedObject(
			document,
			createEntityInstancePath(["root"], [elementNameAllRows])
		);

		if (isNullableString(rowActionForAllRows)) {
			return updateEntry({
				currentMap,
				eventNameToChange: rowActionForAllRows,
				set: true,
				enablement,
				row,
				repeatName
			});
		}
	}

	/**
	 * Retrieve the event name and the value to be set in the map.
	 */
	const rowActionToUpdate = documentService.getAssignedObject(
		repeat[row],
		createEntityInstancePath([elementNameOneRow])
	);

	const valueToSet = elementNameValueEnablement
		? documentService.getAssignedObject(
				repeat[row],
				createEntityInstancePath([elementNameValueEnablement])
			)
		: true;

	/**
	 * If the row index is > 1 and rowActionToUpdate is given, update the
	 * corresponding map entry.
	 */
	if (row > 0 && isNullableString(rowActionToUpdate)) {
		return updateEntry({
			currentMap,
			eventNameToChange: rowActionToUpdate,
			set: valueToSet === undefined ? false : (valueToSet as boolean),
			enablement,
			row,
			repeatName
		});
	}

	return currentMap;
}

/**
 * Update a single entry in the given enablement map.
 */
function updateEntry(options: {
	currentMap: EnablementByRow;
	repeatName: string;
	eventNameToChange: string | null;
	set: boolean;
	enablement: "hidden" | "disabled";
	row: number;
}): EnablementByRow {
	const { currentMap, eventNameToChange, set, enablement, row, repeatName } = options;
	const currentRepeatEntry = currentMap[repeatName];

	if (eventNameToChange !== null) {
		const currentEventEntry = currentRepeatEntry
			? currentRepeatEntry[eventNameToChange]
			: undefined;

		const currentRowEntry = currentEventEntry ? currentEventEntry[row] : undefined;

		if (currentRowEntry === undefined || currentRowEntry[enablement] !== set) {
			return {
				...currentMap,
				...{
					[repeatName]: {
						...currentRepeatEntry,
						[eventNameToChange]: {
							...currentEventEntry,
							[row]: {
								...currentRowEntry,
								[enablement]: set
							}
						}
					}
				}
			};
		}
	}

	return currentMap;
}

function areGroupInstances(
	value: GroupInstance[] | GroupInstance | FieldInstanceValue | undefined
): value is GroupInstance[] {
	return Array.isArray(value) && !(value[0] instanceof Date);
}

function isNullableString(element: unknown): element is string | null {
	return typeof element === "string" || element === null;
}

function createEntityInstancePath(...elements: [string, number?][]): EntityInstancePath {
	return elements.map(([elementName, index = 1]) => ({ elementName, index }));
}
