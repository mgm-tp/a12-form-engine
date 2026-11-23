// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	Document,
	EntityInstancePath,
	ICustomCondition,
	ICustomConditionFactory
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

const documentService = new DocumentServiceFactory().getDocumentService();

const conditionsMap: Record<string, ICustomCondition> = {
	CustomTestCondition: {
		check(
			document: Document,
			documentModelId: string,
			relevantEntityInstances: EntityInstancePath[] | undefined,
			formallyIncorrectEntityInstances: EntityInstancePath[],
			errorEntityInstance: EntityInstancePath
		) {
			return "abc" === documentService.getAssignedObject(document, errorEntityInstance);
		}
	},
	CustomTestConditionMultiSelect: {
		check(
			document: Document,
			documentModelId: string,
			relevantEntityInstances: EntityInstancePath[] | undefined,
			formallyIncorrectEntityInstances: EntityInstancePath[],
			errorEntityInstance: EntityInstancePath
		) {
			return "key1" === documentService.getAssignedObject(document, errorEntityInstance);
		}
	},
	CustomTestConditionAttachment: {
		check(
			document: Document,
			documentModelId: string,
			relevantEntityInstances: EntityInstancePath[] | undefined,
			formallyIncorrectEntityInstances: EntityInstancePath[],
			errorEntityInstance: EntityInstancePath
		) {
			return "abc.png" === documentService.getAssignedObject(document, errorEntityInstance);
		}
	}
};

export const customConditionsFactory: ICustomConditionFactory = {
	createCustomCondition(name) {
		return conditionsMap[name];
	}
};
