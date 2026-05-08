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
