// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { DataLoader } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js";
import type { Model } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import type { DgChangeLogSlice, DgSlice, FormModel } from "@com.mgmtp.a12.client/client-data";
import {
	generateNotRelevantConfigFromFormModel,
	initializeDataComponent
} from "@com.mgmtp.a12.client/client-data";
import type { Document } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentRtServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

import { isInstanceDescriptor } from "../modules/contentEngine/contentEngineModule.js";

import { DEPENDENCY_DM1 } from "./documents/dependency-dm1.js";
import { FIELD_TYPES_DM1 } from "./documents/fieldTypes-dm1.js";
import { MESSAGE_GROUP_DM1 } from "./documents/messageGroup-dm1.js";
import { TABLE_DM1 } from "./documents/table-dm1.js";
import { VALIDATION_DM1 } from "./documents/validation-dm1.js";

export class MockContentEngineDataLoader implements DataLoader<DgSlice & DgChangeLogSlice> {
	public name = "MockContentEngineDataLoader";

	canHandle(descriptor: Activity.Descriptor): boolean {
		return isInstanceDescriptor(descriptor);
	}

	async load(
		activity: Activity,
		models: Promise<DataLoader.Models>
	): Promise<DgSlice & DgChangeLogSlice> {
		const result = await models;
		const mainDocModel = result.documentModel as Model.DocumentAndValidationModel;

		const formModel = result.modelsInScene.find(
			(model): model is FormModel => model.header.modelType === "form"
		);

		const notRelevantConfigs = [
			...(formModel ? [generateNotRelevantConfigFromFormModel(formModel)] : [])
		];

		const documentService = DocumentRtServiceFactory.createDocumentRtService(
			mainDocModel.generatedCodeAccessor,
			{
				ignoreUnknownFields: true
			}
		);

		const docRef = activity.descriptor.instance ?? "";

		const document = getMockDocument(activity.descriptor.model ?? "", docRef);

		const computationResult = documentService.compute(document as Document);
		const preparedDocument = computationResult.appliedTo(document as Document);

		const data = initializeDataComponent(
			[
				{
					docRef,
					document: preparedDocument,
					documentModel: mainDocModel,
					formModel,
					notRelevantConfigs,
					loadingState: "loaded"
				}
			],
			[],
			docRef
		);

		return Promise.resolve(data);
	}

	async save(): Promise<DgSlice & DgChangeLogSlice> {
		/**
		 * No saving functionality in this mock example
		 */

		return Promise.resolve({} as DgSlice & DgChangeLogSlice);
	}

	delete(): Promise<void> {
		throw new Error("Method not implemented.");
	}
}

function getMockDocument(modelId: string, docRef: string) {
	if (docRef.startsWith("dependency-dm/")) {
		return DEPENDENCY_DM1;
	} else if (docRef.startsWith("fieldTypes-dm/")) {
		return FIELD_TYPES_DM1;
	} else if (docRef.startsWith("messageGroup-dm/")) {
		return MESSAGE_GROUP_DM1;
	} else if (docRef.startsWith("table-dm/")) {
		return TABLE_DM1;
	} else if (docRef.startsWith("validation-dm/")) {
		return VALIDATION_DM1;
	}

	return {
		id: docRef,
		modelId
	};
}
