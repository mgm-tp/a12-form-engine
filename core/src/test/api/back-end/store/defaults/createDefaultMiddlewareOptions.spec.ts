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

import { notEqual, strictEqual } from "node:assert/strict";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type IExternalEnumerationProvider from "../../../../../back-end/services/external-enumeration-provider.js";
import type { EngineStore } from "../../../../../back-end/store/index.js";
import { createDefaultMiddlewareOptions } from "../../../../../back-end/store/index.js";

describe("api.back-end.store.defaults", () => {
	describe("createDefaultMiddlewareOptions", () => {
		describe("externalEnumerationProvider", () => {
			describe("called with an external enumeration provider", () => {
				it("returns an object where the given external enumeration provider is set", () => {
					const externalEnumerationProvider: IExternalEnumerationProvider =
						(): DocumentModel.ReadonlyObjectMap<{ [key: string]: string | undefined }> => {
							return { key_1: { en: "test" } };
						};
					const middlewareOptions = createDefaultMiddlewareOptions({ externalEnumerationProvider });
					strictEqual(middlewareOptions.externalEnumerationProvider, externalEnumerationProvider);
				});
			});

			describe("called with no external enumeration provider", () => {
				it("returns an object with no external enumeration provider set", () => {
					const middlewareOptions = createDefaultMiddlewareOptions({});
					strictEqual(middlewareOptions.externalEnumerationProvider, undefined);
				});
			});
		});

		describe("localizer", () => {
			describe("given a localizer provider", () => {
				it("returns an object where the given localizer is set", () => {
					const localizer: EngineStore.Provider<Localizer> = () => () => "";

					const middlewareOptions = createDefaultMiddlewareOptions({ localizer });
					strictEqual(middlewareOptions.localizer, localizer);
				});
			});

			describe("given no localizer provider", () => {
				it("creates a new default localizer and returns an object with the created localizer", () => {
					const middlewareOptions = createDefaultMiddlewareOptions({});
					notEqual(middlewareOptions.localizer, undefined);
				});
			});
		});

		describe("nowProvider", () => {
			describe("called with a now provider", () => {
				it("returns an object where the given now provider is set", () => {
					const nowProvider: EngineStore.Provider<Date | undefined> = () => new Date();
					const middlewareOptions = createDefaultMiddlewareOptions({ nowProvider });
					strictEqual(middlewareOptions.nowProvider, nowProvider);
				});
			});

			describe("called without a now provider", () => {
				it("returns an object without a now provider set", () => {
					const middlewareOptions = createDefaultMiddlewareOptions({});
					strictEqual(middlewareOptions.nowProvider, undefined);
				});
			});
		});
	});
});
