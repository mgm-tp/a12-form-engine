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

import type { ReactElement } from "react";
import { useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizer, ValueConversion } from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { Column } from "@com.mgmtp.a12.widgets/widgets-core";

import {
	DataSelectors,
	FormModelSelectors,
	ModelSelectors,
	UiStateSelectors
} from "../../../../../../back-end/store/index.js";
import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";
import { getDocumentPath } from "../../../../../../back-end/utils/internal/path.js";
import type { FormModel } from "../../../../../../models/index.js";
import {
	isFormModelControl,
	isFormModelDetachedRepeat,
	isFormModelFieldOverviewColumn,
	isFormModelInlineRepeat
} from "../../../../../../models/internal/FormModelGuards.js";
import * as DocumentModelUtils from "../../../../../../models/internal/utils/document-model-utils.js";
import {
	DocumentUtils,
	IndexedControl
} from "../../../../../../models/internal/utils/document-utils.js";
import { FormModelPath } from "../../../../../../models/internal/utils/form-model-path.js";
import { FormModelUtils } from "../../../../../../models/internal/utils/form-model-utils.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import type { ComponentMap } from "../../../../configuration/componentMap/component-map.js";
import { InputMapContext } from "../../../../configuration/componentMap/input/input.js";
import type { FormModelMap, Inputs } from "../../../../configuration/engine-configuration.js";
import { SelectorContext } from "../../../../configuration/selectorContext.js";
import { isHidden } from "../../../../utilities/enablements/hidden.js";
import { evaluateReadonlyPresentation } from "../../../../utilities/enablements/readonly-presentation.js";
import { isReadonly } from "../../../../utilities/enablements/readonly.js";
import { DataContext } from "../../data-context.js";
import { useInputRef } from "../../input-reference-provider.js";
import {
	getLabel,
	getLabelAsHtml,
	getLabelWithAsterisk,
	shouldShowAsterisk
} from "../../model-element-labels.js";

import { getValueForUI } from "./getValueForUI.js";
import { TextOutput } from "./text-output/text-output.js";

/**
 * @internal
 *
 * Maps a FieldOverviewColumn from the form-model to either an input element
 * or a text output.
 *
 * Calculates all necessary props for the column by evaluating
 * the form-model and current state.
 *
 * If the column is readonly, does not reference an attachment and the
 * readonly presentation is set to TEXT a text output is rendered in the end.
 * In all other cases Input is called, which renders depending on the datatype
 * and configuration (e.g. exposition) the correct react element from
 * the InputElementMap.
 */
