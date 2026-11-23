// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
