// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

import type { WidgetMap } from "@com.mgmtp.a12.formengine/formengine-core";
import { DefaultWidgetMap } from "@com.mgmtp.a12.formengine/formengine-core";
import type { ActionContentboxProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.api.js";
import { ActionContentbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/template/contentbox.tpl.view.js";

function CustomActionBox(props: ActionContentboxProps): JSX.Element {
	return (
		<ActionContentbox
			{...props}
			headingElements={<ContentBoxElements.Title text="My custom title" />}
		/>
	);
}

export const withCustomTitle: WidgetMap = {
	...DefaultWidgetMap,
	ActionContentbox: CustomActionBox
};
