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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization";
import {
	localizableFromModel,
	localizableKeyFromSegments
} from "@com.mgmtp.a12.utils/utils-localization";

import {
	isFormModelButtonType,
	isFormModelControl,
	isFormModelEmbeddedRepeat,
	isFormModelFieldOverviewColumn,
	isFormModelInlineRepeat,
	isFormModelRowAction
} from "../../../models/internal/FormModelGuards.js";
import type { FormModel } from "../../../models/internal/form-model.js";
import * as DocumentModelUtils from "../../../models/internal/utils/document-model-utils.js";
import { FormModelUtils } from "../../../models/internal/utils/form-model-utils.js";

import { createKey } from "./documentModelKeyFactory.js";
import { createResourceLocalizable } from "./factory.js";
import { FmKeySegmentFactory } from "./fmKeySegmentFactory.js";
import { RESOURCE_KEYS } from "./languages/keys.js";

/** @internal */
export function createLocalizableFactory(
	documentModel: DocumentModel,
	formModel: FormModel
): LocalizableFactory {
	return new LocalizableFactory(documentModel, formModel);
}

/** @internal */
export interface IDocumentModelLocalizableFactory {
	booleanValue(path: ModelPath, value: boolean | null): Localizable[];
	/**
	 * Returns the Localizables used for confirms in filters, expressions and readonly presentation (key: textOutput.noData).
	 */
	confirmValue(path: ModelPath, value: true | null): Localizable[];
	/**
	 * Returns the Localizables used for confirms in input widgets (key: null).
	 */
	confirmUIValue(path: ModelPath, value: true | null): Localizable[];
	enumerationValue(path: ModelPath, value: DocumentModel.EnumValue): Localizable[];
}

class DocumentModelLocalizableFactory implements IDocumentModelLocalizableFactory {
	protected documentModel: DocumentModel;
	public constructor(documentModel: DocumentModel) {
		this.documentModel = documentModel;
	}

	public booleanValue(path: ModelPath, value: boolean | null): Localizable[] {
		const stringValue = String(value);
		const key = createKey(this.documentModel, "boolean", path, stringValue);
		return [
			{ key },
			value === true
				? createResourceLocalizable(RESOURCE_KEYS.true)
				: value === false
					? createResourceLocalizable(RESOURCE_KEYS.false)
					: createResourceLocalizable(RESOURCE_KEYS.textOutput.noData)
		];
	}

	public confirmValue(path: ModelPath, value: true | null): Localizable[] {
		const stringValue = String(value);
		const key = createKey(this.documentModel, "confirm", path, stringValue);
		return [
			{ key },
			value
				? createResourceLocalizable(RESOURCE_KEYS.true)
				: createResourceLocalizable(RESOURCE_KEYS.textOutput.noData)
		];
	}

	public confirmUIValue(path: ModelPath, value: true | null): Localizable[] {
		const stringValue = String(value);
		const key = createKey(this.documentModel, "confirmUI", path, stringValue);
		return [
			{ key },
			value
				? createResourceLocalizable(RESOURCE_KEYS.true)
				: createResourceLocalizable(RESOURCE_KEYS.null)
		];
	}

	public enumerationValue(
		path: ModelPath,
		{ value, label }: DocumentModel.EnumValue
	): Localizable[] {
		const key = createKey(this.documentModel, "enumValues", path, value);
		const keyForDefault = `${key}.default`;

		return [
			localizableFromModel(key, label || []),
			{ key: keyForDefault, defaults: { en: value, de: value } }
		];
	}

	protected fieldLabel(path: ModelPath): Localizable[] {
		const element = DocumentModelUtils.findByPath(this.documentModel, path);

		if (DocumentModelUtils.isMultiSelect(element)) {
			return this.fieldLabel([...path, { elementName: element.elements[0].name }]);
		}

		if (element.type !== "Field") {
			return [];
		}

		const key = createKey(this.documentModel, "label", path);
		return [localizableFromModel(key, element.label || [])];
	}

	protected fieldHint(path: ModelPath): Localizable[] {
		const element = DocumentModelUtils.findByPath(this.documentModel, path);
		const key = createKey(this.documentModel, "hint", path);
		return [localizableFromModel(key, element.externalDescription)];
	}

