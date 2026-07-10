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

import { deepEqual, equal, notEqual } from "node:assert/strict";
import { mock } from "node:test";

import { Fragment } from "react";

import type { A12ApplicationConfig } from "@com.mgmtp.a12.client/client-core";
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
