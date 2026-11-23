// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import type { Store } from "redux";

import { LoggerFactory } from "@com.mgmtp.a12.utils/utils-logging";

import { setup } from "./appsetup.js";
import { AppContainer } from "./components/app/app-container.js";
import { AppContent } from "./components/app/app-content.js";

declare global {
	interface Window {
		store: Store;
	}
}

devapp();

async function devapp() {
	const { store } = await setup();

	/**
	 * Mount Page into the DOM.
	 */
	const mountPoint = document.getElementById("root");
	if (mountPoint) {
		createRoot(mountPoint, {
			onRecoverableError: (err, info) => LoggerFactory.getLogger("APPLICATION").error(err, info)
		}).render(
			<StrictMode>
				<Provider store={store}>
					<AppContainer>
						<AppContent />
					</AppContainer>
				</Provider>
			</StrictMode>
		);
	} else {
		throw new Error("Can't find 'root'-element to render react content.");
	}
}
