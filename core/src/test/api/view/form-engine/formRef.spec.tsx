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
 * 1. Open-Source License – EUPL v1.2
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
import { mock } from "node:test";

import { createRef, type RefObject } from "react";

import { screen } from "@com.mgmtp.a12.devtools/react";
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.api.js";

import type { Models } from "../../../../back-end/store/index.js";
import { type ScrollApi, type WidgetMap } from "../../../../view/index.js";
import { SetupHelpers } from "../../../utils/setup.js";

describe("api.view.scrollRef", () => {
	it("contains scrollToTop which, when called, scrolls to the top of the form", () => {
		const scrollIntoViewStub = mock.method(Element.prototype, "scrollIntoView");

		// any model will do
		const scrollRef = render(SetupHelpers.loadModels("styles"));
		scrollRef.current?.scrollToTop();

		strictEqual(scrollIntoViewStub.mock.callCount(), 1, "one scroll event");

		const form = document.querySelector("[data-role='form']");
		strictEqual(scrollIntoViewStub.mock.calls[0].this, form, "form DIV scrolled into view");
	});

	// note: do not mock.method on focus as is it is monkey-patched by RTL userEvent
	it("contains focusElement which, when called for a model with initiallyFocusedElementId, focuses a specific control of the form", () => {
		// model with initiallyFocusedElementId
		const scrollRef = render(SetupHelpers.loadModels("customization.scroll-api"));
		scrollRef.current?.focusElement();

		const focusTarget = screen.getById("a12-StringField-field_13ec5");
		strictEqual(focusTarget === document.activeElement, true, "focus target receives focus");
	});

	it("contains focusElement which, when called for a model without initiallyFocusedElementId, focuses nothing", () => {
		// any model without initiallyFocusedElementId will do
		const scrollRef = render(SetupHelpers.loadModels("styles"));

		const focusedElementBefore = document.activeElement;
		scrollRef.current?.focusElement();

		strictEqual(document.activeElement, focusedElementBefore, "focus target unchanged");
	});

	/**
	 * Renders the given models and returns a scrollRef so that a focus can be
	 * triggered.
	 */
	function render(models: Models): RefObject<ScrollApi | null> {
		const widgetMap: Partial<WidgetMap> = {
			TextLineStateless: mock.fn(TextLineWithRef)
		};

		const scrollRef = createRef<ScrollApi>();
		SetupHelpers.setupFormEngineRendererWithRtl({
			models,
			scrollRef,
			config: { widgetMap }
		});

		return scrollRef;
	}

	// specific mock with ref support
	function TextLineWithRef(props: TextLineStatelessProps) {
		return <div id={props.id} ref={props.inputRef} tabIndex={-1}></div>;
	}
});
