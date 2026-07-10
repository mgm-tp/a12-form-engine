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

import { notStrictEqual, strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { ButtonDef } from "../../../utils/FormModelHelpers.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

import { setupFooterButtonTests, setupForButtonTests } from "./utils.js";

describe("api.view.content-box", () => {
	const models = setupModelsFixture("buttons");

	describe("Top Level Screen Footer", () => {
		it("does not render when no footer buttons exist", () => {
			const { widgetMap } = setupForButtonTests({ models });

			query(widgetMap.ButtonGroupContainer).assertNotRendered();
		});

		it("does not render when no footer buttons are visible", () => {
			const buttons: ButtonDef[] = [
				{ type: "EVENT", scope: "HIDDEN_IN_READONLY_MODE" },
				{ type: "NAVIGATION", scope: "HIDDEN_IN_READONLY_MODE" }
			];

			const { widgetMap } = setupFooterButtonTests({
				models,
				buttons,
				isReadonly: true
			});

			query(widgetMap.ButtonGroupContainer).assertNotRendered();
		});

		it("renders buttons in a responsive ButtonGroupContainer", () => {
			const buttons: ButtonDef[] = [
				{ type: "EVENT", priority: "SECONDARY" },
				{ type: "NAVIGATION", priority: "SECONDARY" }
			];

			const { widgetMap } = setupFooterButtonTests({
				models,
				buttons
			});

			const buttonGroupProps = query(widgetMap.ButtonGroupContainer).props();

			// eslint-disable-next-line @typescript-eslint/no-deprecated
			strictEqual(buttonGroupProps.leftSlot?.length, 4);

			// eslint-disable-next-line @typescript-eslint/no-deprecated
			strictEqual(buttonGroupProps.rightSlot?.length, 4);
			strictEqual(buttonGroupProps.responsive, true);
		});

		describe("Label, Description and Icon", () => {
			function setupLabelTest(config: {
				readonly setLabel?: boolean;
				readonly setDescription?: boolean;
				readonly labelHidden?: boolean;
				readonly setIcon?: boolean;
			}) {
				const button: ButtonDef = {
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
						footer: {
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
						screenFooter: {
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
				describe("and given a description for the button", () => {
					describe("and an icon", () => {
						describe("and labelHidden set to false", () => {
							it("renders the icon and the label and the title of the button", () => {
								const { widgetMap } = setupLabelTest({
									setIcon: true,
									setLabel: true,
									setDescription: true
								});

								const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();

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

								const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();

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
						it("renders the label and title of a footer button and no icon", () => {
							const { widgetMap } = setupLabelTest({
								setIcon: false,
								setLabel: true,
								setDescription: true
							});

							const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();

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

								const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();

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

								const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();

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
						it("renders the label of a footer button and no title and no icon", () => {
							const { widgetMap } = setupLabelTest({ setIcon: false, setLabel: true });

							const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();

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

						const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();

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
						const { widgetMap } = setupLabelTest({ setIcon: true });

						const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();

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

		describe("major footer buttons", () => {
			it("renders right aligned", () => {
				const buttons: ButtonDef[] = [
					{ type: "EVENT", priority: "PRIMARY" },
					{ type: "NAVIGATION", priority: "PRIMARY" }
				];

				const { widgetMap } = setupForButtonTests({
					models,
					buttons: {
						footer: { major: buttons },
						screenFooter: { major: buttons }
					}
				});

				query(widgetMap.Button).withTestId("screen-footer-left").assertNotRendered();
				const rightButtonProps = query(widgetMap.Button)
					.withTestId("screen-footer-right")
					.propsHistory();
				strictEqual(rightButtonProps.length, 4);
			});

			it("renders the primary buttons as primary button", () => {
				const buttons: ButtonDef[] = [
					{ type: "EVENT", priority: "PRIMARY" },
					{ type: "NAVIGATION", priority: "PRIMARY" }
				];

				const { widgetMap } = setupForButtonTests({
					models,
					buttons: {
						footer: { major: buttons },
						screenFooter: { major: buttons }
					}
				});

				const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();
				allProps.forEach(props => {
					strictEqual(props.primary, true);
				});
			});

			it("renders the secondary buttons as secondary button", () => {
				const buttons: ButtonDef[] = [
					{ type: "EVENT", priority: "SECONDARY" },
					{ type: "NAVIGATION", priority: "SECONDARY" }
				];

				const { widgetMap } = setupForButtonTests({
					models,
					buttons: {
						footer: { major: buttons },
						screenFooter: { major: buttons }
					}
				});

				const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();
				allProps.forEach(props => {
					strictEqual(props.primary, false);
				});
			});
		});

		describe("minor footer buttons", () => {
			it("renders left aligned", () => {
				const buttons: ButtonDef[] = [
					{ type: "EVENT", priority: "PRIMARY" },
					{ type: "NAVIGATION", priority: "PRIMARY" }
				];

				const { widgetMap } = setupForButtonTests({
					models,
					buttons: {
						footer: { minor: buttons },
						screenFooter: { minor: buttons }
					}
				});

				query(widgetMap.Button).withTestId("screen-footer-right").assertNotRendered();
				const leftButtonProps = query(widgetMap.Button)
					.withTestId("screen-footer-left")
					.propsHistory();
				strictEqual(leftButtonProps.length, 4);
			});

			it("renders the primary buttons as primary button", () => {
				const buttons: ButtonDef[] = [
					{ type: "EVENT", priority: "PRIMARY" },
					{ type: "NAVIGATION", priority: "PRIMARY" }
				];

				const { widgetMap } = setupForButtonTests({
					models,
					buttons: {
						footer: { minor: buttons },
						screenFooter: { minor: buttons }
					}
				});

				const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();
				allProps.forEach(props => {
					strictEqual(props.primary, true);
				});
			});

			it("renders the secondary buttons as secondary button", () => {
				const buttons: ButtonDef[] = [
					{ type: "EVENT", priority: "SECONDARY" },
					{ type: "NAVIGATION", priority: "SECONDARY" }
				];

				const { widgetMap } = setupForButtonTests({
					models,
					buttons: {
						footer: { minor: buttons },
						screenFooter: { minor: buttons }
					}
				});

				const allProps = query(widgetMap.Button).withTestId("screen-footer").propsHistory();
				allProps.forEach(props => {
					strictEqual(props.primary, false);
				});
			});
		});
	});
});
