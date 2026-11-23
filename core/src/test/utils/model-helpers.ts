// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { FormModel } from "../../models/index.js";

export namespace ModelHelpers {
	export function createModelPath(...elements: string[]): ModelPath {
		return elements.map(elementName => ({ elementName }));
	}
}

export namespace FormModelHelpers {
	let buttonIdCounter = 0;
	function button({
		type,
		label,
		description,
		icon,
		scope = "ALWAYS",
		priority,
		screen,
		labelHidden
	}: ButtonDef): FormModel.ButtonType {
		return {
			type,
			id: "generatedButtonId" + buttonIdCounter,
			name: "button" + buttonIdCounter++,
			buttonStyling:
				label || description || icon || priority || labelHidden
					? {
							label: label
								? {
										type: "Multilingual",
										multilingualText: { text: [{ locale: "en", text: label || "EVENT" }] }
									}
								: undefined,
							description: description
								? {
										text: [{ locale: "en", text: description }]
									}
								: undefined,
							icon,
							priority,
							labelHidden
						}
					: undefined,
			target: screen ?? "",
			scope
		};
	}

	export interface ButtonDef {
		readonly type: "EVENT" | "NAVIGATION";
		readonly label?: string;
		readonly description?: string;
		readonly icon?: FormModel.Icon;
		readonly scope?: FormModel.ScopeEnum;
		readonly priority?: FormModel.ButtonPriorityEnum;
		readonly screen?: string;
		readonly labelHidden?: boolean;
	}

	export interface ButtonsDef {
		readonly major?: ReadonlyArray<ButtonDef>;
		readonly minor?: ReadonlyArray<ButtonDef>;
	}

	/**
	 * Generates a new form model from a base form model and overrides the header
	 * and footer buttons. The resulting form model will only contain one screen.
	 */
	export function createFormModel(
		baseModel: FormModel,
		config: {
			readonly subHeader?: ButtonsDef;
			readonly footer?: ButtonsDef;
			readonly screenSubHeader?: ButtonsDef;
			readonly screenFooter?: ButtonsDef;
		}
	): FormModel {
		return {
			...baseModel,
			content: {
				...baseModel.content,
				subHeaderBox: {
					id: "subHeaderBox",
					majorButtons: config.subHeader?.major
						? { button: config.subHeader.major.map(button) }
						: undefined,
					minorButtons: config.subHeader?.minor
						? { button: config.subHeader.minor.map(button) }
						: undefined
				},
				footerBox: {
					id: "footerBox",
					majorButtons: config.footer?.major
						? { button: config.footer.major.map(button) }
						: undefined,
					minorButtons: config.footer?.minor
						? { button: config.footer.minor.map(button) }
						: undefined
				},
				screens: baseModel.content.screens.map(screen => ({
					...screen,
					subHeaderBox: {
						id: "subHeaderBox",
						majorButtons: config.screenSubHeader?.major
							? { button: config.screenSubHeader.major.map(button) }
							: undefined,
						minorButtons: config.screenSubHeader?.minor
							? { button: config.screenSubHeader.minor.map(button) }
							: undefined
					},
					footerBox: {
						id: "footerBox",
						majorButtons: config.screenFooter?.major
							? { button: config.screenFooter.major.map(button) }
							: undefined,
						minorButtons: config.screenFooter?.minor
							? { button: config.screenFooter.minor.map(button) }
							: undefined
					}
				}))
			}
		};
	}
}

export namespace DocumentModelHelpers {
	type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

	export function DocumentModelContent(
		rootGroup: Partial<Omit<DocumentModel.Group, "type">> = {}
	): DocumentModel.DocumentModelContent {
		return {
			modelRoot: Group(rootGroup),
			modelInfo: {},
			modelConfig: {
				timeZone: "UTC"
			}
		};
	}

	export function Group(
		group: Partial<Omit<DocumentModel.Group, "type">> = {}
	): DocumentModel.Group {
		return {
			type: "Group",
			id: "id",
			name: "anyGroup",
			annotations: [],
			elements: [],
			externalDescription: [{ locale: "en", text: "externalDescription" }],
			repeatability: 1,
			...group
		};
	}

	export function Field(
		field: Partial<Omit<DocumentModel.Field, "type">> = {}
	): DocumentModel.Field {
		return {
			type: "Field",
			id: "id",
			name: "anyField",
			annotations: [],
			externalDescription: [{ locale: "en", text: "externalDescription" }],
			fieldType: { type: "StringType", lineBreaksPermitted: false },
			label: [{ locale: "en", text: "label" }],
			...field
		};
	}

	export function createDocumentModel(rootGroup: DocumentModel.Group): DocumentModel {
		return {
			header: {
				modelType: "document",
				modelVersion: "24.1.0",
				id: "MyProject",
				locales: [{ code: "en" }],
				labels: [{ locale: "en", text: "externalDescription" }]
			},
			content: {
				modelRoot: Group({
					elements: [rootGroup]
				}),
				modelInfo: {},
				modelConfig: {
					timeZone: "UTC"
				}
			}
		};
	}
}
