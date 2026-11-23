// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

import type {
	ApplicationFrameLayoutPropsNG,
	FrameViews,
	LayoutNG
} from "@com.mgmtp.a12.client/client-core/lib/core/frame/index.js";
import { ApplicationFrameLayoutNGComponent } from "@com.mgmtp.a12.client/client-core/lib/core/frame/index.js";

import { Logo } from "./Logo.js";
import { Settings } from "./Settings.js";
import { Title } from "./Title.js";
import { VersionHeaderInfo } from "./VersionHeaderInfo.js";

const additionalHeaderItems = [
	{
		item: <Settings />,
		orientation: "rightSlots-left"
	},
	{
		item: <VersionHeaderInfo />,
		orientation: "rightSlots-left"
	}
] satisfies FrameViews.HeaderItemProps[];

function DevappLayoutComponent(props: ApplicationFrameLayoutPropsNG): JSX.Element {
	return (
		<ApplicationFrameLayoutNGComponent
			{...props}
			logo={<Logo />}
			title={<Title />}
			additionalHeaderItems={additionalHeaderItems}
		/>
	);
}

export const DevappLayoutNG: LayoutNG = { component: DevappLayoutComponent };
