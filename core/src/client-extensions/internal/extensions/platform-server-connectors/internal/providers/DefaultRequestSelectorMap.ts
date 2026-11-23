// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
