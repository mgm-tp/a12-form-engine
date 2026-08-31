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

import type { JSX } from "react";
import { useCallback, useContext, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import type { Dispatch } from "redux";
import { useDispatch, useSelector, useStore } from "react-redux";

import {
	ActivityActions,
	ActivitySelectors,
	ModelActions,
	NEW_INSTANCE_IDENTIFIER
} from "@com.mgmtp.a12.client/client-core";
import type { createHttpModelLoader } from "@com.mgmtp.a12.client/client-core/modelLoader";
import type { DefaultDispatchProps, ScrollApi } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	FormEngineActions,
	FormEngineSelectors,
	FormEngineStateAdapter,
	FormEngineViews
} from "@com.mgmtp.a12.formengine/formengine-core";
import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { DevappThemeContext } from "../ThemeContextProvider.js";

/** The detail form spawned by the "open-detail" button, see `formEngineModule.tsx`'s dynamically generated `detail-instance-scene`s. */
const DETAIL_FORM_NAME = "customization.masterDetailFocus.detail-form";
const DETAIL_DOCUMENT_NAME = "customization.masterDetailFocus.detail-document";

const EVENT_OPEN_DETAIL = "open-detail";
const EVENT_SCROLL_TO_TOP = "scroll-to-top";
const EVENT_RETURN_TO_INDEX = "return-to-index";

/** Initial `MasterDetail` pane animation duration, applied to the theme on mount (before the form's own `animationDurationMsField` has even been read once). */
const DEFAULT_ANIMATION_DURATION_MS = 300;

/** Readonly display field the reopen countdown is written into, see `writeCountdownDisplay`. */
const REOPEN_COUNTDOWN_FIELD = "reopenCountdownDisplayField";

/**
 * Delays the detail form's *model* load (not its activity/pane creation) so the focus-vs-animation
 * race stays observable despite mock-mode loading normally being instant. A plain module-level
 * value, not React state, since the `ModelLoader` wrapped by `withMasterDetailFocusModelLoadDelay`
 * (in `backend/mock/config.ts`) lives outside the component tree.
 */
const modelLoadDelayState = { nextDelayMs: 0 };

type HttpModelLoader = ReturnType<typeof createHttpModelLoader>;

/** See `modelLoadDelayState`. */
export function withMasterDetailFocusModelLoadDelay(loader: HttpModelLoader): HttpModelLoader {
	return {
		...loader,
		async load(modelDescriptors, existingModels) {
			const delayMs = modelDescriptors.some(
				d => d.name === DETAIL_FORM_NAME || d.name === DETAIL_DOCUMENT_NAME
			)
				? modelLoadDelayState.nextDelayMs
				: 0;

			if (delayMs > 0) {
				await new Promise(resolve => setTimeout(resolve, delayMs));
			}

			return loader.load(modelDescriptors, existingModels);
		}
	};
}

/**
 * Navigates back to the index by cancelling the given top-level activity directly, mirroring the
 * standard `PreviewApplication` back button's plain `ActivityActions.cancel` (see `PreviewView.tsx`)
 * - needed since both forms run `withoutPreview`, hiding that button. This also sidesteps dirty
 * confirmation, which only reacts to `cancelRequested`, not the plain `cancel` used here.
 */
function returnToIndex(dispatch: Dispatch, activityId: string) {
	dispatch(ActivityActions.cancel({ activityId }));
}

const documentService = new DocumentServiceFactory().getDocumentService();

function fieldPath(fieldName: string): EntityInstancePath {
	return [
		{ elementName: "settings", index: 1 },
		{ elementName: fieldName, index: 1 }
	];
}

function readNumberField(document: GroupInstance, fieldName: string): number {
	const value = documentService.getAssignedObject(document, fieldPath(fieldName));
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : 0;
}

function readStringField(document: GroupInstance, fieldName: string): string {
	const value = documentService.getAssignedObject(document, fieldPath(fieldName));
	return typeof value === "string" ? value : "";
}

/**
 * Writes the countdown text into the readonly `reopenCountdownDisplayField` Control, the same
 * DocumentService pattern `writeDirtyStatesInDocumentMiddleware.ts` uses. Reads the document fresh
 * from the store each call (not a closed-over render's `document`) since this also runs from a
 * later `setInterval` tick.
 */
