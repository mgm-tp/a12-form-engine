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

import type { Activity, DataLoader, Model } from "@com.mgmtp.a12.client/client-core";
import type { DgChangeLogSlice, DgSlice, FormModel } from "@com.mgmtp.a12.client/client-data";
import {
	generateNotRelevantConfigFromFormModel,
	initializeDataComponent
} from "@com.mgmtp.a12.client/client-data";
import type { Document } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentRtServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";

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

		const data = initializeDataComponent({
			documents: [
				{
					docRef,
					document: preparedDocument,
					documentModel: mainDocModel,
					formModel,
					notRelevantConfigs,
					loadingState: "loaded"
				}
			],
			links: [],
			entryPoint: docRef
		});

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
