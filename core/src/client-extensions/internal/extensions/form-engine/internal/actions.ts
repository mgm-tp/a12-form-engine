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

import type { Action, Dispatch } from "redux";

import type { View } from "@com.mgmtp.a12.client/client-core";
import { actionCreatorFactory } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";

import type { DefaultDispatchProps } from "../../../../../view/internal/configuration/Defaults.js";
import { defaultMapDispatchToProps } from "../../../../../view/internal/configuration/Defaults.js";

const factory = actionCreatorFactory("Activity");

/**
 * These are container actions for the Form-Engine actions. Every Form-Engine action
 * is wrapped inside one of these actions. This is done to prevent duplication
 * of all Form-Engine event-actions.
 */
export namespace FormEngineActions {
	export interface FormEngineEventActions<T = Action> {
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
	 * Dispatch adapter to dispatch the FormEngineActions.{@link event}
	 * with the activity id and the original action.
	 */
	export function dispatchAdapterFactory(clientDispatch: Dispatch, activityId: string): Dispatch {
		return function dispatchAdapter(engineEvent) {
			clientDispatch(FormEngineActions.event({ engineEvent, activityId }));
			return engineEvent;
		};
	}

	/**
	 * Dispatch adapter to dispatch the FormEngineActions.{@link command}
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
		ownProps: Pick<View, "activityId">
	): DefaultDispatchProps {
		return defaultMapDispatchToProps(
			FormEngineActions.dispatchAdapterFactory(dispatch, ownProps.activityId)
		);
	}
}
