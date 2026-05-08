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

import type { Models } from "../../../../../back-end/store/index.js";
import type { WidgetMap } from "../../../../../view/index.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { BUTTONS } from "../../../../utils/test-model-helpers/button.melies.js";

import triggerProps from "./trigger.js";

const { setupFormEngineRendererWithRtl } = SetupHelpers;
const { createDocumentPath } = DocumentHelpers;
const { createModelPath } = ModelHelpers;

export function testLabelHidden(params: {
	models: Models;
	withLabelId: string;
	withFallbackId?: string;
	isMenuItem?: true;
}): void {
	const { models, withLabelId, withFallbackId, isMenuItem } = params;

	function setup(): WidgetMap {
		const { widgetMap } = setupFormEngineRendererWithRtl({
			models,
			ui: {
				screenLocation: [
					{
						path: createDocumentPath(),
						locationPath: createModelPath(BUTTONS.labelHidden)
					}
				]
			}
		});
		return widgetMap;
	}

	describe("labelHidden", () => {
		it("hides the label if label is given", () => {
			const widgetMap = setup();
			const button = triggerProps(isMenuItem)(widgetMap)(withLabelId);
			strictEqual(button?.labelHidden, true);
		});

		if (withFallbackId) {
			it("hides the label if screen label is used as fallback", () => {
				const widgetMap = setup();
				const button = triggerProps(isMenuItem)(widgetMap)(withFallbackId);
				strictEqual(button?.labelHidden, true);
			});
		}
	});
}
