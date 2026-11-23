// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useSelector } from "react-redux";

import type { View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";

import type { ScrollHandlerProps } from "../../../../../view/index.js";
import { ScrollHandler } from "../../../../../view/index.js";
import { createRenderGuardComponent } from "../../../core/view/internal/components/createRenderGuardComponent.js";

import { FormEngineSelectors } from "./selectors.js";

const ScrollHandlerGuard = createRenderGuardComponent(ScrollHandler, propsAreComplete);

/** @internal */
export function FormEngineScrollHandler(
	props: View & Omit<ScrollHandlerProps, "uiState" | "models">
) {
	const stateProps = useSelector(state => {
		const engineState = FormEngineSelectors.engineState(props.activityId)(state);

		return engineState !== undefined
			? {
					uiState: engineState.ui,
					models: engineState.models
				}
			: {};
	});

	return <ScrollHandlerGuard {...props} {...stateProps} />;
}

function propsAreComplete(props: Partial<ScrollHandlerProps>): props is ScrollHandlerProps {
	const { models, uiState } = props;
	return models !== undefined && uiState !== undefined;
}
