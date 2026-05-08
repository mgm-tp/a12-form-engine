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

import type { JSX } from "react";
import { useContext } from "react";

import type { FormModel, FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	DataSelectors,
	DefaultFormModelMap,
	DefaultWidgetMap,
	FormModelPath,
	FormModelSelectors,
	ModelSelectors,
	Suffix,
	Tooltips,
	UiStateSelectors,
	useDocumentPathForInput,
	ValidationMessages
} from "@com.mgmtp.a12.formengine/formengine-core";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type {
	Localizable,
	Localizer
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

/**
 * This example demonstrates how to customize a control.
 * It renders for each control which has the annotation 'customControl' an
 * 'Autocomplete' with the number 1 to 10.
 *
 * The example shows how to
 *  	* localize labels, placeholders and hints
 *  	* render validation messages (as tooltips and as validation message boxes)
 * 		* retrieve and render the suffix for an input
 * 		* render tooltips
 *
 * Mind: You do not need every code parts if you model does not contain these specifics.
 * E.g. if you do not have suffixes you don't need to retrieve them.
 */
export const CustomFormModelMapForCustomControl = {
	...DefaultFormModelMap,
	Control: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.Control>) => {
			if (!props.modelElement.annotations?.some(a => a.value === "customControl")) {
				return <DefaultFormModelMap.Control.component {...props} />;
			}
			if (props.modelElement.messageExposition === "TOOLTIP") {
				return <CustomControlWithValidationTooltips {...props} />;
			} else {
				return <CustomControlWithValidationMessageBoxes {...props} />;
			}
		}
	}
};

