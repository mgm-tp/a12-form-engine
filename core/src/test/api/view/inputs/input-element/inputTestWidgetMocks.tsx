// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, PropsWithChildren } from "react";

import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/data-roles.js";

import type { WidgetMap } from "../../../../../view/index.js";
import { DefaultWidgetMap } from "../../../../../view/index.js";
import { getWidgetMocks } from "../../../../rtl-utils/getWidgetMocks.js";
import type { Mocked } from "../../../../rtl-utils/mock-map.js";
import { DisableMockComponents } from "../../../../utils/disable-mocks.js";

import { Input_Widgets } from "./input-widgets.js";

// non-input widgets, but they are tested in the same way
const Additional_Widgets: (keyof WidgetMap)[] = [
	"ErrorTooltip",
	"HintTooltip",
	"WarningTooltip",

	"TextAffix",

	"MessageBox",
	"TextOutput"
];

const WidgetsToBeMocked: (keyof WidgetMap)[] = [...Input_Widgets, ...Additional_Widgets];

export function widgetMocksForInputTests(): Mocked<WidgetMap> {
	const mockedWidgets = () => {
		const inputMocks = Object.fromEntries(WidgetsToBeMocked.map(name => [name, mockForType(name)]));
		return {
			...getWidgetMocks(),
			...inputMocks
		};
	};
	const realWidgets = () => DefaultWidgetMap;
	return DisableMockComponents.components(realWidgets)(mockedWidgets);
}

interface InputWidgetMockProps {
	id: string;

	label?: React.ReactNode;
	errorMessage?: React.ReactNode;
	warningMessage?: React.ReactNode;
	infoMessage?: React.ReactNode;
	prefixes?: React.ReactNode;
	suffixes?: React.ReactNode;

	addonAfter?: React.ReactNode;
	tooltips?: React.ReactNode;
}

function mockForType(type: keyof WidgetMap): React.ComponentType<InputWidgetMockProps> {
	const Irregular_Labels: Partial<Record<keyof WidgetMap, unknown>> = {
		TextLineStateless: DataRoles.Textline.Label
	};

	function labelDataRole(type: keyof WidgetMap): unknown {
		return Irregular_Labels[type] ?? "label";
	}

	return function InputWidgetMock(props: PropsWithChildren<InputWidgetMockProps>): JSX.Element {
		return (
			<div id={props.id}>
				{/* ReactNode props which need a data-role wrapper */}
				{props.label && <div data-role={labelDataRole(type)}>{props.label}</div>}
				{props.errorMessage && <div data-role={DataRoles.Error.Text}>{props.errorMessage}</div>}
				{props.warningMessage && (
					<div data-role={DataRoles.Warning.Text}>{props.warningMessage}</div>
				)}
				{props.infoMessage && <div data-role={DataRoles.Info.Text}>{props.infoMessage}</div>}
				{props.prefixes && <div data-role={DataRoles.Textline.Prefix}>{props.prefixes}</div>}
				{props.suffixes && <div data-role={DataRoles.Textline.TextAffix}>{props.suffixes}</div>}

				{/* plain ReactNode props */}
				{props.addonAfter}
				{props.tooltips}

				{/* generic ReactNode */}
				{props.children}
			</div>
		);
	};
}
