// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { SelectItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/select.api.js";

import type { EngineStore } from "../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../models/index.js";

import { ModelHelpers } from "../utils/model-helpers.js";
import { SetupHelpers } from "../utils/setup.js";
import { setupModelsFixture } from "../utils/setupFixture.js";
import { DEP_ENUMERATION } from "../utils/test-model-helpers/dependent-enumeration.js";

const { createModelPath } = ModelHelpers;

describe("unit.view.Dependent Enumeration", () => {
	const models = setupModelsFixture("dependencies.enumeration");

	describe("Enumeration control inside top level screen", () => {
		it("renders all enumeration values when no master value is selected", async () => {
			const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({ models });

			query(wrapper.widgetMap.Select).withId(DEP_ENUMERATION.ID_TOP_LEVEL_BRAND).assertRendered();
			const dependentEnumeration = query(wrapper.widgetMap.Select)
				.withId(DEP_ENUMERATION.ID_TOP_LEVEL_MODEL)
				.props();

			const items: SelectItem[] = dependentEnumeration.items;
			strictEqual(items.length, 7);
		});

		it("only renders enumeration values which fit the dependency", () => {
			executeTest({
				dependentElementId: DEP_ENUMERATION.ID_TOP_LEVEL_MODEL
			});
		});
	});

	describe("Enumeration control inside detached repeat detail screen", () => {
		describe("and master field inside repeatable group", () => {
			it("only renders enumeration values which fit the dependency", () => {
				executeTest({
					dependentElementId: DEP_ENUMERATION.ID_MODEL_IN_DR,
					screenState: {
						path: DEP_ENUMERATION.pathToCars,
						locationPath: DEP_ENUMERATION.dr_locationPath
					}
				});
			});
		});

		describe("and master field outside repeatable group", () => {
			it("only renders enumeration values which fit the dependency", () => {
				executeTest({
					dependentElementId: DEP_ENUMERATION.ID_MODEL_MASTER_OUTSIDE_IN_DR,
					screenState: {
						path: DEP_ENUMERATION.pathToRestrictedCars,
						locationPath: DEP_ENUMERATION.dr_restricted_locationPath
					}
				});
			});
		});
	});

	describe("Enumeration control inside embedded repeat detail screen", () => {
		describe("and master field inside repeatable group", () => {
			it("only renders enumeration values which fit the dependency", () => {
				executeTest({
					dependentElementId: DEP_ENUMERATION.ID_MODEL_IN_ER,
					repeatInstanceState: {
						[ModelPath.toString(DEP_ENUMERATION.er_locationPath)]: {
							expandedRowPath: DEP_ENUMERATION.pathToCars
						}
					}
				});
			});
		});

		describe("and master field outside repeatable group", () => {
			it("only renders enumeration values which fit the dependency", () => {
				executeTest({
					dependentElementId: DEP_ENUMERATION.ID_MODEL_MASTER_OUTSIDE_IN_ER,
					repeatInstanceState: {
						[ModelPath.toString(DEP_ENUMERATION.er_restricted_locationPath)]: {
							expandedRowPath: DEP_ENUMERATION.pathToRestrictedCars
						}
					}
				});
			});
		});
	});

	describe("Enumeration field overview-column inside top level screen", () => {
		describe("and master field inside repeatable group", () => {
			it("only renders enumeration values which fit the dependency", async () => {
				const doc = { A12T_DependentEnumeration: { Cars: [{ Brand: "MERCEDES" }] } };

				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: doc }
				});

				const dependentEnumeration = query(wrapper.widgetMap.Select)
					.withId(DEP_ENUMERATION.ID_MODEL_IN_IR)
					.props();
				const items: SelectItem[] = dependentEnumeration.items;
				strictEqual(items[0].value, "");
				strictEqual(items[1].value, "MERCEDES_A_CLASS");
				strictEqual(items[2].value, "MERCEDES_E_CLASS");
			});
		});

		describe("and master field outside repeatable group", () => {
			it("only renders enumeration values which fit the dependency", async () => {
				const doc = {
					A12T_DependentEnumeration: {
						Restricted: {
							BrandRestriction: "MERCEDES",
							Cars: [{}]
						}
					}
				};
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: {
						document: doc
					},
					ui: {
						backup: [{ document: doc, messages: {} }],
						screenLocation: [
							{
								path: [],
								locationPath: createModelPath(DEP_ENUMERATION.screenName),
								repeatInstanceState: {
									[ModelPath.toString(DEP_ENUMERATION.er_restricted_locationPath)]: {
										expandedRowPath: DEP_ENUMERATION.pathToRestrictedCars
									}
								}
							}
						]
					}
				});

				const dependentEnumeration = query(wrapper.widgetMap.Select)
					.withId(DEP_ENUMERATION.ID_MODEL_MASTER_OUTSIDE_IN_IR)
					.props();

				const items: SelectItem[] = dependentEnumeration.items;
				strictEqual(items[0].value, "");
				strictEqual(items[1].value, "MERCEDES_A_CLASS");
				strictEqual(items[2].value, "MERCEDES_E_CLASS");
			});
		});
	});

	async function executeTest(options: {
		readonly dependentElementId: string;
		readonly screenState?: EngineStore.ScreenState;
		readonly repeatInstanceState?: ReadonlyObjectMap<EngineStore.Repeat.InstanceState>;
	}): Promise<void> {
		const documentWithOneRow = {
			A12T_DependentEnumeration: {
				Brand: "MERCEDES",
				Cars: [{ Brand: "MERCEDES" }],
				Restricted: {
					BrandRestriction: "MERCEDES",
					Cars: [{}]
				}
			}
		};

		const screenLocation: EngineStore.ScreenState[] = [
			{
				path: [],
				locationPath: createModelPath(DEP_ENUMERATION.screenName),
				repeatInstanceState: options.repeatInstanceState
			}
		];

		if (options.screenState) {
			screenLocation.push(options.screenState);
		}

		const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
			models,
			data: { document: documentWithOneRow },
			ui: {
				screenLocation: screenLocation,
				backup: options.screenState ? [{ document: documentWithOneRow, messages: {} }] : undefined
			}
		});

		const dependentEnumeration = query(wrapper.widgetMap.Select)
			.withId(options.dependentElementId)
			.props();

		const items: SelectItem[] = dependentEnumeration.items;
		strictEqual(items[0].value, "");
		strictEqual(items[1].value, "MERCEDES_A_CLASS");
		strictEqual(items[2].value, "MERCEDES_E_CLASS");
	}
});
