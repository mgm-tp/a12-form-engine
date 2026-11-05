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
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";

import { loadModels, setupFormEngineRendererWithRtl } from "../../../../utils/setup.js";
import {
	MARKDOWN_COLUMN,
	withMarkdownColumnEditor
} from "../../../../utils/test-model-helpers/markdown-column.js";
import { MARKDOWN, withMarkdownEditor } from "../../../../utils/test-model-helpers/markdown.js";
import { createDocumentForRepeat } from "../../../../utils/test-model-helpers/repeat.js";

describe("api.view.inputs", () => {
	describe("Markdown", () => {
		describe("isMarkdownEditor", () => {
			it("resolves a field with isMarkdownEditor set to the MarkdownEditor widget", () => {
				const models = withMarkdownEditor(loadModels("enablement.readonly"));

				const { widgetMap } = setupFormEngineRendererWithRtl({ models });

				query(widgetMap.MarkdownEditor).withId(MARKDOWN.CONTROL_ID).assertRendered();
			});

			it("keeps rendering the plain TextAreaStateless widget when isMarkdownEditor is unset", () => {
				const models = loadModels("enablement.readonly");

				const { widgetMap } = setupFormEngineRendererWithRtl({ models });

				query(widgetMap.TextAreaStateless).withId(MARKDOWN.CONTROL_ID).assertRendered();
			});
		});

		describe("Value", () => {
			it("passes the field's current value to the editor", () => {
				const models = withMarkdownEditor(loadModels("enablement.readonly"));

				const { widgetMap } = setupFormEngineRendererWithRtl({
					models,
					data: { document: { rootGroup: { stringFieldArea: "# Hello" } } }
				});

				const props = query(widgetMap.MarkdownEditor).withId(MARKDOWN.CONTROL_ID).props();
				strictEqual(props.value, "# Hello");
			});

			// onChange dispatch behavior (trimming, empty -> null): see
			// api.view.inputs.MarkdownInput.onChange in markdown-input.spec.tsx
		});

		describe("Readonly / disabled", () => {
			it("passes readonly through to the editor", () => {
				const models = withMarkdownEditor(loadModels("enablement.readonly"));

				const { widgetMap } = setupFormEngineRendererWithRtl({ models, ui: { readonly: true } });

				const props = query(widgetMap.MarkdownEditor).withId(MARKDOWN.CONTROL_ID).props();
				strictEqual(props.readonly, true);
			});
		});

		describe("WidgetMap override", () => {
			it("lets a host swap the editor for its own (e.g. to select plugins/extensions)", () => {
				const models = withMarkdownEditor(loadModels("enablement.readonly"));
				const CustomMarkdownEditor = mock.fn(() => null);

				setupFormEngineRendererWithRtl({
					models,
					config: { widgetMap: { MarkdownEditor: CustomMarkdownEditor } }
				});

				strictEqual(CustomMarkdownEditor.mock.callCount() > 0, true);
			});
		});

		describe("Repeat overview column", () => {
			function renderColumn() {
				const models = withMarkdownColumnEditor(loadModels("repeat", "inline"));

				return setupFormEngineRendererWithRtl({
					models,
					data: { document: createDocumentForRepeat({ nestedL1: [{ L1_String: "# Hello" }] }) }
				});
			}

			it("resolves a repeat overview column with isMarkdownEditor set to the MarkdownEditor widget", () => {
				const { widgetMap } = renderColumn();

				query(widgetMap.MarkdownEditor).withId(MARKDOWN_COLUMN.CELL_ID).assertRendered();
			});

			it("wires the ImageUploadPlugin into the widget for the column's markdownAttachmentRepeatPath", () => {
				const { widgetMap } = renderColumn();

				const props = query(widgetMap.MarkdownEditor).withId(MARKDOWN_COLUMN.CELL_ID).props();
				strictEqual(props.plugins !== undefined, true);
			});
		});
	});
});
