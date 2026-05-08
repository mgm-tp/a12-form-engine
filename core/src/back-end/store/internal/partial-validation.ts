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

import type { Dispatch } from "redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { ReadonlyObjectMap } from "../../../models/index.js";
import { findElementByFormModelPath, FormModel } from "../../../models/index.js";
import { DocumentPath } from "../../../models/internal/utils/document-utils.js";

import { Commands } from "./actions.js";
import type { RelevantFieldPaths } from "./collectRelevantFields.js";
import { getEffectiveRelevantFields } from "./getEffectiveRelevantFields.js";
import { messageStateIsEqual } from "./messageStateIsEqual.js";
import type { MiddlewareOptions } from "./middleware/middleware-options.js";
import { DataSelectors } from "./selectors/data.js";
import { ModelSelectors } from "./selectors/models.js";
import { UiStateSelectors } from "./selectors/ui-state.js";
import type { EngineState, EngineStore } from "./store.js";
import { validateElements } from "./validation.js";

/**
 * @internal
 *
 * Function does a partial validation and updates the error messages.
 * If focusFirstError is true it also focuses the first error.
 *
 * @returns true if the update was successful.
 */
export function validatePartlyWithFocusHandling(options: {
	state: EngineState;
	dispatch: Dispatch;
	middlewareOptions: MiddlewareOptions;
	relevantElements: RelevantFieldPaths[];
	focusFirstError?: boolean;
}): boolean {
	const { state, dispatch, middlewareOptions, relevantElements, focusFirstError } = options;
	const formModel = ModelSelectors.formModel()(state);
	const sectionState = UiStateSelectors.sectionState()(state);
	const initialMessages = UiStateSelectors.messages()(state);
	const validatorProvider = ModelSelectors.validationCode()(state);
	const document = DataSelectors.document()(state) as GroupInstance;

	const messages = validateElements({
		document,
		initialMessages,
		now: middlewareOptions.nowProvider?.(state),
		relevantElements: getEffectiveRelevantFields(relevantElements.map(e => e.documentPath)),
		validatorProvider,
		type: "partial"
	});

	if (!messageStateIsEqual(messages, initialMessages)) {
		dispatch(Commands.setMessageState({ messages }));
	}

	const errorPaths = Object.keys(messages)
		.filter(
			path =>
				messages[path]?.parseError ||
				messages[path]?.validationMessages.some(m => m.severity === "ERROR")
		)
		.map(path => DocumentPath.fromString(path));

	if (errorPaths.length > 0) {
		if (focusFirstError) {
			const visibleElements = relevantElements.filter(
				(e): e is { documentPath: EntityInstancePath; formModelPath: ModelPath } =>
					e.formModelPath !== undefined
			);

			const focusedComponent = findFirstErrorElement(
				errorPaths,
				visibleElements,
				sectionState,
				formModel
			);

			if (focusedComponent) {
				dispatch(
					Commands.changeScreenState({
						focusedComponent,
						index: UiStateSelectors.screenLocationStack()(state).length - 1
					})
				);
			}
		}

		return false;
	}

	return true;
}

function findFirstErrorElement(
	errorPaths: EntityInstancePath[],
	visibleFields: { documentPath: EntityInstancePath; formModelPath: ModelPath }[],
	sectionState: ReadonlyObjectMap<boolean>,
	formModel: FormModel
): EngineStore.FocusedComponent | undefined {
	for (const visibleField of visibleFields) {
		const path = errorPaths.find(path => DocumentPath.matches(path, visibleField.documentPath));
		if (path && isReachable(formModel, visibleField.formModelPath, sectionState)) {
			const element = findElementByFormModelPath(formModel, visibleField.formModelPath);
			if (element && FormModel.FieldOverviewColumn.isInstance(element)) {
				return {
					formModelPath: visibleField.formModelPath,
					index: path[path.length - 2].index - 1
				};
			} else if (element && FormModel.Control.isInstance(element)) {
				return {
					formModelPath: visibleField.formModelPath
				};
			}
		}
	}

	return undefined;
}

function isReachable(
	formModel: FormModel,
	elementPath: ModelPath,
	sectionState: ReadonlyObjectMap<boolean>
): boolean {
	for (let i = 0; i < elementPath.length - 1; i++) {
		const path = elementPath.slice(0, i + 1);
		const parent = findElementByFormModelPath(formModel, path);
		if (parent && FormModel.Section.isInstance(parent)) {
			const stateOfSection = sectionState[ModelPath.toString(path)];
			if (stateOfSection === false) {
				return false;
			}
		}
	}

	return true;
}
