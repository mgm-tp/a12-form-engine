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

import { useDispatch } from "react-redux";
import type { Middleware } from "redux";
import { put } from "typed-redux-saga";
import type { SagaGenerator } from "typed-redux-saga";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { View } from "@com.mgmtp.a12.client/client-core";
import { Commands, Events, FormEngineActions } from "@com.mgmtp.a12.formengine/formengine-core";
// tag::dispatchExample[]
// Middleware
export const customMiddleware: Middleware = api => () => () => {
	const formEngineEvent = FormEngineActions.dispatchAdapterFactory(api.dispatch, "MY_ACTIVITY_ID");
	// ...other logic
	formEngineEvent(
		Events.collapseSection({
			path: ModelPath.fromString("/Group/Field1"),
			collapse: true
		})
	);
};

// Saga
export function* customSagaHandler(): SagaGenerator<void> {
	// ...other logic
	yield* put(
		FormEngineActions.command({
			activityId: "MY_ACTIVITY_ID",
			engineEvent: Commands.changeScreen({ screenName: "MyScreen" })
		})
	);
}

// View
export function CustomView(props: View): React.JSX.Element {
	const dispatch = useDispatch();
	const formEngineCommand = FormEngineActions.commandDispatch(dispatch, props.activityId);
	formEngineCommand(Commands.setReadonly(true));
	// ...other logic
	return <></>;
}
// end::dispatchExample[]
