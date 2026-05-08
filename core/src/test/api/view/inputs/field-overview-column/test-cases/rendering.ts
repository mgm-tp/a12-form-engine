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

import { query } from "@com.mgmtp.a12.devtools/react";

import { getComponentMocks } from "../../../../../rtl-utils/getComponentMocks.js";
import { RenderGroupFixture } from "../../../../../utils/rtl-render-group.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { ATTACHMENT } from "../../../../../utils/test-model-helpers/attachment.js";
import { EXTERNAL_ENUM } from "../../../../../utils/test-model-helpers/external-enumeration.js";
import { IR } from "../../../../../utils/test-model-helpers/inline.repeat.js";
import type { RenderWithInputMap } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";
import { renderWithInputMocks } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";
import { createDocumentForRepeat } from "../../../../../utils/test-model-helpers/repeat.js";

export function executeTestsForFieldOverviewColumnRendering(): void {
	const inlineRepeatModels = setupModelsFixture("repeat", "inline");
	const externalEnumerationModels = setupModelsFixture("controls.externalenumeration");
	const attachmentModels = setupModelsFixture("controls.attachmentUpload");

	const documentForRepeat = createDocumentForRepeat({
		nestedL1: [{}],
		nestedL3: [{}],
		nestedL4: [{}],
		nestedL5: [{}],
		nestedL6: [{}],
		nestedL8: [{}],
		nestedL10: [{}]
	});

	function setupForInlineRepeat(screenName: string): Promise<RenderWithInputMap> {
		return renderWithInputMocks({
			models: inlineRepeatModels,
			data: { document: documentForRepeat },
			ui: {
				screenLocation: [{ locationPath: [{ elementName: screenName }], path: [] }]
			}
		});
	}

	const documentForExternalEnumeration = EXTERNAL_ENUM.createDocument({
		repeatableGroup: [{}]
	});
	function setupForExternalEnumeration(): Promise<RenderWithInputMap> {
		return renderWithInputMocks({
			models: externalEnumerationModels,
			data: { document: documentForExternalEnumeration }
		});
	}

	describe("Field types", () => {
		const { it, render } = RenderGroupFixture<RenderWithInputMap>(() =>
			setupForInlineRepeat(IR.SortingAndFiltering.screen)
		);
		describe("Given a field with data type String", () => {
			describe("and no field configuration entry", () => {
				it("renders a StringInput", async () => {
					const input = query(render.wrapper.inputMap.StringInput).withProp(
						"uiId",
						IR.SortingAndFiltering.ID_L1_STRING
					);
					input.assertRendered();
				});
			});
		});

		describe("Given a field with data type Number", () => {
			it("renders a NumberInput", async () => {
				const input = query(render.wrapper.inputMap.NumberInput).withProp(
					"uiId",
					IR.SortingAndFiltering.ID_L1_NUMBER
				);
				input.assertRendered();
			});
		});

		describe("Given a field with data type Custom", () => {
			it("renders a StringInput", async () => {
				const input = query(render.wrapper.inputMap.StringInput).withProp(
					"uiId",
					IR.SortingAndFiltering.ID_L1_CUSTOM
				);
				input.assertRendered();
			});
		});
	});

	describe("Given a field with data type String", () => {
		describe("and a field configuration entry ", () => {
			describe("containing an external enumeration source", () => {
				const { it, render } = RenderGroupFixture<RenderWithInputMap>(setupForExternalEnumeration);

				describe("and the exposition compact", () => {
					it("renders a DropDownInput", async () => {
						const input = query(render.wrapper.inputMap.DropDownInput).withProp(
							"uiId",
							EXTERNAL_ENUM.ID_IR_EXTERNAL_ENUM_COMPACT
						);
						input.assertRendered();
					});
				});

				describe("and the exposition autocomplete", () => {
					it("renders an AutoCompleteInput", async () => {
						const input = query(render.wrapper.inputMap.AutoCompleteInput).withProp(
							"uiId",
							EXTERNAL_ENUM.ID_IR_EXTERNAL_ENUM_AUTOCOMPLETE
						);
						input.assertRendered();
					});
				});

				describe("and the exposition full", () => {
					it("renders a DropDownInput", async () => {
						const input = query(render.wrapper.inputMap.DropDownInput).withProp(
							"uiId",
							EXTERNAL_ENUM.ID_IR_EXTERNAL_ENUM_FULL
						);
						input.assertRendered();
					});
				});

				describe("and the exposition inline", () => {
					it("renders a DropDownInput", async () => {
						const input = query(render.wrapper.inputMap.DropDownInput).withProp(
							"uiId",
							EXTERNAL_ENUM.ID_IR_EXTERNAL_ENUM_INLINE
						);
						input.assertRendered();
					});
				});
			});

			describe("containing exposition=Area", () => {
				it("renders a MultilineInput", async () => {
					const wrapper = await setupForInlineRepeat(IR.FieldExpositions.screen);
					const input = query(wrapper.inputMap.MultilineInput).withProp(
						"uiId",
						IR.FieldExpositions.ID_L3_TEXT_AREA
					);
					input.assertRendered();
				});
			});
		});
	});

	describe("Given a field with data type Enumeration", () => {
		const { it, render } = RenderGroupFixture<RenderWithInputMap>(() =>
			setupForInlineRepeat(IR.FieldExpositions.screen)
		);

		describe("and exposition 'compact'", () => {
			it("renders a DropDownInput", async () => {
				const wrapper = await setupForInlineRepeat(IR.FieldExpositions.screen);
				const input = query(wrapper.inputMap.DropDownInput).withProp(
					"uiId",
					IR.FieldExpositions.ID_L5_ENUM_COMPACT
				);
				input.assertRendered();
			});
		});

		describe("and exposition 'autocomplete'", () => {
			it("renders an AutoCompleteInput", async () => {
				const input = query(render.wrapper.inputMap.AutoCompleteInput).withProp(
					"uiId",
					IR.FieldExpositions.ID_L5_ENUM_AUTOCOMPLETE
				);
				input.assertRendered();
			});
		});

		describe("and exposition 'full'", () => {
			it("renders a DropDownInput", async () => {
				const input = query(render.wrapper.inputMap.DropDownInput).withProp(
					"uiId",
					IR.FieldExpositions.ID_L5_ENUM_RADIO_FULL
				);
				input.assertRendered();
			});
		});

		describe("and exposition 'inline'", () => {
			it("renders a DropDownInput", async () => {
				const input = query(render.wrapper.inputMap.DropDownInput).withProp(
					"uiId",
					IR.FieldExpositions.ID_L5_ENUM_RADIO_COMPACT
				);
				input.assertRendered();
			});
		});
	});

	describe("Date types", () => {
		const { it, render } = RenderGroupFixture<RenderWithInputMap>(() =>
			setupForInlineRepeat(IR.SortingAndFiltering.screen)
		);

		describe("Given a field with data type Date", () => {
			it("renders a DateInput with a date picker", async () => {
				const input = query(render.wrapper.inputMap.DateInput).withProp(
					"uiId",
					IR.SortingAndFiltering.ID_L1_DATE
				);
				input.assertRendered();
			});
		});

		describe("Given a field with data type DateFragment", () => {
			it("renders a DateFragmentInput without a date picker", async () => {
				const input = query(render.wrapper.inputMap.DateFragmentInput).withProp(
					"uiId",
					IR.SortingAndFiltering.ID_L1_DATE_FRAGMENT
				);
				input.assertRendered();
			});
		});

		describe("Given a field with data type DateTime", () => {
			it("renders a DateTimeInput", async () => {
				const input = query(render.wrapper.inputMap.DateTimeInput).withProp(
					"uiId",
					IR.SortingAndFiltering.ID_L1_DATE_TIME
				);
				input.assertRendered();
			});
		});

		describe("Given a field with data type Time", () => {
			it("renders a TimeInput", async () => {
				const input = query(render.wrapper.inputMap.TimeInput).withProp(
					"uiId",
					IR.SortingAndFiltering.ID_L1_TIME
				);
				input.assertRendered();
			});
		});

		describe("Given a field with data type DateRange", () => {
			it("renders a DateRangeInput", async () => {
				const input = query(render.wrapper.inputMap.DateRangeInput).withProp(
					"uiId",
					IR.SortingAndFiltering.ID_L1_DATE_RANGE
				);
				input.assertRendered();
			});
		});
	});

	describe("Expositions", () => {
		const { it, render } = RenderGroupFixture<RenderWithInputMap>(() =>
			setupForInlineRepeat(IR.FieldExpositions.screen)
		);
		describe("Given a field with data type Boolean", () => {
			describe("and no exposition", () => {
				it("renders a CheckboxInput", async () => {
					const input = query(render.wrapper.inputMap.CheckboxInput).withProp(
						"uiId",
						IR.FieldExpositions.ID_L5_BOOLEAN
					);
					input.assertRendered();
				});
			});

			describe("and exposition 'checkbox'", () => {
				it("renders a CheckboxInput", async () => {
					const input = query(render.wrapper.inputMap.CheckboxInput).withProp(
						"uiId",
						IR.FieldExpositions.ID_L5_BOOLEAN_CHECKBOX
					);
					input.assertRendered();
				});
			});

			describe("and exposition 'switch'", () => {
				it("renders a SwitchInput", async () => {
					const input = query(render.wrapper.inputMap.SwitchInput).withProp(
						"uiId",
						IR.FieldExpositions.ID_L5_BOOLEAN_SWITCH
					);
					input.assertRendered();
				});
			});

			describe("and exposition 'switch-with-values'", () => {
				it("renders a SwitchInput", async () => {
					const input = query(render.wrapper.inputMap.SwitchInput).withProp(
						"uiId",
						IR.FieldExpositions.ID_L5_BOOLEAN_SWITCH_WITH_VALUES
					);
					input.assertRendered();
				});
			});
		});

		describe("Given a field with data type Confirm", () => {
			describe("and no exposition", () => {
				it("renders a CheckboxInput", async () => {
					const input = query(render.wrapper.inputMap.CheckboxInput).withProp(
						"uiId",
						IR.FieldExpositions.ID_L10_CONFIRM
					);
					input.assertRendered();
				});
			});

			describe("and exposition 'checkbox'", () => {
				it("renders a CheckboxInput", async () => {
					const input = query(render.wrapper.inputMap.CheckboxInput).withProp(
						"uiId",
						IR.FieldExpositions.ID_L10_CONFIRM_CHECKBOX
					);
					input.assertRendered();
				});
			});

			describe("and exposition 'switch'", () => {
				it("renders a SwitchInput", async () => {
					const input = query(render.wrapper.inputMap.SwitchInput).withProp(
						"uiId",
						IR.FieldExpositions.ID_L10_CONFIRM_SWITCH
					);
					input.assertRendered();
				});
			});

			describe("and exposition 'switch-with-values'", () => {
				it("renders a SwitchInput", async () => {
					const input = query(render.wrapper.inputMap.SwitchInput).withProp(
						"uiId",
						IR.FieldExpositions.ID_L10_CONFIRM_SWITCH_WITH_VALUES
					);
					input.assertRendered();
				});
			});
		});
	});

	describe("Given a group with customType='attachment'", () => {
		describe("and no exposition", () => {
			it("renders an AttachmentInput", async () => {
				const documentForAttachment = ATTACHMENT.createDocumentForAttachment({
					repeatableGroup: [{ attachment: { attachment_id: "1" } }]
				});

				const wrapper = await renderWithInputMocks({
					models: attachmentModels,
					data: { document: documentForAttachment }
				});
				const input = query(wrapper.inputMap.AttachmentInput).withProp(
					"uiId",
					ATTACHMENT.ID_IR_ATTACHMENT
				);
				input.assertRendered();
			});
		});

		describe("and exposition COMPACT", () => {
			it("renders an AttachmentInput", async () => {
				const documentForAttachment = ATTACHMENT.createDocumentForAttachment({
					repeatableGroup: [{ attachment: { attachment_id: "1" } }]
				});

				const wrapper = await renderWithInputMocks({
					models: attachmentModels,
					data: { document: documentForAttachment }
				});
				const input = query(wrapper.inputMap.AttachmentInput).withProp(
					"uiId",
					ATTACHMENT.ID_IR_ATTACHMENT_COMPACT
				);
				input.assertRendered();
			});
		});

		describe("and exposition THUMBNAIL_OR_ICON", () => {
			it("renders an AttachmentPreview", async () => {
				const documentForAttachment = ATTACHMENT.createDocumentForAttachment({
					repeatableGroup: [{ attachment: { attachment_id: "1" } }]
				});

				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					componentMap: getComponentMocks(),
					models: attachmentModels,
					data: { document: documentForAttachment }
				});
				const input = query(wrapper.componentMap.AttachmentPreview).withId(
					ATTACHMENT.ID_IR_ATTACHMENT_THUMBNAIL_OR_ICON
				);
				input.assertRendered();
			});
		});
	});

	describe("Given a group with customType='multiselect'", () => {
		describe("and exposition autocomplete", () => {
			it("renders a MultiSelectInput", async () => {
				const wrapper = await setupForInlineRepeat(IR.FieldExpositions.screen);
				const input = query(wrapper.inputMap.MultiSelectInput).withProp(
					"uiId",
					IR.FieldExpositions.ID_L8_MULTI_SELECT_AUTOCOMPLETE
				);
				input.assertRendered();
			});
		});

		describe("and exposition full", () => {
			it("renders a MultiSelectInput", async () => {
				const wrapper = await setupForInlineRepeat(IR.FieldExpositions.screen);
				const input = query(wrapper.inputMap.MultiSelectInput).withProp(
					"uiId",
					IR.FieldExpositions.ID_L8_MULTI_SELECT_FULL
				);
				input.assertRendered();
			});
		});

		describe("and exposition inline", () => {
			it("renders a MultiSelectInput", async () => {
				const wrapper = await setupForInlineRepeat(IR.FieldExpositions.screen);
				const input = query(wrapper.inputMap.MultiSelectInput).withProp(
					"uiId",
					IR.FieldExpositions.ID_L8_MULTI_SELECT_INLINE
				);
				input.assertRendered();
			});
		});
	});
}
