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
 * 1. Open-Source License - EUPL v1.2
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
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { View } from "@com.mgmtp.a12.client/client-core";

import type { DefaultDispatchProps } from "../../../../../view/internal/configuration/Defaults.js";
import { defaultStatePropsAreEqual } from "../../../../../view/internal/configuration/hooks.js";

import { FormEngineActions } from "./actions.js";
import { FormEngineStateAdapter } from "./state.js";
import type { FormEngineProps } from "./view.js";

/**
 * Hooks that read the Form Engine props from the Client store.
 *
 * They wrap the `FormEngineStateAdapter.mapStateToProps` and
 * `FormEngineActions.mapDispatchToProps` mappings and take care of
 * memoization: both mappings re-create their
 * result on every call, so a plain `useSelector(state => mapStateToProps(state,
 * props))` re-renders on every dispatched action.
 *
 * Prefer these hooks inside a component, and call the mappings directly only
 * where a hook cannot be called, for example in tests.
 */
export const FormEngineHooks = {
	/**
	 * Reads the Form Engine state props for the given own props from the Client store.
	 *
	 * Re-renders only when the engine state or the derived config actually changed.
	 *
	 * @param ownProps Props for the Form Engine
	 * @returns the respective Form Engine state props or an empty object if some
	 * information is missing in the Client state
	 */
	useStateProps(ownProps: FormEngineProps): FormEngineStateAdapter.StateProps {
		return useSelector(
			state => FormEngineStateAdapter.mapStateToProps(state, ownProps),
			defaultStatePropsAreEqual
		);
	},

	/**
	 * Creates the Form Engine dispatch props for the given own props.
	 *
	 * The result keeps its identity as long as the `activityId` does not change,
	 * so the event handlers stay stable across renders.
	 *
	 * @param ownProps Props holding the activity that holds the Form Engine state
	 * @returns the respective Form Engine dispatch props
	 */
	useDispatchProps(ownProps: Pick<View, "activityId">): DefaultDispatchProps {
		const dispatch = useDispatch();
		const { activityId } = ownProps;

		return useMemo(
			() => FormEngineActions.mapDispatchToProps(dispatch, { activityId }),
			[dispatch, activityId]
		);
	}
};
