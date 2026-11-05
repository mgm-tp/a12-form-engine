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

import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization";

import type { EngineStore } from "../../../back-end/store/internal/store.js";
import { findElementByFormModelPath } from "../../../models/index.js";
import { DocumentPath } from "../../../models/internal/utils/document-utils.js";
import type { Config, FormModelMap } from "../../../view/index.js";
import { getUIIssueReport } from "../../../view/internal/components/form-engine/correction-mode/getUIIssueReport.js";
import { createDocumentPath } from "../../utils/createDocumentPath.js";
import { createModelPath } from "../../utils/createModelPath.js";
import { US_LOCALE } from "../../utils/localization.js";
import { setupRenderConfiguration } from "../../utils/setup.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

describe("unit.correction-mode.custom-element-fixability", () => {
	const models = setupModelsFixture("customization.custom-screen-element");

	const dataContext = createDocumentPath(["g"]);
	const dataFormats = defaultDataFormats(US_LOCALE);
	const converter = defaultValueConversion(dataFormats);
	const localizer = defaultLocalizerFactory({
		locale: US_LOCALE,
		conversion: converter,
		dataFormats
	});

	function makeRenderOptions(): FormModelMap.RenderOptions {
		const config = setupRenderConfiguration({
			models,
			data: { dirty: false, document: { g: { f1: "" } } },
			ui: { screenLocation: [{ locationPath: createModelPath("Screen1"), path: [] }] }
		});
		return {
			...config.renderOptions,
			config: { ...(config.renderOptions.config as Config) }
		};
	}

	function makeMessage(customFormElement: ModelPath): EngineStore.Validation.CustomMessage {
		return {
			customFormElement,
			dataContext,
			errorCode: "code",
			errorKey: "key",
			errorText: [{ key: "x", defaults: { en: "x" } }],
			severity: "ERROR"
		};
	}

	it("reports fixable=true for a custom message whose target is a CustomScreenElement", () => {
		const message = makeMessage(createModelPath("Screen1", "customElm1"));

		const report = getUIIssueReport(message, makeRenderOptions(), localizer, converter);

		ok(report.fixable, "expected the report to be fixable");
		strictEqual(report.items.length, 1, "expected one correction-mode item");
		ok(report.items[0].formModelPath, "item should carry the formModelPath");
	});

	it("reports fixable=false when the customFormElement does not resolve in the form model", () => {
		const message = makeMessage(createModelPath("Screen1", "doesNotExist"));

		const report = getUIIssueReport(message, makeRenderOptions(), localizer, converter);

		strictEqual(report.fixable, false);
	});

	it("reports fixable=false when the target form-model element is not a CustomScreenElement", () => {
		// "ControlsAndCustomElement" exists on "Screen1" but is a Section, not a CustomScreenElement
		const modelPath = createModelPath("Screen1", "ControlsAndCustomElement");
		const message = makeMessage(modelPath);

		const renderOptions = makeRenderOptions();

		const element = findElementByFormModelPath(models.formModel, message.customFormElement);
		ok(
			element,
			`Configuration error in test setup: Expected ${ModelPath.toString(modelPath)} to exist in the form model`
		);

		const report = getUIIssueReport(message, renderOptions, localizer, converter);

		strictEqual(report.fixable, false);
	});

	it("gives each screen above the element's repeat its own data context, starting at the root", () => {
		// customElm4 sits on the detail screen of the "Rows" DetachedRepeat, so there are two
		// screens: /Screen3 outside the repeat, and /Screen3/Rows/Details inside a row
		const config = setupRenderConfiguration({
			models,
			data: {
				dirty: false,
				document: { g: { f1: "", rep: [{ f3: "a" }, { f3: "b" }, { f3: "c" }] } }
			},
			ui: { screenLocation: [{ locationPath: createModelPath("Screen3"), path: [] }] }
		});
		const renderOptions: FormModelMap.RenderOptions = {
			...config.renderOptions,
			config: { ...(config.renderOptions.config as Config) }
		};

		const report = getUIIssueReport(
			{
				...makeMessage(ModelPath.fromString("/Screen3/Rows/Details/customElm4")),
				dataContext: DocumentPath.fromString("/g[1]/rep[3]")
			},
			renderOptions,
			localizer,
			converter
		);

		ok(report.fixable, "expected the report to be fixable");
		strictEqual(report.items.length, 1, "expected one correction-mode item");
		deepStrictEqual(
			report.items[0].locationStack.map(s => ({
				locationPath: ModelPath.toString(s.locationPath),
				path: DocumentPath.toString(s.path)
			})),
			[
				{ locationPath: "/Screen3", path: "/" },
				{ locationPath: "/Screen3/Rows/Details", path: "/g[1]/rep[3]" }
			]
		);
	});

	it("reports no item for a custom message whose repeat row is gone from the document", () => {
		const config = setupRenderConfiguration({
			models,
			data: { dirty: false, document: { g: { f1: "", rep: [{ f3: "a" }] } } },
			ui: { screenLocation: [{ locationPath: createModelPath("Screen3"), path: [] }] }
		});
		const renderOptions: FormModelMap.RenderOptions = {
			...config.renderOptions,
			config: { ...(config.renderOptions.config as Config) }
		};

		const report = getUIIssueReport(
			{
				...makeMessage(ModelPath.fromString("/Screen3/Rows/Details/customElm4")),
				dataContext: DocumentPath.fromString("/g[1]/rep[3]")
			},
			renderOptions,
			localizer,
			converter
		);

		ok(report.fixable, "the element still resolves, so the message stays fixable");
		strictEqual(report.items.length, 0, "but there is no row to link to");
	});
});
