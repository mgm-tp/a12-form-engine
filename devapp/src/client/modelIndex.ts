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

/** A form the devapp can open, as a tile entry. */
export interface FormEntry {
	readonly label: string;
	readonly modelId: string;
}

/** All groups sharing a base name, e.g. every `controls.*` group, as one tile. */
export interface ModelTile {
	readonly name: string;
	readonly forms: readonly FormEntry[];
}

export interface ModelIndexColumn {
	readonly tiles: readonly ModelTile[];
}

/**
 * The `modelIndex/<name>.json` payload, as `:exampleModels:generateFormModelList`
 * writes it: every form model the devapp can open, already grouped into tiles and
 * distributed over the columns of the overview. It is rendered as it arrives, so
 * changing the tiles or the column split means changing that task.
 */
export interface ModelIndex {
	readonly columns: readonly ModelIndexColumn[];
}
