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

import { notStrictEqual, ok, strictEqual } from "node:assert/strict";

import { query, screen } from "@com.mgmtp.a12.devtools/react";

import type { FormModelHelpers } from "../../../utils/model-helpers.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

import { setupForButtonTests, setupSubheaderButtonTests } from "./utils.js";

describe("api.view.content-box", () => {
	const models = setupModelsFixture("buttons");

	describe("ActionButtons subaction bar", () => {
		it("renders only sub-header buttons of type `EVENT`", () => {
			const buttons: FormModelHelpers.ButtonDef[] = [
				{ type: "EVENT", label: "EVENT" },
				{ type: "NAVIGATION", label: "NAVIGATION" },
				{ type: "EVENT", label: "SUBMIT" }
			];

			const { widgetMap } = setupSubheaderButtonTests({ models, buttons });
			const buttonGroupProps = query(widgetMap.ButtonGroupContainer).props();
			// eslint-disable-next-line @typescript-eslint/no-deprecated
			strictEqual(buttonGroupProps.leftSlot?.length, 4);
			// eslint-disable-next-line @typescript-eslint/no-deprecated
			strictEqual(buttonGroupProps.rightSlot?.length, 4);
			const buttonProps = query(widgetMap.Button).propsHistory();
			strictEqual(
				buttonProps.some(c => c.label === "NAVIGATION"),
				false
			);
		});

		it("renders button container with right-left collapse direction`", () => {
			const buttons: FormModelHelpers.ButtonDef[] = [
				{ type: "EVENT", label: "EVENT" },
				{ type: "NAVIGATION", label: "NAVIGATION" },
				{ type: "EVENT", label: "SUBMIT" }
			];

			const { widgetMap } = setupSubheaderButtonTests({ models, buttons });
			const buttonGroupProps = query(widgetMap.ButtonGroupContainer).props();

			strictEqual(buttonGroupProps.collapsingDirection, "right-to-left");
		});

		it("does not render when no sub-header buttons of type `EVENT` and `SUBMIT` exist", () => {
			const { widgetMap } = setupSubheaderButtonTests({ models });

			query(widgetMap.ButtonGroupContainer).assertNotRendered();
		});

		it("does not render when no sub-header buttons are visible", () => {
			const buttons: FormModelHelpers.ButtonDef[] = [
				{ type: "NAVIGATION", scope: "HIDDEN_IN_READONLY_MODE" },
				{ type: "EVENT", scope: "HIDDEN_IN_READONLY_MODE" }
			];

			const { widgetMap } = setupSubheaderButtonTests({
				models,
				buttons,
				isReadonly: true
			});

			query(widgetMap.ButtonGroupContainer).assertNotRendered();
		});

		it("renders all major sub-header buttons left aligned and minor buttons right aligned", () => {
			const majorButtons: FormModelHelpers.ButtonDef[] = [
				{ type: "EVENT", label: "major" },
				{ type: "EVENT", label: "major" }
			];
			const minorButtons: FormModelHelpers.ButtonDef[] = [
				{ type: "EVENT", label: "minor" },
				{ type: "EVENT", label: "minor" }
			];

			const { widgetMap } = setupForButtonTests({
				models,
				buttons: {
					subHeader: { major: majorButtons, minor: minorButtons },
					screenSubHeader: { major: majorButtons, minor: minorButtons }
				}
			});

			const leftButtonProps = query(widgetMap.Button)
				.withTestId("action-button-left")
				.propsHistory();
			ok(leftButtonProps.every(p => p.label === "major"));
			const rightButtonProps = query(widgetMap.Button)
				.withTestId("action-button-right")
				.propsHistory();
			ok(rightButtonProps.every(p => p.label === "minor"));
		});

		describe("Label, Description and Icon", () => {
			function setupLabelTest(config: {
				readonly setLabel?: boolean;
				readonly setDescription?: boolean;
				readonly setIcon?: boolean;
				readonly labelHidden?: boolean;
			}) {
				const button: FormModelHelpers.ButtonDef = {
					type: "EVENT",
					scope: "HIDDEN_IN_READONLY_MODE"
				};
				const iconMap: { [buttonLabel: string]: string } = {
					evt1: "build",
					evt2: "done",
					evt3: "eco",
					evt4: "face"
				};

				return setupForButtonTests({
					models,
					buttons: {
						subHeader: {
							major: [
								{
									...button,
									icon: config.setIcon ? { name: iconMap.evt1 } : undefined,
									label: config.setLabel ? "evt1" : undefined,
									description: config.setDescription ? "evt1 description" : undefined,
									labelHidden: config.labelHidden
								}
							],
							minor: [
								{
									...button,
									icon: config.setIcon ? { name: iconMap.evt2 } : undefined,
									label: config.setLabel ? "evt2" : undefined,
									description: config.setDescription ? "evt2 description" : undefined,
									labelHidden: config.labelHidden
								}
							]
						},
						screenSubHeader: {
							major: [
								{
									...button,
									icon: config.setIcon ? { name: iconMap.evt3 } : undefined,
									label: config.setLabel ? "evt3" : undefined,
									description: config.setDescription ? "evt3 description" : undefined,
									labelHidden: config.labelHidden
								}
							],
							minor: [
								{
									...button,
									icon: config.setIcon ? { name: iconMap.evt4 } : undefined,
									label: config.setLabel ? "evt4" : undefined,
									description: config.setDescription ? "evt4 description" : undefined,
									labelHidden: config.labelHidden
								}
							]
						}
					}
				});
			}

			describe("Given a label for the button", () => {
				describe("and a description for the button", () => {
					describe("and an icon", () => {
						describe("and labelHidden set to false", () => {
							it("renders the icon and the label and the title of the button", () => {
								const { widgetMap } = setupLabelTest({
									setIcon: true,
									setLabel: true,
									setDescription: true
								});

								const allProps = query(widgetMap.Button).withTestId("action-button").propsHistory();
								allProps.forEach(props => {
									notStrictEqual(props.label, undefined);
									strictEqual(props.labelHidden, undefined);
									notStrictEqual(props.title, undefined);
									notStrictEqual(props.icon, undefined);
								});
							});
						});

						describe("and labelHidden set to true", () => {
							it("renders only the icon and sets the title of the button", () => {
								const { widgetMap } = setupLabelTest({
									setIcon: true,
									setLabel: true,
									setDescription: true,
									labelHidden: true
								});

								const allProps = query(widgetMap.Button).withTestId("action-button").propsHistory();
								allProps.forEach(props => {
									notStrictEqual(props.label, undefined);
									strictEqual(props.labelHidden, true);
									notStrictEqual(props.title, undefined);
									notStrictEqual(props.icon, undefined);
								});
							});
						});
					});

					describe("and no icon", () => {
						it("renders the label and title of the button and no icon", () => {
							const { widgetMap } = setupLabelTest({
								setIcon: false,
								setLabel: true,
								setDescription: true
							});

							const allProps = query(widgetMap.Button).withTestId("action-button").propsHistory();
							allProps.forEach(props => {
								notStrictEqual(props.label, undefined);
								strictEqual(props.labelHidden, undefined);
								notStrictEqual(props.title, undefined);
								notStrictEqual(props.label, props.title);
								strictEqual(props.icon, undefined);
							});
						});
					});
				});

				describe("and no description for the button", () => {
					describe("and an icon", () => {
						describe("and labelHidden set to false", () => {
							it("renders the icon and the label of the button and does not set a title", () => {
								const { widgetMap } = setupLabelTest({ setIcon: true, setLabel: true });

								const allProps = query(widgetMap.Button).withTestId("action-button").propsHistory();
								allProps.forEach(props => {
									notStrictEqual(props.label, undefined);
									strictEqual(props.labelHidden, undefined);
									strictEqual(props.title, undefined);
									notStrictEqual(props.icon, undefined);
								});
							});
						});

						describe("and labelHidden set to true", () => {
							it("renders only the icon and sets the label as the title of the button", () => {
								const { widgetMap } = setupLabelTest({
									setIcon: true,
									setLabel: true,
									labelHidden: true
								});

								const allProps = query(widgetMap.Button).withTestId("action-button").propsHistory();
								allProps.forEach(props => {
									notStrictEqual(props.label, undefined);
									strictEqual(props.labelHidden, true);
									notStrictEqual(props.title, undefined);
									notStrictEqual(props.icon, undefined);
								});
							});
						});
					});

					describe("and no icon", () => {
						it("renders the label of the button and no title and no icon", () => {
							const { widgetMap } = setupLabelTest({ setIcon: false, setLabel: true });

							const allProps = query(widgetMap.Button).withTestId("action-button").propsHistory();
							allProps.forEach(props => {
								notStrictEqual(props.label, undefined);
								strictEqual(props.labelHidden, undefined);
								strictEqual(props.title, undefined);
								strictEqual(props.icon, undefined);
							});
						});
					});
				});
			});

			describe("Given no label for the button and an icon", () => {
				describe("and a description", () => {
					it("renders the icon and the title for the button", () => {
						const { widgetMap } = setupLabelTest({
							setIcon: true,
							setDescription: true
						});

						const allProps = query(widgetMap.Button).withTestId("action-button").propsHistory();
						allProps.forEach(props => {
							strictEqual(props.label, undefined);
							strictEqual(props.labelHidden, undefined);
							notStrictEqual(props.title, undefined);
							notStrictEqual(props.icon, undefined);
						});
					});
				});

				describe("and no description", () => {
					it("renders the icon for the button", () => {
						const { widgetMap } = setupLabelTest({ setIcon: true, setDescription: false });

						const allProps = query(widgetMap.Button).withTestId("action-button").propsHistory();
						allProps.forEach(props => {
							strictEqual(props.label, undefined);
							strictEqual(props.labelHidden, undefined);
							strictEqual(props.title, undefined);
							notStrictEqual(props.icon, undefined);
						});
					});
				});
			});
		});

		it(
			"renders the sub-header buttons of type `EVENT` in the order:" +
				" sub-header major buttons," +
				" screen sub-header major buttons," +
				" sub-header minor buttons," +
				" and screen sub-header minor buttons",
			() => {
				setupForButtonTests({
					models,
					buttons: {
						subHeader: {
							major: [{ type: "EVENT", label: "1" }],
							minor: [{ type: "EVENT", label: "2" }]
						},
						screenSubHeader: {
							major: [{ type: "EVENT", label: "3" }],
							minor: [{ type: "EVENT", label: "4" }]
						}
					}
				});

				const node1 = screen.getByText("1");
				const node2 = screen.getByText("2");
				const node3 = screen.getByText("3");
				const node4 = screen.getByText("4");

				strictEqual(node1.compareDocumentPosition(node3), Node.DOCUMENT_POSITION_FOLLOWING);
				strictEqual(node3.compareDocumentPosition(node2), Node.DOCUMENT_POSITION_FOLLOWING);
				strictEqual(node2.compareDocumentPosition(node4), Node.DOCUMENT_POSITION_FOLLOWING);
			}
		);

		it("renders the primary sub-header buttons of type `EVENT` as primary button", () => {
			const buttons: FormModelHelpers.ButtonDef[] = [{ type: "EVENT", priority: "PRIMARY" }];
			const { widgetMap } = setupSubheaderButtonTests({
				models,
				buttons
			});

			const allProps = query(widgetMap.Button).withTestId("action-button").propsHistory();
			allProps.forEach(props => {
				strictEqual(props.primary, true);
			});
		});

		it("renders the secondary sub-header buttons of type `EVENT` as secondary button", () => {
			const buttons: FormModelHelpers.ButtonDef[] = [{ type: "EVENT", priority: "SECONDARY" }];
			const { widgetMap } = setupSubheaderButtonTests({
				models,
				buttons
			});

			const allProps = query(widgetMap.Button).withTestId("action-button").propsHistory();
			allProps.forEach(props => {
				strictEqual(props.primary, false);
			});
		});

		describe("given major and minor buttons", () => {
			it("renders event buttons in a responsive ButtonGroupContainer", () => {
				const buttons: FormModelHelpers.ButtonDef[] = [
					{ type: "EVENT", priority: "SECONDARY" },
					{ type: "NAVIGATION", priority: "SECONDARY" }
				];

				const { widgetMap } = setupSubheaderButtonTests({
					models,
					buttons
				});

				const props = query(widgetMap.ButtonGroupContainer).props();
				strictEqual(props.responsive, true);
				// eslint-disable-next-line @typescript-eslint/no-deprecated
				strictEqual(props.leftSlot?.length, 2);
				// eslint-disable-next-line @typescript-eslint/no-deprecated
				strictEqual(props.rightSlot?.length, 2);
			});
		});

		describe("given only minor buttons", () => {
			it("renders event buttons in a responsive ButtonGroupContainer", () => {
				const buttons: FormModelHelpers.ButtonDef[] = [
					{ type: "EVENT", priority: "SECONDARY" },
					{ type: "NAVIGATION", priority: "SECONDARY" }
				];

				const { widgetMap } = setupForButtonTests({
					models,
					buttons: {
						subHeader: { minor: buttons },
						screenSubHeader: { minor: buttons }
					}
				});

				const props = query(widgetMap.ButtonGroupContainer).props();
				strictEqual(props.responsive, true);
				// eslint-disable-next-line @typescript-eslint/no-deprecated
				strictEqual(props.leftSlot?.length, 0);
				// eslint-disable-next-line @typescript-eslint/no-deprecated
				strictEqual(props.rightSlot?.length, 2);
			});
		});

		describe("given only major buttons", () => {
			it("renders event buttons in a responsive ButtonGroupContainer", () => {
				const buttons: FormModelHelpers.ButtonDef[] = [
					{ type: "EVENT", priority: "SECONDARY" },
					{ type: "NAVIGATION", priority: "SECONDARY" }
				];

				const { widgetMap } = setupForButtonTests({
					models,
					buttons: {
						subHeader: { major: buttons },
						screenSubHeader: { major: buttons }
					}
				});
				const props = query(widgetMap.ButtonGroupContainer).props();
				strictEqual(props.responsive, true);
				// eslint-disable-next-line @typescript-eslint/no-deprecated
				strictEqual(props.leftSlot?.length, 2);
				// eslint-disable-next-line @typescript-eslint/no-deprecated
				strictEqual(props.rightSlot?.length, 0);
			});
		});
	});
});
