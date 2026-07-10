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

/* eslint-disable mocha/no-setup-in-describe */

import { query } from "@com.mgmtp.a12.devtools/react";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { Config } from "../../../view/internal/configuration/engine-configuration.js";
import type { RtlRenderWrapper } from "../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../utils/createModelPath.js";
import { setupFormEngineRendererWithRtl } from "../../utils/setup.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";
import { createDocument, IDS } from "../../utils/test-model-helpers/dependent-control.js";

describe("api.features", () => {
	describe("dependent-control", () => {
		const models = setupModelsFixture("dependencies.control");

		function setup(
			screenName: string,
			document?: GroupInstance,
			config?: Partial<Config>
		): RtlRenderWrapper {
			const wrapper = setupFormEngineRendererWithRtl({
				models,
				data: { document },
				ui: { screenLocation: [{ locationPath: createModelPath(screenName), path: [] }] },
				config
			});

			return wrapper;
		}

		const testVariants = [
			{
				element: "multi column section",
				screenId: IDS.SCREEN2,
				headlineSuffix: "Multi Column Section"
			},
			{
				element: "section",
				screenId: IDS.SCREEN1,
				headlineSuffix: "Section"
			},
			{
				element: "control grid",
				screenId: IDS.SCREEN3,
				headlineSuffix: "Control Grid"
			}
		];

		for (const testVariant of testVariants) {
			describe(`The target of a dependent control is a ${testVariant.element}.`, () => {
				/**
				 * Behavior of the boolean trigger control:
				 * * **undefined:** only 1.0 is shown
				 * * **false:** only 1.1 is shown
				 * * **true:** only 1.2 is shown
				 */
				describe("which is dependent on a boolean control", () => {
					const testDescriptions = [
						{
							description: `when trigger value is 'true', only shows the ${testVariant.element}s with visibility condition 'true'`,
							triggerValue: true,
							renderedHeadlines: [false, false, true]
						},
						{
							description: `when trigger value is 'false', only shows the ${testVariant.element}s with visibility condition 'false'`,
							triggerValue: false,
							renderedHeadlines: [false, true, false]
						},
						{
							description: `when trigger value is 'undefined', only shows the ${testVariant.element}s with visibility condition 'undefined'`,
							triggerValue: undefined,
							renderedHeadlines: [true, false, false]
						}
					];

					for (const testDescription of testDescriptions) {
						it(`${testDescription.description}`, () => {
							const { widgetMap } = setup(
								testVariant.screenId,
								createDocument({ bool_single: testDescription.triggerValue })
							);

							const headlinesUndefined = query(widgetMap.TypographyHeadline).withProp(
								"children",
								`[1.0] ${testVariant.headlineSuffix}`
							);
							const headlinesFalse = query(widgetMap.TypographyHeadline).withProp(
								"children",
								`[1.1] ${testVariant.headlineSuffix}`
							);
							const headlinesTrue = query(widgetMap.TypographyHeadline).withProp(
								"children",
								`[1.2] ${testVariant.headlineSuffix}`
							);

							testDescription.renderedHeadlines[0]
								? headlinesUndefined.assertRendered()
								: headlinesUndefined.assertNotRendered();
							testDescription.renderedHeadlines[1]
								? headlinesFalse.assertRendered()
								: headlinesFalse.assertNotRendered();
							testDescription.renderedHeadlines[2]
								? headlinesTrue.assertRendered()
								: headlinesTrue.assertNotRendered();
						});
					}
				});

				/**
				 * Behavior of the confirm trigger control:
				 * * **null:** 2.1 is shown and 2.2 is not shown.
				 * * **true:** 2.1 is not shown and 2.2 is shown.
				 */
				describe("which is dependent on a confirm control", () => {
					const testDescriptions = [
						{
							description: `with trigger value 'true' only shows ${testVariant.element}s with visibility condition 'true'`,
							triggerValue: true,
							renderedHeadlines: [false, true]
						},
						{
							description: `with trigger value 'null' only shows ${testVariant.element}s with visibility condition 'null'`,
							triggerValue: null,
							renderedHeadlines: [true, false]
						},
						{
							description: `with trigger value 'undefined' only shows ${testVariant.element}s with visibility condition 'null'`,
							triggerValue: undefined,
							renderedHeadlines: [true, false]
						}
					];

					for (const testDescription of testDescriptions) {
						it(`${testDescription.description}`, () => {
							const { widgetMap } = setup(
								testVariant.screenId,
								createDocument({ confirm_single: testDescription.triggerValue })
							);

							const headlinesNull = query(widgetMap.TypographyHeadline).withProp(
								"children",
								`[2.1] ${testVariant.headlineSuffix}`
							);
							const headlinesTrue = query(widgetMap.TypographyHeadline).withProp(
								"children",
								`[2.2] ${testVariant.headlineSuffix}`
							);

							testDescription.renderedHeadlines[0]
								? headlinesNull.assertRendered()
								: headlinesNull.assertNotRendered();

							testDescription.renderedHeadlines[1]
								? headlinesTrue.assertRendered()
								: headlinesTrue.assertNotRendered();
						});
					}
				});

				/**
				 * Behavior of the enumeration trigger control:
				 * * **null:** All elements (3.1, 3.2, and 3.3) are shown.
				 * * **V0:** Only 3.1 is shown.
				 * * **V1:** Only 3.1 is shown.
				 * * **V2:** Only 3.2 is shown.
				 * * **V3:** Only 3.3 is shown.
				 */
				describe("which is dependent on an enumeration control", () => {
					const testDescriptions = [
						{ value: null, headlinesRendered: [true, true, true] },
						{
							value: "V0",
							headlinesRendered: [true, false, false]
						},
						{
							value: "V1",
							headlinesRendered: [true, false, false]
						},
						{
							value: "V2",
							headlinesRendered: [false, true, false]
						},
						{
							value: "V3",
							headlinesRendered: [false, false, true]
						}
					];

					for (const testDescription of testDescriptions) {
						it(
							"will only be shown if the condition of the enumeration trigger control is fulfilled - " +
								testDescription.value,
							() => {
								const { widgetMap } = setup(
									testVariant.screenId,
									testDescription.value
										? createDocument({ enum_single: testDescription.value })
										: undefined
								);

								const headline1 = query(widgetMap.TypographyHeadline).withProp(
									"children",
									`[3.1] ${testVariant.headlineSuffix}`
								);
								const headline2 = query(widgetMap.TypographyHeadline).withProp(
									"children",
									`[3.2] ${testVariant.headlineSuffix}`
								);
								const headline3 = query(widgetMap.TypographyHeadline).withProp(
									"children",
									`[3.3] ${testVariant.headlineSuffix}`
								);

								testDescription.headlinesRendered[0]
									? headline1.assertRendered()
									: headline1.assertNotRendered();

								testDescription.headlinesRendered[1]
									? headline2.assertRendered()
									: headline2.assertNotRendered();

								testDescription.headlinesRendered[2]
									? headline3.assertRendered()
									: headline3.assertNotRendered();
							}
						);
					}
				});

				describe("depends on an indexed control", () => {
					describe("with a numeric index", () => {
						it(`only shows the ${testVariant.element} if the trigger value matches the condition`, () => {
							const { widgetMap } = setup(
								testVariant.screenId,
								createDocument({ bool_numericIndex: true })
							);

							const headlinesTrue = query(widgetMap.TypographyHeadline).withProp(
								"children",
								`[6.2] ${testVariant.headlineSuffix}`
							);
							const headlinesFalse = query(widgetMap.TypographyHeadline).withProp(
								"children",
								`[6.1] ${testVariant.headlineSuffix}`
							);

							headlinesTrue.assertRendered();
							headlinesFalse.assertNotRendered();
						});
					});

					describe("with a semantic index", () => {
						it(`only shows the ${testVariant.element} if the trigger value matches the condition`, () => {
							const { widgetMap } = setup(
								testVariant.screenId,
								createDocument({ bool_semanticIndex: true })
							);

							const headlinesTrue = query(widgetMap.TypographyHeadline).withProp(
								"children",
								`[7.2] ${testVariant.headlineSuffix}`
							);
							const headlinesFalse = query(widgetMap.TypographyHeadline).withProp(
								"children",
								`[7.1] ${testVariant.headlineSuffix}`
							);

							headlinesTrue.assertRendered();
							headlinesFalse.assertNotRendered();
						});
					});
				});

				if (testVariant.element !== "control grid") {
					/**
					 * Behavior of nested trigger controls:
					 * * Outer trigger
					 *   * **false:** 4.1 is not shown.
					 *   * **true:** 4.1 is not shown.
					 * * Inner trigger
					 *   * **false:** 4.1.2 is not shown.
					 *   * **true:** 4.1.2 is not shown.
					 */
					describe(
						"is nested inside another element that depends on the dependent control feature," +
							" then it will only be shown if the other element is shown" +
							" and the conditions of the trigger control is fulfilled",
						() => {
							const testDescriptions = [
								{
									description: "no trigger set",
									document: undefined,
									headlinesRendered: [false, false]
								},
								{
									description: "only first trigger set",
									document: createDocument({ bool_cascade0: true }),
									headlinesRendered: [testVariant.element !== "control grid", false]
								},
								{
									description: "both triggers in the cascade set",
									document: createDocument({ bool_cascade0: true, bool_cascade1: true }),
									headlinesRendered: [true, testVariant.element !== "control grid"]
								}
							];

							for (const testDescription of testDescriptions) {
								it(`${testDescription.description}`, () => {
									const { widgetMap } = setup(testVariant.screenId, testDescription.document);

									const headline1 = query(widgetMap.TypographyHeadline).withProp(
										"children",
										`[4.1] ${testVariant.headlineSuffix}`
									);
									const headline2 = query(widgetMap.TypographyHeadline).withProp(
										"children",
										`[4.1.2] ${testVariant.headlineSuffix}`
									);

									testDescription.headlinesRendered[0]
										? headline1.assertRendered()
										: headline1.assertNotRendered();

									testDescription.headlinesRendered[1]
										? headline2.assertRendered()
										: headline2.assertNotRendered();
								});
							}
						}
					);
				}

				/**
				 * Behavior of multiple trigger controls:
				 * * 5.1 will be shown if both triggers are true.
				 */

				describe(
					"depends on multiple trigger controls," +
						" then it will only be shown if all conditions of all trigger controls are fulfilled",
					() => {
						const testDescriptions = [
							{
								description: "all triggers null",
								document: undefined,
								headlineRendered: false
							},
							{
								description: "only one trigger set to true",
								document: createDocument({ bool_combined0: true }),
								headlineRendered: false
							},
							{
								description: "both triggers set but one is false",
								document: createDocument({ bool_combined0: false, bool_combined1: true }),
								headlineRendered: false
							},
							{
								description: "both triggers set to true",
								document: createDocument({ bool_combined0: true, bool_combined1: true }),
								headlineRendered: true
							}
						];

						for (const testDescription of testDescriptions) {
							it(`${testDescription.description}`, () => {
								const { widgetMap } = setup(testVariant.screenId, testDescription.document);

								const headline = query(widgetMap.TypographyHeadline).withProp(
									"children",
									`[5.1] ${testVariant.headlineSuffix}`
								);

								testDescription.headlineRendered
									? headline.assertRendered()
									: headline.assertNotRendered();
							});
						}
					}
				);
			});
		}

		describe("The target of a dependent control is a custom screen element", () => {
			/**
			 * Behavior of the boolean trigger control:
			 * * **undefined:** only 1.0 is shown
			 * * **false:** only 1.1 is shown
			 * * **true:** only 1.2 is shown
			 */
			describe("which is dependent on a boolean control", () => {
				const testDescriptions = [
					{
						description: `with trigger value 'true' only shows custom screen elements with visibility condition 'true'`,
						triggerValue: true,
						renderedHeadlines: [false, false, true]
					},
					{
						description: `with trigger value 'false' only shows custom screen elements with visibility condition 'false'`,
						triggerValue: false,
						renderedHeadlines: [false, true, false]
					},
					{
						description: `with trigger value 'undefined' only shows custom screen elements with visibility condition 'undefined'`,
						triggerValue: undefined,
						renderedHeadlines: [true, false, false]
					}
				];

				for (const testDescription of testDescriptions) {
					it(`${testDescription.description}`, () => {
						const { widgetMap } = setup(
							IDS.SCREEN4,
							createDocument({ bool_single: testDescription.triggerValue })
						);

						const headlinesFUndefined = query(widgetMap.TypographyHeadline).withProp(
							"children",
							`[1.0] Custom Screen Element`
						);
						const headlinesFalse = query(widgetMap.TypographyHeadline).withProp(
							"children",
							`[1.1] Custom Screen Element`
						);
						const headlinesTrue = query(widgetMap.TypographyHeadline).withProp(
							"children",
							`[1.2] Custom Screen Element`
						);

						testDescription.renderedHeadlines[0]
							? headlinesFUndefined.assertRendered()
							: headlinesFUndefined.assertNotRendered();
						testDescription.renderedHeadlines[1]
							? headlinesFalse.assertRendered()
							: headlinesFalse.assertNotRendered();
						testDescription.renderedHeadlines[2]
							? headlinesTrue.assertRendered()
							: headlinesTrue.assertNotRendered();
					});
				}
			});
		});
	});
});
