// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { IIdentifier } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/lib/main/js/a12internal/validation/IIdentifier.js";
import { ErrorType } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/lib/main/js/a12internal/validation/IResult.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { ValidationResult } from "../../../back-end/store/internal/kernel-adapter.js";

describe("api.back-end.store.kernel-adapter", () => {
	describe("ValidationResult", () => {
		const identifier1 = {
			getName() {
				return IIdentifier.SEPARATOR + "a";
			},
			getIndices() {
				return [1];
			}
		} as IIdentifier;
		const identifier2 = {
			getName() {
				return IIdentifier.SEPARATOR + "b";
			},
			getIndices() {
				return [1];
			}
		} as IIdentifier;
		const identifier3 = {
			getName() {
				return IIdentifier.SEPARATOR + "c";
			},
			getIndices() {
				return [1];
			}
		} as IIdentifier;

		const referencedFields = new Set([identifier2]);
		const refOmissionErrorResponsible = new Set([identifier3]);

		function createArgs(
			errorType: ErrorType
		): [string, string, IIdentifier, Localizable[], ErrorType, Set<IIdentifier>, Set<IIdentifier>] {
			return [
				"name",
				"error",
				identifier1,
				[{ key: "foo", defaults: { en: "text" } }],
				errorType,
				referencedFields,
				refOmissionErrorResponsible
			];
		}

		describe("addHint", () => {
			it("uses referencedFields as referenced fields if the error type is VALUE_ERROR", () => {
				const validationResult = new ValidationResult();
				validationResult.addHint(...createArgs(ErrorType.VALUE_ERROR));
				strictEqual(validationResult.messages.length, 1);
				deepStrictEqual(validationResult.messages[0].referencedFields, [
					[{ elementName: "b", index: 1 }]
				]);
			});

			it("uses refOmissionErrorResponsible as referenced fields if the error type is OMISSION_ERROR", () => {
				const validationResult = new ValidationResult();
				validationResult.addHint(...createArgs(ErrorType.OMISSION_ERROR));
				strictEqual(validationResult.messages.length, 1);
				deepStrictEqual(validationResult.messages[0].referencedFields, [
					[{ elementName: "c", index: 1 }]
				]);
			});
		});

		describe("addError", () => {
			it("uses referencedFields as referenced fields if the error type is VALUE_ERROR", () => {
				const validationResult = new ValidationResult();
				validationResult.addError(...createArgs(ErrorType.VALUE_ERROR));
				strictEqual(validationResult.messages.length, 1);
				deepStrictEqual(validationResult.messages[0].referencedFields, [
					[{ elementName: "b", index: 1 }]
				]);
			});

			it("uses refOmissionErrorResponsible as referenced fields if the error type is OMISSION_ERROR", () => {
				const validationResult = new ValidationResult();
				validationResult.addError(...createArgs(ErrorType.OMISSION_ERROR));
				strictEqual(validationResult.messages.length, 1);
				deepStrictEqual(validationResult.messages[0].referencedFields, [
					[{ elementName: "c", index: 1 }]
				]);
			});
		});
	});
});