export function FieldOverviewColumn(props: {
	readonly modelElement: FormModel.FieldOverviewColumn;
	readonly config: FormModelMap.RenderConfiguration;
	readonly repeat: FormModel.Repeat;
	readonly alignment?: Column.HorizontalAlignment;
}): ReactElement | null {
	const { localizer, conversion } = useContext(LocalizerContext);

	const componentMap = useContext(ComponentMapContext);
	const { AttachmentPreview } = componentMap;
	const inputMap = useContext(InputMapContext);

	const { attachmentThumbnail } = useContext(SelectorContext);

	const { modelElement: fieldOverviewColumn, config, repeat, alignment } = props;

	const dataContext = useContext(DataContext);
	const groupPath = repeat.groupPath;
	const groupDataContext = dataContext.slice(0, groupPath.length);
	const isColumnHidden = isHidden({
		formModelElement: fieldOverviewColumn,
		dataContext: groupDataContext,
		state: config.renderOptions.state
	});
	if (isColumnHidden) {
		return null;
	}

	const rowIndex = groupDataContext[groupDataContext.length - 1].index - 1;
	const uiId = UiId.generate({
		element: fieldOverviewColumn,
		uiIdPrefix: config.renderOptions.config.uiIdPrefix,
		rowIndex
	});

	const fieldBasedInputOptions = calculateFieldBasedInputOptions({
		input: fieldOverviewColumn,
		uiId,
		renderConfiguration: config,
		dataContext: groupDataContext,
		localizer,
		converter: conversion,
		componentMap
	});

	const fieldOptions = {
		...fieldBasedInputOptions,
		modelElement: {
			...fieldBasedInputOptions.modelElement,
			labelHiddenButRead: true
		}
	};

	const formModelPath = FormModelPath.extend(config.parentPath, fieldOverviewColumn);

	let attachment = undefined;
	if (
		DocumentModelUtils.isAttachment(fieldOptions.documentElement) &&
		isFormModelInlineRepeat(repeat) &&
		fieldOverviewColumn.exposition === "THUMBNAIL_OR_ICON"
	) {
		attachment = fieldOptions.value.data ?? {};
		if (DocumentUtils.isFieldInstanceValue(attachment)) {
			throw new Error("Internal Error!");
		}
	}

	return fieldOptions.modelElement.readonly &&
		!DocumentModelUtils.isAttachment(fieldOptions.documentElement) &&
		isFormModelInlineRepeat(repeat) &&
		evaluateReadonlyPresentation(formModelPath, config.renderOptions.state) === "TEXT" ? (
		<TextOutput
			{...fieldOptions}
			documentElementDataType={fieldBasedInputOptions.documentElementDataType}
			documentElement={fieldBasedInputOptions.documentElement}
			displayPartialText={repeat.tableStyle?.rowHeight !== undefined}
			alignment={alignment}
			disableParagraphWrapping
		/>
	) : attachment ? (
		<AttachmentPreview
			id={uiId}
			repeatRowHeight={
				(isFormModelInlineRepeat(repeat) || isFormModelDetachedRepeat(repeat)) &&
				repeat.infiniteScrolling
					? repeat.tableStyle?.rowHeight
					: undefined
			}
			attachment={attachment}
			thumbnail={attachmentThumbnail(attachment)(config.renderOptions.state)}
		/>
	) : (
		<inputMap.Input {...fieldOptions} />
	);
}

/**
 * @internal
 *
 * Maps a Control from the form-model to an input element.
 *
 * Calculates all necessary props for the control by evaluating
 * the form-model and current state.
 * Calls Input in the end, which renders depending on the datatype
 * and configuration (e.g. exposition) the correct react element from
 * the InputElementMap.
 */