	protected fieldHelperText(path: ModelPath): Localizable[] {
		const element = DocumentModelUtils.findByPath(this.documentModel, path);

		if (DocumentModelUtils.isMultiSelect(element)) {
			return this.fieldHelperText([...path, { elementName: element.elements[0].name }]);
		}

		if (element.type !== "Field") {
			return [];
		}

		const key = createKey(this.documentModel, "helperText", path);
		return [localizableFromModel(key, element.helperText)];
	}
}

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface LocalizableFactory extends IDocumentModelLocalizableFactory {
	modelLabel(model: FormModel): Localizable[];
	modelSubtitle(model: FormModel): Localizable[];
	componentTitle(component: FormModel.TitledComponent, path: ModelPath): Localizable[];
	componentLabel(component: FormModel.LabeledComponent, path: ModelPath): Localizable[];
	componentDescription(
		component: FormModel.ComponentWithDescription,
		path: ModelPath
	): Localizable[];
	componentHint(component: FormModel.Control, path: ModelPath): Localizable[];
	componentContent(component: FormModel.TextCell, path: ModelPath): Localizable[];
	componentButtonLabels(
		component: FormModel.ButtonType | FormModel.Repeat,
		path: ModelPath,
		type: FormModel.RepeatButtonLabelEnum
	): Localizable[];
	componentConfirmationTitles(
		component: FormModel.Repeat,
		path: ModelPath,
		type: FormModel.ConfirmationTextEnum
	): Localizable[];
	componentConfirmationMessages(
		component: FormModel.Repeat,
		path: ModelPath,
		type: FormModel.ConfirmationTextEnum
	): Localizable[];
	inputLabel(control: FormModel.FieldBasedInputType, path: ModelPath): Localizable[];
	controlHint(control: FormModel.Control, path: ModelPath): Localizable[];
	inputPlaceholder(control: FormModel.FieldBasedInputType, path: ModelPath): Localizable[];
	controlHelperText(control: FormModel.Control): Localizable[];
	inputSuffix(documentModelPath: ModelPath): Localizable[];

	repeatRowActionLabel(path: ModelPath, action: FormModel.RowAction): Localizable[];
	repeatRowActionDescription(path: ModelPath, action: FormModel.RowAction): Localizable[];
	repeatRowActionConfirmation(path: ModelPath, action: FormModel.RowAction): Localizable[];
	repeatRowActionDialogTitle(path: ModelPath, action: FormModel.RowAction): Localizable[];
	repeatOverviewColumnTitle(column: FormModel.RepeatOverviewColumn, path: ModelPath): Localizable[];
	repeatOverviewColumnHint(column: FormModel.RepeatOverviewColumn, path: ModelPath): Localizable[];

	repeatMultiFileUploadDescription(repeat: FormModel.Repeat, path: ModelPath): Localizable[];
	repeatMultiFileUploadButtonText(repeat: FormModel.Repeat, path: ModelPath): Localizable[];
	repeatMultiFileUploadHelperText(repeat: FormModel.Repeat, path: ModelPath): Localizable[];

	formFieldLabel(path: ModelPath): Localizable[];
}

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class LocalizableFactory
	extends DocumentModelLocalizableFactory
	implements LocalizableFactory
{
	private formModel: FormModel;

	constructor(documentModel: DocumentModel, formModel: FormModel) {
		super(documentModel);
		this.formModel = formModel;
	}

	modelLabel(model: FormModel): Localizable[] {
		const fmKey = FmKeySegmentFactory.getHeaderKey(this.formModel, "label");
		const writeableLabels = model.header.labels;
		return [localizableFromModel(fmKey, writeableLabels)];
	}

	modelSubtitle(model: FormModel): Localizable[] {
		const fmKey = FmKeySegmentFactory.getHeaderKey(this.formModel, "subtitle");
		const subtitle = model.content.subtitle;
		const multilingualSubtitle =
			subtitle?.type === "Multilingual" ? subtitle.multilingualText : undefined;
		return [localizableFromModel(fmKey, multilingualSubtitle?.text)];
	}

	componentTitle(component: FormModel.TitledComponent, path: ModelPath): Localizable[] {
		const fmKey = FmKeySegmentFactory.getComponentKey(this.formModel, path, "title");
		const multilingualTitle =
			component.title?.type === "Multilingual" ? component.title.multilingualText : undefined;
		return [localizableFromModel(fmKey, multilingualTitle?.text)];
	}

	componentLabel(component: FormModel.LabeledComponent, path: ModelPath): Localizable[] {
		const fmKey = FmKeySegmentFactory.getComponentKey(this.formModel, path, "label");
		const labelType =
			isFormModelButtonType(component) || isFormModelRowAction(component)
				? component.buttonStyling?.label
				: component.label;
		const multilingualLabel =
			labelType?.type === "Multilingual" ? labelType.multilingualText : undefined;
		return [localizableFromModel(fmKey, multilingualLabel?.text)];
	}

	componentDescription(
		component: FormModel.ComponentWithDescription,
		path: ModelPath
	): Localizable[] {
		const fmKey = FmKeySegmentFactory.getComponentKey(this.formModel, path, "description");
		const labelType = component.buttonStyling?.description;
		return [localizableFromModel(fmKey, labelType?.text)];
	}

	componentHint(component: FormModel.FieldBasedInputType, path: ModelPath): Localizable[] {
		const fmKey = FmKeySegmentFactory.getComponentKey(this.formModel, path, "hint");
		return [localizableFromModel(fmKey, component.hint?.text)];
	}

	componentContent(component: FormModel.TextCell, path: ModelPath): Localizable[] {
		const fmKey = FmKeySegmentFactory.getComponentKey(this.formModel, path, "content");
		return [localizableFromModel(fmKey, component.content.text)];
	}

	componentButtonLabels(
		component: FormModel.ButtonType | FormModel.Repeat,
		path: ModelPath,
		type: FormModel.RepeatButtonLabelEnum
	): Localizable[] {
		const key = FmKeySegmentFactory.getComponentButtonLabel(this.formModel, path, type);
		const buttonLabel =
			"buttonLabels" in component && component.buttonLabels
				? component.buttonLabels[type]
				: undefined;

		const defaultKey = FmKeySegmentFactory.getComponentDefaultButtonLabel(this.formModel, type);
		const defaultButtonLabel = this.formModel.content.defaults.buttonLabels?.[type];

		return [
			localizableFromModel(key, buttonLabel?.text),
			localizableFromModel(defaultKey, defaultButtonLabel?.text),
			createResourceLocalizable(RESOURCE_KEYS.repeat.buttonLabels[type])
		];
	}

	componentConfirmationMessages(
		component: FormModel.Repeat,
		path: ModelPath,
		type: FormModel.ConfirmationTextEnum
	): Localizable[] {
		const key = FmKeySegmentFactory.getComponentConfirmationMessage(this.formModel, path, type);
		const confirmationText = component.confirmationTexts
			? component.confirmationTexts[type]
			: undefined;

		const defaultKey = FmKeySegmentFactory.getComponentDefaultConfirmationMessage(
			this.formModel,
			type
		);
		const defaultConfirmationText = this.formModel.content.defaults.confirmationTexts?.[type];

		return [
			localizableFromModel(key, confirmationText?.message?.text),
			localizableFromModel(defaultKey, defaultConfirmationText?.message?.text),
			createResourceLocalizable(RESOURCE_KEYS.repeat.deletionConfirmationText)
		];
	}

	componentConfirmationTitles(
		component: FormModel.Repeat,
		path: ModelPath,
		type: FormModel.ConfirmationTextEnum
	): Localizable[] {
		const key = FmKeySegmentFactory.getComponentConfirmationTitle(this.formModel, path, type);
		const confirmationText = component.confirmationTexts
			? component.confirmationTexts[type]
			: undefined;

		const defaultKey = FmKeySegmentFactory.getComponentDefaultConfirmationTitle(
			this.formModel,
			type
		);
		const defaultConfirmationText = this.formModel.content.defaults.confirmationTexts?.[type];

		return [
			localizableFromModel(key, confirmationText?.title?.text),
			localizableFromModel(defaultKey, defaultConfirmationText?.title?.text),
			createResourceLocalizable(RESOURCE_KEYS.repeat.deletionConfirmationTitle)
		];
	}

	inputLabel(input: FormModel.FieldBasedInputType, path: ModelPath): Localizable[] {
		return this.labelForInput(input, path);
	}

	controlHint(control: FormModel.Control, path: ModelPath): Localizable[] {
		const fieldHint = this.fieldHint(control.elementPath);
		const { fieldMap } = this.formModel.content.fieldConfiguration;
		const fieldConfigurationEntry = fieldMap[ModelPath.toString(control.elementPath)];
		return [
			...this.componentHint(control, path),
			...this.fieldConfigurationEntryHint(control, fieldConfigurationEntry),
			...(fieldHint ? fieldHint : [])
		];
	}

	inputPlaceholder(control: FormModel.FieldBasedInputType, path: ModelPath): Localizable[] {
		const fmKey = FmKeySegmentFactory.getComponentKey(this.formModel, path, "placeholder");
		return [localizableFromModel(fmKey), ...this.fieldConfigurationPlaceholder(control)];
	}

	inputSuffix(documentModelPath: ModelPath): Localizable[] {
		const documentModelKey = createKey(this.documentModel, "suffix", documentModelPath);

		const { fieldMap } = this.formModel.content.fieldConfiguration;
		const fieldConfigurationEntry = fieldMap[ModelPath.toString(documentModelPath)];
		return [localizableFromModel(documentModelKey, fieldConfigurationEntry?.suffix?.text)];
	}

	controlHelperText(control: FormModel.Control): Localizable[] {
		return [...this.fieldHelperText(control.elementPath)];
	}

	repeatRowActionLabel(path: ModelPath, action: FormModel.RowAction): Localizable[] {
		const key = FmKeySegmentFactory.getRepeatRowActionKey(this.formModel, path, action, "label");
		const multilingualLabel =
			action.buttonStyling?.label?.type === "Multilingual"
				? action.buttonStyling.label.multilingualText
				: undefined;
		return [localizableFromModel(key, multilingualLabel?.text)];
	}

	repeatRowActionDescription(path: ModelPath, action: FormModel.RowAction): Localizable[] {
		const key = FmKeySegmentFactory.getRepeatRowActionKey(
			this.formModel,
			path,
			action,
			"description"
		);
		const description = action.buttonStyling?.description;
		return [localizableFromModel(key, description?.text)];
	}

	repeatRowActionConfirmation(path: ModelPath, action: FormModel.RowAction): Localizable[] {
		const key = FmKeySegmentFactory.getRepeatRowActionKey(
			this.formModel,
			path,
			action,
			"confirmation"
		);
		return [localizableFromModel(key, action.confirmation?.text)];
	}

	repeatRowActionDialogTitle(path: ModelPath, action: FormModel.RowAction): Localizable[] {
		const key = FmKeySegmentFactory.getRepeatRowActionKey(
			this.formModel,
			path,
			action,
			"confirmationTitle"
		);
		return [localizableFromModel(key, action.confirmationDialogTitle?.text)];
	}

	repeatOverviewColumnTitle(
		column: FormModel.RepeatOverviewColumn,
		path: ModelPath
	): Localizable[] {
		if (column.type === "FieldBasedRepeatOverviewColumn") {
			return this.labelForInput(column, path);
		} else {
			return this.componentLabel(column, path);
		}
	}

	repeatOverviewColumnHint(column: FormModel.RepeatOverviewColumn, path: ModelPath): Localizable[] {
		if (column.type === "FieldBasedRepeatOverviewColumn") {
			const { fieldMap } = this.formModel.content.fieldConfiguration;
			const fieldConfigurationEntry = fieldMap[ModelPath.toString(column.elementPath)];
			const fieldHint = this.fieldHint(column.elementPath);
			return [
				...this.componentHint(column, path),
				...this.fieldConfigurationEntryHint(column, fieldConfigurationEntry),
				...(fieldHint ? fieldHint : [])
			];
		} else {
			return [];
		}
	}

	repeatMultiFileUploadDescription(repeat: FormModel.Repeat, path: ModelPath): Localizable[] {
		if (
			(isFormModelEmbeddedRepeat(repeat) || isFormModelInlineRepeat(repeat)) &&
			repeat.multiFileUploadOptions
		) {
			const key = FmKeySegmentFactory.getRepeatMultiFileUploadKey(
				this.formModel,
				path,
				"description"
			);

			return [localizableFromModel(key, repeat.multiFileUploadOptions.fileUploadDescription?.text)];
		}

		return [];
	}

	repeatMultiFileUploadButtonText(repeat: FormModel.Repeat, path: ModelPath): Localizable[] {
		if (
			(isFormModelEmbeddedRepeat(repeat) || isFormModelInlineRepeat(repeat)) &&
			repeat.multiFileUploadOptions
		) {
			const key = FmKeySegmentFactory.getRepeatMultiFileUploadKey(
				this.formModel,
				path,
				"buttonText"
			);

			return [localizableFromModel(key, repeat.multiFileUploadOptions.fileUploadButtonText?.text)];
		}

		return [];
	}

	repeatMultiFileUploadHelperText(repeat: FormModel.Repeat, path: ModelPath): Localizable[] {
		if (
			(isFormModelEmbeddedRepeat(repeat) || isFormModelInlineRepeat(repeat)) &&
			repeat.multiFileUploadOptions
		) {
			const key = FmKeySegmentFactory.getRepeatMultiFileUploadKey(
				this.formModel,
				path,
				"helperText"
			);

			return [localizableFromModel(key, repeat.multiFileUploadOptions.fileUploadHelperText?.text)];
		}

		return [];
	}

	formFieldLabel(path: ModelPath): Localizable[] {
		const instance = FormModelUtils.findFirstOccurrenceOfControlByDocumentPath(
			this.formModel,
			path
		);
		if (instance !== undefined) {
			if (isFormModelControl(instance.element)) {
				return this.inputLabel(instance.element, instance.formModelPath);
			} else if (isFormModelFieldOverviewColumn(instance.element)) {
				return this.repeatOverviewColumnTitle(instance.element, instance.formModelPath);
			}
		}
		// fallback to document model element label
		return this.fieldLabel(path);
	}

	protected labelForInput(
		fieldBasedInput: FormModel.FieldBasedInputType,
		path: ModelPath
	): Localizable[] {
		const { fieldMap } = this.formModel.content.fieldConfiguration;
		const fieldConfigurationEntry = fieldMap[ModelPath.toString(fieldBasedInput.elementPath)];
		const fieldLabel = this.fieldLabel(fieldBasedInput.elementPath);

		return [
			...this.componentLabel(fieldBasedInput, path),
			...this.fieldConfigurationEntryLabel(fieldBasedInput, fieldConfigurationEntry),
			...(fieldLabel ? fieldLabel : [])
		];
	}

	protected fieldConfigurationEntryLabel(
		fieldBasedInput: FormModel.FieldBasedInputType,
		entry?: FormModel.FieldConfigurationEntry
	): Localizable[] {
		const documentModelKey = createKey(this.documentModel, "label", fieldBasedInput.elementPath);

		const fieldConfigEntryKey = `${localizableKeyFromSegments([
			"uiModel",
			this.formModel.header.id
		])}.${documentModelKey}`;

		const multilingualLabel =
			entry?.label?.type === "Multilingual" ? entry?.label.multilingualText : undefined;

		return [localizableFromModel(fieldConfigEntryKey, multilingualLabel?.text)];
	}

	protected fieldConfigurationEntryHint(
		control: FormModel.FieldBasedInputType,
		entry?: FormModel.FieldConfigurationEntry
	): Localizable[] {
		const documentModelKey = createKey(this.documentModel, "hint", control.elementPath);

		return [localizableFromModel(documentModelKey, entry?.hint?.text)];
	}

	protected fieldConfigurationPlaceholder(element: FormModel.FieldBasedInputType): Localizable[] {
		const documentModelKey = createKey(this.documentModel, "placeholder", element.elementPath);
		const { fieldMap } = this.formModel.content.fieldConfiguration;
		const fieldConfigurationEntry = fieldMap[ModelPath.toString(element.elementPath)];
		return [localizableFromModel(documentModelKey, fieldConfigurationEntry?.placeholder?.text)];
	}
}
