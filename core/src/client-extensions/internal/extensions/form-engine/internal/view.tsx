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

/**
 * This is the View adapter for the Form Engine.
 *
 * @packageDocumentation
 */

import deepEqual from "fast-deep-equal";
import type { JSX } from "react";
import { memo, useMemo, useRef } from "react";
import { connect } from "react-redux";

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import { ViewViews } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";

import type {
	Config,
	DefaultDispatchProps,
	DefaultStateProps,
	FormEngineRendererPropsType,
	ScrollApi,
	ScrollHandlerProps
} from "../../../../../view/index.js";
import { FormEngineRenderer, ScrollHandler } from "../../../../../view/index.js";
import { createRenderGuardComponent } from "../../../core/view/internal/components/createRenderGuardComponent.js";

import { FormEngineActions } from "./actions.js";
import { FormEngineStateAdapter } from "./state.js";
import { useFocus } from "./useFocus.js";
import { useScrollToTop } from "./useScrollToTop.js";

type EngineCompositionProps = View & FormEngineRendererPropsType & ScrollHandlerProps;

function EngineComposition(props: EngineCompositionProps): JSX.Element | null {
	const activityId = props.activityId;

	const internalScrollRef = useRef<ScrollApi>(null);
	const scrollRef = props.scrollRef ?? internalScrollRef;

	useScrollToTop({
		scrollRef,
		activityId,
		disable: props.disableScrollToTopLevelScreen
	});

	useFocus({
		scrollRef,
		activityId
	});

	const activityContextValue = useMemo(
		() => ({ activityId: props.activityId }),
		[props.activityId]
	);

	return (
		<ViewViews.ActivityContext.Provider value={activityContextValue}>
			<ScrollHandler {...props} models={props.state.models} uiState={props.state.ui}>
				<FormEngineRenderer {...props} scrollRef={scrollRef} />
			</ScrollHandler>
		</ViewViews.ActivityContext.Provider>
	);
}

/** @internal */
export const FormEngineViewTpl = createRenderGuardComponent(
	memo(EngineComposition, areStatePropsEqual),
	propsAreComplete,
	shouldComponentUpdate
);

/** @internal */
export const FormEngineView = connect<
	Partial<DefaultStateProps>,
	DefaultDispatchProps,
	View & Partial<Config> & Partial<ScrollHandlerProps>
>(
	FormEngineStateAdapter.mapStateToProps,
	FormEngineActions.mapDispatchToProps
)(FormEngineViewTpl);

function propsAreComplete(props: Partial<EngineCompositionProps>): props is EngineCompositionProps {
	const { config, state } = props;
	return config !== undefined && state !== undefined;
}

function shouldComponentUpdate(state: object, props: Partial<EngineCompositionProps>): boolean {
	if (props.activityId === undefined) {
		return false;
	}

	const formEngineLoadingState = ActivitySelectors.loadingStateById(props.activityId)(state);
	return formEngineLoadingState === "loaded" || formEngineLoadingState === "error";
}

/**
 * The state props are re-recreated by the mapping in
 * `FormEngineStateAdapter.mapStateToProps` (and possibly also
 * `defaultMapStateToProps`). Therefore, we need to navigate down in the state
 * props objects until we have some stable props.
 *
 * @internal
 */
export function areStatePropsEqual(
	prevProps: Partial<DefaultStateProps>,
	curProps: Partial<DefaultStateProps>
): boolean {
	if (prevProps.state === undefined || curProps.state === undefined) {
		return prevProps.state === curProps.state;
	}

	return (
		areConfigsEqual(prevProps.config, curProps.config) &&
		prevProps.state.locale === curProps.state.locale &&
		prevProps.state.data.dirty === curProps.state.data.dirty &&
		prevProps.state.data.document === curProps.state.data.document &&
		deepEqual(prevProps.state.data.attachmentState, curProps.state.data.attachmentState) &&
		prevProps.state.models.documentModel === curProps.state.models.documentModel &&
		prevProps.state.models.formModel === curProps.state.models.formModel &&
		arePropsEqual(prevProps.state.ui, curProps.state.ui)
	);
}

function areConfigsEqual(c1: Config | undefined, c2: Config | undefined): boolean {
	if (c1 === undefined || c2 === undefined) {
		return c1 === c2;
	}
	return arePropsEqual(c1, c2);
}

// shortcut so that we don't have to list all props here
function arePropsEqual<T extends object>(d1: T, d2: T): boolean {
	const k1 = Object.keys(d1) as (keyof T)[];
	const k2 = Object.keys(d2);
	return k1.length === k2.length && k1.every(p1 => d1[p1] === d2[p1]);
}