export function Control(props: {
	modelElement: FormModel.Control;
	config: FormModelMap.RenderConfiguration;
}): ReactElement | null {
	const { modelElement: control, config: renderConfiguration } = props;
	const { renderOptions: options, parentPath } = renderConfiguration;

	const documentModel = ModelSelectors.documentModel()(options.state);
	const formModel = ModelSelectors.formModel()(options.state);

	const { localizer, conversion } = useContext(LocalizerContext);

	const componentMap = useContext(ComponentMapContext);
	const inputMap = useContext(InputMapContext);

	const dataContext = useContext(DataContext);

	const initiallyFocusedElementId = formModel.content.screens[0].initiallyFocusedElementId;
	const inputRef = useInputRef(control.id, initiallyFocusedElementId);

	const document = DataSelectors.document()(options.state) as GroupInstance;

	// context of the screen or embedded repeat row
	const currentDataContext =
		dataContext.length > 0
			? dataContext
			: UiStateSelectors.currentScreenLocation()(options.state).path;

	const controlContext = IndexedControl.getContextOfControlWithIndex({
		elementPath: control.elementPath,
		controlIndex: control.index,
		documentModel,
		document,
		currentDataContext
	});

	if (
		isHidden({
			formModelElement: control,
			dataContext: controlContext,
			state: options.state
		})
	) {
		return null;
	}

	const formModelPath = FormModelPath.extend(parentPath, control);

	const hintLocalizables = UiStateSelectors.InputLocalization.hintLocalizables(
		formModelPath,
		control
	)(options.state);

	const helperTextLocalizables = UiStateSelectors.InputLocalization.helperTextLocalizables(
		formModelPath,
		control
	)(options.state);

	const uiId = UiId.generate({ element: control, uiIdPrefix: options.config.uiIdPrefix });
	const fieldBasedInputOptions = calculateFieldBasedInputOptions({
		input: control,
		uiId,
		renderConfiguration,
		dataContext: controlContext,
		localizer,
		converter: conversion,
		componentMap
	});
	const label = fieldBasedInputOptions.modelElement.required
		? getLabelWithAsterisk(fieldBasedInputOptions.modelElement.label)
		: fieldBasedInputOptions.modelElement.label;
	const fce =
		formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(control.elementPath)];

	const fieldOptions: Inputs.InputProps<DocumentModel.FieldType | DocumentModel.Group> = {
		...fieldBasedInputOptions,
		modelElement: {
			...fieldBasedInputOptions.modelElement,
			label,
			hintText: localizer(...hintLocalizables),
			secret: control.secret || fce?.secret,
			enableSelectAll: fce?.enableSelectAll,
			tooltipsOnTop: control.tooltipsOnTop,
			labelHiddenButRead: control.labelHiddenButRead,
			labelPlacement: fce?.labelPlacement,
			helperText: localizer(...helperTextLocalizables),
			attachmentConfig: fce?.attachmentConfig
		},
		inputRef
	};

	if (
		fieldOptions.modelElement.readonly &&
		!DocumentModelUtils.isAttachment(fieldOptions.documentElement) &&
		evaluateReadonlyPresentation(formModelPath, options.state) === "TEXT"
	) {
		return (
			<TextOutput
				{...fieldOptions}
				documentElementDataType={fieldBasedInputOptions.documentElementDataType}
				documentElement={fieldBasedInputOptions.documentElement}
			/>
		);
	}
	return <inputMap.Input {...fieldOptions} />;
}

