// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Store } from "redux";

import { ApplicationActions } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import { ModelActions } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { NotificationActions } from "@com.mgmtp.a12.client/client-core/lib/core/notification/index.js";
import { ModelGraph } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Relationship/index.js";
import {
	ConnectorLocator,
	RestServerConnector
} from "@com.mgmtp.a12.utils/utils-connector/lib/main/index.js";

import { createServerConnectionFailedErrorMessage } from "../utils.js";

import { JwtTokenFilter } from "./JwtTokenFilter.js";
import { waitForServer } from "./wait.js";

// has to match with "resources/server/src/main/resources/users.yaml"
const DEV_CREDENTIALS = { username: "dev", password: "dev" };

/**
 * Sets up the server connector and the connection to the A12 services server
 * for **development** and sets the model graph.
 *
 * This needs to run before any server request is done.
 */
export async function setupServerConnection(store: Store): Promise<void> {
	const { dispatch } = store;
	const jwtTokenFilter = new JwtTokenFilter();

	const serverConnector = new RestServerConnector("../api", [jwtTokenFilter]);
	ConnectorLocator.createInstance(serverConnector);

	dispatch(ApplicationActions.setBusy(true));

	await waitForServer(store);

	try {
		const response = await serverConnector.fetchData({
			method: "POST",
			relativeUrl: "/user/local/login",
			body: JSON.stringify(DEV_CREDENTIALS)
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		} else {
			jwtTokenFilter.jwtToken = response.headers.get("access_token");
			if (!jwtTokenFilter.jwtToken) {
				throw new Error("Cannot find access_token in login response.");
			}

			const modelGraph = await serverConnector
				.fetchData(ModelGraph.build(true))
				.then(r => r.json());

			dispatch(ModelActions.setModelGraph(modelGraph));
			dispatch(ApplicationActions.setBusy(false));
		}
	} catch (error) {
		dispatch(NotificationActions.add(createServerConnectionFailedErrorMessage(error)));
		throw error;
	}
}