export function CustomControlWithValidationTooltips(
	props: FormModelMap.FormModelComponentProps<FormModel.Control>
): JSX.Element {
	const control = props.modelElement;
	const state = props.config.renderOptions.state;
	const { localizer } = useContext(LocalizerContext);

	const document = DataSelectors.document()(state);
	const formModelPath = FormModelPath.extend(props.config.parentPath, control);

	const uiId = `custom-control-${control.id}`;

	// Retrieve the document path of the control taking the current data context into account
	const documentPath = useDocumentPathForInput(
		props.modelElement.elementPath,
		ModelSelectors.documentModel()(state)
	);
	const value = new DocumentServiceFactory()
		.getDocumentService()
		.getAssignedObject(document as GroupInstance, documentPath);

	/** Label */
	const labelLocalizables = UiStateSelectors.InputLocalization.labelLocalizables(
		formModelPath,
		control
	)(state);
	const localizedLabel = getLocalizedString(localizer, labelLocalizables);

	/** Placeholder */
	const placeholderLocalizables = UiStateSelectors.InputLocalization.placeholderLocalizables(
		formModelPath,
		control
	)(state);
	const localizedPlaceholder = getLocalizedString(localizer, placeholderLocalizables);

	/** Validation messages */
	const errorMessagesForElement = UiStateSelectors.messagesByPath(
		documentPath,
		formModelPath,
		"error"
	)(state);
	const warningMessagesForElement = UiStateSelectors.messagesByPath(
		documentPath,
		formModelPath,
		"warning"
	)(state);
	const infoMessagesForElement = UiStateSelectors.messagesByPath(
		documentPath,
		formModelPath,
		"info"
	)(state);

	const errorMessages = errorMessagesForElement.map(m => m.errorText);
	const warningMessages = warningMessagesForElement.map(m => m.errorText);
	const infoMessages = infoMessagesForElement.map(m => m.errorText);

	/** Hint Text */
	const hintLocalizables = UiStateSelectors.InputLocalization.hintLocalizables(
		formModelPath,
		control
	)(state);
	const hintText = getLocalizedString(localizer, hintLocalizables);

	/** Tooltips */
	const errorTooltip =
		errorMessages.length > 0
			? {
					id: `${uiId}-errorTooltip`,
					content: <ValidationMessages messages={errorMessages} id={`${uiId}-error`} />
				}
			: undefined;
	const warningTooltip =
		warningMessages.length > 0
			? {
					id: `${uiId}-warningTooltip`,
					content: <ValidationMessages messages={warningMessages} id={`${uiId}-warning`} />
				}
			: undefined;

	const infoTooltip =
		infoMessages.length > 0
			? {
					id: `${uiId}-infoTooltip`,
					content: <ValidationMessages messages={infoMessages} id={`${uiId}-info`} />
				}
			: undefined;

	const hintToolTip = hintText
		? {
				id: `${uiId}-hintTooltip`,
				content: hintText
			}
		: undefined;

	const tooltips = (
		<Tooltips
			errorTooltip={errorTooltip}
			warningTooltip={warningTooltip}
			infoTooltip={infoTooltip}
			hintTooltip={hintToolTip}
		/>
	);

	/**
	 * Collect the ids which are used for the ariaDescribedBy
	 * property of the input.
	 * This information is needed for accessibility.
	 */
	const ariaDescribedBy: string[] = [];
	if (errorTooltip) {
		ariaDescribedBy.push(errorTooltip.id);
	}
	if (warningTooltip) {
		ariaDescribedBy.push(warningTooltip.id);
	}
	if (infoTooltip) {
		ariaDescribedBy.push(infoTooltip.id);
	}
	if (hintToolTip) {
		ariaDescribedBy.push(hintToolTip?.id);
	}

	/** Suffix */
	const suffixText = FormModelSelectors.suffix(control.elementPath, localizer)(state);
	const suffix = suffixText && <Suffix suffix={suffixText} />;

	return (
		<DefaultWidgetMap.Autocomplete
			id={uiId}
			items={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
			hintTemplate={""}
			inputPlaceHolder={localizedPlaceholder}
			label={localizedLabel}
			value={value !== undefined ? String(value) : undefined}
			onValueChange={selectedValue => {
				props.config.renderOptions.eventHandlers.onValueChange(
					documentPath,
					Number(selectedValue),
					formModelPath
				);
			}}
			error={errorMessages.length > 0}
			warning={warningMessages.length > 0}
			info={infoMessages.length > 0}
			tooltips={tooltips}
			suffixes={suffix}
			ariaDescribedby={ariaDescribedBy.length > 0 ? ariaDescribedBy.join(" ") : undefined}
		/>
	);
}

export function CustomControlWithValidationMessageBoxes(
	props: FormModelMap.FormModelComponentProps<FormModel.Control>
): JSX.Element {
	const control = props.modelElement;
	const state = props.config.renderOptions.state;
	const { localizer } = useContext(LocalizerContext);

	const document = DataSelectors.document()(state);
	const formModelPath = FormModelPath.extend(props.config.parentPath, control);

	const uiId = `custom-control-${control.id}`;

	// Retrieve the document path of the control taking the current React data context into account
	const documentPath = useDocumentPathForInput(
		props.modelElement.elementPath,
		ModelSelectors.documentModel()(state)
	);
	const value = new DocumentServiceFactory()
		.getDocumentService()
		.getAssignedObject(document as GroupInstance, documentPath);

	/** Label */
	const labelLocalizables = UiStateSelectors.InputLocalization.labelLocalizables(
		formModelPath,
		control
	)(state);
	const localizedLabel = getLocalizedString(localizer, labelLocalizables);

	/** Placeholder */
	const placeholderLocalizables = UiStateSelectors.InputLocalization.placeholderLocalizables(
		formModelPath,
		control
	)(state);
	const localizedPlaceholder = getLocalizedString(localizer, placeholderLocalizables);

	/** Validation messages */
	const errorMessagesForElement = UiStateSelectors.messagesByPath(
		documentPath,
		formModelPath,
		"error"
	)(state);
	const warningMessagesForElement = UiStateSelectors.messagesByPath(
		documentPath,
		formModelPath,
		"warning"
	)(state);
	const infoMessagesForElement = UiStateSelectors.messagesByPath(
		documentPath,
		formModelPath,
		"info"
	)(state);

	const errorMessages = errorMessagesForElement.map(m => m.errorText);
	const warningMessages = warningMessagesForElement.map(m => m.errorText);
	const infoMessages = infoMessagesForElement.map(m => m.errorText);

	const errorMessageContainer =
		errorMessages.length > 0 ? <ValidationMessages messages={errorMessages} /> : undefined;
	const warningMessageContainer =
		warningMessages.length > 0 ? <ValidationMessages messages={warningMessages} /> : undefined;
	const infoMessageContainer =
		infoMessages.length > 0 ? <ValidationMessages messages={infoMessages} /> : undefined;

	/** Hint */
	const hintLocalizables = UiStateSelectors.InputLocalization.hintLocalizables(
		formModelPath,
		control
	)(state);
	const hintText = getLocalizedString(localizer, hintLocalizables);

	const hintToolTip = hintText
		? {
				id: `${uiId}-hintTooltip`,
				content: hintText
			}
		: undefined;

	const tooltips = <Tooltips hintTooltip={hintToolTip} />;

	/**
	 * Collect the ids which are used for the ariaDescribedBy
	 * property of the input.
	 * This information is needed for accessibility.
	 */
	const ariaDescribedBy: string[] = [];
	if (hintToolTip) {
		ariaDescribedBy.push(hintToolTip.id);
	}

	/** Suffix */
	const suffixText = FormModelSelectors.suffix(control.elementPath, localizer)(state);
	const suffix = suffixText && <Suffix suffix={suffixText} />;

	return (
		<DefaultWidgetMap.Autocomplete
			id={uiId}
			items={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
			hintTemplate={""}
			inputPlaceHolder={localizedPlaceholder}
			label={localizedLabel}
			value={value !== undefined ? String(value) : undefined}
			onValueChange={selectedValue => {
				props.config.renderOptions.eventHandlers.onValueChange(
					documentPath,
					Number(selectedValue),
					formModelPath
				);
			}}
			error={errorMessages.length > 0}
			warning={warningMessages.length > 0}
			info={infoMessages.length > 0}
			errorMessage={errorMessageContainer}
			warningMessage={warningMessageContainer}
			infoMessage={infoMessageContainer}
			tooltips={tooltips}
			suffixes={suffix}
			ariaDescribedby={ariaDescribedBy.length > 0 ? ariaDescribedBy.join(" ") : undefined}
		/>
	);
}

function getLocalizedString(
	localizer: Localizer,
	localizables?: Localizable[]
): string | undefined {
	if (localizables === undefined) {
		return undefined;
	}
	return localizer(...localizables) ?? "";
}
