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
import { useCallback, useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import * as DocumentModelUtils from "../../../../../../../models/internal/utils/document-model-utils.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

import { useBaseProps } from "../use-input-props.js";

/** @internal */
export function StringWithHintListInput(
	props: Inputs.InputProps<DocumentModel.StringType>
): ReactElement {
	const { localizer, conversion, locale } = useContext(LocalizerContext);

	const { inputRef } = props;
	const options = props.renderConfiguration.renderOptions;
	const { addonAfter, suffixes, truncateSuffix, placeholder, htmlInputProps, ...inputProps } =
		useBaseProps(props);

	const hintTemplate = getLocalizedResource(RESOURCE_KEYS.autocomplete.hintTemplate, localizer);

	const AutocompleteComponent = useContext(WidgetMapContext).Autocomplete;

	const documentModel = ModelSelectors.documentModel()(options.state);

	const value = props.value;
	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, value.path);

	const hintList = getHintList(props.documentElementDataType as DocumentModel.StringType, locale);

	const onValueChange = useCallback(
		(newValue: string | DropDownItem) => {
			const autoCompleteValue = getNewAutocompleteValue(newValue);
			if (autoCompleteValue != null) {
				const result = conversion.parseValue(autoCompleteValue, conversionConfig);
				if (result.parseError) {
					options.eventHandlers.onParseError(
						value.path,
						autoCompleteValue,
						result.parseError,
						props.formModelPath
					);
				} else {
					options.eventHandlers.onValueChange(value.path, result.value!, props.formModelPath);
				}
			} else {
				options.eventHandlers.onValueChange(value.path, null, props.formModelPath);
			}
		},
		[conversion, conversionConfig, options.eventHandlers, props.formModelPath, value.path]
	);

	const autoCompleteInputRef = useCallback(
		(element: HTMLElement | null) => {
			if (inputRef) {
				inputRef.current = element;
			}
		},
		[inputRef]
	);

	return (
		<AutocompleteComponent
			{...inputProps}
			value={value.data?.toString()}
			items={hintList}
			hintTemplate={hintTemplate ?? ""}
			caseSensitive={true}
			allowAddingNewItem={true}
			onValueChange={onValueChange}
			tooltips={addonAfter}
			breakTooltipsToNewLine={props.modelElement.tooltipsOnTop}
			inputPlaceHolder={placeholder}
			inputProps={htmlInputProps}
			inputRef={autoCompleteInputRef}
		/>
	);
}

function getHintList(stringType: DocumentModel.StringType, locale: Locale): string[] {
	const localizedHintList = stringType.hintList!.find(list => {
		return list.locale === Locale.toString(locale);
	}) ??
		stringType.hintList!.find(list => list.locale === locale.language) ?? { values: [] };
	const hintList = [...localizedHintList.values];

	return stringType.alphabeticalSorting
		? hintList.sort((v1, v2) => v1.localeCompare(v2))
		: hintList;
}

function getNewAutocompleteValue(selectedValue: string | DropDownItem): string | null {
	const stringValue =
		typeof selectedValue === "string" // else DropDownItem
			? selectedValue.trim()
			: selectedValue.label;

	// unset autocomplete when entered an empty string
	return stringValue === "" ? null : stringValue;
}
