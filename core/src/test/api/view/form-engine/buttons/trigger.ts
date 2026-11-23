// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { query } from "@com.mgmtp.a12.devtools/react";
import { isMenuGroup } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/menu.utils.js";

import type { WidgetMap } from "../../../../../view/index.js";

/**
 * abstraction of props access for buttons and menu items
 *
 * assumes that there is only one menu rendered!
 */
export default function triggerProps(isMenuItem?: boolean) {
	return function (widgetMap: WidgetMap) {
		const props = isMenuItem ? menuItemProps : buttonProps;
		return props(widgetMap);
	};

	function buttonProps(widgetMap: WidgetMap) {
		return function (elementId: string) {
			return query(widgetMap.Button).withId(elementId).maybeProps();
		};
	}

	function menuItemProps(widgetMap: WidgetMap) {
		return function (elementId: string) {
			const menu = query(widgetMap.FlyoutMenu).maybeProps();
			const item = menu?.items.find(i => i.id === elementId);
			const menuItem = isMenuGroup(item) ? undefined : item;
			return menuItem;
		};
	}
}
