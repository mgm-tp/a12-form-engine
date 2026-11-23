// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { use } from "react";

import type { TableWidgetMap } from "../../../view/internal/components/form-engine/repeat/table-widget-map.js";

import { TableRenderContext } from "./table-context.js";

export const Foot: TableWidgetMap["TableTemplate"]["Foot"] = props => {
	return (
		<div role="rowgroup" id={props.id}>
			{props.children}
		</div>
	);
};

export const FootRenderer: TableWidgetMap["footRenderer"] = props => {
	const {
		TableTemplate: { Foot }
	} = use(TableRenderContext);
	return <Foot {...props}>{props?.children}</Foot>;
};
