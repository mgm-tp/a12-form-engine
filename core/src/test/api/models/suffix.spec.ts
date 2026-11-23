// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { createEngineStore, FormModelSelectors } from "../../../back-end/store/index.js";
import type { EngineState } from "../../../back-end/store/internal/store.js";
import type { FormModel } from "../../../models/index.js";
import { US_LOCALE } from "../../utils/localization.js";
import { ModelHelpers } from "../../utils/model-helpers.js";
import { setupFixture, setupModelsFixture } from "../../utils/setupFixture.js";

describe("api.models.FormModelSelectors", () => {
	describe("suffix", () => {
		const amountSuffixModels = setupModelsFixture("controls.suffix", "amountSuffix");

		describe("given a document model element", () => {
			describe("which is of type Number", () => {
				describe("and trait is 'amount'", () => {
					describe("and a static amountSuffix is defined in the model", () => {
						const AMOUNT_SUFFIX = "Custom_Amount_Suffix";

						const fixture = setupFixture(() => {
							const locale = US_LOCALE;
							const formModelWithAmountSuffix: FormModel = {
								...amountSuffixModels.formModel,
								content: {
									...amountSuffixModels.formModel.content,
									amountSuffix: { type: "static", value: AMOUNT_SUFFIX },
									amountSuffixFieldPath: undefined
								}
							};

							return {
								state: createEngineStore({
									data: {},
									locale,
									models: {
										...amountSuffixModels,
										formModel: formModelWithAmountSuffix
									}
								}),
								localizer: defaultLocalizerFactory({ locale })
							};
						});

						describe("and given a suffix is defined in the given fieldConfigurationEntry", () => {
							it("returns the suffix from fieldConfigurationEntry", () => {
								assert({
									...fixture,
									documentModelPath: ModelHelpers.createModelPath(
										"root",
										"norep",
										"number_amount_02"
									),
									expectedSuffix: "€"
								});
							});
						});

						describe("and given no suffix is defined in the given fieldConfigurationEntry", () => {
							it("returns the given amountSuffix", () => {
								assert({
									...fixture,
									documentModelPath: ModelHelpers.createModelPath(
										"root",
										"norep",
										"number_amount_01"
									),
									expectedSuffix: AMOUNT_SUFFIX
								});
							});
						});
					});

					describe("and a dynamic amountSuffix is defined in the model", () => {
						const fixture = setupFixture(() => {
							const locale = US_LOCALE;
							const document = {
								root: {
									norep: {
										amountSuffixEnum: "Taler"
									}
								}
							};

							return {
								state: createEngineStore({
									data: {
										document
									},
									locale,
									models: amountSuffixModels
								}),
								localizer: defaultLocalizerFactory({ locale })
							};
						});

						describe("and given a suffix is defined in the given fieldConfigurationEntry", () => {
							it("returns the suffix from fieldConfigurationEntry", () => {
								assert({
									...fixture,
									documentModelPath: ModelHelpers.createModelPath(
										"root",
										"norep",
										"number_amount_02"
									),
									expectedSuffix: "€"
								});
							});
						});

						describe("and given no suffix is defined in the given fieldConfigurationEntry", () => {
							it("returns the localized value of the referenced field", () => {
								const expectedSuffix = "Taler (EN)";

								assert({
									...fixture,
									documentModelPath: ModelHelpers.createModelPath(
										"root",
										"norep",
										"number_amount_01"
									),
									expectedSuffix
								});
							});
						});
					});

					describe("and no amountSuffix is defined in the model", () => {
						const fixture = setupFixture(() => {
							const locale = US_LOCALE;
							const formModelWithOutAmountSuffix: FormModel = {
								...amountSuffixModels.formModel,
								content: {
									...amountSuffixModels.formModel.content,
									amountSuffix: undefined,
									amountSuffixFieldPath: undefined
								}
							};

							return {
								state: createEngineStore({
									data: {},
									locale,
									models: {
										...amountSuffixModels,
										formModel: formModelWithOutAmountSuffix
									}
								}),
								localizer: defaultLocalizerFactory({ locale })
							};
						});

						describe("and a suffix is defined in the given fieldConfigurationEntry", () => {
							it("returns the suffix from fieldConfigurationEntry", () => {
								assert({
									...fixture,
									documentModelPath: ModelHelpers.createModelPath(
										"root",
										"norep",
										"number_amount_02"
									),
									expectedSuffix: "€"
								});
							});
						});

						describe("and given no suffix is defined in the given fieldConfigurationEntry", () => {
							it("returns undefined", () => {
								assert({
									...fixture,
									documentModelPath: ModelHelpers.createModelPath(
										"root",
										"norep",
										"number_amount_01"
									),
									expectedSuffix: undefined
								});
							});
						});
					});
				});

				describe("and trait is not 'amount'", () => {
					const fixture = setupFixture(() => {
						const locale = US_LOCALE;

						return {
							state: createEngineStore({
								data: {},
								locale,
								models: amountSuffixModels
							}),
							localizer: defaultLocalizerFactory({ locale })
						};
					});

					describe("given a suffix is defined in the given fieldConfigurationEntry", () => {
						it("returns the suffix from fieldConfigurationEntry", () => {
							assert({
								...fixture,
								documentModelPath: ModelHelpers.createModelPath("root", "norep", "number_none_02"),
								expectedSuffix: "mmol/l"
							});
						});
					});

					describe("given no suffix is defined in the given fieldConfigurationEntry", () => {
						it("returns undefined", () => {
							assert({
								...fixture,
								documentModelPath: ModelHelpers.createModelPath("root", "norep", "number_none_01"),
								expectedSuffix: undefined
							});
						});
					});
				});
			});

			describe("which is not of type Number", () => {
				const fixture = setupFixture(() => {
					const locale = US_LOCALE;

					return {
						state: createEngineStore({
							data: {},
							locale,
							models: amountSuffixModels
						}),
						localizer: defaultLocalizerFactory({ locale })
					};
				});

				it("returns undefined", () => {
					assert({
						...fixture,
						documentModelPath: ModelHelpers.createModelPath("root", "norep", "string"),
						expectedSuffix: undefined
					});
				});
			});
		});
	});
});

function assert(params: {
	state: EngineState;
	documentModelPath: ModelPath;
	expectedSuffix: string | undefined;
	localizer: Localizer;
}): void {
	const { documentModelPath, expectedSuffix, state, localizer } = params;

	strictEqual(FormModelSelectors.suffix(documentModelPath, localizer)(state), expectedSuffix);
}
