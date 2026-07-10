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

export const FieldInValidatonMessage = {
	rootGroup: "root",
	REPEAT_1: {
		repeatName: "repeat",
		nestedGroup: "nestedGroup",
		F6: "F6",
		F7: "F7",
		F8: "F8"
	},
	REPEAT_2: {
		repeatName: "repeat2",
		N1: "N1"
	},
	REPEAT_3: {
		repeatName: "repeat3",
		nestedGroup: "nestedGroup",
		nestedRepeat: "nestedRepeat",
		nestedNestedGroup1: "nestedNestedGroup1",
		nestedNestedGroup2: "nestedNestedGroup2",
		N2: "N2",
		N3: "N3",
		F8: "F8"
	},
	REPEAT_4: {
		repeatName: "repeat4",
		nestedRepeat: "nestedRepeat",
		N4: "N4"
	}
} as const;