function writeCountdownDisplay(
	store: ReturnType<typeof useStore>,
	dispatch: Dispatch,
	activityId: string,
	value: string
) {
	const state = store.getState() as object;
	const document = FormEngineSelectors.dataState(activityId)(state).document as GroupInstance;
	const documentModel = FormEngineSelectors.models(activityId)(state)?.documentModel;

	if (!documentModel) {
		return;
	}

	const newDocument = documentService.updateEntityInstance(
		document,
		fieldPath(REOPEN_COUNTDOWN_FIELD),
		value,
		documentModel
	);

	dispatch(ActivityActions.setData({ activityId, data: { document: newDocument } }));
}

/**
 * Master pane of the devapp's MasterDetail focus example: clicking "open-detail" immediately adds
 * a second activity's view for the (separately modeled) detail form into `/CONTENT` (see
 * `formEngineModule.tsx`'s `detailInstanceScenes`) - the pane and its enter animation start right
 * away, but that activity's `initiallyFocusedElementId` control focuses as soon as its *model* has
 * loaded, unaware the pane may still be animating in.
 *
 * The delay/animation-duration/safety-delay fields (bound to this form's document, read via
 * `DocumentService` at click time) let that race be explored without leaving the form. The
 * "opening detail" delay only postpones the detail's *model* load (see `modelLoadDelayState`), not
 * the activity/pane itself. The "safety" delay applies only when *reopening* an already-open
 * detail, on top of the animation duration - both are needed to outlast the old pane's exit
 * transition before a new one mounts (see the `flushSync`/countdown below). The countdown itself
 * renders via a readonly `reopenCountdownDisplayField` Control (see `writeCountdownDisplay`).
 */
