// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import "./config/index.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import type { Store } from "redux";

import type { CustomConfig } from "./appsetup.js";
import { createAppSetup } from "./appsetup.js";
import { loadLocalModelGraph, mockConfig } from "./backend/mock/config.js";
import { defaultBackendConfig } from "./backend/services/config.js";
import { setupServerConnection } from "./backend/services/setupServerConnection.js";
import { DEVAPP_MODE } from "./config/mode.js";
import { ResizableDevApp } from "./ResizableDevApp.js";

function getConfigForMode(): [CustomConfig, (store: Store) => Promise<void>] {
	switch (DEVAPP_MODE) {
		case "mock":
			return [mockConfig, loadLocalModelGraph];
		case "services":
			return [defaultBackendConfig, setupServerConnection];
	}
}

const [config, initialActions] = getConfigForMode();

const root = createRoot(document.getElementById("root") as HTMLDivElement);
const { store } = createAppSetup(config);

root.render(
	<StrictMode>
		<Provider store={store}>
			<ResizableDevApp />
		</Provider>
	</StrictMode>
);

await initialActions(store);
