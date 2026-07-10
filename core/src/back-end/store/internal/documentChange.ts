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

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { DocumentPath } from "../../../models/internal/utils/document-utils.js";
import type { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";

/**
 * Change which was made to the document
 */
export type Change = ValueChanged | GroupAdded | GroupRemoved | GroupMoved | Revert;
export interface BaseChange {
	readonly path: EntityInstancePath;
}

/** A value was changed */
export interface ValueChanged extends BaseChange {
	readonly type: "ValueChanged";
}

/** A group was removed.  */
export interface GroupRemoved extends BaseChange {
	readonly type: "GroupRemoved";
}

/**
 * A group was added to the document.
 * The added group is always the last one - the provided
 * path either refers to the repeatable group (in case of add new) or the
 * source group (in case of clone).
 */
export interface GroupAdded extends BaseChange {
	readonly type: "GroupAdded";
}

/** A group was moved inside the document */
export interface GroupMoved extends BaseChange {
	readonly type: "GroupMoved";
	/**
	 * Delta by which the group was moved.
	 * A delta of -1 means the row was moved up by 1.
	 * A delta of +1 means the row was moved down by 1.
	 */
	readonly delta: number;
}

/**
 * The document was reverted to the last backup
 */
export interface Revert {
	readonly type: "Revert";
}

/** @experimental */
export const Change = {
	/** Function to check if a given element is an instance of {@link GroupAdded} */
	isGroupAdded(element: Change): element is GroupAdded {
		return element.type === "GroupAdded";
	},

	/** Function to check if a given element is an instance of {@link GroupMoved} */
	isGroupMoved(element: Change): element is GroupMoved {
		return element.type === "GroupMoved";
	},

	/** Function to check if a given element is an instance of {@link GroupRemoved} */
	isGroupRemoved(element: Change): element is GroupRemoved {
		return element.type === "GroupRemoved";
	},

	/** Function to check if a given element is an instance of {@link ValueChanged} */
	isRevert(element: Change): element is Revert {
		return element.type === "Revert";
	},

	/** Function to check if a given element is an instance of {@link ValueChanged} */
	isValueChanged(element: Change): element is ValueChanged {
		return element.type === "ValueChanged";
	}
};

/** @internal */
export const ChangeMapCreators = {
	createValueChanged(path: EntityInstancePath): ReadonlyObjectMap<Change> {
		return { [DocumentPath.toString(path)]: { type: "ValueChanged", path } };
	},

	createGroupRemoved(path: EntityInstancePath): ReadonlyObjectMap<Change> {
		return { [DocumentPath.toString(path)]: { type: "GroupRemoved", path } };
	},

	createValueChanges(paths: EntityInstancePath[]): ReadonlyObjectMap<Change> {
		return paths.reduce<ReadonlyObjectMap<Change>>((result, path) => {
			return {
				...result,
				...ChangeMapCreators.createValueChanged(path)
			};
		}, {});
	},

	union(...changeMaps: ReadonlyObjectMap<Change>[]): ReadonlyObjectMap<Change> {
		return Object.assign({}, ...changeMaps);
	},

	difference(
		minuend: ReadonlyObjectMap<Change>,
		subtrahend: ReadonlyObjectMap<Change>
	): ReadonlyObjectMap<Change> {
		return Object.fromEntries(Object.entries(minuend).filter(c => subtrahend[c[0]] === undefined));
	},

	fromList(changes: Change[]): ReadonlyObjectMap<Change> {
		const entries = changes.map(changePathEntry);
		const pathBasedChanges = entries.filter(notUndefined);
		return Object.fromEntries(pathBasedChanges);
	}
};

function changePathEntry(change: Change) {
	return change.type !== "Revert" ? [DocumentPath.toString(change.path), change] : undefined;
}

function notUndefined<T>(obj: T | undefined): obj is T {
	return obj !== undefined;
}
