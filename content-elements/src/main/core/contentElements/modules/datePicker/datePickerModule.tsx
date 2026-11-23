// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";

import type { NodeRendererProps } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";

import { ComponentMapContext } from "../../componentMap/componentMapContext.js";
import { createElementModule } from "../../createElementModule.js";

import type { DatePickerNode } from "./datePickerNode.js";
import { DATE_PICKER_TYPE } from "./datePickerNode.js";
import { datePickerValidator } from "./datePickerValidator.js";

/** @internal */
export const DatePickerModule = createElementModule<DatePickerNode>({
	type: DATE_PICKER_TYPE,
	renderer: DatePickerRenderer,
	validator: datePickerValidator
});

function DatePickerRenderer(props: NodeRendererProps<DatePickerNode>): JSX.Element | null {
	const { DateInput, DateTimeInput, TimeInput, DateRangeInput, DateFragmentInput } =
		useContext(ComponentMapContext);
	const { getElementById } = useDocumentContext(c => c.model);

	const modelElement = useSelector(state => getElementById(state, props.node.props.elementId));

	if (modelElement?.type === "Field") {
		switch (modelElement.fieldType.type) {
			case "DateType": {
				return <DateInput {...props} />;
			}
			case "DateTimeType": {
				return <DateTimeInput {...props} />;
			}
			case "TimeType": {
				return <TimeInput {...props} />;
			}
			case "DateRangeType": {
				return <DateRangeInput {...props} />;
			}
			case "DateFragmentType": {
				/**
				 * TODO: keep the DateFragment in the DatePicker or just allow
				 * modeling it as a simple text line?
				 */
				return <DateFragmentInput {...props} />;
			}
			default: {
				return null;
			}
		}
	}

	return null;
}
