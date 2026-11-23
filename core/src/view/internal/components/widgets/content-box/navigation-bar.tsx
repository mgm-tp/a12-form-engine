// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { JSX } from "react";

import type { MenuItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/menu.api.js";

import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

/** @internal */
export interface ContentBoxNavigationBarProps {
	readonly navItems: MenuItem[];
}

/** @internal */
export function ContentBoxNavigationBar(props: ContentBoxNavigationBarProps): JSX.Element {
	const { FlyoutMenu } = useContext(WidgetMapContext);

	return <FlyoutMenu items={[...props.navItems]} type="horizontal" useAs="tabNavigation" />;
}
