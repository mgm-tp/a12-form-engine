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

import { strictEqual } from "node:assert/strict";

import { act } from "react";

import { query, within } from "@com.mgmtp.a12.devtools/react";
import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core";

import { COUNTER } from "../../../rtl-utils/data-roles.js";
import { mouseEventMock } from "../../../rtl-utils/mock-utils.js";
import { loadModels, setupConnectedFormEngineWithRtlAsync } from "../../../utils/setup.js";

describe("api.view.modals", () => {
	describe("warning-info-confirmation", () => {
		describe("when hideConfirmationSummary is not set", () => {
			it("should render confirmation summary", async () => {
				const models = loadModels("computation-validation.errors_and_warnings_and_infos");
				// raises information message
				const data = {
					document: {
						group: {
							Infos: 1,
							StringType: "Test"
						}
					}
				};
				const wrapper = await setupConnectedFormEngineWithRtlAsync({
					models,
					data
				});

				// trigger validation
				const button = query(wrapper.widgetMap.Button).withProp("label", "Validate Full").props();
				await act(() => {
					button.onClick?.(mouseEventMock);
				});

				const modal = within(wrapper.baseElement).getByDataRole(DataRoles.Modal.Overlay);
				const counter = within(modal).getAllByDataRole(COUNTER);

				// there are 2 Counter Widgets rendered in the summary
				strictEqual(counter.length, 2);
			});
		});
		describe("when hideConfirmationSummary is set to true", () => {
			it("should not render confirmation summary", async () => {
				const models = loadModels("buttons");
				// raises warning
				const data = {
					document: {
						group: {
							NumberType: 1
						}
					}
				};
				const wrapper = await setupConnectedFormEngineWithRtlAsync({
					models,
					data
				});

				// trigger validation
				const button = query(wrapper.widgetMap.Button)
					.withProp("label", "Next (Full Validation)")
					.props();
				await act(() => {
					button.onClick?.(mouseEventMock);
				});

				const modal = within(wrapper.baseElement).queryByDataRole(DataRoles.Modal.Overlay);

				// expect no summary to be rendered
				strictEqual(modal, null);
			});
		});
	});
});
