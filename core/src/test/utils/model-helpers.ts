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
