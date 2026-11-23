// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useDispatch } from "react-redux";
import type { Middleware } from "redux";
import { put } from "typed-redux-saga";
import type { SagaGenerator } from "typed-redux-saga";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
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
