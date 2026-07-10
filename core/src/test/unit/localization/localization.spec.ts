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
import type { Localizable, LocalizableArgs } from "@com.mgmtp.a12.utils/utils-localization";
import {
	defaultLocalizerFactory,
	Locale,
	localizableFromLocalizationTreeMap
} from "@com.mgmtp.a12.utils/utils-localization";

import { DEFAULT_TRANSLATIONS } from "../../../back-end/localization/index.js";
import { createResourceLocalizable } from "../../../back-end/localization/internal/factory.js";
import { de } from "../../../back-end/localization/internal/languages/de.js";
import { en } from "../../../back-end/localization/internal/languages/en.js";
import { RESOURCE_KEYS } from "../../../back-end/localization/internal/languages/keys.js";
import type { LocalizableFactory } from "../../../back-end/localization/internal/localization.js";
import { createLocalizableFactory } from "../../../back-end/localization/internal/localization.js";
import type { FormModel, ReadonlyObjectMap } from "../../../models/index.js";
import { findElementByFormModelPath } from "../../../models/index.js";
import {
	isFormModelControl,
	isFormModelEventButton,
	isFormModelExpressionOverviewColumn,
	isFormModelFieldOverviewColumn,
	isFormModelRepeat,
	isFormModelRow,
	isFormModelSection,
	isFormModelTextCell
} from "../../../models/internal/FormModelGuards.js";
import * as DocumentModelUtils from "../../../models/internal/utils/document-model-utils.js";
import { createModelPath } from "../../utils/createModelPath.js";
import { DE_LOCALE, US_LOCALE } from "../../utils/localization.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

const locales = [US_LOCALE, DE_LOCALE];

const repeatButtonTypes: FormModel.RepeatButtonLabelEnum[] = [
	"ADD",
	"COMMIT_ADD",
	"APPLY",
	"EDIT",
	"REMOVE",
	"VIEW",
	"CANCEL",
	"CONFIRM",
	"RETURN",
	"UP",
	"DOWN",
	"COPY",
	"CLOSE",
	"DOWNLOAD",
	"SKIP",
	"REPLACE",
	"UPLOAD_AS_COPY"
];

const repeatConfirmationTypes: FormModel.ConfirmationTextEnum[] = ["REMOVE"];

interface FormModelElementWithPath<T> {
	readonly path: ModelPath;
	readonly element: T;
}

