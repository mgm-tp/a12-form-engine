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

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale/index.js";
import { Model, ModelSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

import type { FormModel } from "../../../../../../models/index.js";
import { isFormModel } from "../../../../../../models/index.js";
import { FormActivity } from "../../../../core/activity/internal/activity.js";
import { assertCondition, assertNotNullish } from "../../../../core/assertion.js";
import { InternalModelSelectors } from "../../../../core/view/internal/components/selectors.js";

import { RequestBuilder } from "../utils/requestBuilder.js";

import type { RequestSelectorMap } from "./RequestSelectorMap.js";

/**
 * @experimental
 * The default map of request selector factories.
 */
export const DefaultRequestSelectorMap: RequestSelectorMap = {
	load(config) {
		return state => {
			const targetDocumentModel = InternalModelSelectors.referencedDocumentModelName(
				state,
				config.activityId
			);
			const instance = ActivitySelectors.activityPropById(
				config.activityId,
				a => a.descriptor.instance
			)(state);
			assertCondition(instance !== undefined, "Activity instance is not set");

			return RequestBuilder.query({
				targetDocumentModel,
				projectionName: "document",
				constraint: {
					operator: "exact_match",
					field: "/__meta/docRef",
					value: instance
				},
				paging: {
					pageNumber: 0,
					pageSize: 1
				}
			});
		};
	},
	save(config) {
		return state => {
			const locale = LocaleSelectors.locale()(state);
			const instance = ActivitySelectors.activityPropById(
				config.activityId,
				a => a.descriptor.instance
			)(state);
			const oldData = ActivitySelectors.data(config.activityId)(state);
			assertCondition(
				FormActivity.Data.SingleDocumentData.isInstance(oldData),
				"Activity data does not contain a single document"
			);

			const models = ModelSelectors.allModelsInScene(config.activityId)(state);

			const formModel = assertNotNullish(models.find(isFormModel), "No form model found in scene");
			const documentModel = assertNotNullish(models.find(isReferencedDM(formModel)));

			// apply "notRelevant" from dependent groups & fields
			const { modelId, id, ...relevantDocument } = FormActivity.Data.filterDataByRelevance(
				oldData.document,
				{
					documentModel,
					formModel
				}
			);

			const docForServer = new DocumentServiceFactory()
				.getDocumentService()
				.formatDates(relevantDocument, documentModel);

			return instance === NEW_INSTANCE_IDENTIFIER
				? RequestBuilder.addDocument(modelId, docForServer, locale)
				: RequestBuilder.modifyDocument(id, docForServer, locale);
		};
	},
	delete(config) {
		return state => {
			const instance = config.details.instanceId;
			const locale = LocaleSelectors.locale()(state);

			return RequestBuilder.deleteDocument(instance, locale);
		};
	}
};

function isReferencedDM(formModel: FormModel): typeof Model.isDocumentAndValidationModel {
	const dmRef = InternalModelSelectors.getDocumentModelReference(formModel);
	return (m: unknown): m is Model.DocumentAndValidationModel =>
		Model.isDocumentAndValidationModel(m) && m.header.id === dmRef;
}
