/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import type { JSX } from "react";
import { useSelector } from "react-redux";
import { styled } from "styled-components";

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { ViewViews, type View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
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

	return (
		<StyledIndicator
			delay={0}
			progress={isBusy ? "loading" : "none"}
			ProgressIndicatorComponent={CustomIndicator}
		>
			{children}
		</StyledIndicator>
	);
}
