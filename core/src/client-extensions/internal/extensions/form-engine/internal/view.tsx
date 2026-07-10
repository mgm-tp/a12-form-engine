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

/**
 * This is the View adapter for the Form Engine.
 *
 * @packageDocumentation
 */

import deepEqual from "fast-deep-equal";
import type { JSX } from "react";
import { memo, useMemo, useRef } from "react";
import { connect, shallowEqual } from "react-redux";

import type { View } from "@com.mgmtp.a12.client/client-core";
import { ActivitySelectors, ViewViews } from "@com.mgmtp.a12.client/client-core";

import type { PickOptional } from "../../../../../back-end/utils/internal/types.js";
import type {
	Config,
	DefaultDispatchProps,
	DefaultStateProps,
	FormEngineRendererPropsType,
	ScrollApi,
	ScrollHandlerProps
} from "../../../../../view/index.js";
import { FormEngineRenderer, ScrollHandler } from "../../../../../view/index.js";
import {
	createRenderGuardComponent,
	Placeholder
} from "../../../core/view/internal/components/createRenderGuardComponent.js";

import { FormEngineActions } from "./actions.js";
import { FormEngineStateAdapter } from "./state.js";
import { useFocus } from "./useFocus.js";
import { useScrollToTop } from "./useScrollToTop.js";

export type EngineCompositionProps = Pick<View, "activityId" | "ariaLevel"> &
	FormEngineRendererPropsType &
	Omit<ScrollHandlerProps, "uiState" | "models" | "children">;

/**
 * FormEngineTpl can be rendered with optional state and config that are
 * usually created by mapStateToProps and that are protected by the RenderGuard.
 */
export type FormEngineTplProps = PickOptional<EngineCompositionProps, "state" | "config">;

/**
 * FormEngine can be rendered with an incomplete config, that is extended by mapStateToProps.
 * EventHandlers and state are forbidden, as they come from mapDispatchToProps / mapStateToProps.
 */
export type FormEngineProps = Omit<EngineCompositionProps, "eventHandlers" | "state" | "config"> &
	Partial<Config>;

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
			<ScrollHandler
				models={props.state.models}
				uiState={props.state.ui}
				disableRepeatBehavior={props.disableRepeatBehavior}
				disableScrollToTopLevelScreen={props.disableScrollToTopLevelScreen}
				uiIdPrefix={props.uiIdPrefix}
			>
				<FormEngineRenderer
					config={props.config}
					eventHandlers={props.eventHandlers}
					state={props.state}
					scrollRef={scrollRef}
				/>
			</ScrollHandler>
		</ViewViews.ActivityContext.Provider>
	);
}

/** @internal */
export const FormEngineViewTpl = createRenderGuardComponent(
	memo(EngineComposition, areStatePropsEqual),
	propsAreComplete,
	shouldComponentUpdate,
	Placeholder,
	false
);

/** @internal */
export const FormEngineView = connect<
	Partial<DefaultStateProps>,
	DefaultDispatchProps,
	FormEngineProps,
	object
>(
	FormEngineStateAdapter.mapStateToProps,
	FormEngineActions.mapDispatchToProps
)(FormEngineViewTpl);

function propsAreComplete(
	props: Partial<Pick<EngineCompositionProps, "config" | "state">>
): props is EngineCompositionProps {
	const { config, state } = props;
	return config !== undefined && state !== undefined;
}

function shouldComponentUpdate(state: object, props: EngineCompositionProps): boolean {
	const formEngineLoadingState = ActivitySelectors.loadingStateById(props.activityId)(state);
	return (
		formEngineLoadingState === "loaded" ||
		formEngineLoadingState === "error" ||
		formEngineLoadingState === "without"
	);
}

/**
 * The state props are re-recreated by the mapping in
 * `FormEngineStateAdapter.mapStateToProps` (and possibly also
 * `defaultMapStateToProps`). Therefore, we need to navigate down in the state
 * props objects until we have some stable props.
 */
function areStatePropsEqual(
	prevProps: Partial<DefaultStateProps>,
	curProps: Partial<DefaultStateProps>
): boolean {
	if (prevProps.state === undefined || curProps.state === undefined) {
		return prevProps.state === curProps.state;
	}

	return (
		shallowEqual(prevProps.config, curProps.config) &&
		prevProps.state.locale === curProps.state.locale &&
		prevProps.state.data.dirty === curProps.state.data.dirty &&
		prevProps.state.data.document === curProps.state.data.document &&
		deepEqual(prevProps.state.data.attachmentState, curProps.state.data.attachmentState) &&
		prevProps.state.models.documentModel === curProps.state.models.documentModel &&
		prevProps.state.models.formModel === curProps.state.models.formModel &&
		shallowEqual(prevProps.state.ui, curProps.state.ui)
	);
}
