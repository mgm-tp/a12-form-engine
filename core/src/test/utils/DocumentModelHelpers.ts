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

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

export const DocumentModelHelpers = {
	DocumentModelContent(
		rootGroup: Partial<Omit<DocumentModel.Group, "type">> = {}
	): DocumentModel.DocumentModelContent {
		return {
			modelRoot: DocumentModelHelpers.Group(rootGroup),
			modelInfo: {},
			modelConfig: {
				timeZone: "UTC"
			},
			documentUniquenessCriteria: []
		};
	},

	Group(group: Partial<Omit<DocumentModel.Group, "type">> = {}): DocumentModel.Group {
		return {
			type: "Group",
			id: "id",
			name: "anyGroup",
			annotations: [],
			elements: [],
			externalDescription: [{ locale: "en", text: "externalDescription" }],
			repeatability: 1,
			...group
		};
	},

	Field(field: Partial<Omit<DocumentModel.Field, "type">> = {}): DocumentModel.Field {
		return {
			type: "Field",
			id: "id",
			name: "anyField",
			annotations: [],
			externalDescription: [{ locale: "en", text: "externalDescription" }],
			fieldType: { type: "StringType", lineBreaksPermitted: false },
			label: [{ locale: "en", text: "label" }],
			...field
		};
	},

	createDocumentModel(rootGroup: DocumentModel.Group): DocumentModel {
		return {
			header: {
				modelType: "document",
				modelVersion: "24.1.0",
				id: "MyProject",
				locales: [{ code: "en" }],
				labels: [{ locale: "en", text: "externalDescription" }]
			},
			content: {
				modelRoot: DocumentModelHelpers.Group({
					elements: [rootGroup]
				}),
				modelInfo: {},
				modelConfig: {
					timeZone: "UTC"
				},
				documentUniquenessCriteria: []
			}
		};
	}
};
