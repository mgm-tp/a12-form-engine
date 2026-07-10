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

import { query, screen, within } from "@com.mgmtp.a12.devtools/react";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { ValidationMessages } from "../../../../main/core/contentElements/elementFragments/validationMessages.js";
import { getMockLocalization } from "../../../mocks/getMockLocalization.js";
import { BULLET_LIST_ITEM } from "../../../rtl-utils/data-roles.js";
import { renderWrapper } from "../../../rtl-utils/render-wrapper.js";

describe("core.contentElements.elementFragments", () => {
	describe("ValidationMessages", () => {
		it("does not render anything if no messages are given", () => {
			renderWrapper(
				<LocalizerContext.Provider value={getMockLocalization()}>
					<ValidationMessages id="test-id" messages={[]} />
				</LocalizerContext.Provider>
			);

			const text = screen.queryByText(/./);
			strictEqual(text, null);
		});

		it("renders the localized message as a simple string if a single message is given", () => {
			const localizableKey = "test.message";

			const { container } = renderWrapper(
				<LocalizerContext.Provider value={getMockLocalization()}>
					<ValidationMessages id="test-id" messages={[[{ key: localizableKey }]]} />
				</LocalizerContext.Provider>
			);

			strictEqual(container.textContent, localizableKey);
		});

		it("renders localized messages in an unordered list if multiple messages are given", () => {
			const localizableKeys = ["test.message.1", "test.message.2", "test.message.3"];

			const { widgetMap } = renderWrapper(
				<LocalizerContext.Provider value={getMockLocalization()}>
					<ValidationMessages
						id="test-id"
						messages={[
							[{ key: localizableKeys[0] }],
							[{ key: localizableKeys[1] }],
							[{ key: localizableKeys[2] }]
						]}
					/>
				</LocalizerContext.Provider>
			);

			const listProps = query(widgetMap.BulletListUnordered).props();

			strictEqual(listProps.id, "test-id");
			strictEqual(listProps.type, "disc");
			strictEqual(listProps.indent, false);

			const items = within(screen.getById(listProps.id)).getAllByDataRole(BULLET_LIST_ITEM);

			strictEqual(items.length, localizableKeys.length);

			localizableKeys.forEach((key, idx) => {
				strictEqual(items[idx].textContent, key);
			});
		});
	});
});
