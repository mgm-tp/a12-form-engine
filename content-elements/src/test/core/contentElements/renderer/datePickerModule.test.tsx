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

import {
	ContentEngineContextProvider,
	DocumentContext,
	DocumentPathContextProvider
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { query } from "@com.mgmtp.a12.devtools/react";

import { DatePickerModule } from "../../../../main/core/contentElements/modules/datePicker/datePickerModule.js";
import type { DatePickerNode } from "../../../../main/core/contentElements/modules/datePicker/datePickerNode.js";
import { DATE_PICKER_TYPE } from "../../../../main/core/contentElements/modules/datePicker/datePickerNode.js";
import { FORM_ELEMENTS_NAMESPACE } from "../../../../main/core/namespace.js";
import { mockDocumentContext } from "../../../mocks/mockDocumentContext.js";
import type { RenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements", () => {
	describe("DatePicker", () => {
		it("renders a DateInput with the given node for fields of type 'DateType'", () => {
			const { componentMap } = setup("DateType");

			const props = query(componentMap.DateInput).props();
			strictEqual(props.node, mockNode);
		});

		it("renders a DateTimeInput with the given node for fields of type 'DateTimeType'", () => {
			const { componentMap } = setup("DateTimeType");

			const props = query(componentMap.DateTimeInput).props();
			strictEqual(props.node, mockNode);
		});

		it("renders a TimeInput with the given node for fields of type 'TimeType'", () => {
			const { componentMap } = setup("TimeType");

			const props = query(componentMap.TimeInput).props();
			strictEqual(props.node, mockNode);
		});

		it("renders a DateRangeInput with the given node for fields of type 'DateRangeType'", () => {
			const { componentMap } = setup("DateRangeType");

			const props = query(componentMap.DateRangeInput).props();
			strictEqual(props.node, mockNode);
		});

		it("renders a DateFragmentInput with the given node for fields of type 'DateFragmentType'", () => {
			const { componentMap } = setup("DateFragmentType");

			const props = query(componentMap.DateFragmentInput).props();
			strictEqual(props.node, mockNode);
		});
	});
});

const mockNode: DatePickerNode = {
	id: "test-node-id",
	namespace: FORM_ELEMENTS_NAMESPACE,
	type: DATE_PICKER_TYPE,
	props: {
		elementId: "test-id"
	}
};

function setup(
	fieldType: "DateType" | "DateTimeType" | "TimeType" | "DateFragmentType" | "DateRangeType"
): RenderWrapper {
	return renderWrapper(
		<ContentEngineContextProvider libraryId={""} size="lg">
			<DocumentPathContextProvider groupPath={""}>
				<DocumentContext.Provider value={getMockDocContext(fieldType)}>
					<DatePickerModule.renderer node={mockNode} />
				</DocumentContext.Provider>
			</DocumentPathContextProvider>
		</ContentEngineContextProvider>
	);
}

function getMockDocContext(
	fieldType: "DateType" | "DateTimeType" | "TimeType" | "DateFragmentType" | "DateRangeType"
): DocumentContext {
	return mockDocumentContext({
		getElementById: {
			id: "test-id",
			name: "test-name",
			type: "Field",
			fieldType: {
				type: fieldType,
				format: "",
				rangeSeparator: "",
				formatOfFragment: ""
			}
		}
	});
}