describe("unit.back-end.localization", () => {
	function assertL10nResult(
		result: string | undefined,
		present: boolean,
		value?: string,
		topic?: string
	): void {
		strictEqual(
			result !== undefined,
			present,
			`${topic}: Present is ${result !== undefined} and should be ${present}`
		);

		if (present) {
			strictEqual(result, value, `${topic}: Value is ${result} and should be ${value}`);
		}
	}

	const models = setupModelsFixture("localization");
	let localizableFactory: LocalizableFactory;

	before(() => {
		localizableFactory = createLocalizableFactory(models.documentModel, models.formModel);
	});

	describe("test localizable generation", () => {
		describe("create resource localizable", () => {
			describe("and its key property", () => {
				it("contains the key that was provided during creation", () => {
					const key = "this.is.my.key";
					const localizable = createResourceLocalizable(key, {});
					strictEqual(localizable.key, key);
				});
			});

			describe("and its args property", () => {
				it("contains the argument object that was provided during creation", () => {
					const args: LocalizableArgs = { placeholder: { type: "plain", value: "text" } };
					const localizable = createResourceLocalizable("key", args);
					strictEqual(localizable.args, args);
				});

				it("contains an empty argument object if no was provided during creation", () => {
					const localizable = createResourceLocalizable("key");
					deepStrictEqual(localizable.args, {});
				});
			});

			describe("and its defaults property", () => {
				it("contains the text for all locales that are supported by default (en, de)", () => {
					const localizable = createResourceLocalizable(RESOURCE_KEYS.validation.goToIssue);
					deepStrictEqual(localizable.defaults, {
						en: en.validation.goToIssue,
						de: de.validation.goToIssue
					});
				});
			});
		});
	});

	describe("test model text resolution order", () => {
		function getControlsFromRow(path: ModelPath): FormModelElementWithPath<FormModel.Control>[] {
			const element = findElementByFormModelPath(models.formModel, path);
			if (element === undefined || !isFormModelRow(element)) {
				throw new Error(`Internal Error: Row "${ModelPath.toString(path)}" cannot be found!`);
			}

			if (element.cell === undefined) {
				return [];
			}

			const result: FormModelElementWithPath<FormModel.Control>[] = [];
			for (const child of element.cell) {
				if (!isFormModelControl(child)) {
					continue;
				}

				result.push({ element: child, path: [...path, { elementName: element.id }] });
			}

			return result;
		}

		describe("control", () => {
			describe("that neither have a texts provided in the document model nor in the form model", () => {
				let controls: FormModelElementWithPath<FormModel.Control>[];
				const cgPath = createModelPath("Screen1", "sec1", "cg1");

				before(() => {
					const row1Path = [...cgPath, { elementName: "row1" }];
					const row2Path = [...cgPath, { elementName: "row2" }];
					controls = [...getControlsFromRow(row1Path), ...getControlsFromRow(row2Path)];
					if (controls.length === 0) {
						throw new Error(
							`Internal Error: No controls found in row "${ModelPath.toString(cgPath)}"!`
						);
					}
				});

				it("returns empty for the label text", () => {
					for (const { element, path } of controls) {
						const localizables = localizableFactory.inputLabel(element, path);
						for (const locale of locales) {
							const localizer = defaultLocalizerFactory({ locale });
							const optional = localizer(...localizables);
							assertL10nResult(optional, false, undefined, Locale.toString(locale));
						}
					}
				});

				it("returns empty for the hint text", () => {
					for (const { element, path } of controls) {
						const localizables = localizableFactory.controlHint(element, path);
						for (const locale of locales) {
							const localizer = defaultLocalizerFactory({ locale });
							const optional = localizer(...localizables);
							assertL10nResult(optional, false, undefined, Locale.toString(locale));
						}
					}
				});
			});

			describe("that have only a texts provided in the document model", () => {
				let controls: FormModelElementWithPath<FormModel.Control>[];
				const cgPath = createModelPath("Screen1", "sec1", "cg2");
				before(() => {
					const row1Path = [...cgPath, { elementName: "row1" }];
					controls = getControlsFromRow(row1Path);
					if (controls.length === 0) {
						throw new Error(
							`Internal Error: No controls found in row "${ModelPath.toString(cgPath)}"!`
						);
					}
				});

				it("returns the label text from the document model", () => {
					for (const { element, path } of controls) {
						const localizables = localizableFactory.inputLabel(element, path);
						for (const locale of locales) {
							const localizer = defaultLocalizerFactory({ locale });
							const optional = localizer(...localizables);
							assertL10nResult(
								optional,
								true,
								`DocumentModelLabel.${locale.language}`,
								Locale.toString(locale)
							);
						}
					}
				});

				it("returns the hint text from the document model", () => {
					for (const { element, path } of controls) {
						const localizables = localizableFactory.controlHint(element, path);
						for (const locale of locales) {
							const localizer = defaultLocalizerFactory({ locale });
							const optional = localizer(...localizables);
							assertL10nResult(
								optional,
								true,
								`DocumentModelHint.${locale.language}`,
								Locale.toString(locale)
							);
						}
					}
				});
			});

			describe("that have only a texts provided in the document model and at the field configuration of the form model", () => {
				let controls: FormModelElementWithPath<FormModel.Control>[];
				const cgPath = createModelPath("Screen1", "sec1", "cg4");
				before(() => {
					const row1Path = [...cgPath, { elementName: "row1" }];
					const row2Path = [...cgPath, { elementName: "row2" }];
					controls = [...getControlsFromRow(row1Path), ...getControlsFromRow(row2Path)];
					if (controls.length === 0) {
						throw new Error(
							`Internal Error: No controls found in row "${ModelPath.toString(cgPath)}"!`
						);
					}
				});

				it("returns the label text from the field configuration of the form model", () => {
					for (const { element, path } of controls) {
						const localizables = localizableFactory.inputLabel(element, path);
						for (const locale of locales) {
							const localizer = defaultLocalizerFactory({ locale });
							const optional = localizer(...localizables);
							assertL10nResult(
								optional,
								true,
								`FieldConfigLabel.${locale.language}`,
								Locale.toString(locale)
							);
						}
					}
				});

				it("returns the hint text from the field configuration of the form model", () => {
					for (const { element, path } of controls) {
						const localizables = localizableFactory.controlHint(element, path);
						for (const locale of locales) {
							const localizer = defaultLocalizerFactory({ locale });
							const optional = localizer(...localizables);
							assertL10nResult(
								optional,
								true,
								`FieldConfigHint.${locale.language}`,
								Locale.toString(locale)
							);
						}
					}
				});
			});

			describe("that have only a texts provided in the document model and at the control of the form model", () => {
				let controls: FormModelElementWithPath<FormModel.Control>[];
				const cgPath = createModelPath("Screen1", "sec1", "cg3");
				before(() => {
					const row1Path = [...cgPath, { elementName: "row1" }];
					const row2Path = [...cgPath, { elementName: "row2" }];
					controls = [...getControlsFromRow(row1Path), ...getControlsFromRow(row2Path)];
					if (controls.length === 0) {
						throw new Error(
							`Internal Error: No controls found in row "${ModelPath.toString(cgPath)}"!`
						);
					}
				});
				it("returns the label text from the control of the form model", () => {
					for (const { element, path } of controls) {
						const localizables = localizableFactory.inputLabel(element, path);
						for (const locale of locales) {
							const localizer = defaultLocalizerFactory({ locale });
							const optional = localizer(...localizables);
							assertL10nResult(
								optional,
								true,
								`FormModelLabel.${locale.language}`,
								Locale.toString(locale)
							);
						}
					}
				});

				it("returns the hint text from the control the of form model", () => {
					for (const { element, path } of controls) {
						const localizables = localizableFactory.controlHint(element, path);
						for (const locale of locales) {
							const localizer = defaultLocalizerFactory({ locale });
							const optional = localizer(...localizables);
							assertL10nResult(
								optional,
								true,
								`FormModelHint.${locale.language}`,
								Locale.toString(locale)
							);
						}
					}
				});
			});

			describe("that have a texts provided in the document model and at the control and field configuration of the form model", () => {
				let controls: FormModelElementWithPath<FormModel.Control>[];
				const cgPath = createModelPath("Screen1", "sec1", "cg3");
				before(() => {
					const row1Path = [...cgPath, { elementName: "row1" }];
					const row2Path = [...cgPath, { elementName: "row2" }];
					controls = [...getControlsFromRow(row1Path), ...getControlsFromRow(row2Path)];
					if (controls.length === 0) {
						throw new Error(
							`Internal Error: No controls found in row "${ModelPath.toString(cgPath)}"!`
						);
					}
				});

				it("returns the label text from the control of the form model", () => {
					for (const { element, path } of controls) {
						const localizables = localizableFactory.inputLabel(element, path);
						for (const locale of locales) {
							const localizer = defaultLocalizerFactory({ locale });
							const optional = localizer(...localizables);
							assertL10nResult(
								optional,
								true,
								`FormModelLabel.${locale.language}`,
								Locale.toString(locale)
							);
						}
					}
				});

				it("returns the hint text from the control the of form model", () => {
					for (const { element, path } of controls) {
						const localizables = localizableFactory.controlHint(element, path);
						for (const locale of locales) {
							const localizer = defaultLocalizerFactory({ locale });
							const optional = localizer(...localizables);
							assertL10nResult(
								optional,
								true,
								`FormModelHint.${locale.language}`,
								Locale.toString(locale)
							);
						}
					}
				});
			});
		});

		describe("repeat", () => {
			type RepeatWithPath = FormModel.Repeat & { modelPath: ModelPath };
			let defaultLabelsRepeat: RepeatWithPath;
			let customLabelsRepeat: RepeatWithPath;
			let localizableFactoryWithoutDefaults: LocalizableFactory;

			function checkComponentButtonLabels(options: {
				repeat: RepeatWithPath;
				expectDefault?: boolean;
				expectedLabel?: string;
				expectedLocalePrefix?: string;
				customLocalizableFactory?: LocalizableFactory;
			}) {
				const {
					repeat: { modelPath },
					expectedLabel,
					expectedLocalePrefix,
					customLocalizableFactory
				} = options;
				for (const type of repeatButtonTypes) {
					const localizeFactory = customLocalizableFactory || localizableFactory;
					const localizables = localizeFactory.componentButtonLabels(
						options.repeat,
						modelPath,
						type
					);
					for (const locale of locales) {
						const localizer = defaultLocalizerFactory({ locale });
						const optional = localizer(...localizables);
						const expectedText = options.expectDefault
							? localizer(
									localizableFromLocalizationTreeMap(
										RESOURCE_KEYS.repeat.buttonLabels[type],
										DEFAULT_TRANSLATIONS
									)
								)
							: expectedLabel || `${expectedLocalePrefix}${type}.${locale.language}`;
						assertL10nResult(optional, true, expectedText, Locale.toString(locale));
					}
				}
			}

			function checkConfirmationTexts(options: {
				repeat: RepeatWithPath;
				expectedLabel?: string;
				expectedLabels?: ReadonlyObjectMap<string>;
				expectedLocalePrefix?: string;
				area: "TITLE" | "MESSAGE";
				customLocalizableFactory?: LocalizableFactory;
			}) {
				for (const type of repeatConfirmationTypes) {
					const {
						repeat: { modelPath },
						area,
						customLocalizableFactory
					} = options;
					const localizeFactory = customLocalizableFactory || localizableFactory;
					const localizables =
						area === "MESSAGE"
							? localizeFactory.componentConfirmationMessages(options.repeat, modelPath, type)
							: localizeFactory.componentConfirmationTitles(options.repeat, modelPath, type);
					for (const locale of locales) {
						const localizer = defaultLocalizerFactory({ locale });
						const optional = localizer(...localizables);
						const expectedText =
							options.expectedLabel ||
							(options.expectedLabels && options.expectedLabels[locale.language]) ||
							`${options.expectedLocalePrefix}${locale.language}`;
						assertL10nResult(optional, true, expectedText, Locale.toString(locale));
					}
				}
			}

			before(() => {
				const defaultLabelsRepeatPath = createModelPath("Screen1", "Repeat", "RepeatDefaultLabels");
				const customLabelsRepeatPath = createModelPath("Screen1", "Repeat", "RepeatCustomLabels");

				let element = findElementByFormModelPath(models.formModel, defaultLabelsRepeatPath);
				if (element === undefined || !isFormModelRepeat(element)) {
					throw new Error(
						`Internal Error: Repeat "${ModelPath.toString(
							defaultLabelsRepeatPath
						)}" cannot be found!`
					);
				}

				defaultLabelsRepeat = {
					...element,
					modelPath: defaultLabelsRepeatPath
				};

				element = findElementByFormModelPath(models.formModel, customLabelsRepeatPath);
				if (element === undefined || !isFormModelRepeat(element)) {
					throw new Error(
						`Internal Error: Repeat "${ModelPath.toString(
							customLabelsRepeatPath
						)}" cannot be found!`
					);
				}

				customLabelsRepeat = {
					...element,
					modelPath: customLabelsRepeatPath
				};

				localizableFactoryWithoutDefaults = createLocalizableFactory(models.documentModel, {
					...models.formModel,
					content: {
						...models.formModel.content,
						defaults: {}
					}
				});
			});

			describe("without button texts defined in the form model", () => {
				it("returns the default label from the DEFAULT_TRANSLATIONS", () => {
					checkComponentButtonLabels({
						customLocalizableFactory: localizableFactoryWithoutDefaults,
						repeat: defaultLabelsRepeat,
						expectDefault: true
					});
				});
			});

			describe("with button texts defined in the form model defaults", () => {
				it("returns the button text from the default button settings of the form model", () => {
					checkComponentButtonLabels({
						repeat: defaultLabelsRepeat,
						expectedLocalePrefix: "Default."
					});
				});
			});

			describe("with button texts defined in the form model defaults and on the repeat", () => {
				it("returns the button text from the repeat", () => {
					checkComponentButtonLabels({
						repeat: customLabelsRepeat,
						expectedLocalePrefix: "Custom."
					});
				});
			});

			describe("without confirmation texts defined form model", () => {
				it("returns a default title", () => {
					checkConfirmationTexts({
						customLocalizableFactory: localizableFactoryWithoutDefaults,
						repeat: defaultLabelsRepeat,
						expectedLabels: {
							en: en.repeat.deletionConfirmationTitle,
							de: de.repeat.deletionConfirmationTitle
						},
						area: "TITLE"
					});
				});

				it("returns a default messages", () => {
					checkConfirmationTexts({
						customLocalizableFactory: localizableFactoryWithoutDefaults,
						repeat: defaultLabelsRepeat,
						expectedLabels: {
							en: en.repeat.deletionConfirmationText,
							de: de.repeat.deletionConfirmationText
						},
						area: "MESSAGE"
					});
				});
			});

			describe("with confirmation texts defined in the form model defaults", () => {
				it("returns the confirmation titles from the default button settings of the form model", () => {
					checkConfirmationTexts({
						repeat: defaultLabelsRepeat,
						expectedLocalePrefix: "Default.Confirm.Title.",
						area: "TITLE"
					});
				});

				it("returns the confirmation messages from the default button settings of the form model", () => {
					checkConfirmationTexts({
						repeat: defaultLabelsRepeat,
						expectedLocalePrefix: "Default.Confirm.Message.",
						area: "MESSAGE"
					});
				});
			});

			describe("with confirmation texts defined in the form model defaults and on the repeat", () => {
				it("returns the confirmation titles from the repeat", () => {
					checkConfirmationTexts({
						repeat: customLabelsRepeat,
						expectedLocalePrefix: "Custom.Confirm.Title.",
						area: "TITLE"
					});
				});

				it("returns the confirmation messages from the repeat", () => {
					checkConfirmationTexts({
						repeat: customLabelsRepeat,
						expectedLocalePrefix: "Custom.Confirm.Message.",
						area: "MESSAGE"
					});
				});
			});
		});
	});

	describe("test key generation", () => {
		function getElementWithPath<T extends object>(
			path: ModelPath,
			isInstance: (x: object) => x is T
		): FormModelElementWithPath<T> {
			const element = findElementByFormModelPath(models.formModel, path);
			if (element === undefined || !isInstance(element)) {
				throw new Error(`Internal Error: Element "${ModelPath.toString(path)}" cannot be found!`);
			}

			return { element, path };
		}

		function assertContainsKey(localizables: Localizable[], expectedKey: string): void {
			const keys = localizables.map(localizable => localizable.key);

			ok(
				keys.some(actualKey => actualKey === expectedKey),
				`${JSON.stringify(keys)} does not contain "${expectedKey}"`
			);
		}

		let section: FormModelElementWithPath<FormModel.Section>;
		let control: FormModelElementWithPath<FormModel.Control>;
		let textCell: FormModelElementWithPath<FormModel.TextCell>;
		let repeat: FormModelElementWithPath<FormModel.Repeat>;
		let button: FormModelElementWithPath<FormModel.EventButton>;
		let rowAction: FormModelElementWithPath<FormModel.RowAction>;
		let fieldOverviewColumn: FormModelElementWithPath<FormModel.FieldOverviewColumn>;
		let expressionOverviewColumn: FormModelElementWithPath<FormModel.ExpressionOverviewColumn>;

		before(() => {
			section = getElementWithPath(createModelPath("Screen1", "Section"), isFormModelSection);

			control = getElementWithPath(
				createModelPath("Screen1", "sec1", "cg1", "row1", "control-ead0a"),
				isFormModelControl
			);

			textCell = getElementWithPath(
				createModelPath("Screen1", "gridText", "row-f852d", "text1"),
				isFormModelTextCell
			);

			repeat = getElementWithPath(
				createModelPath("Screen1", "Repeat", "RepeatDefaultLabels"),
				isFormModelRepeat
			);

			button = getElementWithPath(
				createModelPath("Screen1", "ButtonPanel", "Button"),
				isFormModelEventButton
			);

			const match = repeat.element.rowActionGroup?.action?.find(x => x.event === "custom");
			if (match === undefined) {
				throw new Error(
					`Internal Error: RowAction "custom" cannot be found in "${ModelPath.toString(
						repeat.path
					)}"!`
				);
			}
			rowAction = { element: match, path: repeat.path };

			fieldOverviewColumn = getElementWithPath(
				createModelPath("Screen1", "Repeat", "RepeatDefaultLabels", "fieldOverviewColumn-1"),
				isFormModelFieldOverviewColumn
			);

			expressionOverviewColumn = getElementWithPath(
				createModelPath("Screen1", "Repeat", "RepeatDefaultLabels", "expressionColumn"),
				isFormModelExpressionOverviewColumn
			);
		});

		describe("boolean value", () => {
			it("returns localizables with the right keys for true", () => {
				const localizables = localizableFactory.booleanValue(
					createModelPath("root", "booleanfield"),
					true
				);

				assertContainsKey(
					localizables,
					"documentModel.boolean.localization-document.root.booleanfield.true"
				);
				assertContainsKey(localizables, RESOURCE_KEYS.true);
			});

			it("returns localizables with the right keys for false", () => {
				const localizables = localizableFactory.booleanValue(
					createModelPath("root", "booleanfield"),
					false
				);

				assertContainsKey(
					localizables,
					"documentModel.boolean.localization-document.root.booleanfield.false"
				);
				assertContainsKey(localizables, RESOURCE_KEYS.false);
			});
		});

		describe("confirm value", () => {
			it("returns localizables with the right keys for true", () => {
				const localizables = localizableFactory.confirmValue(
					createModelPath("root", "confirmfield"),
					true
				);

				assertContainsKey(
					localizables,
					"documentModel.confirm.localization-document.root.confirmfield.true"
				);
				assertContainsKey(localizables, RESOURCE_KEYS.true);
			});

			it("returns localizables with the right keys for null", () => {
				const localizables = localizableFactory.confirmValue(
					createModelPath("root", "confirmfield"),
					null
				);

				assertContainsKey(
					localizables,
					"documentModel.confirm.localization-document.root.confirmfield.null"
				);
				assertContainsKey(localizables, RESOURCE_KEYS.textOutput.noData);
			});
		});

		describe("enumeration value", () => {
			it("returns localizables with the right keys", () => {
				const path = createModelPath("root", "enumerationfield_full");

				const enumeration = DocumentModelUtils.findByPath(models.documentModel, path);
				if (enumeration.type !== "Field" || enumeration.fieldType.type !== "EnumerationType") {
					throw new Error(`Internal Error: Cannot find enumeration "${ModelPath.toString(path)}"!`);
				}

				const values = enumeration.fieldType.values;

				ok(Object.keys(values).length > 0);
				for (const value of values) {
					ok(value);
					const localizables = localizableFactory.enumerationValue(path, value);
					assertContainsKey(
						localizables,
						`documentModel.enumValues.localization-document.root.enumerationfield_full.${value.value}`
					);
				}
			});
		});

		describe("model label", () => {
			it("returns localizables with the right keys", () => {
				const element = models.formModel;

				const localizables = localizableFactory.modelLabel(element);
				assertContainsKey(localizables, "uiModel.localization-form.header.label");
			});
		});

		describe("component title", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.componentTitle(section.element, section.path);
				assertContainsKey(localizables, "uiModel.localization-form.Screen1.Section.title");
			});
		});

		describe("component label", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.componentLabel(control.element, control.path);
				assertContainsKey(
					localizables,
					"uiModel.localization-form.Screen1.sec1.cg1.row1.control-ead0a.label"
				);
			});
		});

		describe("component description", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.componentDescription(button.element, button.path);
				assertContainsKey(
					localizables,
					"uiModel.localization-form.Screen1.ButtonPanel.Button.description"
				);
			});
		});

		describe("component hint", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.componentHint(control.element, control.path);
				assertContainsKey(
					localizables,
					"uiModel.localization-form.Screen1.sec1.cg1.row1.control-ead0a.hint"
				);
			});
		});

		describe("component content", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.componentContent(textCell.element, textCell.path);
				assertContainsKey(
					localizables,
					"uiModel.localization-form.Screen1.gridText.row-f852d.text1.content"
				);
			});
		});

		describe("component button labels", () => {
			for (const type of repeatButtonTypes) {
				it(`returns localizables with the right keys for button type ${type}`, () => {
					const localizables = localizableFactory.componentButtonLabels(
						repeat.element,
						repeat.path,
						type
					);
					assertContainsKey(
						localizables,
						`uiModel.localization-form.Screen1.Repeat.RepeatDefaultLabels.buttonLabel.${type.toLowerCase()}`
					);

					assertContainsKey(
						localizables,
						`uiModel.localization-form.defaults.buttonLabel.${type.toLowerCase()}`
					);
				});
			}
		});

		describe("control label", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.inputLabel(control.element, control.path);
				assertContainsKey(
					localizables,
					"uiModel.localization-form.Screen1.sec1.cg1.row1.control-ead0a.label"
				);
				assertContainsKey(
					localizables,
					"documentModel.label.localization-document.root.stringfield_empty"
				);
			});
		});

		describe("control hint", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.controlHint(control.element, control.path);
				assertContainsKey(
					localizables,
					"uiModel.localization-form.Screen1.sec1.cg1.row1.control-ead0a.hint"
				);
				assertContainsKey(
					localizables,
					"documentModel.hint.localization-document.root.stringfield_empty"
				);
			});
		});

		describe("control placeholder", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.inputPlaceholder(control.element, control.path);
				assertContainsKey(
					localizables,
					"uiModel.localization-form.Screen1.sec1.cg1.row1.control-ead0a.placeholder"
				);
				assertContainsKey(
					localizables,
					"documentModel.placeholder.localization-document.root.stringfield_empty"
				);
			});
		});

		describe("repeat row action label", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.repeatRowActionLabel(
					rowAction.path,
					rowAction.element
				);
				assertContainsKey(
					localizables,
					"uiModel.localization-form.Screen1.Repeat.RepeatDefaultLabels.rowActions.custom.label"
				);
			});
		});

		describe("repeat row action confirmation", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.repeatRowActionConfirmation(
					rowAction.path,
					rowAction.element
				);
				assertContainsKey(
					localizables,
					"uiModel.localization-form.Screen1.Repeat.RepeatDefaultLabels.rowActions.custom.confirmation"
				);
			});
		});

		describe("repeat row action confirmation title", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.repeatRowActionDialogTitle(
					rowAction.path,
					rowAction.element
				);
				assertContainsKey(
					localizables,
					"uiModel.localization-form.Screen1.Repeat.RepeatDefaultLabels.rowActions.custom.confirmationTitle"
				);
			});
		});

		describe("repeat overview column title", () => {
			describe("field overview column", () => {
				it("returns localizables with the right keys", () => {
					const localizables = localizableFactory.repeatOverviewColumnTitle(
						fieldOverviewColumn.element,
						fieldOverviewColumn.path
					);
					assertContainsKey(
						localizables,
						"uiModel.localization-form.Screen1.Repeat.RepeatDefaultLabels.fieldOverviewColumn-1.label"
					);
					assertContainsKey(
						localizables,
						"documentModel.label.localization-document.root.repeat.F1"
					);
				});
			});

			describe("expression overview column", () => {
				it("returns localizables with the right keys", () => {
					const localizables = localizableFactory.repeatOverviewColumnTitle(
						expressionOverviewColumn.element,
						expressionOverviewColumn.path
					);
					assertContainsKey(
						localizables,
						"uiModel.localization-form.Screen1.Repeat.RepeatDefaultLabels.expressionColumn.label"
					);
				});
			});
		});

		describe("repeat overview column hint", () => {
			describe("field overview column", () => {
				it("returns localizables with the right keys", () => {
					const localizables = localizableFactory.repeatOverviewColumnHint(
						fieldOverviewColumn.element,
						fieldOverviewColumn.path
					);
					assertContainsKey(
						localizables,
						"documentModel.hint.localization-document.root.repeat.F1"
					);
				});
			});

			describe("expression overview column", () => {
				it("returns localizables with the right keys", () => {
					const localizables = localizableFactory.repeatOverviewColumnHint(
						expressionOverviewColumn.element,
						fieldOverviewColumn.path
					);
					strictEqual(localizables.length, 0);
				});
			});
		});

		describe("repeat overview column placeholder", () => {
			describe("field overview column", () => {
				it("returns localizables with the right keys", () => {
					const localizables = localizableFactory.inputPlaceholder(
						fieldOverviewColumn.element,
						fieldOverviewColumn.path
					);
					assertContainsKey(
						localizables,
						"uiModel.localization-form.Screen1.Repeat.RepeatDefaultLabels.fieldOverviewColumn-1.placeholder"
					);
					assertContainsKey(
						localizables,
						"documentModel.placeholder.localization-document.root.repeat.F1"
					);
				});
			});
		});

		describe("input suffix", () => {
			it("returns localizables with the right keys", () => {
				const localizables = localizableFactory.inputSuffix(control.element.elementPath);
				assertContainsKey(
					localizables,
					"documentModel.suffix.localization-document.root.stringfield_empty"
				);
			});
		});
	});
});
