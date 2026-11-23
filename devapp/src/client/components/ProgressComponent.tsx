// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { styled } from "styled-components";

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { ClientWidgetMapContext } from "@com.mgmtp.a12.client/client-core/lib/core/ClientWidgetMap.js";
import { ViewViews } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import type { View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import type { ProgressIndicatorProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/progress-indicator/main/progress-indicator.api.js";
import { ProgressIndicator } from "@com.mgmtp.a12.widgets/widgets-core/lib/progress-indicator/main/progress-indicator.view.js";

const StyledIndicator = styled(ViewViews.ProgressIndicator)`
	height: "100%";
	width: "100%";
`;

function CustomIndicator(props: ProgressIndicatorProps): JSX.Element {
	/** Provide a custom progress indicator with 'focusOnOpen' set to true */
	return <ProgressIndicator {...props} focusOnOpen id="progress-indicator" />;
}

export function ProgressComponent({
	activityId,
	children
}: View.ProgressComponentProvider.PropsType): JSX.Element {
	const isBusy = useSelector(ActivitySelectors.busy(activityId));
	const defaultClientWidgetMap = useContext(ClientWidgetMapContext);
	const clientWidgetMap = { ...defaultClientWidgetMap, ProgressIndicator: CustomIndicator };

	return (
		<ClientWidgetMapContext.Provider value={clientWidgetMap}>
			<StyledIndicator delay={0} progress={isBusy ? "loading" : "none"}>
				{children}
			</StyledIndicator>
		</ClientWidgetMapContext.Provider>
	);
}
