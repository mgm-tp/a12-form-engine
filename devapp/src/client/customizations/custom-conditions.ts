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

export const defaultCustomConditionNames = Object.keys(conditionsMap);

export const customConditionsFactory: ICustomConditionFactory = {
	createCustomCondition(name) {
		return conditionsMap[name];
	}
};
