// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, PropsWithChildren } from "react";

import type { WidgetMap } from "../../view/index.js";

import { Input_Widgets } from "../api/view/inputs/input-element/input-widgets.js";

/**
 * The scroll handler relies on widgets rendering actual HTML input elements.
 * Some tests also rely on a specific ID structure "-group".
 */
export function widgetMocksForFocusTests(): Partial<WidgetMap> {
	return Object.fromEntries(Input_Widgets.map(name => [name, FocusWidgetMock]));
}

interface InputWidgetMockProps {
	id: string;
}

function FocusWidgetMock(props: PropsWithChildren<InputWidgetMockProps>): JSX.Element {
	return (
		<div id={`${props.id}-group`}>
			<input id={props.id} />
		</div>
	);
}
