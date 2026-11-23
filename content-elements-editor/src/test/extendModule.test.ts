// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import type { ElementModule } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { EditorElementModule } from "@com.mgmtp.a12.contentengine/contentengine-editor";

import { FormElementControllers } from "../controllers/controllerMap.js";
import { createExtendModule } from "../extendModule.js";

describe("extendModule", () => {
	it("should call the given create dm reference checker method with the correct parameters", () => {
		const mockElementEditorFactory = () => ({}) as EditorElementModule;
		const mockCreateDmReferenceMatch = mock.fn(() => () => []);

		const extendModule = createExtendModule({
			editorElementFactory: mockElementEditorFactory,
			createDocumentModelElementReferenceMatch: mockCreateDmReferenceMatch
		});

		const mockModule = { id: "testModule" } as ElementModule;

		extendModule({
			module: mockModule,
			label: "Test Module",
			icon: "testIcon",
			settingsRenderer: () => null,
			editingRenderer: () => null
		});

		strictEqual(mockCreateDmReferenceMatch.mock.calls.length, 1);
		deepStrictEqual(mockCreateDmReferenceMatch.mock.calls[0].arguments, [
			"elementId",
			["elementId"]
		]);
	});

	it("should call the given editor element factory with the correct parameters", () => {
		const mockElementEditorFactory = mock.fn<ReturnType<typeof EditorElementModule.createFactory>>(
			() => ({}) as EditorElementModule
		);
		const mockGetSearchMatches = () => [];
		const mockCreateDmReferenceMatch = () => mockGetSearchMatches;
		const mockSettingsRenderer = () => null;
		const mockEditingRenderer = () => null;

		const extendModule = createExtendModule({
			editorElementFactory: mockElementEditorFactory,
			createDocumentModelElementReferenceMatch: mockCreateDmReferenceMatch
		});

		const mockModule = { id: "testModule" } as ElementModule;
		const mockLabel = "Test Module";
		const mockIcon = " testIcon";

		extendModule({
			module: mockModule,
			label: mockLabel,
			icon: mockIcon,
			settingsRenderer: mockSettingsRenderer,
			editingRenderer: mockEditingRenderer
		});

		strictEqual(mockElementEditorFactory.mock.calls.length, 1);

		const moduleArg = mockElementEditorFactory.mock.calls[0].arguments[0];
		const optionsArg = mockElementEditorFactory.mock.calls[0].arguments[1];

		strictEqual(moduleArg, mockModule);
		strictEqual(optionsArg?.label, mockLabel);
		strictEqual(optionsArg?.icon, mockIcon);
		strictEqual(optionsArg?.category, "Form Elements");
		strictEqual(optionsArg?.controllers, FormElementControllers);
		deepStrictEqual(optionsArg?.childRules, { type: "anyOf", rules: [] });
		deepStrictEqual(optionsArg?.propertiesCreator?.(), {
			props: {
				elementId: "",
				annotations: []
			}
		});
		strictEqual(optionsArg?.settingsRenderer, mockSettingsRenderer);
		strictEqual(optionsArg?.editingRenderer, mockEditingRenderer);
		strictEqual(optionsArg?.getSearchMatches, mockGetSearchMatches);
	});

	it("returns the result of the editor element factory", () => {
		const mockResult = { id: "result" } as EditorElementModule;
		const mockElementEditorFactory = () => mockResult;

		const extendModule = createExtendModule({
			editorElementFactory: mockElementEditorFactory,
			createDocumentModelElementReferenceMatch: () => () => []
		});

		const result = extendModule({
			module: { id: "testModule" } as ElementModule,
			label: "Test Module",
			icon: "testIcon",
			settingsRenderer: () => null,
			editingRenderer: () => null
		});

		strictEqual(result, mockResult);
	});
});
