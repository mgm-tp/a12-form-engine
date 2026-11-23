// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

import { publishFocusFirstErrorEvent } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";

export function FocusFirstErrorButton(): JSX.Element {
	return (
		<Button
			label={"Focus First Error"}
			icon={<Icon>my_location</Icon>}
			onClick={() => {
				publishFocusFirstErrorEvent();
			}}
		/>
	);
}
