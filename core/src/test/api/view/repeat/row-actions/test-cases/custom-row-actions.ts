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

import { ok, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import type { MouseEvent } from "react";
import { act } from "react";

import { query, within } from "@com.mgmtp.a12.devtools/react";

import { noop } from "../../../../../../internal/noop.js";
import type { DispatchConfiguration } from "../../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../../view/index.js";
import { ConfirmationButton } from "../../../../../../view/internal/components/widgets/form-engine/confirmationButton.js";
import { MODAL_OVERLAY } from "../../../../../rtl-utils/data-roles.js";
import type { RtlRenderWrapper } from "../../../../../rtl-utils/render-wrapper.js";
import { RenderGroupFixture } from "../../../../../utils/rtl-render-group.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import {
	IDS as EXPRESSION_LABEL_IDS,
	expressionLabelDocument,
	formattedExpressionUiState
} from "../../../../../utils/test-model-helpers/expression-label.js";
import { IR } from "../../../../../utils/test-model-helpers/inline.repeat.js";
import {
	createDocument,
	FORM_MODEL,
	ICON_NAMES,
	IDS as ROW_ACTION_IDS
} from "../../../../../utils/test-model-helpers/repeat.row-actions.js";

import {
	assertAriaLabelledBy,
	findAndAssertButtonProps,
	findAndAssertListItemProps,
	setupFormEngineRendererForButtonConfigurationTests
} from "../row-action-utils.js";

