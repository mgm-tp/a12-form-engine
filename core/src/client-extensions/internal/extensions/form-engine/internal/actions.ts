// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { AnyAction, Dispatch } from "redux";
import { actionCreatorFactory } from "typescript-fsa";

import type { View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";

import type { Config, ScrollHandlerProps } from "../../../../../view/index.js";
import type { DefaultDispatchProps } from "../../../../../view/internal/configuration/Defaults.js";
import { defaultMapDispatchToProps } from "../../../../../view/internal/configuration/Defaults.js";

const factory = actionCreatorFactory("Activity");

/**
 * These are container actions for the Form-Engine actions. Every Form-Engine action
 * is wrapped inside one of these actions. This is done to prevent duplication
 * of all Form-Engine event-actions.
 */
export namespace FormEngineActions {
	export interface FormEngineEventActions<T = AnyAction> {
		/** Activity that holds the Form Engine state. */
		readonly activityId: string;

		/** Original Form Engine action */
		readonly engineEvent: T;
	}

	/** Action to wrap Form-Engine event-actions. */
	export const event = factory<FormEngineEventActions>("FORM-ENGINE-EVENT");

	/** Action to wrap Form-Engine command-actions. */
	export const command = factory<FormEngineEventActions>("FORM-ENGINE-COMMAND");

	/**
	 * Dispatch adapter to dispatch the {@link FormEngineActions.event}
	 * with the activity id and the original action.
	 */
	export function dispatchAdapterFactory(clientDispatch: Dispatch, activityId: string): Dispatch {
		return function dispatchAdapter(engineEvent) {
			clientDispatch(FormEngineActions.event({ engineEvent, activityId }));
			return engineEvent;
		};
	}

	/**
	 * Dispatch adapter to dispatch the {@link FormEngineActions.command}
	 * with the activity id and the original action.
	 */
	export function commandDispatch(clientDispatch: Dispatch, activityId: string): Dispatch {
		return function dispatchAdapter(engineEvent) {
			clientDispatch(FormEngineActions.command({ engineEvent, activityId }));
			return engineEvent;
		};
	}

	/**
	 * Creates the default dispatch props mapping.
	 */
	export function mapDispatchToProps(
		dispatch: Dispatch,
		ownProps: View & Partial<Config> & Partial<ScrollHandlerProps>
	): DefaultDispatchProps {
		return defaultMapDispatchToProps(
			FormEngineActions.dispatchAdapterFactory(dispatch, ownProps.activityId)
		);
	}
}
