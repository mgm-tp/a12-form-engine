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
