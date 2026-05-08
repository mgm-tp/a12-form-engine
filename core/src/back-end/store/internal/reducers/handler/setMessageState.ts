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

import type { Action } from "typescript-fsa";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Modifier } from "@com.mgmtp.a12.client/client-core/lib/core/lenses.js";
import type { LocalizablePlaceholder } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import {
	segmentsFromLocalizableKey,
	type Localizable,
	type Placeholder
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { createLocalizableFactory } from "../../../../localization/internal/localization.js";
import type { Commands } from "../../actions.js";
import { messageStateIsEqual } from "../../messageStateIsEqual.js";
import type { EngineStore, Models } from "../../store.js";

interface LabelProvider {
	(path: ModelPath): Localizable[];
}

/** @internal */
export function handleSetMessageState(
	state: EngineStore.UIState,
	action: Action<Commands.SetMessageStatePayload>,
	models: Models
): EngineStore.UIState {
	const localizableFactory = createLocalizableFactory(models.documentModel, models.formModel);

	// This is where the label fallback of the form engine is applied to kernel validation messages:
	// Any message that contains a localizable referring to a document model label is extended with the respective
	// localizables for field config and control/field column label
	const extendedMessages = addFieldLabelLocalizables(action.payload.messages, p =>
		localizableFactory.formFieldLabel(p)
	);

	return messageStateIsEqual(state.messages, extendedMessages)
		? state
		: {
				...state,
				messages: extendedMessages
			};
}

/** @internal */
export function addFieldLabelLocalizables(
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	labelProvider: LabelProvider
): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	const modifyMessages = rewriteLabelLocalizables(labelProvider);

	return Object.fromEntries(
		Object.entries(messages).map(([key, entry]) => {
			// add localizables in rule messages
			const extendedMessages = modifyMessages(
				(entry?.validationMessages ?? []) as EngineStore.Validation.Message[]
			);

			// add localizables in parsing messages
			const parseErrorMessage = entry?.parseError
				? modifyMessages([entry.parseError.message])
				: undefined;

			const newEntry: {
				validationMessages: EngineStore.Validation.Message[];
				parseError?: EngineStore.Validation.ParseError;
			} = { validationMessages: extendedMessages };
			if (entry?.parseError && parseErrorMessage) {
				newEntry.parseError = { ...entry.parseError, message: parseErrorMessage[0] };
			}

			return [key, newEntry];
		})
	);
}

/**
 * Creates a modifier that finds all "embedded" localizables in Validation.Message.errorText localizables that refer to document model field
 * labels and replaces those embedded localizables (i.e. LocalizableArgs of type "localizable") with three localizables:
 * - form model control/column label localizable
 * - form model field config label localizable
 * - (original) document model element label localizable
 *
 * The respective localizables are identified when their key matches "documentModel.label.<modelName>.<pathToField>".
 */
function rewriteLabelLocalizables(
	labelProvider: LabelProvider
): Modifier<EngineStore.Validation.Message[]> {
	const modifyLocalizable = replaceLocalizableParameters(labelProvider);

	return messages =>
		messages.map(msg => ({
			...msg,
			errorText: msg.errorText.map(modifyLocalizable)
		}));
}

function replaceLocalizableParameters(labelProvider: LabelProvider): Modifier<Localizable> {
	const modifyPlaceholder = replacePlaceholder(labelProvider);

	return localizable =>
		localizable.args
			? {
					...localizable,
					args: Object.fromEntries(
						Object.entries(localizable.args).map(([key, placeholder]) => [
							key,
							modifyPlaceholder(placeholder)
						])
					)
				}
			: localizable;
}

function replacePlaceholder(labelProvider: LabelProvider): Modifier<Placeholder> {
	return p => (p.type === "localizable" ? modifyLocalizablePlaceholder(labelProvider)(p) : p);
}

function modifyLocalizablePlaceholder(
	labelProvider: LabelProvider
): Modifier<LocalizablePlaceholder> {
	return p => ({
		...p,
		properties:
			p.properties.length === 1 && p.properties[0].key.startsWith("documentModel.label.")
				? labelProvider(
						segmentsFromLocalizableKey(p.properties[0].key) // structure is "documentModel.label.<modelName>.<pathToField>"
							.slice(3) // we only need the path to the dm field
							.map(elementName => ({
								elementName
							}))
					)
				: p.properties
	});
}
