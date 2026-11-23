// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