export function executeTestForCustomRowActions(): void {
	const rowActionModels = setupModelsFixture("repeat.row-actions");
	const inlineRepeatModels = setupModelsFixture("repeat", "inline");
	const expressionLabelModels = setupModelsFixture("localization", "expression-label");
	const document = () => createDocument({ repeat: [{}, {}] });

	const formattedExpressionLabelWrapper = () => setupForExpressionLabelModels(true);

	describe("no confirmation row action", () => {
		executeGeneralRowActionButtonTests({
			rowActionModel: {
				label: "label",
				description: "description",
				icon: ICON_NAMES.star,
				ids: {
					icon: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.iconRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.icon,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.icon
					},
					label: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.label,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.label
					},
					description: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.descriptionRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.description,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.description
					},
					labelAndDescription: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelAndDescriptionRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.labelAndDescription,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.labelAndDescription
					},
					labelAndIcon: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelAndIconRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.labelAndIcon,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.labelAndIcon
					},
					labelHidden: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelHiddenRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.labelAndIconWithLabelHidden,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.labelAndIconWithLabelHidden
					},
					descriptionAndIcon: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.descriptionAndIconRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.descriptionAndIcon,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.descriptionAndIcon
					},
					labelAndDescriptionAndIcon: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelAndDescriptionAndIconRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.labelAndDescriptionAndIcon,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.labelAndDescriptionAndIcon
					},
					labelAndDescriptionLabelHidden: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelAndDescriptionLabelHiddenRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.labelAndDescriptionLabelHidden,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.labelAndDescriptionLabelHidden
					},
					secondary: { button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.secondary },
					primary: { button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.primary },
					notDestructive: { button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.notDestructive },
					destructive: { button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.destructive }
				}
			},
			expressionLabelModel: {
				label: "Row Action: TestValue from repeat",
				formattedLabel: "Row Action crossed out: <del>TestValue from repeat</del>",
				icon: ICON_NAMES.cloud,
				ids: {
					label: {
						cellId: EXPRESSION_LABEL_IDS.ROW_ACTIONS.CELLS.labelRow,
						button: EXPRESSION_LABEL_IDS.ROW_ACTIONS.BUTTONS.LABEL,
						item: EXPRESSION_LABEL_IDS.ROW_ACTIONS.LIST_ITEMS.LABEL
					},
					formattedLabel: {
						cellId: EXPRESSION_LABEL_IDS.ROW_ACTIONS.CELLS.labelFormattedRow,
						button: EXPRESSION_LABEL_IDS.ROW_ACTIONS.BUTTONS.LABEL_FORMATTED,
						item: EXPRESSION_LABEL_IDS.ROW_ACTIONS.LIST_ITEMS.LABEL_FORMATTED
					},
					labelAndIcon: {
						cellId: EXPRESSION_LABEL_IDS.ROW_ACTIONS.CELLS.labelAndIconRow,
						button: EXPRESSION_LABEL_IDS.ROW_ACTIONS.BUTTONS.LABEL_AND_ICON,
						item: EXPRESSION_LABEL_IDS.ROW_ACTIONS.LIST_ITEMS.LABEL_AND_ICON
					},
					labelHidden: {
						cellId: EXPRESSION_LABEL_IDS.ROW_ACTIONS.CELLS.labelAndIconRow,
						button: EXPRESSION_LABEL_IDS.ROW_ACTIONS.BUTTONS.ICON_AND_LABELHIDDEN,
						item: EXPRESSION_LABEL_IDS.ROW_ACTIONS.LIST_ITEMS.ICON_AND_LABELHIDDEN
					}
				}
			}
		});

		executeAriaLabelTests({
			label: "label",
			description: "description",
			ids: {
				labelDescription: {
					button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.BUTTONS.labelDescription,
					cell: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.CELLS.labelDescription,
					item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.LIST_ITEMS.labelDescription
				},
				label: {
					button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.BUTTONS.label,
					cell: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.CELLS.label,
					item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.LIST_ITEMS.label
				},
				description: {
					button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.BUTTONS.description,
					cell: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.CELLS.description,
					item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.LIST_ITEMS.description
				}
			}
		});

		executeAriaLabelledByTests(
			ROW_ACTION_IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.customButton
		);
	});

	describe("confirmation row action", () => {
		executeGeneralRowActionButtonTests({
			rowActionModel: {
				label: "confirmation label",
				description: "confirmation description",
				icon: ICON_NAMES.star,
				ids: {
					icon: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.iconRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationIcon,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.confirmationIcon
					},
					label: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationLabel,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.confirmationLabel
					},
					description: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.descriptionRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationDescription,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.confirmationDescription
					},
					labelAndDescription: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelAndDescriptionRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationLabelAndDescription,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.confirmationLabelAndDescription
					},
					labelAndIcon: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelAndIconRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationLabelAndIcon,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.confirmationLabelAndIcon
					},
					labelHidden: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelHiddenRow,
						button:
							ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationLabelAndIconWithLabelHidden,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS
							.confirmationLabelAndIconWithLabelHidden
					},
					descriptionAndIcon: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.descriptionAndIconRow,
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationDescriptionAndIcon,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS.confirmationDescriptionAndIcon
					},
					labelAndDescriptionAndIcon: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelAndDescriptionAndIconRow,
						button:
							ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationLabelAndDescriptionAndIcon,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS
							.confirmationLabelAndDescriptionAndIcon
					},
					labelAndDescriptionLabelHidden: {
						cellId: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.CELLS.labelAndDescriptionLabelHiddenRow,
						button:
							ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationLabelAndDescriptionLabelHidden,
						item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.LIST_ITEMS
							.confirmationLabelAndDescriptionLabelHidden
					},
					secondary: { button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationSecondary },
					primary: { button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationPrimary },
					notDestructive: {
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationNotDestructive
					},
					destructive: {
						button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.BUTTONS.confirmationDestructive
					}
				}
			},
			expressionLabelModel: {
				label: "Confirmation: TestValue from repeat",
				formattedLabel: "Confirmation crossed out: <del>TestValue from repeat</del>",
				icon: ICON_NAMES.star,
				ids: {
					label: {
						cellId: EXPRESSION_LABEL_IDS.ROW_ACTIONS.CELLS.labelRow,
						button: EXPRESSION_LABEL_IDS.ROW_ACTIONS.BUTTONS.CONFIRMATION_WITH_LABEL,
						item: EXPRESSION_LABEL_IDS.ROW_ACTIONS.LIST_ITEMS.CONFIRMATION_WITH_LABEL
					},
					formattedLabel: {
						cellId: EXPRESSION_LABEL_IDS.ROW_ACTIONS.CELLS.labelFormattedRow,
						button: EXPRESSION_LABEL_IDS.ROW_ACTIONS.BUTTONS.CONFIRMATION_WITH_LABEL_FORMATTED,
						item: EXPRESSION_LABEL_IDS.ROW_ACTIONS.LIST_ITEMS.CONFIRMATION_WITH_LABEL_FORMATTED
					},
					labelAndIcon: {
						cellId: EXPRESSION_LABEL_IDS.ROW_ACTIONS.CELLS.labelAndIconRow,
						button: EXPRESSION_LABEL_IDS.ROW_ACTIONS.BUTTONS.CONFIRMATION_WITH_LABEL_AND_ICON,
						item: EXPRESSION_LABEL_IDS.ROW_ACTIONS.LIST_ITEMS.CONFIRMATION_WITH_LABEL_AND_ICON
					},
					labelHidden: {
						cellId: EXPRESSION_LABEL_IDS.ROW_ACTIONS.CELLS.labelAndIconRow,
						button: EXPRESSION_LABEL_IDS.ROW_ACTIONS.BUTTONS.CONFIRMATION_WITH_ICON_AND_LABELHIDDEN,
						item: EXPRESSION_LABEL_IDS.ROW_ACTIONS.LIST_ITEMS.CONFIRMATION_WITH_ICON_AND_LABELHIDDEN
					}
				}
			}
		});

		executeAriaLabelTests({
			label: "confirmation label",
			description: "confirmation description",
			ids: {
				labelDescription: {
					button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.BUTTONS.confirmationLabelDescription,
					cell: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.CELLS.labelDescription,
					item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.LIST_ITEMS.confirmationLabelDescription
				},
				label: {
					button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.BUTTONS.confirmationLabel,
					cell: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.CELLS.label,
					item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.LIST_ITEMS.confirmationLabel
				},
				description: {
					button: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.BUTTONS.confirmationDescription,
					cell: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.CELLS.description,
					item: ROW_ACTION_IDS.CUSTOM_ROW_ACTIONS.ARIA_LABEL.LIST_ITEMS.confirmationDescription
				}
			}
		});

		executeAriaLabelledByTests(
			ROW_ACTION_IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.customConfirmButton
		);

		async function renderConfirmationTitle(opts: {
			confirmationButtonId: string;
			expectedTitle: string;
		}): Promise<void> {
			const { confirmationButtonId, expectedTitle } = opts;
			const wrapper = await setupForInlineRepeatModels();

			const confirmationButton = query(wrapper.widgetMap.Button)
				.withId(confirmationButtonId)
				.props();
			await act(() =>
				confirmationButton.onClick?.({ stopPropagation: noop } as MouseEvent<HTMLElement>)
			);

			const modal = query(wrapper.widgetMap.ModalNotification).props();
			strictEqual(modal.title, expectedTitle);
		}

		describe("if no title is set for the confirmation button dialog", () => {
			it("renders confirmation button dialog title using the button label", async () => {
				await renderConfirmationTitle({
					confirmationButtonId: IR.RowActions.CONFIRM_BUTTON_WITHOUT_DIALOG_TITLE,
					expectedTitle: "Confirmation Label"
				});
			});
		});

		describe("if a title is set for the confirmation button dialog", () => {
			it("renders confirmation button dialog title correctly", async () => {
				await renderConfirmationTitle({
					confirmationButtonId: IR.RowActions.CONFIRM_BUTTON_WITH_DIALOG_TITLE,
					expectedTitle: "Confirmation Title"
				});
			});
		});

		async function renderConfirmationResponse(opts: {
			responseButtonId: string;
			expectedDispatch: boolean;
		}): Promise<void> {
			const { responseButtonId, expectedDispatch } = opts;

			const stubbedDispatch = defaultMapDispatchToProps(mock.fn());

			const onCustomRowActionStub = mock.fn();
			const dispatchConfig = {
				...stubbedDispatch.eventHandlers,
				repeat: {
					...stubbedDispatch.eventHandlers.repeat,
					onCustomRowAction: onCustomRowActionStub
				}
			};

			const wrapper = await setupForInlineRepeatModels(false, dispatchConfig);

			const confirmationButton = query(wrapper.widgetMap.Button)
				.withId(IR.RowActions.CONFIRM_BUTTON_WITH_DIALOG_TITLE)
				.props();

			const clickEventMock = { stopPropagation: noop } as MouseEvent<HTMLElement>;

			await act(() => confirmationButton.onClick?.(clickEventMock));

			ok(within(wrapper.baseElement).queryByDataRole(MODAL_OVERLAY));

			const responseButton = query(wrapper.widgetMap.Button).withId(responseButtonId).props();
			await act(() => responseButton.onClick?.(clickEventMock));

			strictEqual(within(wrapper.baseElement).queryByDataRole(MODAL_OVERLAY), null);

			const expectedDispatchCallCount = expectedDispatch ? 1 : 0;
			strictEqual(onCustomRowActionStub.mock.calls.length, expectedDispatchCallCount);
		}

		describe("if the 'OK' button is clicked in the dialog", () => {
			it("closes the dialog and calls eventHandlers.repeat.onCustomRowAction", async () => {
				await renderConfirmationResponse({
					responseButtonId: IR.RowActions.CONFIRM_DIALOG_OK_BUTTON,
					expectedDispatch: true
				});
			});
		});

		describe("if the 'CANCEL' button is clicked in the dialog", () => {
			it("closes the dialog and does not call eventHandlers.repeat.onCustomRowAction", async () => {
				await renderConfirmationResponse({
					responseButtonId: IR.RowActions.CONFIRM_DIALOG_CANCEL_BUTTON,
					expectedDispatch: false
				});
			});
		});
	});

	function executeGeneralRowActionButtonTests(options: {
		rowActionModel: {
			label: string;
			description: string;
			icon: string;
			ids: {
				icon: { cellId: string; button: string; item: string };
				label: { cellId: string; button: string; item: string };
				description: { cellId: string; button: string; item: string };
				labelAndDescription: { cellId: string; button: string; item: string };
				labelAndIcon: { cellId: string; button: string; item: string };
				labelHidden: { cellId: string; button: string; item: string };
				descriptionAndIcon: { cellId: string; button: string; item: string };
				labelAndDescriptionAndIcon: { cellId: string; button: string; item: string };
				labelAndDescriptionLabelHidden: { cellId: string; button: string; item: string };
				secondary: { button: string };
				primary: { button: string };
				notDestructive: { button: string };
				destructive: { button: string };
			};
		};
		expressionLabelModel: {
			label: string;
			formattedLabel: string;
			icon: string;
			ids: {
				label: { cellId: string; button: string; item: string };
				formattedLabel: { cellId: string; button: string; item: string };
				labelAndIcon: { cellId: string; button: string; item: string };
				labelHidden: { cellId: string; button: string; item: string };
			};
		};
	}) {
		const { rowActionModel, expressionLabelModel } = options;

		describe("executeGeneralRowActionButtonTests " + options.rowActionModel.label, () => {
			const { render, it } = RenderGroupFixture(
				async () =>
					await setupFormEngineRendererForButtonConfigurationTests(rowActionModels, document())
			);
			describe("label, description and icon", () => {
				describe("if no label is given", () => {
					describe("if no description given", () => {
						describe("if an icon is given", () => {
							it("renders a button with the icon set in the action column", () => {
								findAndAssertButtonProps({
									wrapper: render.wrapper,
									buttonId: rowActionModel.ids.icon.button,
									expectedLabel: undefined,
									expectedTitle: undefined,
									expectedIcon: rowActionModel.icon,
									expectedPrimary: false,
									expectedDestructive: undefined
								});
							});

							it("renders a list item in the context menu with the graphic set, when the row is right-clicked", async () => {
								await findAndAssertListItemProps({
									wrapper: render.wrapper,
									cellId: rowActionModel.ids.icon.cellId,
									itemId: rowActionModel.ids.icon.item,
									expectedGraphic: rowActionModel.icon,
									expectedText: undefined,
									expectedTitle: undefined
								});
							});
						});
					});

					describe("if a description is given", () => {
						describe("if an icon is given", () => {
							it("renders a button with the icon and title set in the action column", () => {
								findAndAssertButtonProps({
									wrapper: render.wrapper,
									buttonId: rowActionModel.ids.descriptionAndIcon.button,
									expectedLabel: undefined,
									expectedTitle: rowActionModel.description,
									expectedIcon: rowActionModel.icon,
									expectedPrimary: false,
									expectedDestructive: undefined
								});
							});

							it("renders a list item in the context menu with the graphic and title set, when the row is right-clicked", async () => {
								await findAndAssertListItemProps({
									wrapper: render.wrapper,
									cellId: rowActionModel.ids.descriptionAndIcon.cellId,
									itemId: rowActionModel.ids.descriptionAndIcon.item,
									expectedGraphic: rowActionModel.icon,
									expectedText: undefined,
									expectedTitle: rowActionModel.description
								});
							});
						});
					});
				});

				describe("if a multilingual label is given", () => {
					describe("and no description is given", () => {
						describe("and no icon is given", () => {
							it("renders a button in the action column with the label set", () => {
								findAndAssertButtonProps({
									wrapper: render.wrapper,
									buttonId: rowActionModel.ids.label.button,
									expectedLabel: rowActionModel.label,
									expectedTitle: undefined,
									expectedIcon: undefined,
									expectedPrimary: false,
									expectedDestructive: undefined
								});
							});

							it("renders a list item in the context menu with the text set, when the row is right-clicked", async () => {
								await findAndAssertListItemProps({
									wrapper: render.wrapper,
									cellId: rowActionModel.ids.label.cellId,
									itemId: rowActionModel.ids.label.item,
									expectedGraphic: undefined,
									expectedText: rowActionModel.label,
									expectedTitle: undefined
								});
							});
						});

						describe("and an icon is given", () => {
							describe("and labelHidden is set to undefined", () => {
								it("renders a button in the action column with the label and the icon set", () => {
									findAndAssertButtonProps({
										wrapper: render.wrapper,
										buttonId: rowActionModel.ids.labelAndIcon.button,
										expectedLabel: rowActionModel.label,
										expectedTitle: undefined,
										expectedIcon: rowActionModel.icon,
										expectedPrimary: false,
										expectedDestructive: undefined
									});
								});

								it("renders a list item in the context menu with the text and graphic set, when the row is right-clicked", async () => {
									await findAndAssertListItemProps({
										wrapper: render.wrapper,
										cellId: rowActionModel.ids.labelAndIcon.cellId,
										itemId: rowActionModel.ids.labelAndIcon.item,
										expectedGraphic: rowActionModel.icon,
										expectedText: rowActionModel.label,
										expectedTitle: undefined
									});
								});
							});

							describe("and labelHidden is set to true", () => {
								it("renders a button in the action column with only the icon set and the label as title of the button", () => {
									findAndAssertButtonProps({
										wrapper: render.wrapper,
										buttonId: rowActionModel.ids.labelHidden.button,
										expectedLabel: undefined,
										expectedTitle: rowActionModel.label,
										expectedIcon: rowActionModel.icon,
										expectedPrimary: false,
										expectedDestructive: undefined
									});
								});

								it("renders a list item in the context menu with the graphic and text set, when the row is right-clicked", async () => {
									await findAndAssertListItemProps({
										wrapper: render.wrapper,
										cellId: rowActionModel.ids.labelHidden.cellId,
										itemId: rowActionModel.ids.labelHidden.item,
										expectedGraphic: rowActionModel.icon,
										expectedText: rowActionModel.label,
										expectedTitle: undefined
									});
								});
							});
						});
					});

					describe("and a description is given", () => {
						describe("and no icon is given", () => {
							it("renders a button in the action column with the label and title set", () => {
								findAndAssertButtonProps({
									wrapper: render.wrapper,
									buttonId: rowActionModel.ids.labelAndDescription.button,
									expectedLabel: rowActionModel.label,
									expectedTitle: rowActionModel.description,
									expectedIcon: undefined,
									expectedPrimary: false,
									expectedDestructive: undefined
								});
							});

							it("renders a list item in the context menu with the text and title set, when the row is right-clicked", async () => {
								await findAndAssertListItemProps({
									wrapper: render.wrapper,
									cellId: rowActionModel.ids.labelAndDescription.cellId,
									itemId: rowActionModel.ids.labelAndDescription.item,
									expectedGraphic: undefined,
									expectedText: rowActionModel.label,
									expectedTitle: rowActionModel.description
								});
							});
						});

						describe("and an icon is given", () => {
							describe("and labelHidden is set to undefined", () => {
								it("renders a button in the action column with the label, title and the icon set", () => {
									findAndAssertButtonProps({
										wrapper: render.wrapper,
										buttonId: rowActionModel.ids.labelAndDescriptionAndIcon.button,
										expectedLabel: rowActionModel.label,
										expectedTitle: rowActionModel.description,
										expectedIcon: rowActionModel.icon,
										expectedPrimary: false,
										expectedDestructive: undefined
									});
								});

								it("renders a list item in the context menu with the text, title and graphic set, when the row is right-clicked", async () => {
									await findAndAssertListItemProps({
										wrapper: render.wrapper,
										cellId: rowActionModel.ids.labelAndDescriptionAndIcon.cellId,
										itemId: rowActionModel.ids.labelAndDescriptionAndIcon.item,
										expectedGraphic: rowActionModel.icon,
										expectedText: rowActionModel.label,
										expectedTitle: rowActionModel.description
									});
								});
							});

							describe("and labelHidden is set to true", () => {
								it("renders a button in the action column with only the icon set and the title of the button", () => {
									findAndAssertButtonProps({
										wrapper: render.wrapper,
										buttonId: rowActionModel.ids.labelAndDescriptionLabelHidden.button,
										expectedLabel: undefined,
										expectedTitle: rowActionModel.description,
										expectedIcon: rowActionModel.icon,
										expectedPrimary: false,
										expectedDestructive: undefined
									});
								});

								it("renders a list item in the context menu with the graphic, title and text set, when the row is right-clicked", async () => {
									await findAndAssertListItemProps({
										wrapper: render.wrapper,
										cellId: rowActionModel.ids.labelAndDescriptionLabelHidden.cellId,
										itemId: rowActionModel.ids.labelAndDescriptionLabelHidden.item,
										expectedGraphic: rowActionModel.icon,
										expectedText: rowActionModel.label,
										expectedTitle: rowActionModel.description
									});
								});
							});
						});
					});
				});
			});

			describe("priority", () => {
				describe("if priority is set to 'SECONDARY'", () => {
					it("renders a secondary button in the action column", () => {
						findAndAssertButtonProps({
							wrapper: render.wrapper,
							buttonId: rowActionModel.ids.secondary.button,
							expectedLabel: rowActionModel.label,
							expectedTitle: undefined,
							expectedIcon: undefined,
							expectedPrimary: false,
							expectedDestructive: undefined
						});
					});
				});

				describe("if priority is set to 'PRIMARY'", () => {
					it("renders a primary button in the action column", () => {
						findAndAssertButtonProps({
							wrapper: render.wrapper,
							buttonId: rowActionModel.ids.primary.button,
							expectedLabel: rowActionModel.label,
							expectedTitle: undefined,
							expectedIcon: undefined,
							expectedPrimary: true,
							expectedDestructive: undefined
						});
					});
				});
			});

			describe("destructive", () => {
				describe("if destructive is set to undefined", () => {
					it("renders a button in the action column with destructive set to false", () => {
						findAndAssertButtonProps({
							wrapper: render.wrapper,
							buttonId: rowActionModel.ids.notDestructive.button,
							expectedLabel: rowActionModel.label,
							expectedTitle: undefined,
							expectedIcon: undefined,
							expectedPrimary: false,
							expectedDestructive: undefined
						});
					});
				});

				describe("if destructive is set to true", () => {
					it("renders a button in the action column with destructive set to true", () => {
						findAndAssertButtonProps({
							wrapper: render.wrapper,
							buttonId: rowActionModel.ids.destructive.button,
							expectedLabel: rowActionModel.label,
							expectedTitle: undefined,
							expectedIcon: undefined,
							expectedPrimary: false,
							expectedDestructive: true
						});
					});
				});
			});
		});

		describe("if an expression label is given: " + options.rowActionModel.label, () => {
			const { render, it } = RenderGroupFixture(() => setupForExpressionLabelModels());
			describe("and no icon is given", () => {
				it("renders a button in the action column with the label set", () => {
					findAndAssertButtonProps({
						wrapper: render.wrapper,
						buttonId: expressionLabelModel.ids.label.button,
						expectedLabel: expressionLabelModel.label,
						expectedTitle: undefined,
						expectedIcon: undefined,
						expectedPrimary: false,
						expectedDestructive: undefined
					});
				});

				it("renders a list item in the context menu with the text set, when the row is right-clicked", async () => {
					await findAndAssertListItemProps({
						wrapper: render.wrapper,
						cellId: expressionLabelModel.ids.label.cellId,
						itemId: expressionLabelModel.ids.label.item,
						expectedGraphic: undefined,
						expectedText: expressionLabelModel.label,
						expectedTitle: undefined
					});
				});
			});

			describe("and an icon is given", () => {
				describe("and labelHidden is set to undefined", () => {
					it("renders a button in the action column with the label and the icon set", () => {
						findAndAssertButtonProps({
							wrapper: render.wrapper,
							buttonId: expressionLabelModel.ids.labelAndIcon.button,
							expectedLabel: expressionLabelModel.label,
							expectedTitle: undefined,
							expectedIcon: expressionLabelModel.icon,
							expectedPrimary: false,
							expectedDestructive: undefined
						});
					});
					it("renders a list item in the context menu with the text and graphic set, when the row is right-clicked", async () => {
						await findAndAssertListItemProps({
							wrapper: render.wrapper,
							cellId: expressionLabelModel.ids.labelAndIcon.cellId,
							itemId: expressionLabelModel.ids.labelAndIcon.item,
							expectedGraphic: expressionLabelModel.icon,
							expectedText: expressionLabelModel.label,
							expectedTitle: undefined
						});
					});
				});

				describe("and labelHidden is set to true", () => {
					it("renders a button in the action column with only the icon set and the label as title of the button", () => {
						findAndAssertButtonProps({
							wrapper: render.wrapper,
							buttonId: expressionLabelModel.ids.labelHidden.button,
							expectedLabel: undefined,
							expectedTitle: expressionLabelModel.label,
							expectedIcon: expressionLabelModel.icon,
							expectedPrimary: false,
							expectedDestructive: undefined
						});
					});

					it("renders a list item in the context menu with the graphic and text set, when the row is right-clicked", async () => {
						await findAndAssertListItemProps({
							wrapper: render.wrapper,
							cellId: expressionLabelModel.ids.labelHidden.cellId,
							itemId: expressionLabelModel.ids.labelHidden.item,
							expectedGraphic: expressionLabelModel.icon,
							expectedText: expressionLabelModel.label,
							expectedTitle: undefined
						});
					});
				});
			});
		});

		describe("if an expression label is given, that contains markdown formatting", () => {
			it("renders a button in the action column with the formatted label set", async () => {
				findAndAssertButtonProps({
					wrapper: await formattedExpressionLabelWrapper(),
					buttonId: expressionLabelModel.ids.formattedLabel.button,
					expectedLabel: expressionLabelModel.formattedLabel,
					expectedTitle: undefined,
					expectedIcon: undefined,
					expectedPrimary: false,
					expectedDestructive: undefined
				});
			});

			it("renders a list item in the context menu with the formatted text set, when the row is right-clicked", async () => {
				await findAndAssertListItemProps({
					wrapper: await formattedExpressionLabelWrapper(),
					cellId: expressionLabelModel.ids.formattedLabel.cellId,
					itemId: expressionLabelModel.ids.formattedLabel.item,
					expectedGraphic: undefined,
					expectedText: expressionLabelModel.formattedLabel,
					expectedTitle: undefined
				});
			});
		});
	}

	function executeAriaLabelTests(params: {
		label: string;
		description: string;
		ids: {
			labelDescription: { button: string; cell: string; item: string };
			label: { button: string; cell: string; item: string };
			description: { button: string; cell: string; item: string };
		};
	}): void {
		describe("aria-label", async () => {
			const { render, it } = RenderGroupFixture(
				async () =>
					await setupFormEngineRendererForButtonConfigurationTests(rowActionModels, document())
			);

			describe("given a row action with label and description", () => {
				it("renders a button with aria-label 'label - description'", () => {
					findAndAssertButtonProps({
						wrapper: render.wrapper,
						buttonId: params.ids.labelDescription.button,
						expectedAriaLabel: `${params.label} - ${params.description}`,
						expectedLabel: params.label,
						expectedTitle: params.description,
						expectedPrimary: false
					});
				});
			});

			describe("given a row action with label", () => {
				it("renders a button with aria-label 'label'", () => {
					findAndAssertButtonProps({
						wrapper: render.wrapper,
						buttonId: params.ids.label.button,
						expectedAriaLabel: `${params.label}`,
						expectedLabel: params.label,
						expectedPrimary: false
					});
				});
			});

			describe("given a row action with description", () => {
				it("renders a button with aria-label 'description'", () => {
					findAndAssertButtonProps({
						wrapper: render.wrapper,
						buttonId: params.ids.description.button,
						expectedAriaLabel: `${params.description}`,
						expectedTitle: params.description,
						expectedPrimary: false
					});
				});
			});
		});
	}

	function executeAriaLabelledByTests(id: string) {
		describe("aria-labelledby", () => {
			it("renders the button with correct aria-labelledby when repeat has a screenReaderColumnRef", async () => {
				const wrapper = await setupFormEngineRendererForButtonConfigurationTests(
					rowActionModels,
					createDocument({
						repeat: [],
						repeat_AttachmentCollection: [{ Attachment: {}, stringField: "Paul" }]
					}),
					FORM_MODEL.screenReaderColumnScreen
				);

				assertAriaLabelledBy(
					wrapper,
					id,
					ROW_ACTION_IDS.SCREEN_READER_COLUMN_TEST.IR_WITH_SCREEN_READER_COLUMN.columnRef
				);
			});
		});
	}

	function setupForInlineRepeatModels(
		readonly?: boolean,
		dispatchConfig?: DispatchConfiguration
	): Promise<RtlRenderWrapper> {
		const componentMap = {
			ConfirmationButton: mock.fn(ConfirmationButton)
		};
		return SetupHelpers.setupFormEngineRendererWithRtlAsync({
			componentMap,
			models: inlineRepeatModels,
			data: { document: { Root: { Nested_L7: [{}] } } },
			ui: {
				readonly,
				screenLocation: [{ path: [], locationPath: [{ elementName: "RowActions" }] }]
			},
			dispatchConfig
		});
	}

	function setupForExpressionLabelModels(withFormatting = false): Promise<RtlRenderWrapper> {
		return SetupHelpers.setupFormEngineRendererWithRtlAsync({
			models: expressionLabelModels,
			data: { document: expressionLabelDocument },
			ui: withFormatting ? formattedExpressionUiState : undefined
		});
	}
}
