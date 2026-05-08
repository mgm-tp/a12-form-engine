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

import { fireEvent } from "@testing-library/react";
import { act } from "react";

import type { Models } from "../../../../back-end/store/index.js";
import { Commands } from "../../../../back-end/store/index.js";
import type { FormModel } from "../../../../models/index.js";
import { assertUniqueId } from "../../../utils/assertions.js";
import { US_LOCALE } from "../../../utils/localization.js";
import { ModelHelpers } from "../../../utils/model-helpers.js";
import { RenderGroupFixture } from "../../../utils/rtl-render-group.js";
import { SetupHelpers } from "../../../utils/setup.js";

import { widgetMocksForInputTests } from "../inputs/input-element/inputTestWidgetMocks.js";

describe("api.view.FormEngineRenderer", () => {
	interface Render extends SetupHelpers.ConnectedRtlWrapper {
		models: Models;
	}

	async function render(params: { idPrefix?: string }): Promise<Render> {
		let models = SetupHelpers.loadModels("controls.uiId");
		const locale = US_LOCALE;

		/*
		 * In some applications the form model contains an additional ID property (e.g. in Client)
		 * This could influence the ID generation. To be prepared, we add this property here as well.
		 */
		models = {
			...models,
			formModel: {
				...models.formModel,
				id: "MY_TEST_ID_1"
			} as FormModel
		};

		const widgetMap = widgetMocksForInputTests();

		const wrapper = await SetupHelpers.setupConnectedFormEngineWithRtlAsync({
			config: { widgetMap, uiIdPrefix: params.idPrefix },
			locale,
			data: {
				document: {
					A12T_PicusTypes: {
						InlineRepeat: [{ booleanField: false }, { booleanField: false }]
					}
				}
			},
			ui: {
				screenLocation: [
					{
						locationPath: ModelHelpers.createModelPath("Screen1"),
						path: []
					}
				],
				repeatStaticState: {
					"/Screen1/InlineRepeat": {
						filterRowOpen: true
					}
				}
			},
			models
		});

		return {
			...wrapper,
			models
		};
	}

	describe("given no uiIdPrefix as parameter in the UI configuration", () => {
		describeTests({ idPrefix: undefined });
	});

	describe("given an uiIdPrefix as parameter in the UI configuration", () => {
		describeTests({ idPrefix: "Test-Prefix" });
	});

	function describeTests(params: { idPrefix?: string }) {
		const { it, render: fixture } = RenderGroupFixture<Render>(() => render(params));

		const prefixString = params.idPrefix ? params.idPrefix + "-" : "";

		it("renders the form div with the form model title as id", () => {
			assertId({ id: `${fixture.wrapper.models.formModel.header.id}` });
		});

		it(`renders a control with ${prefixString}a12-{field-name}-{field-ID}(-{occurrence})?(-input{index})? as id`, () => {
			assertId({
				id: "a12-stringField-id3948",
				assertions: ["GROUP"]
			});
			assertId({
				id: "a12-stringField-id3948-2",
				assertions: ["GROUP"]
			});
			assertId({
				id: "a12-stringField-id3948-3",
				assertions: ["GROUP"]
			});
			assertId({
				id: "a12-stringField-id3948-4",
				assertions: ["GROUP"]
			});

			assertId({
				id: "a12-stringFieldArea-field_87d2c",
				assertions: ["GROUP"]
			});

			assertId({
				id: "a12-numberField-id3939",
				assertions: ["GROUP"]
			});
			assertId({
				id: "a12-numberField-id3939-2",
				assertions: ["GROUP"]
			});

			assertId({ id: "a12-booleanField-F22", assertions: ["GROUP"] });
			assertId({ id: "a12-confirmField-field_0a108", assertions: ["GROUP"] });
			assertId({ id: "a12-dateField-id3963", assertions: ["GROUP"] });
			assertId({ id: "a12-dateTimeField-F28", assertions: ["GROUP"] });
			assertId({
				id: "a12-timeField-F29",
				assertions: ["GROUP"]
			});

			assertId({
				id: "a12-enumerationFieldCompact-id31404",
				assertions: ["GROUP"]
			});

			assertId({
				id: "a12-enumerationFieldRadio-fieldimpl_9a36c-group"
			});

			assertId({
				id: "a12-enumerationFieldInline-fieldimpl_59ab4-group"
			});

			assertId({
				id: "a12-enumerationFieldAutocomplete-fieldimpl_30206",
				assertions: ["GROUP"]
			});
		});

		it(`renders a button with ${prefixString}a12-{ui-ID} as id`, () => {
			assertId({ id: "a12-button-6086b" });
		});

		it(`renders a screen with ${prefixString}case-{ui-ID} as id`, () => {
			assertId({ id: "case-screen1" });
		});

		it(`renders a section with ${prefixString}a12-{ui-ID} as id`, () => {
			assertId({ id: "a12-section-e3744" });
		});

		describe("multi column section", () => {
			it(`renders a multi column section with ${prefixString}a12-{ui-ID} as id`, () => {
				assertId({ id: "a12-multicolumnsection-99bfe" });
			});

			it(`renders a multi column section column with ${prefixString}a12-{ui-ID of column element}-column as id`, () => {
				assertId({ id: "a12-controlgrid-7fb5d-column" });
				assertId({ id: "a12-section_843e6-column" });
				assertId({ id: "a12-buttonpanel_e04b0-column" });
				assertId({ id: "a12-inlinerepeat_24246-column" });
			});
		});

		it(`renders a control grid with ${prefixString}a12-{ui-ID} as id`, () => {
			assertId({ id: "a12-controlgrid-1a77f" });
		});

		it(`renders a row with ${prefixString}a12-{ui-ID} as id`, () => {
			assertId({ id: "a12-row-349c8" });
			assertId({ id: "a12-row-76a3b" });
			assertId({ id: "a12-row-6cb56" });
		});

		it(`renders a text cell with ${prefixString}a12-{ui-ID}-content as id`, () => {
			assertId({ id: "a12-textcell-1cee8-content" });
		});

		it(`renders an expression cell with ${prefixString}a12-{ui-ID}-expression as id`, () => {
			assertId({ id: "a12-expressioncell-e36dd-expression" });
		});

		it(`renders a detached repeat with ${prefixString}a12-{ui-ID} as id`, () => {
			assertId({ id: "a12-inlinerepeat-481b7" });
		});

		it(`renders an inline repeat with ${prefixString}a12-{ui-ID} as id`, () => {
			assertId({ id: "a12-inlinerepeat-a1ac9" });
		});

		it(`renders an embedded repeat with ${prefixString}a12-{ui-ID} as id`, () => {
			assertId({ id: "a12-embeddedrepeat_ef50a" });
		});

		it(`renders the add button of a repeat with ${prefixString}a12-add-button-{ui-ID} as id`, () => {
			// inline repeat
			assertId({ id: "a12-add-button-inlinerepeat-a1ac9" });
			// detached repeat
			assertId({ id: "a12-add-button-inlinerepeat-481b7" });
			// embedded repeat
			assertId({ id: "a12-add-button-embeddedrepeat_ef50a" });
		});

		it(`renders a cell input / select of an inline repeat with ${prefixString}a12-{ui-ID}-cell-{rowIndex} as id`, () => {
			assertId({
				id: "a12-fieldbasedrepeatoverviewcolumn-1864b-cell-0"
			});
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-1864b-cell-1" });

			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-32be8-cell-0" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-32be8-cell-1" });

			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-fc04d-cell-0" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-fc04d-cell-1" });

			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-ef984-cell-0" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-ef984-cell-1" });

			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-cb556-cell-0" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-cb556-cell-1" });

			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-e6fbf-cell-0" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-e6fbf-cell-1" });

			assertId({
				id: "a12-fieldbasedrepeatoverviewcolumn-211ad-cell-0"
			});
			assertId({
				id: "a12-fieldbasedrepeatoverviewcolumn-211ad-cell-1"
			});

			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-e51de-cell-0" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-e51de-cell-1" });
		});

		it(`renders the repeat filter inputs of a repeat with ${prefixString}a12-{uiId}-filter-{filter suffix} as id`, () => {
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-1864b-filter" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-1864b-filter-empty" });

			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-32be8-filter-from" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-32be8-filter-to" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-32be8-filter-empty" });

			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-fc04d-filter-yes" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-fc04d-filter-no" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-fc04d-filter-empty" });

			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-ef984-filter-yes" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-ef984-filter-empty" });

			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-cb556-filter-from" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-cb556-filter-to" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-cb556-filter-empty" });

			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-e6fbf-filter-from" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-e6fbf-filter-to" });
			assertId({ id: "a12-fieldbasedrepeatoverviewcolumn-e6fbf-filter-empty" });

			assertId({
				id: "a12-fieldbasedrepeatoverviewcolumn-211ad-filter-from"
			});
			assertId({
				id: "a12-fieldbasedrepeatoverviewcolumn-211ad-filter-to"
			});

			assertId({
				id: "a12-fieldbasedrepeatoverviewcolumn-e51de-filter-VALUE1"
			});
			assertId({
				id: "a12-fieldbasedrepeatoverviewcolumn-e51de-filter-VALUE2"
			});
			assertId({
				id: "a12-fieldbasedrepeatoverviewcolumn-e51de-filter-VALUE3"
			});
		});

		describe("DetachedRepeatScreen", () => {
			before(async () => {
				await addDetachedRepeatRow();
			});

			after(async () => {
				await cancelDetachedRepeat();
			});

			it(`renders the screen of a detached repeat with ${prefixString}case-a12-{ui-ID} as id`, () => {
				assertId({ id: "case-a12-inlinerepeat-481b7" });
			});

			it(
				"renders the cancel button of a detached repeat with " +
					` ${prefixString}a12-add-cancel-button-{repeat-ui-ID} as id`,
				() => {
					assertId({ id: "a12-add-cancel-button-inlinerepeat-481b7" });
				}
			);

			it(
				"renders the apply button of a detached repeat with " +
					`${prefixString}a12-add-apply-button-{repeat-ui-ID} as id`,
				() => {
					assertId({ id: "a12-add-apply-button-inlinerepeat-481b7" });
				}
			);
		});

		describe("DetachedRepeatScreen (Edit)", () => {
			before(async () => {
				await addDetachedRepeatRow();
				await saveDetachedRepeat();
				await editDetachedRepeatRow();
			});

			after(async () => {
				await cancelDetachedRepeat();
			});

			it(
				"renders the edit apply button of a detached repeat detail screen with " +
					`${prefixString}a12-edit-apply-button-{repeat-ui-ID} as id`,
				() => {
					assertId({
						id: "a12-edit-apply-button-inlinerepeat-481b7"
					});
				}
			);
		});

		describe("DetachedRepeatScreen (readonly)", () => {
			before(async () => {
				await addDetachedRepeatRow();
				await act(() => {
					fixture.wrapper.store.dispatch(Commands.setReadonly(true));
				});
			});

			after(async () => {
				await act(() => {
					fixture.wrapper.store.dispatch(Commands.setReadonly(false));
				});
				cancelDetachedRepeat();
			});

			it(
				"renders the return button of a readonly detached repeat detail screen with " +
					`${prefixString}a12-return-button-{repeat-ui-ID} as id`,
				() => {
					assertId({ id: "a12-return-button-inlinerepeat-481b7" });
				}
			);
		});

		describe("Embedded Repeat Expanded Row", () => {
			before(() => {
				addEmbeddedRepeatRow();
			});

			after(() => {
				closeEmbeddedRepeat();
			});

			it(
				"renders the expanded row of an embedded repeat with " +
					`${prefixString}a12-{ui-ID}-expandedrow-{rowIndex} as id`,
				() => {
					assertId({
						id: "a12-embeddedrepeat_ef50a-expandedrow-0"
					});
				}
			);

			it(
				"renders the close button of an embedded repeat with " +
					`${prefixString}a12-close-button-{repeat-ui-ID} as id`,
				() => {
					assertId({
						id: "a12-close-button-embeddedrepeat_ef50a"
					});
				}
			);
		});

		async function clickButton(idWithoutPrefix: string): Promise<boolean> {
			return act(() => {
				const button = fixture.wrapper.baseElement.querySelector(
					`[id="${prefixString}${idWithoutPrefix}"]`
				);
				const buttonFound = button !== null;
				if (buttonFound) {
					fireEvent.click(button);
				}
				return buttonFound;
			});
		}

		async function addDetachedRepeatRow(): Promise<void> {
			await clickButton("a12-add-button-inlinerepeat-481b7");
		}

		async function editDetachedRepeatRow(): Promise<void> {
			await clickButton("a12-edit-button-inlinerepeat-481b7-1");
		}

		async function cancelDetachedRepeat(): Promise<void> {
			if (!(await clickButton("a12-add-cancel-button-inlinerepeat-481b7"))) {
				await clickButton("a12-edit-cancel-button-inlinerepeat-481b7");
			}
		}

		async function saveDetachedRepeat(): Promise<void> {
			await clickButton("a12-add-apply-button-inlinerepeat-481b7");
		}

		async function addEmbeddedRepeatRow(): Promise<void> {
			await clickButton("a12-add-button-embeddedrepeat_ef50a");
		}

		async function closeEmbeddedRepeat(): Promise<void> {
			await clickButton("a12-close-button-embeddedrepeat_ef50a");
		}

		function assertId(assertionParams: { id: string; assertions?: "GROUP"[] }): void {
			const { id } = assertionParams;
			assertUniqueId({
				wrapper: fixture.wrapper,
				...assertionParams,
				id: prefixString + id
			});
		}
	}
});
