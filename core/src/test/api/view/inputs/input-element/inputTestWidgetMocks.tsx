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
