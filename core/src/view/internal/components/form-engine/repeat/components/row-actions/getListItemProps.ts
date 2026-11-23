// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import type { ListItemProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/list/main/list.api.js";

/** @internal */
export function getListItemProps(buttonProps: ButtonProps): ListItemProps {
	const { icon, label, buttonAttributes, ...rest } = buttonProps;

	return {
		graphic: icon,
		text: label,
		ariaLabel: buttonAttributes?.["aria-label"],
		...rest
	};
}
