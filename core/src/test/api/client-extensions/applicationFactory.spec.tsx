// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepEqual, equal, notEqual } from "node:assert/strict";
import { mock } from "node:test";

import { Fragment } from "react";

import type { A12ApplicationConfig } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import { render } from "@com.mgmtp.a12.devtools/react";

import {
	createFormEngineMiddlewares,
	formEngineDataReducers,
	formEngineSagas,
	FormEngineViews,
	FormModelProcessor
} from "../../../client-extensions/index.js";
import {
	withConfiguredFormEngine,
	withFormEngine
} from "../../../client-extensions/internal/core/index.js";

describe("api.client-extensions.applicationFactory", () => {
	it("withConfiguredFormEngine", () => {
		const baseConfig: A12ApplicationConfig = {
			config: {},
			formEngine: {
				viewConfig: { ariaLevel: 42 }
			}
		};

		const result = withConfiguredFormEngine(baseConfig);

		const TestComponent = mock.fn();
		const NewView = result.config.viewModifications?.("FormEngine")?.(TestComponent) ?? Fragment;
		render(<NewView name={"Test"} activityId={"1"} />);
		deepEqual(TestComponent.mock.calls[0].arguments[0], {
			name: "Test",
			activityId: "1",
			ariaLevel: 42
		});
	});

	it("withFormEngine", () => {
		const baseConfig: A12ApplicationConfig = { config: {} };

		const result = withFormEngine(baseConfig);

		equal(result.configured.formEngine, true);
		equal(result.config.dataHandlers?.length, 2);
		deepEqual(result.config.dataReducers, formEngineDataReducers);
		equal(result.config.additionalMiddlewares?.length, createFormEngineMiddlewares().length);
		equal(result.config.customSagas?.length, formEngineSagas().length);
		equal(result.config.views?.("FormEngine"), FormEngineViews.FormEngine);
		deepEqual(result.modelLoader?.modelProcessors, [FormModelProcessor]);
		notEqual(result.modelLoader.supportedModelVersions?.form, undefined);
	});
});
