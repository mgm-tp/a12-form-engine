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

import type { Modifier } from "@com.mgmtp.a12.client/client-core/lib/core/lenses.js";
import type {
	Document,
	DocumentValidationResult,
	EntityInstancePath,
	GroupInstance,
	IGeneratedCodeAccessor,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentRtServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

import type { FormModel } from "../../../models/index.js";
import { DocumentPath } from "../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";
import { assertExists } from "../../utils/internal/assertions.js";

import { collectRelevantFields } from "./collectRelevantFields.js";
import { isFieldGlobal, mapMessageTypes } from "./kernel-adapter.js";
import type { MiddlewareOptions } from "./middleware/middleware-options.js";
import { DataSelectors } from "./selectors/data.js";
import { ModelSelectors } from "./selectors/models.js";
import type { Selector } from "./selectors/selectors.js";
import { filterMessagesByPath, UiStateSelectors } from "./selectors/ui-state.js";
import type { EngineState } from "./store.js";
import { EngineStore } from "./store.js";

/**
 * @internal
 *
 * Validates the given set of relevant elements.
 *
 * The returned validation entries are combined from the given initial messages and what the validation returned.
 * The given validation type is used to determine which messages have to be reset/removed.
 */
export function validateElements(options: {
	document: GroupInstance;
	initialMessages: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	now?: Date;
	relevantElements: EntityInstancePath[];
	type: "full" | "partial" | "field";
	validatorProvider?: IGeneratedCodeAccessor;
}): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	const { document, initialMessages, now, relevantElements, type, validatorProvider } = options;

	if (relevantElements.length === 0) {
		return initialMessages;
	}
	assertExists(validatorProvider, "partial validation requires A12 Kernel validation code");

	const documentService = DocumentRtServiceFactory.createDocumentRtService(validatorProvider, {
		currentDateForTest: now,
		ignoreUnknownFields: true
	});

	const existingErrors = findExistingFormalErrors(initialMessages);
	const validationResult = documentService.validatePart(
		document as Document,
		relevantElements,
		existingErrors.errorValuesToConsider
	);

	const validationMessages = filterAndMapMessageType(
		validationResult,
		existingErrors.fieldsWithParseErrors
	);
	return updateValidationEntries(
		initialMessages,
		validationMessages,
		relevantElements,
		validatorProvider,
		type
	);
}

/**
 * @internal
 *
 * Returns the highest severity of messages for relevant fields (depending on
 * given validation type).
 */
export const significantMessageSeveritySelector: (
	validation: FormModel.ButtonValidationEnum
) => Selector<EngineStore.Validation.MessageSeverity | undefined> = validation => state => {
	const relevantFields =
		validation === "partial"
			? collectRelevantFields(state).map(field => field.documentPath)
			: undefined;
	return significantSeverity(UiStateSelectors.messages()(state), relevantFields);
};

/**
 * @internal
 *
 * Returns the highest severity within the given messages.
 *
 * In addition, it is possible to restrict the range of entries by a list of
 * `EntityInstancePath`s.
 */
export function significantSeverity(
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	paths?: EntityInstancePath[]
): EngineStore.Validation.MessageSeverity | undefined {
	const identifiers = paths ?? Object.keys(messages).map(DocumentPath.fromString);

	for (const path of identifiers) {
		if (filterMessagesByPath(messages, path).some(EngineStore.Validation.Message.isError)) {
			return "ERROR";
		}
	}

	for (const path of identifiers) {
		if (filterMessagesByPath(messages, path).some(EngineStore.Validation.Message.isWarning)) {
			return "WARNING";
		}
	}

	for (const path of identifiers) {
		if (filterMessagesByPath(messages, path).some(EngineStore.Validation.Message.isInfo)) {
			return "INFO";
		}
	}

	return undefined;
}

/**
 * @internal
 *
 * Returns all validation messages for relevant fields (depending on
 * given validation type).
 */
export const relevantMessagesSelector: (
	validation?: FormModel.ButtonValidationEnum
) => Selector<EngineStore.Validation.Message[]> = validation => state => {
	const messages = UiStateSelectors.messages()(state);

	const relevantPaths =
		validation === "partial"
			? collectRelevantFields(state).map(field => field.documentPath)
			: Object.keys(messages).map(DocumentPath.fromString);
	return relevantPaths.flatMap(path => filterMessagesByPath(messages, path));
};

/**
 * @internal
 *
 * Validates a message state. If it contains any parsing error or validation
 * message with severity `"Error"`, it returns false. In addition, it is
 * possible to restrict the range of entries by a list of `EntityInstancePath`s.
 */
export function valid(
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	paths?: EntityInstancePath[]
): boolean {
	function isError({ severity }: EngineStore.Validation.Message): boolean {
		return severity === "ERROR";
	}

	const identifiers =
		paths ?? Array.from(ReadonlyObjectMap.keys(messages)).map(DocumentPath.fromString);

	for (const path of identifiers) {
		if (filterMessagesByPath(messages, path).some(isError)) {
			return false;
		}
	}

	return true;
}

