// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";

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
