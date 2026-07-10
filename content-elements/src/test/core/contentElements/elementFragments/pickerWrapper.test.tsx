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

import { deepStrictEqual, notStrictEqual, strictEqual } from "assert/strict";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import { provider as deviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";

import { PickerWrapper } from "../../../../main/core/contentElements/elementFragments/pickerWrapper.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements.elementFragments", () => {
	describe("PickerWrapper", () => {
		describe("mobile mode", () => {
			it("renders a ModalOverlay with the correct properties", () => {
				mock.method(deviceDetector, "get", () => "phone");

				const wrapperProps = {
					referenceElement: document.createElement("div"),
					children: "Test Children",
					updateElementPosition: () => {},
					onClose: () => {}
				};
				const { widgetMap } = renderWrapper(<PickerWrapper {...wrapperProps} />);

				const modalProps = query(widgetMap.ModalOverlay).props();

				strictEqual(modalProps.children, wrapperProps.children);
				strictEqual(modalProps.onClose, wrapperProps.onClose);
				strictEqual(modalProps.closeOnOutsideClick, true);
			});
		});

		describe("desktop mode", () => {
			beforeEach(() => {
				mock.method(deviceDetector, "get", () => "desktop");
			});

			it("renders an AttachedPortal with the correct properties", () => {
				const wrapperProps = {
					referenceElement: document.createElement("div"),
					children: "Test Children",
					updateElementPosition: () => {},
					onClose: () => {}
				};
				const { widgetMap } = renderWrapper(<PickerWrapper {...wrapperProps} />);

				const portalProps = query(widgetMap.AttachedPortal).props();

				strictEqual(portalProps.children, wrapperProps.children);
				strictEqual(portalProps.referenceElement, wrapperProps.referenceElement);
				strictEqual(portalProps.updateElementPosition, wrapperProps.updateElementPosition);

				notStrictEqual(portalProps.onVisibilityChange, undefined);
				strictEqual(portalProps.closeOnOutsideClick, true);
				strictEqual(portalProps.selfSizing, true);
				strictEqual(portalProps.adjustPositionToScreen, true);
				strictEqual(portalProps.fixedOrientation, true);
				deepStrictEqual(portalProps.orientationList, [
					"bottom-start",
					"bottom-end",
					"top-start",
					"top-end",
					"right",
					"left"
				]);
			});

			it("onVisibilityChange calls onClose when the visibility changes to false", () => {
				const wrapperProps = {
					referenceElement: document.createElement("div"),
					onClose: mock.fn()
				};
				const { widgetMap } = renderWrapper(<PickerWrapper {...wrapperProps} />);

				const portalProps = query(widgetMap.AttachedPortal).props();
				const onVisibilityChange = portalProps.onVisibilityChange;

				onVisibilityChange?.(false);

				strictEqual(wrapperProps.onClose.mock.callCount(), 1);
			});

			it("onVisibilityChange does not call onClose when the visibility changes to true", () => {
				mock.method(deviceDetector, "get", () => "desktop");

				const wrapperProps = {
					referenceElement: document.createElement("div"),
					onClose: mock.fn()
				};
				const { widgetMap } = renderWrapper(<PickerWrapper {...wrapperProps} />);

				const portalProps = query(widgetMap.AttachedPortal).props();
				const onVisibilityChange = portalProps.onVisibilityChange;

				onVisibilityChange?.(true);

				strictEqual(wrapperProps.onClose.mock.callCount(), 0);
			});
		});
	});
});
