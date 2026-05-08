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

import { DocumentHelpers } from "../document-helpers.js";

export const DOCUMENT_PATHS = {
	FIELD_A: DocumentHelpers.createDocumentPath(["root"], ["NonRep"], ["FieldA"]),
	FIELD_B: DocumentHelpers.createDocumentPath(["root"], ["NonRep"], ["FieldB"]),
	FIELD_C: DocumentHelpers.createDocumentPath(["root"], ["NonRep"], ["FieldC"]),
	FIELD_C_REP: DocumentHelpers.createDocumentPath(["root"], ["Rep"], ["FieldC"]),
	FIELD_G: DocumentHelpers.createDocumentPath(["root"], ["NonRep"], ["FieldG"]),
	FIELD_QUOTIENT: DocumentHelpers.createDocumentPath(["root"], ["NonRep"], ["ResultDivision"]),
	FIELD_MULTI_SELECT: DocumentHelpers.createDocumentPath(
		["root"],
		["MultiSelectComputation"],
		["MultiSelect1"]
	),
	FIELD_H: DocumentHelpers.createDocumentPath(["root"], ["MultiSelectComputation"], ["FieldH"]),

	FIELD_ATTACHMENT: DocumentHelpers.createDocumentPath(
		["root"],
		["AttachmentComputation"],
		["Attachment"]
	),
	FIELD_I: DocumentHelpers.createDocumentPath(["root"], ["AttachmentComputation"], ["FieldI"]),
	FIELD_D: DocumentHelpers.createDocumentPath(["root"], ["FieldD"])
};
