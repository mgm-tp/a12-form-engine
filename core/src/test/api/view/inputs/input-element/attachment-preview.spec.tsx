// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { equal } from "node:assert/strict";

import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import { query } from "@com.mgmtp.a12.devtools/react";

import { DefaultComponentMap } from "../../../../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import { mockFunctions } from "../../../../rtl-utils/mock-map.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { FORM_MODEL } from "../../../../utils/test-model-helpers/repeat.multi-file-upload.js";

describe("api.view.inputs", () => {
	describe("AttachmentPreview", () => {
		const models = setupModelsFixture("repeat.multi-file-upload");

		describe("Given no attachment", () => {
			it("does not render a ResponsiveImageContainer or an icon widget", async () => {
				const componentMap = mockFunctions(DefaultComponentMap);
				const { widgetMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					componentMap,
					models,
					locale: US_LOCALE,
					data: { document: { Root: { AttachmentCollection: [{}] } } }
				});

				query(componentMap.AttachmentPreview)
					.withId(FORM_MODEL.IR.attachmentPreviewId)
					.assertRendered();

				query(widgetMap.ResponsiveImageContainer)
					.withTestId(`${FORM_MODEL.IR.attachmentPreviewId}-ResponsiveImageContainer`)
					.assertNotRendered();

				query(widgetMap.Icon)
					.withTestId(`${FORM_MODEL.IR.attachmentPreviewId}-Icon`)
					.assertNotRendered();
			});
		});

		describe("Given an attachment", () => {
			describe("that has a preview image", () => {
				it("renders a ResponsiveImageContainer with the correct props", async () => {
					const attachmentWithThumbnail: Attachment = {
						attachment_id: "unique1",
						original_filename: "unique_file_name_1.txt"
					};

					const componentMap = mockFunctions(DefaultComponentMap);
					const { widgetMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						componentMap,
						data: {
							document: {
								Root: { AttachmentCollection: [{ Attachment01: attachmentWithThumbnail }] }
							},
							attachmentState: { thumbnails: { unique1: "Preview" } }
						},
						models,
						locale: US_LOCALE
					});

					query(componentMap.AttachmentPreview)
						.withId(FORM_MODEL.IR.attachmentPreviewId)
						.assertRendered();

					const image = query(widgetMap.ResponsiveImageContainer)
						.withTestId(`${FORM_MODEL.IR.attachmentPreviewId}-ResponsiveImageContainer`)
						.props();

					equal(image.title, attachmentWithThumbnail.original_filename);
					equal(image.src, "Preview");
				});
			});

			describe("that does not have a preview image", () => {
				it("renders an icon widget with the correct props", async () => {
					const attachmentWithoutThumbnail: Attachment = {
						attachment_id: "unique1",
						original_filename: "unique_file_name_1.txt",
						mime_type: "text/plain"
					};

					const componentMap = mockFunctions(DefaultComponentMap);
					const { widgetMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						componentMap,
						data: {
							document: {
								Root: { AttachmentCollection: [{ Attachment01: attachmentWithoutThumbnail }] }
							}
						},
						models,
						locale: US_LOCALE
					});

					query(componentMap.AttachmentPreview)
						.withId(FORM_MODEL.IR.attachmentPreviewId)
						.assertRendered();

					const icon = query(widgetMap.Icon)
						.withTestId(`${FORM_MODEL.IR.attachmentPreviewId}-Icon`)
						.props();
					equal(icon.children, "datatype_text");
					equal(icon.title, "txt");
				});
			});
		});
	});
});
