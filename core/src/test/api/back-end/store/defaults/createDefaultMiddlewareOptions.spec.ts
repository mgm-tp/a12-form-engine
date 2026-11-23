// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
