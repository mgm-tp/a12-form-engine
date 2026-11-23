// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { query, screen, within } from "@com.mgmtp.a12.devtools/react";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { ValidationMessages } from "../../../../view/internal/components/widgets/validationMessages.js";
import { BULLET_LIST_ITEM } from "../../../rtl-utils/data-roles.js";
import { rtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("api.view.ValidationMessages", () => {
	describe("given no validation messages", () => {
		it("does not render anything", () => {
			rtlRenderWrapper(<ValidationMessages id="MyId" messages={[]} />);

			const text = screen.queryByText(/./);
			strictEqual(text, null, "No text should be rendered");
		});
	});

	describe("given one validation message", () => {
		it("renders the single message", () => {
			const message = "My Message";
			const { container } = rtlRenderWrapper(
				<ValidationMessages id="MyId" messages={[createLocalizables(message)]} />
			);

			strictEqual(container.textContent, message);
		});
	});

	describe("given multiple validation messages", () => {
		it("renders a list of messages", () => {
			const { widgetMap } = rtlRenderWrapper(
				<ValidationMessages
					id="MyId"
					messages={[
						createLocalizables("My Message 1"),
						createLocalizables("My Message 2"),
						createLocalizables("My Message 3")
					]}
				/>
			);

			query(widgetMap.BulletListUnordered).withId("MyId").assertRenderedTimes(1);

			const items = within(screen.getById("MyId")).getAllByDataRole(BULLET_LIST_ITEM);

			strictEqual(items.length, 3, "Expected to find 3 list items");

			strictEqual(items[0].textContent, "My Message 1");
			strictEqual(items[1].textContent, "My Message 2");
			strictEqual(items[2].textContent, "My Message 3");
		});
	});
});

function createLocalizables(text: string): Localizable[] {
	return [{ key: "test", defaults: { en: text, de: text } }];
}
