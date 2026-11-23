// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { BaseTooltipProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/main/tooltip.api.js";

import { isRecord } from "../../../../back-end/utils/internal/guards.js";
import { isReactElement } from "../../../rtl-utils/mock-utils.js";

export function messageKeysForTooltip(tooltip: BaseTooltipProps): string[] {
	return isReactElement(tooltip.text) &&
		"messages" in tooltip.text.props &&
		Array.isArray(tooltip.text.props.messages)
		? tooltip.text.props.messages.flat(1).map(m => (isLocalizable(m) ? m.key : "???"))
		: typeof tooltip.text === "string"
			? [tooltip.text]
			: [];
}

function isLocalizable(o: unknown): o is Localizable {
	return isRecord(o) && "key" in o;
}
