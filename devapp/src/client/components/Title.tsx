// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { JSX } from "react";
import { useDispatch } from "react-redux";
import { styled } from "styled-components";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { ApplicationActions } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import { LOCALE_RESOURCE_KEYS } from "@com.mgmtp.a12.client/client-core/lib/core/locale/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { INDEX_DESCRIPTOR } from "../modules/devappModule.js";

const TitleSpan = styled.span`
	cursor: pointer;
`;

export function Title(): JSX.Element {
	const dispatch = useDispatch();
	const { localizer } = useContext(LocalizerContext);
	return (
		<TitleSpan
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
		>
			{localizer({ key: LOCALE_RESOURCE_KEYS.application.title })}
		</TitleSpan>
	);
}
