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

import { type WidgetMap } from "../../view/index.js";

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
