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
