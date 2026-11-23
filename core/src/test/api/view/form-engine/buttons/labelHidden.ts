// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
