// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	ActivityActions,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { ViewNGProps } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { GlobalMessageBox } from "@com.mgmtp.a12.widgets/widgets-core/lib/global-message-box/main/global-message-box.view.js";

export function ErrorBox({ activityId }: Pick<ViewNGProps, "activityId">): JSX.Element | null {
	const error = useSelector(ActivitySelectors.error(activityId));
	const dispatch = useDispatch();

	if (!error) {
		return null;
	}
	return (
		<GlobalMessageBox
			content={`${error.errorCode}: ${"message" in error ? error.message : "Check console for details"}`}
			variant="error"
			actions={
				<Button
					primary
					invert
					label="Dismiss"
					title="Clear error"
					onClick={() => dispatch(ActivityActions.clearError({ activityId }))}
				/>
			}
		/>
	);
}
