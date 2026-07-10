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

import { Provider } from "react-redux";

import type { Activity } from "@com.mgmtp.a12.client/client-core";
import { ViewViews } from "@com.mgmtp.a12.client/client-core";
import { query } from "@com.mgmtp.a12.devtools/react";

import type { UniqueConstraintError } from "../../../../client-extensions/internal/extensions/platform-server-connectors/internal/UniqueConstraintError.js";
import { UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE } from "../../../../client-extensions/internal/extensions/platform-server-connectors/internal/UniqueConstraintError.js";
import { UniqueConstraintViolationBar } from "../../../../view/internal/components/form-engine/UniqueConstraintViolationBar.js";
import { getComponentMocks } from "../../../rtl-utils/getComponentMocks.js";
import { rtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import type { RtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import { createActivity, createStore, TEST_ACTIVITY_ID } from "../../../utils/client-helpers.js";

function renderWithError(error?: Activity.Error<UniqueConstraintError>): RtlRenderWrapper {
	const { store } = createStore({
		activities: [createActivity({ id: TEST_ACTIVITY_ID, error })]
	});

	return rtlRenderWrapper(
		<Provider store={store}>
			<ViewViews.ActivityContext.Provider value={{ activityId: TEST_ACTIVITY_ID }}>
				<UniqueConstraintViolationBar />
			</ViewViews.ActivityContext.Provider>
		</Provider>,
		{ componentMap: getComponentMocks() }
	);
}

describe("api.view.UniqueConstraintViolationBar", () => {
	it("should not render when there is no activity context", () => {
		const { store } = createStore();

		const { widgetMap } = rtlRenderWrapper(
			<Provider store={store}>
				<UniqueConstraintViolationBar />
			</Provider>
		);

		query(widgetMap.GlobalMessageBox).assertNotRendered();
	});

	it("should not render when there is no error on the activity", () => {
		const { widgetMap } = renderWithError();
		query(widgetMap.GlobalMessageBox).assertNotRendered();
	});

	it("should not render when the activity error is not a unique constraint error", () => {
		const { widgetMap } = renderWithError({ errorCode: "INTERNAL_CLIENT_ERROR" });

		query(widgetMap.GlobalMessageBox).assertNotRendered();
	});

	it("should render all violation messages", () => {
		const localizables = [
			{
				key: "formEngine.uniqueConstraintViolation.name",
				defaults: { en: "Name must be unique" }
			},
			{
				key: "formEngine.uniqueConstraintViolation.email",
				defaults: { en: "Email must be unique" }
			}
		];

		const { widgetMap, componentMap } = renderWithError({
			errorCode: UNIQUE_CONSTRAINT_VIOLATION_ERROR_CODE,
			messages: localizables
		});

		query(widgetMap.GlobalMessageBox).withProp("variant", "error").assertRenderedTimes(1);
		query(componentMap.MessageList)
			.withProp(
				"messages",
				localizables.map(l => [l])
			)
			.assertRenderedTimes(1);
	});
});
