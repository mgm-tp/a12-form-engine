// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { JSX } from "react";
import { useDispatch } from "react-redux";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { ApplicationActions } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";

import { INDEX_DESCRIPTOR } from "../modules/devappModule.js";
import { DevappThemeContext } from "../ThemeContextProvider.js";

export function Logo(): JSX.Element {
	const { theme } = useContext(DevappThemeContext);
	const suffix = theme.includes("flat") ? "_flat" : "";
	const logoURL = `./images/a12_logo${suffix}.svg`;

	const dispatch = useDispatch();

	return (
		<a
			onClick={() =>
				dispatch(
					ApplicationActions.startMainActivityRequested({
						action: ActivityActions.create({
							activityDescriptor: INDEX_DESCRIPTOR
						}),
						descriptor: {}
					})
				)
			}
			className="logo"
			href="#"
		>
			<img src={logoURL} />
		</a>
	);
}
