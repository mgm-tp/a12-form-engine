// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import React, { useContext } from "react";
import { useDispatch } from "react-redux";

import { DataActions } from "@com.mgmtp.a12.client/client-data";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";

import { createResourceLocalizable } from "../../localization/index.js";
import { RESOURCE_KEYS } from "../../localization/keys.js";

export const ValidateButton = (props: { activityId: string }): React.JSX.Element | null => {
	const dispatch = useDispatch();
	const localizer = useContext(LocalizerContext).localizer;

	return (
		<>
			<Button
				primary
				label={localizer(createResourceLocalizable(RESOURCE_KEYS.header.validation.button))}
				icon={<Icon>check</Icon>}
				onClick={() => dispatch(DataActions.validateFull({ activityId: props.activityId }))}
			/>
		</>
	);
};
