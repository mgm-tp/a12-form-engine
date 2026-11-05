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
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import type { EngineState } from "../../../back-end/store/internal/store.js";

import type { ScrollHandlerProps } from "../components/scroll-handler.js";

import type { DefaultDispatchProps, DefaultOwnProps, DefaultStateProps } from "./Defaults.js";
import { defaultMapDispatchToProps, defaultMapStateToProps } from "./Defaults.js";

/**
 * Equality function for the props created by {@link defaultMapStateToProps}.
 *
 * `defaultMapStateToProps` re-creates its result - including the derived
 * `config` - on every call, so its props are never referentially equal. This is
 * the `useSelector` equality function that makes {@link useDefaultStateProps}
 * re-render only on an actual state change.
 *
 * @param previous The previously mapped state props
 * @param current The currently mapped state props
 * @returns `true` if both describe the same Form Engine state
 * @internal
 */
export function defaultStatePropsAreEqual(
	previous: Partial<DefaultStateProps>,
	current: Partial<DefaultStateProps>
): boolean {
	return previous.state === current.state && shallowEqual(previous.config, current.config);
}

/**
 * Reads the state props needed to render the view from an {@link EngineState} store.
 *
 * Hook variant of {@link defaultMapStateToProps} that takes care of the
 * memoization: the component only re-renders when the engine state or the
 * derived config actually changed.
 *
 * Use this when you keep the Form Engine state in your own store. For a Form
 * Engine hosted by a Client Activity use `FormEngineHooks.useStateProps` instead.
 *
 * @param ownProps Own props of the view, holding the partial config
 * @returns the state props for the view
 */
export function useDefaultStateProps(ownProps: DefaultOwnProps): DefaultStateProps {
	return useSelector(
		(state: EngineState) => defaultMapStateToProps(state, ownProps),
		defaultStatePropsAreEqual
	);
}

/**
 * Creates the dispatch props needed to render the view.
 *
 * Hook variant of {@link defaultMapDispatchToProps}. The result keeps its
 * identity for as long as the store does, so the event handlers stay stable
 * across renders.
 *
 * @returns the dispatch props for the view
 */
export function useDefaultDispatchProps(): DefaultDispatchProps {
	const dispatch = useDispatch();

	return useMemo(() => defaultMapDispatchToProps(dispatch), [dispatch]);
}

/**
 * Reads the state props of the `ScrollHandler` from an {@link EngineState} store.
 *
 * The `ScrollHandler` needs the same `uiIdPrefix` as the Form Engine it wraps,
 * so pass that one as an own prop - only the state derived props are read here.
 *
 * @returns the ui state and the models for the `ScrollHandler`
 */
export function useScrollHandlerProps(): Pick<ScrollHandlerProps, "uiState" | "models"> {
	return useSelector(
		(state: EngineState) => ({
			uiState: state.ui,
			models: state.models
		}),
		shallowEqual
	);
}