/**
 * @internal
 *
 * Executes the full validation and returns the error messages
 */
export function fullValidation(
	state: EngineState,
	middlewareOptions: MiddlewareOptions
): EngineStore.Validation.Message[] {
	const validatorProvider = ModelSelectors.validationCode()(state);
	assertExists(validatorProvider, "full validation requires A12 Kernel validation code");
	const document = DataSelectors.relevantDocument()(state) as Document;

	const documentService = DocumentRtServiceFactory.createDocumentRtService(validatorProvider, {
		currentDateForTest: middlewareOptions.nowProvider?.(state),
		ignoreUnknownFields: true
	});

	const messages = UiStateSelectors.messages()(state);
	const existingErrors = findExistingFormalErrors(messages);
	const validationResult = documentService.validateFull(
		document,
		existingErrors.errorValuesToConsider
	);
	return filterAndMapMessageType(validationResult, existingErrors.fieldsWithParseErrors);
}

function findExistingFormalErrors(messages: ReadonlyObjectMap<EngineStore.Validation.Entry>) {
	// this map will be used to pass already (formally) incorrect fields to the kernel
	const errorValuesToConsider = new Map<EntityInstancePath, string>();
	// this list is to filter out the validation results for those already incorrect fields later on
	const fieldsWithParseErrors: string[] = [];
	Object.entries(messages).forEach(([path, message]) => {
		const value = message?.parseError?.value;
		if (value) {
			const documentPath = DocumentPath.fromString(path);
			errorValuesToConsider.set(documentPath, value);
			fieldsWithParseErrors.push(path);
		}
	});
	return {
		errorValuesToConsider,
		fieldsWithParseErrors
	};
}

function filterAndMapMessageType(
	result: DocumentValidationResult,
	fieldsWithParseErrors: string[]
): EngineStore.Validation.Message[] {
	const isNotExistingFormalError = (message: Message) => {
		return !(
			fieldsWithParseErrors.includes(DocumentPath.toString(message.entityInstance)) &&
			message.rulePath === "formalePruefung"
		);
	};

	return (
		result.messages
			// we have to remove all formal errors from the result that were already present before the validation
			.filter(isNotExistingFormalError)
			// now we have to map to our validation entry structure for the redux store
			.map(mapMessageTypes)
	);
}

/** @internal */
export function updateValidationEntries(
	messagesFromStore: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	currentValidationErrors: EngineStore.Validation.Message[],
	instances: EntityInstancePath[],
	validatorProvider: IGeneratedCodeAccessor,
	type: "full" | "partial" | "field"
): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	type Entry = EngineStore.Validation.Entry;
	type Mutation = [string, (entry: Entry | undefined) => Entry | undefined];

	const stringPaths = instances.map(DocumentPath.toStringOrRegExp);

	const shouldMessageBeRemoved = (path: string): boolean => {
		if (type === "full") {
			return true;
		}
		const isGlobal = isFieldGlobal(validatorProvider, DocumentPath.fromString(path));
		const matchesExistingPaths = (existing: string | RegExp): boolean => {
			return typeof existing === "string" ? path.startsWith(existing) : !!path.match(existing);
		};
		return isGlobal || stringPaths.some(matchesExistingPaths);
	};

	const identifiers = Array.from(ReadonlyObjectMap.keys(messagesFromStore)).filter(
		shouldMessageBeRemoved
	);

	const mutations = [
		/**
		 * Resets the validation messages for every entry
		 * For "field" validation, also remove parse errors
		 */
		...identifiers.map<Mutation>(identifier => [
			identifier,
			oldEntry =>
				type !== "field" && oldEntry?.parseError !== undefined
					? { validationMessages: [], parseError: oldEntry.parseError }
					: undefined
		]),
		// Sets new validation messages from the validation result
		...currentValidationErrors.map<Mutation>(message => [
			DocumentPath.toString(message.element),
			entry => {
				return EngineStore.Validation.Entry.merge(entry, { validationMessages: [message] });
			}
		])
	];

	return mutate(messagesFromStore, mutations);
}

/**
 * Mutates the validation state by a list of key and mutator function tuples.
 */
function mutate(
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	mutations: [string, Modifier<EngineStore.Validation.Entry | undefined>][]
): ReadonlyObjectMap<EngineStore.Validation.Entry> {
	return mutations.reduce((result, [key, mutator]) => {
		const { [key]: oldEntry, ...others } = result;
		const newEntry = mutator(oldEntry);

		if (oldEntry === newEntry) {
			return result;
		} else if (newEntry !== undefined) {
			return { ...others, [key]: newEntry };
		} else {
			return others;
		}
	}, messages);
}
