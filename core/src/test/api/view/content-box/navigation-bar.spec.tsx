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

import { createDocumentPath } from "../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../utils/createModelPath.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { BUTTONS } from "../../../utils/test-model-helpers/button.form.js";
import type { ButtonDef } from "../../../utils/FormModelHelpers.js";

import { setupForButtonTests, setupSubheaderButtonTests } from "./utils.js";

describe("api.view.content-box", () => {
	const models = setupModelsFixture("buttons");

	describe("NavigationBar", () => {
		it("renders only sub-header buttons of type `NAVIGATION`", () => {
			const buttons: ButtonDef[] = [
				{ type: "EVENT", label: "EVENT" },
				{ type: "NAVIGATION", label: "NAVIGATION" }
			];

			const { componentMap } = setupSubheaderButtonTests({
				models,
				buttons
			});

			const props = query(componentMap.ContentBoxNavigationBar).props();
			strictEqual(props.navItems.length, 4);
			props.navItems.forEach(item => {
				strictEqual(item.label, "NAVIGATION");
			});
		});

		it("does not render if no sub-header buttons of type `NAVIGATION` exist", () => {
			const { componentMap } = setupSubheaderButtonTests({ models });

			query(componentMap.ContentBoxNavigationBar).assertNotRendered();
		});

		it("does not render if no sub-header buttons are visible", () => {
			const buttons: ButtonDef[] = [{ type: "NAVIGATION", scope: "HIDDEN_IN_READONLY_MODE" }];

			const { componentMap } = setupSubheaderButtonTests({
				models,
				buttons: buttons,
				isReadonly: true
			});

			query(componentMap.ContentBoxNavigationBar).assertNotRendered();
		});

		describe("Label, Description and Icon", () => {
			function setupLabelTest(config: {
				readonly setLabel?: boolean;
				readonly setDescription?: boolean;
				readonly labelHidden?: boolean;
				readonly setIcon?: boolean;
			}) {
				const button: ButtonDef = {
					type: "NAVIGATION",
					scope: "HIDDEN_IN_READONLY_MODE"
				};
				const iconMap: { [buttonLabel: string]: string } = {
					nav1: "build",
					nav2: "done",
					nav3: "eco",
					nav4: "face"
				};

				return setupForButtonTests({
					models,
					buttons: {
						subHeader: {
							major: [
								{
									...button,
									icon: config.setIcon ? { name: iconMap.nav1 } : undefined,
									label: config.setLabel ? "nav1" : undefined,
									description: config.setDescription ? "nav1 description" : undefined,
									labelHidden: config.labelHidden
								}
							],
							minor: [
								{
									...button,
									icon: config.setIcon ? { name: iconMap.nav2 } : undefined,
									label: config.setLabel ? "nav2" : undefined,
									description: config.setDescription ? "nav2 description" : undefined,
									labelHidden: config.labelHidden
								}
							]
						},
						screenSubHeader: {
							major: [
								{
									...button,
									icon: config.setIcon ? { name: iconMap.nav3 } : undefined,
									label: config.setLabel ? "nav3" : undefined,
									description: config.setDescription ? "nav3 description" : undefined,
									labelHidden: config.labelHidden
								}
							],
							minor: [
								{
									...button,
									icon: config.setIcon ? { name: iconMap.nav4 } : undefined,
									label: config.setLabel ? "nav4" : undefined,
									description: config.setDescription ? "nav4 description" : undefined,
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
								const { componentMap } = setupLabelTest({
									setIcon: true,
									setLabel: true,
									setDescription: true
								});

								const props = query(componentMap.ContentBoxNavigationBar).props();
								props.navItems.forEach(item => {
									notStrictEqual(item.label, undefined);
									strictEqual(item.labelHidden, undefined);
									notStrictEqual(item.title, undefined);
									notStrictEqual(item.label, item.title);
									notStrictEqual(item.icon, undefined);
								});
							});
						});

						describe("and labelHidden set to true", () => {
							it("renders only the icon and sets the title of the button", () => {
								const { componentMap } = setupLabelTest({
									setIcon: true,
									setLabel: true,
									setDescription: true,
									labelHidden: true
								});

								const props = query(componentMap.ContentBoxNavigationBar).props();
								props.navItems.forEach(item => {
									notStrictEqual(item.label, undefined);
									strictEqual(item.labelHidden, true);
									notStrictEqual(item.title, undefined);
									notStrictEqual(item.label, item.title);
									notStrictEqual(item.icon, undefined);
								});
							});
						});
					});

					describe("and no icon", () => {
						it("renders the label and title of the button and no icon", () => {
							const { componentMap } = setupLabelTest({
								setIcon: false,
								setLabel: true,
								setDescription: true
							});

							const props = query(componentMap.ContentBoxNavigationBar).props();
							props.navItems.forEach(item => {
								notStrictEqual(item.label, undefined);
								strictEqual(item.labelHidden, undefined);
								notStrictEqual(item.title, undefined);
								notStrictEqual(item.label, item.title);
								strictEqual(item.icon, undefined);
							});
						});
					});
				});

				describe("and no description for the button", () => {
					describe("and an icon", () => {
						describe("and labelHidden set to false", () => {
							it("renders the icon and the label of the button and does not set a title", () => {
								const { componentMap } = setupLabelTest({ setIcon: true, setLabel: true });

								const props = query(componentMap.ContentBoxNavigationBar).props();
								props.navItems.forEach(item => {
									notStrictEqual(item.label, undefined);
									strictEqual(item.labelHidden, undefined);
									strictEqual(item.title, undefined);
									notStrictEqual(item.icon, undefined);
								});
							});
						});

						describe("and labelHidden set to true", () => {
							it("renders only the icon and sets the label as the title of the button", () => {
								const { componentMap } = setupLabelTest({
									setIcon: true,
									setLabel: true,
									labelHidden: true
								});

								const props = query(componentMap.ContentBoxNavigationBar).props();
								props.navItems.forEach(item => {
									notStrictEqual(item.label, undefined);
									strictEqual(item.labelHidden, true);
									notStrictEqual(item.title, undefined);
									notStrictEqual(item.icon, undefined);
								});
							});
						});
					});

					describe("and no icon", () => {
						it("renders the label of a footer button and no title and no icon", () => {
							const { componentMap } = setupLabelTest({ setIcon: false, setLabel: true });

							const props = query(componentMap.ContentBoxNavigationBar).props();
							props.navItems.forEach(item => {
								notStrictEqual(item.label, undefined);
								strictEqual(item.labelHidden, undefined);
								strictEqual(item.title, undefined);
								strictEqual(item.icon, undefined);
							});
						});
					});
				});
			});

			describe("Given no label for the button", () => {
				describe("and a description", () => {
					it("renders the icon and title for the button", () => {
						const { componentMap } = setupLabelTest({
							setIcon: true,
							setDescription: true
						});

						const props = query(componentMap.ContentBoxNavigationBar).props();
						props.navItems.forEach(item => {
							strictEqual(item.label, undefined);
							strictEqual(item.labelHidden, undefined);
							notStrictEqual(item.title, undefined);
							notStrictEqual(item.icon, undefined);
						});
					});
				});

				describe("and no description", () => {
					it("renders the icon for the button", () => {
						const { componentMap } = setupLabelTest({ setIcon: true });

						const props = query(componentMap.ContentBoxNavigationBar).props();
						props.navItems.forEach(item => {
							strictEqual(item.label, undefined);
							strictEqual(item.labelHidden, undefined);
							strictEqual(item.title, undefined);
							notStrictEqual(item.icon, undefined);
						});
					});
				});
			});
		});

		it(
			"renders the sub-header buttons of type `NAVIGATION` in the order:" +
				" sub-header major buttons," +
				" sub-header minor buttons," +
				" screen sub-header major buttons," +
				" and screen sub-header minor buttons",
			() => {
				const { componentMap } = setupForButtonTests({
					models,
					buttons: {
						subHeader: {
							major: [{ type: "NAVIGATION", label: "1" }],
							minor: [{ type: "NAVIGATION", label: "2" }]
						},
						screenSubHeader: {
							major: [{ type: "NAVIGATION", label: "3" }],
							minor: [{ type: "NAVIGATION", label: "4" }]
						}
					}
				});

				const props = query(componentMap.ContentBoxNavigationBar).props();
				strictEqual(props.navItems.length, 4);
				strictEqual(props.navItems[0].label, "1");
				strictEqual(props.navItems[1].label, "2");
				strictEqual(props.navItems[2].label, "3");
				strictEqual(props.navItems[3].label, "4");
			}
		);

		describe("Enablement", () => {
			describe("if the engine is enabled", () => {
				it("renders all the sub-header buttons of type `NAVIGATION` enabled", () => {
					const buttons: ButtonDef[] = [
						{ type: "NAVIGATION", scope: "HIDDEN_IN_READONLY_MODE" },
						{ type: "NAVIGATION" }
					];

					const { componentMap } = setupSubheaderButtonTests({
						models,
						buttons
					});

					const props = query(componentMap.ContentBoxNavigationBar).props();
					strictEqual(props.navItems.length, 8);
					props.navItems.forEach(item => {
						strictEqual(item.disabled, false);
					});
				});
			});

			describe("if the engine is disabled", () => {
				it("renders all the sub-header buttons of type `NAVIGATION` disabled", () => {
					const buttons: ButtonDef[] = [
						{ type: "NAVIGATION", scope: "HIDDEN_IN_READONLY_MODE" },
						{ type: "NAVIGATION" }
					];

					const { componentMap } = setupSubheaderButtonTests({
						models,
						buttons,
						isDisabled: true
					});

					const props = query(componentMap.ContentBoxNavigationBar).props();
					strictEqual(props.navItems.length, 8);
					props.navItems.forEach(item => {
						strictEqual(item.disabled, true);
					});
				});
			});

			describe("if the engine is readonly", () => {
				it("renders only the sub-header buttons of type `NAVIGATION` with scope !== 'HIDDEN_IN_READONLY_MODE'", () => {
					const buttons: ButtonDef[] = [
						{ type: "NAVIGATION", label: "HIDDEN", scope: "HIDDEN_IN_READONLY_MODE" },
						{ type: "NAVIGATION", label: "VISIBLE", scope: "DISABLED_IN_READONLY_MODE" },
						{ type: "NAVIGATION", label: "VISIBLE", scope: "HIDDEN_IN_EDIT_MODE" },
						{ type: "NAVIGATION", label: "VISIBLE", scope: "DISABLED_IN_EDIT_MODE" },
						{ type: "NAVIGATION", label: "VISIBLE" }
					];

					const { componentMap } = setupSubheaderButtonTests({
						models,
						buttons,
						isReadonly: true
					});

					const props = query(componentMap.ContentBoxNavigationBar).props();
					strictEqual(props.navItems.length, 16);
					props.navItems.forEach(item => {
						strictEqual(item.label, "VISIBLE");
					});
				});

				it("renders the sub-header buttons of type `NAVIGATION` with scope === 'DISABLED_IN_READONLY_MODE' as disabled", () => {
					const buttons: ButtonDef[] = [
						{ type: "NAVIGATION", label: "DISABLED", scope: "DISABLED_IN_READONLY_MODE" },
						{ type: "NAVIGATION", label: "ENABLED" }
					];

					const { componentMap } = setupSubheaderButtonTests({
						models,
						buttons,
						isReadonly: true
					});

					const props = query(componentMap.ContentBoxNavigationBar).props();
					strictEqual(props.navItems.length, 8);
					props.navItems
						.filter(item => item.label === "DISABLED")
						.forEach(item => {
							strictEqual(item.disabled, true);
						});
					props.navItems
						.filter(item => item.label === "ENABLED")
						.forEach(item => {
							strictEqual(item.disabled, false);
						});
				});
			});

			describe("if the engine is not readonly", () => {
				it("renders only the sub-header buttons of type `NAVIGATION` with scope !== 'HIDDEN_IN_EDIT_MODE'", () => {
					const buttons: ButtonDef[] = [
						{ type: "NAVIGATION", label: "HIDDEN", scope: "HIDDEN_IN_EDIT_MODE" },
						{ type: "NAVIGATION", label: "VISIBLE", scope: "DISABLED_IN_EDIT_MODE" },
						{ type: "NAVIGATION", label: "VISIBLE", scope: "HIDDEN_IN_READONLY_MODE" },
						{ type: "NAVIGATION", label: "VISIBLE", scope: "DISABLED_IN_READONLY_MODE" },
						{ type: "NAVIGATION", label: "VISIBLE" }
					];

					const { componentMap } = setupSubheaderButtonTests({
						models,
						buttons
					});

					const props = query(componentMap.ContentBoxNavigationBar).props();
					strictEqual(props.navItems.length, 16);
					props.navItems.forEach(item => {
						strictEqual(item.label, "VISIBLE");
					});
				});

				it("renders the sub-header buttons of type `NAVIGATION` with scope === 'DISABLED_IN_EDIT_MODE' as disabled", () => {
					const buttons: ButtonDef[] = [
						{ type: "NAVIGATION", label: "DISABLED", scope: "DISABLED_IN_EDIT_MODE" },
						{ type: "NAVIGATION", label: "ENABLED" }
					];

					const { componentMap } = setupSubheaderButtonTests({
						models,
						buttons
					});

					const props = query(componentMap.ContentBoxNavigationBar).props();
					strictEqual(props.navItems.length, 8);
					props.navItems
						.filter(item => item.label === "DISABLED")
						.forEach(item => {
							strictEqual(item.disabled, true);
						});
					props.navItems
						.filter(item => item.label === "ENABLED")
						.forEach(item => {
							strictEqual(item.disabled, false);
						});
				});
			});
		});

		it("renders the sub-header button of type `NAVIGATION` selected if user is on referred screen", () => {
			const buttons: ButtonDef[] = [{ type: "NAVIGATION", screen: "screen-1" }];

			const { componentMap } = setupSubheaderButtonTests({
				models,
				buttons
			});

			const props = query(componentMap.ContentBoxNavigationBar).props();
			strictEqual(props.navItems.length, 4);
			props.navItems.forEach(item => {
				strictEqual(item.selected, true);
			});
		});

		it("does not render the sub-header button of type `NAVIGATION` selected if user is not on referred screen", () => {
			const buttons: ButtonDef[] = [{ type: "NAVIGATION", screen: "screen-2" }];

			const { componentMap } = setupSubheaderButtonTests({
				models,
				buttons
			});

			const props = query(componentMap.ContentBoxNavigationBar).props();
			strictEqual(props.navItems.length, 4);
			props.navItems.forEach(item => {
				strictEqual(item.selected, false);
			});
		});

		it("does not render the sub-header button of type `NAVIGATION` if the target does not exist", () => {
			const buttons: ButtonDef[] = [{ type: "NAVIGATION", screen: "screen-3" }];

			const { componentMap } = setupSubheaderButtonTests({
				models,
				buttons
			});

			query(componentMap.ContentBoxNavigationBar).assertNotRendered();
		});

		describe("sub-header button of type `NAVIGATION` with target `#previous`", () => {
			it("renders if a previous screen is reachable", () => {
				const buttons: ButtonDef[] = [{ type: "NAVIGATION", screen: "#previous" }];

				const { componentMap } = setupSubheaderButtonTests({
					models,
					buttons,
					screenName: "Screen2"
				});

				const props = query(componentMap.ContentBoxNavigationBar).props();
				strictEqual(props.navItems.length, 4);
			});

			it("does not render if no previous screen is reachable", () => {
				const buttons: ButtonDef[] = [{ type: "NAVIGATION", screen: "#previous" }];

				const { componentMap } = setupSubheaderButtonTests({
					models,
					buttons,
					screenName: "Screen1"
				});

				query(componentMap.ContentBoxNavigationBar).assertNotRendered();
			});
		});

		describe("sub-header button of type `NAVIGATION` with target `#next`", () => {
			it("renders if a next screen is reachable", () => {
				const buttons: ButtonDef[] = [{ type: "NAVIGATION", screen: "#next" }];

				const { componentMap } = setupSubheaderButtonTests({
					models,
					buttons,
					screenName: "Screen1"
				});

				const props = query(componentMap.ContentBoxNavigationBar).props();
				strictEqual(props.navItems.length, 4);
			});

			it("does not render if no next screen is reachable", () => {
				const buttons: ButtonDef[] = [{ type: "NAVIGATION", screen: "#next" }];

				const { componentMap } = setupSubheaderButtonTests({
					models,
					buttons,
					screenName: "LastScreen"
				});

				query(componentMap.ContentBoxNavigationBar).assertNotRendered();
			});
		});

		describe("if a detached repeat detail screen is open", () => {
			it("renders all the sub-header buttons of type `NAVIGATION` disabled", () => {
				const locationStackForDetachedRepeat = [
					{
						path: createDocumentPath(),
						locationPath: createModelPath(BUTTONS.screen1)
					},
					{
						path: BUTTONS.groupDocumentPath,
						locationPath: BUTTONS.detachedRepeatDetailScreen
					}
				];

				const buttons: ButtonDef[] = [
					{ type: "NAVIGATION", scope: "HIDDEN_IN_READONLY_MODE" },
					{ type: "NAVIGATION" }
				];

				const { componentMap } = setupSubheaderButtonTests({
					models,
					buttons,
					locationStack: locationStackForDetachedRepeat
				});

				const props = query(componentMap.ContentBoxNavigationBar).props();
				strictEqual(props.navItems.length, 4);
				props.navItems.forEach(item => {
					strictEqual(item.disabled, true);
				});
			});
		});
	});
});
