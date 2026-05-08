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

import type { JSX } from "react";
import { useSelector } from "react-redux";

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
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

const documentService = new DocumentServiceFactory().getDocumentService();

const repeatName = "detached-repeat-addresses";

export function CustomButtonEnablementEngine(props: FormEngineViews.FormEngineProps): JSX.Element {
	const document = useSelector(FormEngineSelectors.dataState(props.activityId))
		.document as GroupInstance;
	const dirty = useSelector(FormEngineSelectors.dataState(props.activityId)).dirty;

	const byButtonNameMap = calculateButtonNameMap(document, dirty);
	const byRowMap = calculateByRowMap(document);

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
 * Calculate a new EnablementByButtonName map depending on the current document
 * and dirty state.
 */
function calculateButtonNameMap(document: GroupInstance, dirty: boolean): EnablementByButtonName {
	const childrenPath = createEntityInstancePath(["root"], ["children"]);
	const hasChildren =
		(documentService.getAssignedObject(document, childrenPath) as boolean | undefined) ?? false;

	return {
		submit: {
			disabled: !dirty
		},
		buttonNavScreen2: {
			disabled: !hasChildren
		}
	};
}

/**
 * Calculate a new EnablementByRow map depending on the current document.
 */
function calculateByRowMap(document: GroupInstance): EnablementByRow {
	const addressesPath = createEntityInstancePath(["root"], ["addresses", 0]);
	const addresses = documentService.getAssignedObject(document, addressesPath);

	const initialMap: EnablementByRow = {
		[repeatName]: {
			/**
			 * The delete row action is enabled in the model, but should be
			 * hidden for the first row by using the enablement api.
			 */
			[DefaultRepeatButtonNames.delete]: {
				[1]: {
					hidden: true
				}
			},
			/**
			 * The copy row action is not enabled in the model, but should still
			 * be shown for all rows by using the enablement api.
			 */
			[DefaultRepeatButtonNames.copy]: {
				[0]: {
					hidden: false
				}
			},
			/**
			 * The custom delete row action will be hidden for all rows except
			 * the first row.
			 */
			custom_delete: {
				[0]: { hidden: true },
				[1]: { hidden: false }
			}
		}
	};

	if (!Array.isArray(addresses)) {
		return initialMap;
	}

	let enhancedMap = initialMap;

	/**
	 * Iterate through all row from the addresses repeat and update the
	 * corresponding map entries.
	 */
	for (let i = 0; i < addresses.length; i++) {
		const address = addresses[i];
		if (address instanceof Date) {
			continue;
		}

		/**
		 * The detached repeat commit button will be disabled by default and
		 * will only be enabled when dataComplete is true in the document, i.e.
		 * when the user checked the checkbox.
		 */
		const dataComplete =
			documentService.getAssignedObject(address, createEntityInstancePath(["dataComplete"])) ||
			false;
		const shouldBeDisabled = !dataComplete;

		const row = i + 1;

		enhancedMap = updateDetachedRepeatEntry({
			currentMap: enhancedMap,
			value: shouldBeDisabled,
			row
		});
	}

	return enhancedMap;
}

/**
 * Update a single entry in the given enablement map.
 */
function updateDetachedRepeatEntry(options: {
	currentMap: EnablementByRow;
	row: number;
	value: boolean;
}): EnablementByRow {
	const { currentMap, row, value } = options;

	return {
		...currentMap,
		[repeatName]: {
			...currentMap[repeatName],
			[DefaultRepeatButtonNames.commit_detached_repeat]: {
				[row]: {
					disabled: value
				}
			}
		}
	};
}

function createEntityInstancePath(...elements: [string, number?][]): EntityInstancePath {
	return elements.map(([elementName, index = 1]) => ({ elementName, index }));
}
