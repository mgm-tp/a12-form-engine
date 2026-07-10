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

import { strictEqual } from "assert/strict";

import { query, screen } from "@com.mgmtp.a12.devtools/react";

import { Tooltips } from "../../../../main/core/contentElements/elementFragments/tooltips.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements.elementFragments", () => {
	describe("Tooltips", () => {
		it("renders an ErrorTooltip if an error is given", () => {
			const errorTooltip = tooltip("error");

			const { widgetMap } = renderWrapper(<Tooltips errorTooltip={errorTooltip} />);

			const props = query(widgetMap.ErrorTooltip).props();

			strictEqual(props.id, errorTooltip.id);
			strictEqual(props.text, errorTooltip.content);
		});

		it("renders a WarningTooltip if a warning is given", () => {
			const warningTooltip = tooltip("warning");

			const { widgetMap } = renderWrapper(<Tooltips warningTooltip={warningTooltip} />);

			const props = query(widgetMap.WarningTooltip).props();

			strictEqual(props.id, warningTooltip.id);
			strictEqual(props.text, warningTooltip.content);
		});

		it("renders a HintTooltip if an info is given", () => {
			const infoTooltip = tooltip("info");

			const { widgetMap } = renderWrapper(<Tooltips infoTooltip={infoTooltip} />);

			const props = query(widgetMap.HintTooltip).props();

			strictEqual(props.id, infoTooltip.id);
			strictEqual(props.text, infoTooltip.content);
		});

		it("renders a HintTooltip if a hint is given", () => {
			const hintTooltip = tooltip("hint");

			const { widgetMap } = renderWrapper(<Tooltips hintTooltip={hintTooltip} />);

			const props = query(widgetMap.HintTooltip).props();

			strictEqual(props.id, hintTooltip.id);
			strictEqual(props.text, hintTooltip.content);
		});

		it("renders tooltips in the correct order", () => {
			const tooltipsProps = {
				errorTooltip: tooltip("error"),
				warningTooltip: tooltip("warning"),
				infoTooltip: tooltip("info"),
				hintTooltip: tooltip("hint")
			};

			renderWrapper(<Tooltips {...tooltipsProps} />);

			const node1 = screen.getById(tooltipsProps.errorTooltip.id);
			const node2 = screen.getById(tooltipsProps.warningTooltip.id);
			const node3 = screen.getById(tooltipsProps.infoTooltip.id);
			const node4 = screen.getById(tooltipsProps.hintTooltip.id);

			strictEqual(node1.compareDocumentPosition(node2), Node.DOCUMENT_POSITION_FOLLOWING);
			strictEqual(node2.compareDocumentPosition(node3), Node.DOCUMENT_POSITION_FOLLOWING);
			strictEqual(node3.compareDocumentPosition(node4), Node.DOCUMENT_POSITION_FOLLOWING);
		});

		it("does not render any tooltips if no props are given", () => {
			const { widgetMap } = renderWrapper(<Tooltips />);

			query(widgetMap.ErrorTooltip).assertNotRendered();
			query(widgetMap.WarningTooltip).assertNotRendered();
			query(widgetMap.HintTooltip).assertNotRendered();
		});
	});
});

function tooltip(type: string) {
	return {
		id: `${type}-tooltip-id`,
		content: `This is a ${type} tooltip`
	};
}
