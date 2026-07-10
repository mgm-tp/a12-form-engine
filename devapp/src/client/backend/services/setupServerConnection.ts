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

import type { Store } from "redux";

import {
	ApplicationActions,
	ModelActions,
	NotificationActions
} from "@com.mgmtp.a12.client/client-core";
import { ModelGraph } from "@com.mgmtp.a12.dataservices/dataservices-access";
import { ConnectorLocator, RestServerConnector } from "@com.mgmtp.a12.utils/utils-connector";

import { createServerConnectionFailedErrorMessage } from "../utils.js";

import { JwtTokenFilter } from "./JwtTokenFilter.js";
import { waitForServer } from "./waitForServer.js";

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
