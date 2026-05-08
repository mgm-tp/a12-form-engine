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

import { strictEqual } from "node:assert/strict";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type IExternalEnumerationProvider from "../../../../../back-end/services/external-enumeration-provider.js";
import { createEngineStore } from "../../../../../back-end/store/index.js";
import type { EngineState } from "../../../../../back-end/store/internal/store.js";
import type { FormModelMap } from "../../../../../view/index.js";
import { defaultMapStateToProps } from "../../../../../view/index.js";
import {
	DefaultExternalEnumerationProvider,
	DefaultFormModelMap
} from "../../../../../view/internal/configuration/Defaults.js";
import { DE_LOCALE, US_LOCALE } from "../../../../utils/localization.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";

describe("api.back-end.store.defaults", () => {
	let engineState: EngineState;
	const models = setupModelsFixture("computation-validation.partial");
	before(() => {
		engineState = createEngineStore({
			models,
			locale: DE_LOCALE,
			data: {}
		});
	});

	describe("defaultMapStateToProps", () => {
		describe("cardView", () => {
			describe("called with 'cardView=true'", () => {
				it("returns an object with the state and a config where 'cardView=true'", () => {
					const props = defaultMapStateToProps(engineState, { config: { cardView: true } });
					strictEqual(props.config.cardView, true);
				});
			});

			describe("called with 'cardView=false'", () => {
				it("returns an object with the state and a config where 'cardView=false'", () => {
					const props = defaultMapStateToProps(engineState, { config: { cardView: false } });
					strictEqual(props.config.cardView, false);
				});
			});

			describe("called with 'cardView=undefined'", () => {
				it("returns an object with the state and a config where 'cardView=false'", () => {
					const props = defaultMapStateToProps(engineState, { config: { cardView: undefined } });
					strictEqual(props.config.cardView, false);
				});
			});
		});

		describe("disableDatePicker", () => {
			describe("called with 'disableDatePicker=true'", () => {
				it("returns an object with the state and a config where 'disableDatePicker=true'", () => {
					const props = defaultMapStateToProps(engineState, {
						config: { disableDatePicker: true }
					});
					strictEqual(props.config.disableDatePicker, true);
				});
			});

			describe("called with 'disableDatePicker=false'", () => {
				it("returns an object with the state and a config where 'disableDatePicker=false'", () => {
					const props = defaultMapStateToProps(engineState, {
						config: { disableDatePicker: false }
					});
					strictEqual(props.config.disableDatePicker, false);
				});
			});

			describe("called with 'disableDatePicker=undefined'", () => {
				it("returns an object with the state and a config where 'disableDatePicker=false'", () => {
					const props = defaultMapStateToProps(engineState, {
						config: { disableDatePicker: undefined }
					});
					strictEqual(props.config.disableDatePicker, false);
				});
			});
		});

		describe("earlyDetectDirtyControl", () => {
			describe("called with 'earlyDetectDirtyControl=true'", () => {
				it("returns an object with the state and a config where 'earlyDetectDirtyControl=true'", () => {
					const props = defaultMapStateToProps(engineState, {
						config: { earlyDetectDirtyControl: true }
					});
					strictEqual(props.config.earlyDetectDirtyControl, true);
				});
			});

			describe("called with 'earlyDetectDirtyControl=false'", () => {
				it("returns an object with the state and a config where 'earlyDetectDirtyControl=false'", () => {
					const props = defaultMapStateToProps(engineState, {
						config: { earlyDetectDirtyControl: false }
					});
					strictEqual(props.config.earlyDetectDirtyControl, false);
				});
			});

			describe("called with 'earlyDetectDirtyControl=undefined'", () => {
				it("returns an object with the state and a config where 'earlyDetectDirtyControl=false'", () => {
					const props = defaultMapStateToProps(engineState, {
						config: { earlyDetectDirtyControl: undefined }
					});
					strictEqual(props.config.earlyDetectDirtyControl, false);
				});
			});
		});

		describe("externalEnumerationProvider", () => {
			describe("called with an external enumeration provider", () => {
				it("returns an object with the state and a config where the given external enumeration provider is set", () => {
					const externalEnumerationProvider: IExternalEnumerationProvider = (
						source: string,
						path?: ModelPath
					): DocumentModel.ReadonlyObjectMap<{ [key: string]: string | undefined }> => {
						return {
							key_1: {
								en: "test"
							}
						};
					};
					const props = defaultMapStateToProps(engineState, {
						config: { externalEnumerationProvider }
					});
					strictEqual(props.config.externalEnumerationProvider, externalEnumerationProvider);
				});
			});

			describe("called with no external enumeration provider", () => {
				it("returns an object with the state and a config where an empty DefaultExternalEnumerationProvider is set", () => {
					const props = defaultMapStateToProps(engineState, { config: {} });
					strictEqual(props.config.externalEnumerationProvider, DefaultExternalEnumerationProvider);
				});
			});
		});

		describe("timeMode", () => {
			describe("called with a timeMode", () => {
				it("returns an object with the state and a config where the given timeMode is set", () => {
					const props12 = defaultMapStateToProps(engineState, { config: { timeMode: "12h" } });
					strictEqual(props12.config.timeMode, "12h");

					const props24 = defaultMapStateToProps(engineState, { config: { timeMode: "24h" } });
					strictEqual(props24.config.timeMode, "24h");
				});
			});

			describe("called with no timeMode", () => {
				describe("locale=en_US", () => {
					it("returns an object with the state and a config where 'timeMode=12h'", () => {
						const engineStateUs = createEngineStore({
							models,
							locale: US_LOCALE,
							data: {}
						});
						const props = defaultMapStateToProps(engineStateUs, {});
						strictEqual(props.config.timeMode, "12h");
					});
				});

				describe("locale=en_DE", () => {
					it("returns an object with the state and a config where 'timeMode=24h'", () => {
						const engineStateUs = createEngineStore({
							models,
							locale: Locale.fromString("en_DE") as Locale,
							data: {}
						});
						const props = defaultMapStateToProps(engineStateUs, {});
						strictEqual(props.config.timeMode, "24h");
					});
				});

				describe("locale=de_DE", () => {
					it("returns an object with the state and a config where 'timeMode=24h'", () => {
						const engineStateUs = createEngineStore({
							models,
							locale: DE_LOCALE,
							data: {}
						});
						const props = defaultMapStateToProps(engineStateUs, {});
						strictEqual(props.config.timeMode, "24h");
					});
				});

				describe("any other locale", () => {
					it("returns an object with the state and a config where 'timeMode=24h'", () => {
						const engineStateUs = createEngineStore({
							models,
							locale: Locale.fromString("my_LO") as Locale,
							data: {}
						});
						const props = defaultMapStateToProps(engineStateUs, {});
						strictEqual(props.config.timeMode, "24h");
					});
				});
			});
		});

		describe("uiIdPrefix", () => {
			it("returns an object with the state and a config where the given uiIdPrefix is set", () => {
				const props = defaultMapStateToProps(engineState, { config: { uiIdPrefix: "My Prefix" } });
				strictEqual(props.config.uiIdPrefix, "My Prefix");
			});
		});

		describe("ariaLevel", () => {
			describe("called with a ariaLevel", () => {
				it("returns an object with the state and a config where the given ariaLevel is set", () => {
					const props = defaultMapStateToProps(engineState, { config: { ariaLevel: 42 } });
					strictEqual(props.config.ariaLevel, 42);
				});
			});

			describe("called with no ariaLevel", () => {
				it("returns an object with the state and a config where 'ariaLevel=1'", () => {
					const props = defaultMapStateToProps(engineState, {});
					strictEqual(props.config.ariaLevel, 1);
				});
			});
		});

		describe("formModelMap", () => {
			describe("called with a formModelMap", () => {
				it("returns an object with the state and a config where the given formModelMap is set", () => {
					const myFormModelMap: FormModelMap = {
						...DefaultFormModelMap,
						Section: { component: () => null }
					};
					const props = defaultMapStateToProps(engineState, {
						config: { formModelMap: myFormModelMap }
					});
					strictEqual(props.config.formModelMap, myFormModelMap);
				});
			});

			describe("called with no formModelMap", () => {
				it("returns an object with the state and a config where the default form model map is set", () => {
					const props = defaultMapStateToProps(engineState, {});
					strictEqual(props.config.formModelMap, DefaultFormModelMap);
				});
			});
		});
	});
});
