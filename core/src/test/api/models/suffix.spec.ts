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

import { strictEqual } from "node:assert/strict";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization";

import { createEngineStore, FormModelSelectors } from "../../../back-end/store/index.js";
import type { EngineState } from "../../../back-end/store/internal/store.js";
import type { FormModel } from "../../../models/index.js";
import { createModelPath } from "../../utils/createModelPath.js";
import { US_LOCALE } from "../../utils/localization.js";
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
									documentModelPath: createModelPath("root", "norep", "number_amount_02"),
									expectedSuffix: "€"
								});
							});
						});

						describe("and given no suffix is defined in the given fieldConfigurationEntry", () => {
							it("returns the given amountSuffix", () => {
								assert({
									...fixture,
									documentModelPath: createModelPath("root", "norep", "number_amount_01"),
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
									documentModelPath: createModelPath("root", "norep", "number_amount_02"),
									expectedSuffix: "€"
								});
							});
						});

						describe("and given no suffix is defined in the given fieldConfigurationEntry", () => {
							it("returns the localized value of the referenced field", () => {
								const expectedSuffix = "Taler (EN)";

								assert({
									...fixture,
									documentModelPath: createModelPath("root", "norep", "number_amount_01"),
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
									documentModelPath: createModelPath("root", "norep", "number_amount_02"),
									expectedSuffix: "€"
								});
							});
						});

						describe("and given no suffix is defined in the given fieldConfigurationEntry", () => {
							it("returns undefined", () => {
								assert({
									...fixture,
									documentModelPath: createModelPath("root", "norep", "number_amount_01"),
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
								documentModelPath: createModelPath("root", "norep", "number_none_02"),
								expectedSuffix: "mmol/l"
							});
						});
					});

					describe("given no suffix is defined in the given fieldConfigurationEntry", () => {
						it("returns undefined", () => {
							assert({
								...fixture,
								documentModelPath: createModelPath("root", "norep", "number_none_01"),
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
						documentModelPath: createModelPath("root", "norep", "string"),
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
