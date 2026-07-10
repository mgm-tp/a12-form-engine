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

import { Activity } from "@com.mgmtp.a12.client/client-core";

import type { Models } from "../../../../../back-end/store/index.js";
import { filterDocumentByRelevance } from "../../../../../back-end/store/index.js";

export namespace FormActivity {
	/**
	 * A container for predefined types for the activity's data. It contains a
	 * specification for form data.
	 */
	export namespace Data {
		/**
		 * Specification for a single A12 document that gets stored in activity's data property.
		 */
		export interface SingleDocumentData {
			readonly document: Activity.Data.Document;
		}

		export namespace SingleDocumentData {
			export function isInstance(data: object | undefined): data is SingleDocumentData {
				const { document }: Partial<SingleDocumentData> = data || {};
				return Activity.Data.Document.isInstance(document);
			}
		}

		/**
		 * Applies all dependent field and dependent group dependencies with the notRelevant flag.
		 * I.e. removes all non-relevant fields and groups from the data based on the current state of the data.
		 *
		 * @param data
		 * @param models
		 * @returns the data with non-relevant fields and groups
		 */
		export function filterDataByRelevance(
			data: Activity.Data.Document,
			models: Models
		): Activity.Data.Document {
			const filteredData = filterDocumentByRelevance(data, models);
			if (Activity.Data.Document.isInstance(filteredData)) {
				return filteredData;
			}
			throw new Error("Data is in invalid shape after excluding non-relevant parts.");
		}
	}
}
