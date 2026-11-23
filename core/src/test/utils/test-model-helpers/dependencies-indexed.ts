// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DocumentHelpers } from "../document-helpers.js";

const { createDocumentPath } = DocumentHelpers;

export namespace DEP_INDEXED {
	export namespace DOCUMENT_MODEL {
		export const MASTER_OUTSIDE_FOR_NUMERIC = createDocumentPath(["Root"], ["masterNumeric"]);
		export const MASTER_OUTSIDE_FOR_SEMANTIC = createDocumentPath(["Root"], ["masterSemantic"]);

		export function getNumericMasterPath(index: number) {
			return createDocumentPath(["Root"], ["NumericIndex", index], ["masterInRepeat"]);
		}
		export function getSemanticMasterPath(index: number) {
			return createDocumentPath(["Root"], ["SemanticIndex", index], ["masterInRepeat"]);
		}
	}

	export namespace FORM_MODEL {
		export const NUMERIC_INDEX_FIELD_DEP = "a12-DependentField-field_cff9b";
		export const NUMERIC_INDEX_GROUP_DEP = "a12-FieldFromDependentGroup-field_26a6e";
		export const NUMERIC_INDEX_FIELD_DEP_MASTER_OUTSIDE =
			"a12-DependentFieldMasterOutside-field_211c0";
		export const NUMERIC_INDEX_GROUP_DEP_MASTER_OUTSIDE =
			"a12-FieldFromDependentGroupMasterOutside-field_447a5";

		export const SEMANTIC_INDEX_FIELD_DEP = "a12-DependentField-field_7c009";
		export const SEMANTIC_INDEX_GROUP_DEP = "a12-FieldFromDependentGroup-field_c41fc";
		export const SEMANTIC_INDEX_FIELD_DEP_MASTER_OUTSIDE =
			"a12-DependentFieldMasterOutside-field_52c54";
		export const SEMANTIC_INDEX_GROUP_DEP_MASTER_OUTSIDE =
			"a12-FieldFromDependentGroupMasterOutside-field_24639";
	}

	export function createDocument(): GroupInstance {
		const document = {
			Root: {
				NumericIndex: [{}, {}, {}],
				SemanticIndex: [{ Index: "a" }, { Index: "b" }, { Index: "c" }]
			}
		};

		return document;
	}
}
