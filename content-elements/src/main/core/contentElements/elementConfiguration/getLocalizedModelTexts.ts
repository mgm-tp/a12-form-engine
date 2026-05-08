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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DataReference } from "@com.mgmtp.a12.client/client-data/lib/core/api/data-reference.js";
import { DocumentModelLocalizableFactory } from "@com.mgmtp.a12.client/client-data/lib/kernel-extension/documentModelLocalizableFactory.js";
import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	LocalizedModelText,
	Localizer
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { localizableFromModel } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { generateLocalizableKey } from "../../localization/generateLocalizableKey.js";
import type { BaseControlProps, MarkingOfRequiredFields } from "../../types/controlProps.js";

/** @internal */
export const GET_LOCALIZED_MODEL_TEXTS_WRAPPER = {
	getLocalizedModelTexts
};

/** @internal */
export interface LocalizedModelTexts {
	label?: string;
	hint?: string;
	helperText?: string;
	placeholder?: string;
	suffix?: string;
	uncheckedLabel?: string;
	checkedLabel?: string;
}

/**
 * @internal
 * TODO: get rid of dataReference here
 */
function getLocalizedModelTexts(options: {
	contentModelName: string;
	node: ContentModel.Node<BaseControlProps>;
	documentModelName: string;
	dmElement: DocumentModel.Element;
	dataReference: DataReference;
	readonly: boolean;
	required: boolean;
	markingOfRequiredFields?: MarkingOfRequiredFields;
	amountSuffixValue?: string | undefined;
	localizer: Localizer;
}): LocalizedModelTexts {
	const {
		contentModelName,
		node,
		documentModelName,
		dmElement,
		dataReference,
		readonly,
		required,
		markingOfRequiredFields,
		amountSuffixValue,
		localizer
	} = options;

	const documentPath = ModelPath.fromString(dataReference);

	const localizedLabel = getPlainLocalizabledLabel({
		contentModelName,
		nodeId: node.id,
		label: node.props.label,
		documentModelName,
		dmElement,
		documentPath,
		localizer
	});

	// TODO: in the FE the global markingOfRequiredFields has precedence over control setting => is this correct?
	const label = decorateLabel({
		label: localizedLabel,
		readonly,
		required,
		markingOfRequiredFields: node.props.markingOfRequiredFields ?? markingOfRequiredFields
	});

	const hint = localizer(
		localizableFromModel(
			generateLocalizableKey(contentModelName, node.id, "hint"),
			node.props.hint
		),
		...DocumentModelLocalizableFactory.fieldHint(documentModelName, dmElement, documentPath)
	);

	const helperText = localizer(
		...DocumentModelLocalizableFactory.fieldHelperText(documentModelName, dmElement, documentPath)
	);

	const placeholder = localizer(
		localizableFromModel(
			generateLocalizableKey(contentModelName, node.id, "placeholder"),
			node.props.placeholder
		)
	);

	const localizedSuffix = localizer(
		localizableFromModel(
			generateLocalizableKey(contentModelName, node.id, "suffix"),
			node.props.suffix
		)
	);
	const suffix = isAmountField(dmElement)
		? (localizedSuffix ?? amountSuffixValue)
		: localizedSuffix;

	const uncheckedLabel = localizer(
		localizableFromModel(
			generateLocalizableKey(contentModelName, node.id, "uncheckedLabel"),
			node.props.uncheckedLabel
		)
	);
	const checkedLabel = localizer(
		localizableFromModel(
			generateLocalizableKey(contentModelName, node.id, "checkedLabel"),
			node.props.checkedLabel
		)
	);

	return {
		label,
		hint,
		helperText,
		placeholder,
		suffix,
		uncheckedLabel,
		checkedLabel
	};
}

/**
 * @internal
 *
 * Returns the plain localized label of a content model element without an asterisk.
 */
export function getPlainLocalizabledLabel(options: {
	contentModelName: string;
	nodeId: string;
	label?: LocalizedModelText;
	documentModelName: string;
	dmElement: DocumentModel.Element;
	documentPath: ModelPath;
	localizer: Localizer;
}): string | undefined {
	const { contentModelName, nodeId, label, documentModelName, dmElement, documentPath, localizer } =
		options;

	return localizer(
		localizableFromModel(generateLocalizableKey(contentModelName, nodeId, "label"), label),
		...DocumentModelLocalizableFactory.fieldLabel(documentModelName, dmElement, documentPath)
	);
}

function decorateLabel(params: {
	label?: string;
	readonly: boolean;
	required: boolean;
	markingOfRequiredFields?: MarkingOfRequiredFields;
}): string | undefined {
	const { label, readonly, required, markingOfRequiredFields } = params;

	const shouldShowAsterisk =
		!label || readonly
			? false
			: markingOfRequiredFields === "ALWAYS"
				? true
				: markingOfRequiredFields === "NONE"
					? false
					: required;

	return shouldShowAsterisk ? `${label}*` : label;
}

function isAmountField(dmElement?: DocumentModel.Element): boolean {
	return (
		dmElement?.type === "Field" &&
		dmElement.fieldType.type === "NumberType" &&
		dmElement.fieldType.trait === "amount"
	);
}