function calculateFieldBasedInputOptions(options: {
	renderConfiguration: FormModelMap.RenderConfiguration;
	input: FormModel.FieldBasedInputType;
	uiId: string;
	dataContext: EntityInstancePath;
	localizer: Localizer;
	converter: ValueConversion;
	componentMap: ComponentMap;
	fieldDocumentPath?: EntityInstancePath;
}): Inputs.InputProps<DocumentModel.FieldType | DocumentModel.Group> & {
	documentElement: DocumentModel.Element;
} {
	const { input, uiId, dataContext, renderConfiguration, localizer, converter, componentMap } =
		options;
	const { renderOptions, parentPath } = options.renderConfiguration;
	const { config, state } = renderOptions;

	const documentModel = ModelSelectors.documentModel()(state);
	const formModel = ModelSelectors.formModel()(state);

	const documentElement = DocumentModelUtils.findByPath(documentModel, input.elementPath);

	const formModelPath = FormModelPath.extend(parentPath, input);

	const documentElementPath = getDocumentPath(documentModel, input.elementPath, dataContext);
	const originalValue = getValueForUI(
		converter,
		documentElementPath,
		localizer,
		config.externalEnumerationProvider
	)(state);

	const readonly = isReadonly({
		formModelPath,
		dataContext,
		state
	});
	const disabled = UiStateSelectors.disabled()(state);

	const dataType = documentElement.type === "Field" ? documentElement.fieldType : documentElement;

	const placeholderLocalizables = UiStateSelectors.InputLocalization.placeholderLocalizables(
		formModelPath,
		input
	)(state);

	const fce = formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(input.elementPath)];
	const fceExposition = fce ? fce.exposition : undefined;
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(renderOptions.state);
	const label = getLabel({
		options: renderOptions,
		element: input,
		formModelPath,
		dataContext: isFormModelControl(input) ? dataContext : currentScreenLocation.path,
		localizer,
		converter,
		fce
	});

	const suffixText = FormModelSelectors.suffix(input.elementPath, localizer)(state);

	const errorMessagesForElement = UiStateSelectors.messagesByPath(
		originalValue.path,
		formModelPath,
		"error"
	)(state);
	const warningMessagesForElement = UiStateSelectors.messagesByPath(
		originalValue.path,
		formModelPath,
		"warning"
	)(state);
	const infoMessagesForElement = UiStateSelectors.messagesByPath(
		originalValue.path,
		formModelPath,
		"info"
	)(state);
	const errorMessages = errorMessagesForElement.map(m => m.errorText);
	const warningMessages = warningMessagesForElement.map(m => m.errorText);
	const infoMessages = infoMessagesForElement.map(m => m.errorText);

	const exposition =
		isFormModelFieldOverviewColumn(input) &&
		((documentElement.type === "Field" &&
			FormModelUtils.isEnumerable(documentElement.fieldType, fce)) ||
			DocumentModelUtils.isMultiSelect(documentElement))
			? enumerationExposition({ dataType, columnExposition: input.exposition, fceExposition })
			: input.exposition || fceExposition || defaultExposition(dataType);

	const specificHorizontalAlignment = isFormModelFieldOverviewColumn(input)
		? input.specificHorizontalAlignment
		: undefined;

	const specificVerticalAlignment = isFormModelFieldOverviewColumn(input)
		? input.specificVerticalAlignment
		: undefined;

	const showCommaSeparated = isFormModelFieldOverviewColumn(input)
		? input.showCommaSeparated
		: undefined;

	const timeZone = documentModel.content.modelConfig.timeZone;
	const labelAsHtml = getLabelAsHtml(label, input, componentMap, fce);
	const showAsterisk = shouldShowAsterisk(
		{
			label: labelAsHtml,
			elementPath: input.elementPath,
			markingOfRequiredFields: input.markingOfRequiredFields,
			disabled,
			readonly
		},
		renderOptions,
		formModel
	);

	return {
		renderConfiguration,
		uiId,
		value: originalValue,
		validationMessages: {
			errors: errorMessages,
			warnings: warningMessages,
			infos: infoMessages
		},
		modelElement: {
			elementRef: input.elementRef,
			elementPath: input.elementPath,
			label: labelAsHtml,
			exposition,
			enableSelectAll: fce?.enableSelectAll,
			readonly,
			secret: input.secret || fce?.secret,
			datePickerConfig: input.datePickerConfig,
			messageExposition: input.messageExposition,
			autoExpand: input.autoExpand,
			disabled,
			suffix: suffixText,
			truncateSuffix: input.truncateSuffix,
			placeholder: localizer(...placeholderLocalizables),
			required: showAsterisk,
			specificHorizontalAlignment,
			specificVerticalAlignment,
			attachmentConfig: fce?.attachmentConfig,
			showCommaSeparated,
			timeZone,
			style: input.style,
			autoComplete: input.autoComplete,
			icon: fce?.icon
		},
		formModelPath,
		documentElementDataType: dataType,
		documentElement
	};
}

function defaultExposition(
	dataType: DocumentModel.FieldType | DocumentModel.Group
): FormModel.ExpositionPresentation {
	if (dataType.type === "BooleanType") {
		return "BOOLEAN_SELECT";
	}

	if (dataType.type === "ConfirmType") {
		return "CHECKBOX";
	}

	if (dataType.type === "Group") {
		if (DocumentModelUtils.isMultiSelect(dataType)) {
			return "AUTOCOMPLETE";
		}

		if (DocumentModelUtils.isAttachment(dataType)) {
			return "FULL";
		}
	}

	return "COMPACT";
}

function enumerationExposition(options: {
	dataType: DocumentModel.FieldType | DocumentModel.Group;
	columnExposition?: FormModel.ExpositionPresentation;
	fceExposition?: FormModel.ExpositionPresentation;
}): FormModel.ExpositionPresentation {
	const { dataType, columnExposition, fceExposition } = options;

	return columnExposition === "AUTOCOMPLETE" ||
		(!columnExposition && fceExposition === "AUTOCOMPLETE")
		? "AUTOCOMPLETE"
		: defaultExposition(dataType);
}
