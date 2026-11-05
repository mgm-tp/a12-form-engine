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

import { strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DataReference } from "@com.mgmtp.a12.client/client-data";
import type {
	ContentModel,
	DocumentContext,
	RuntimeTreeContext
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import { createElementModule } from "../../../main/core/contentElements/createElementModule.js";
import { TEXT_LINE_TYPE } from "../../../main/core/contentElements/modules/textLine/textLineNode.js";
import type { BaseControlProps } from "../../../main/core/index.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../main/core/namespace.js";

const STATE = {};

describe("core.contentElements", () => {
	describe("createElementModule isRendered", () => {
		it("reports a control as not rendered while its data is not relevant", () => {
			const module = createTextLineModule();

			const rendered = module.isRendered?.(
				createControlNode("field-id"),
				"/root[1]",
				createContext(["/root[1]/field[1]"])
			);

			strictEqual(rendered, false);
		});

		it("reports a control as rendered while its data is relevant", () => {
			const module = createTextLineModule();

			const rendered = module.isRendered?.(
				createControlNode("field-id"),
				"/root[1]",
				createContext([])
			);

			strictEqual(rendered, true);
		});

		it("reports a control as not rendered only for its own data context", () => {
			const module = createTextLineModule();

			const rendered = module.isRendered?.(
				createControlNode("field-id"),
				"/root[2]",
				createContext(["/root[1]/field[1]"])
			);

			strictEqual(rendered, true);
		});

		it("reports a control the author has not configured yet as rendered", () => {
			const module = createTextLineModule();

			const rendered = module.isRendered?.(
				createControlNode(undefined),
				"/root[1]",
				createContext([])
			);

			strictEqual(rendered, true);
		});
	});
});

function createTextLineModule() {
	return createElementModule<ContentModel.Node<BaseControlProps>>({
		type: TEXT_LINE_TYPE,
		renderer: () => null,
		validator: () => []
	});
}

function createControlNode(elementId?: string): ContentModel.Node<BaseControlProps> {
	return {
		id: "textline",
		namespace: FORM_ELEMENTS_NAMESPACE,
		type: TEXT_LINE_TYPE,
		props: { elementId } as BaseControlProps
	};
}

function createContext(notRelevantReferences: string[]): RuntimeTreeContext {
	const documentContext = {
		model: {
			getModelPathById: () => ModelPath.fromString("/root/field"),
			getElementByPath: () => ({ id: "field-id", name: "field", type: "Field" })
		},
		document: {
			getNotRelevant: (_state: object, dataReference: DataReference) =>
				notRelevantReferences.includes(dataReference)
		}
	} as unknown as DocumentContext;

	return {
		state: STATE,
		documentContext,
		baseDataContext: "/",
		resolveDataContext: () => "/"
	};
}
