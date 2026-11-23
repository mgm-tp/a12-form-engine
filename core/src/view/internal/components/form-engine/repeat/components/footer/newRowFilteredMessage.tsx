// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils.js";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/index.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

/** @internal */
export function NewRowFilteredMessage(props: { tableId: string }): JSX.Element | null {
	const localizer = useContext(LocalizerContext).localizer;
	const { Message } = useContext(WidgetMapContext);

	const { tableId } = props;
	const text = getLocalizedResource(RESOURCE_KEYS.repeat.hidden.newEntry, localizer);

	return text !== undefined ? (
		<Message
			key="emptyplaceholder_2"
			id={`${tableId}-emptyplaceholder_2`}
			className={addPrefix("-u-height-full -u-flex -u-justify-center")}
		>
			{text}
		</Message>
	) : null;
}
