// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * React component mocks shared by date widget tests.
 */
import { mock } from "node:test";

import type { JSX, ReactNode } from "react";

import type { DateTimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/date-time-picker/main/date-time-picker.api.js";
import type { DatePickerDialogProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-picker.mobile.api.js";

import type { WidgetMap } from "../../../../../view/index.js";
import { DefaultComponentMap } from "../../../../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import { mockFunctions } from "../../../../rtl-utils/mock-map.js";
import type { RtlRenderWrapperOptions } from "../../../../rtl-utils/render-wrapper.js";

import { widgetMocksForInputTests } from "../input-element/inputTestWidgetMocks.js";

function DatePickerDialogMock(props: DatePickerDialogProps): JSX.Element {
	return (
		<div>
			{props.submitButton}
			{props.clearButton}
		</div>
	);
}

function DateTimePickerMock(props: DateTimePickerProps): JSX.Element {
	return <div>{props.customHeaderElement as ReactNode}</div>;
}

export function getComponentMocks(): Pick<RtlRenderWrapperOptions, "widgetMap" | "componentMap"> {
	const widgetMap: WidgetMap = {
		...widgetMocksForInputTests(),
		DatePickerDialog: mock.fn(DatePickerDialogMock),
		DateTimePicker: mock.fn(DateTimePickerMock)
	};
	const componentMap = mockFunctions(DefaultComponentMap);
	return { widgetMap, componentMap };
}