export function MasterDetailFocusEngine(props: FormEngineViews.FormEngineProps): JSX.Element {
	const state = useSelector(state => state);
	const dispatch = useDispatch();
	const store = useStore();

	const { setMasterDetailAnimationDurationMs } = useContext(DevappThemeContext);

	useEffect(() => {
		setMasterDetailAnimationDurationMs(DEFAULT_ANIMATION_DURATION_MS);
		return () => setMasterDetailAnimationDurationMs(undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const document = FormEngineSelectors.dataState(props.activityId)(state).document as GroupInstance;

	// Read fresh on every render (not just at click time) so the readout below always reflects
	// the current field values, including whatever the user is actively editing.
	const reopenSafetyDelayMs = readNumberField(document, "reopenSafetyDelayMsField");

	// The countdown field's own text doubles as the "a reopen wait is in flight" signal (non-empty
	// while counting down, see `writeCountdownDisplay`) - reused here rather than adding a second,
	// redundant document field just to track the same boolean condition.
	const reopenInFlight = readStringField(document, REOPEN_COUNTDOWN_FIELD) !== "";

	const propsWithEnablements: FormEngineViews.FormEngineProps = {
		...props,
		enablements: {
			byButtonName: {
				[EVENT_OPEN_DETAIL]: { disabled: reopenInFlight }
			}
		}
	};

	const stateProps = FormEngineStateAdapter.mapStateToProps(state, propsWithEnablements);

	const currentDetailActivityId = useRef<string>(undefined);
	const detailIdCounter = useRef(0);
	const reopenIntervalRef = useRef<number>(undefined);

	useEffect(() => () => window.clearInterval(reopenIntervalRef.current), []);

	function onEventButton(eventName: string) {
		if (eventName === EVENT_RETURN_TO_INDEX) {
			returnToIndex(dispatch, props.activityId);
			return;
		}

		if (eventName !== EVENT_OPEN_DETAIL) {
			return;
		}

		// A reopen wait (see below) is already counting down toward its own `openDetail` - a click
		// landing in that window is a no-op rather than cancelling the wait, or the old pane's exit
		// transition would never get its full window to play before a new one mounts.
		if (reopenIntervalRef.current !== undefined) {
			return;
		}

		const delayMs = readNumberField(document, "openDetailDelayMsField");
		const animationDurationMs = readNumberField(document, "animationDurationMsField");
		setMasterDetailAnimationDurationMs(animationDurationMs);

		function openDetail() {
			modelLoadDelayState.nextDelayMs = delayMs;

			const activityId = `${props.activityId}-detail-${++detailIdCounter.current}`;
			currentDetailActivityId.current = activityId;

			dispatch(
				ActivityActions.create({
					activityId,
					activityDescriptor: {
						instance: NEW_INSTANCE_IDENTIFIER,
						formName: DETAIL_FORM_NAME,
						isDetail: "true"
					},
					initiatingActivityId: props.activityId
				})
			);
		}

		if (currentDetailActivityId.current === undefined) {
			dispatch(
				ModelActions.setModels({
					[DETAIL_FORM_NAME]: undefined,
					[DETAIL_DOCUMENT_NAME]: undefined
				})
			);
			openDetail();
			return;
		}

		const previousDetailActivityId = currentDetailActivityId.current;

		// The MasterDetail pane's enter/exit transition is keyed by *position*, not activity - removing
		// and recreating within the same commit would just swap content in place, without the browser
		// ever painting the intermediate "no detail" frame. flushSync forces the removal to commit
		// synchronously; the wait that follows (covering the full `animationDurationMs`, not just the
		// safety-delay field/countdown below) gives the browser time to actually paint that frame and
		// finish the old pane's exit before the new one mounts.
		flushSync(() => {
			dispatch(ActivityActions.cancel({ activityId: previousDetailActivityId }));
			currentDetailActivityId.current = undefined;

			// Models are cached by name, independently of any activity - without clearing them here,
			// a later "open-detail" click would find the detail form's model already loaded from a
			// previous click, so the model load delay above would have nothing left to delay.
			dispatch(
				ModelActions.setModels({
					[DETAIL_FORM_NAME]: undefined,
					[DETAIL_DOCUMENT_NAME]: undefined
				})
			);
		});

		const reopenWaitMs = animationDurationMs + reopenSafetyDelayMs;
		const deadline = Date.now() + reopenWaitMs;
		writeCountdownDisplay(
			store,
			dispatch,
			props.activityId,
			`Reopening detail in ${Math.ceil(reopenWaitMs)}ms…`
		);
		reopenIntervalRef.current = window.setInterval(() => {
			const remainingMs = deadline - Date.now();
			if (remainingMs <= 0) {
				window.clearInterval(reopenIntervalRef.current);
				// `clearInterval` only stops the timer - the ref must be reset too, or the "a reopen
				// wait is in flight" guard above would see this stale (now-invalid) interval id and
				// treat every future click as a no-op forever.
				reopenIntervalRef.current = undefined;
				writeCountdownDisplay(store, dispatch, props.activityId, "");
				openDetail();
			} else {
				writeCountdownDisplay(
					store,
					dispatch,
					props.activityId,
					`Reopening detail in ${Math.ceil(remainingMs)}ms…`
				);
			}
		}, 100);
	}

	const defaultDispatchProps = FormEngineActions.mapDispatchToProps(dispatch, props);
	const dispatchProps: DefaultDispatchProps = {
		...defaultDispatchProps,
		eventHandlers: {
			...defaultDispatchProps.eventHandlers,
			onEventButton
		}
	};

	return <FormEngineViews.FormEngineTpl {...props} {...stateProps} {...dispatchProps} />;
}

/**
 * Detail pane of the devapp's MasterDetail focus example - handles this form's own
 * "scroll-to-top" (see `customization.scroll-api`'s `ScrollApiEngine`, the pattern this mirrors)
 * and "return-to-index" buttons.
 */
export function MasterDetailFocusDetailEngine(props: FormEngineViews.FormEngineProps): JSX.Element {
	const state = useSelector(state => state);
	const dispatch = useDispatch();

	const stateProps = FormEngineStateAdapter.mapStateToProps(state, props);

	const scrollRef = useRef<ScrollApi>(null);

	// Cancels the *master* activity (looked up via `initiatingActivityId`) to fully return to index,
	// falling back to this activity's own id if opened standalone (no `initiatingActivityId`).
	const masterActivityId = useSelector(
		ActivitySelectors.activityPropById(props.activityId, activity => activity.initiatingActivityId)
	);

	const onEventButton = useCallback(
		(eventName: string) => {
			if (eventName === EVENT_SCROLL_TO_TOP) {
				scrollRef.current?.scrollToTop();
			} else if (eventName === EVENT_RETURN_TO_INDEX) {
				returnToIndex(dispatch, masterActivityId ?? props.activityId);
			}
		},
		[dispatch, masterActivityId, props.activityId]
	);

	const defaultDispatchProps = FormEngineActions.mapDispatchToProps(dispatch, props);
	const dispatchProps: DefaultDispatchProps = {
		...defaultDispatchProps,
		eventHandlers: {
			...defaultDispatchProps.eventHandlers,
			onEventButton
		}
	};

	return (
		<FormEngineViews.FormEngineTpl
			{...props}
			{...stateProps}
			{...dispatchProps}
			scrollRef={scrollRef}
		/>
	);
}
