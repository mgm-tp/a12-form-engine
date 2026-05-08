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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Locale,
	Localizable
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { findElementByFormModelPath } from "../../../../models/internal/findElementByFormModelPath.js";
import { FormModel } from "../../../../models/internal/form-model.js";
import { DocumentPath } from "../../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../../models/internal/utils/json.js";
import type { LocalizableFactory } from "../../../localization/internal/localization.js";
import { createLocalizableFactory } from "../../../localization/internal/localization.js";

import type { EngineStore, RepeatFilter } from "../store.js";

import { engineState } from "./engineState.js";
import { ModelSelectors } from "./models.js";
import type { Selector } from "./selectors.js";

/**
 * All UI state related selector creators.
 */
export namespace UiStateSelectors {
	/**
	 * @returns a selector that selects the section state
	 */
	export function sectionState(): Selector<ReadonlyObjectMap<boolean>> {
		return state => engineState(state).ui.sectionState;
	}

	/** @returns a selector that selects the ui dirty state. */
	export function dirty(): Selector<boolean> {
		return state => engineState(state).ui.dirty;
	}

	/** @internal @returns a selector that selects the ui userValidation state. */
	export function actionConfirmationRequested(): Selector<
		| {
				actionsToDispatch: Action<object>[];
				validation?: FormModel.ButtonValidationEnum;
		  }
		| undefined
	> {
		return state => engineState(state).ui.actionConfirmationRequested;
	}

	/** @returns a selector that selects the disabled property. */
	export function disabled(): Selector<boolean> {
		return state => engineState(state).ui.disabled;
	}

	/** @returns a selector that selects the readonly property. */
	export function readonly(): Selector<boolean> {
		return state => engineState(state).ui.readonly;
	}

	/** @returns a selector that selects the correction screen state. */
	export function correctionScreenState(): Selector<EngineStore.CorrectionScreenState> {
		return state => engineState(state).ui.correctionScreen;
	}

	/** @returns a selector that selects the validation bar state. */
	export function validationBarState(): Selector<EngineStore.ValidationBarState> {
		return state => engineState(state).ui.validationBar;
	}

	/** @returns a selector that selects the correction mode backup. The backup can be undefined. */
	export function correctionModeBackup(): Selector<EngineStore.CorrectionModeBackup | undefined> {
		return state => engineState(state).ui.correctionModeBackup;
	}

	/** @returns a selector that selects the locale. */
	export function locale(): Selector<Locale> {
		return state => engineState(state).locale;
	}

	/** @returns a selector that selects the column widths map */
	export function columnWidths(): Selector<{ [modelPath: string]: number | undefined }> {
		return state => engineState(state).ui.columnWidths ?? {};
	}

	export const InputLocalization = {
		/**
		 * @param formModelPath The form model path of the input
		 * @param input The form model element
		 * @returns a selector to get the localized label of a control or
		 * field overview column
		 */
		labelLocalizables: (
			formModelPath: ModelPath,
			input: FormModel.FieldBasedInputType
		): Selector<Localizable[]> => {
			return getLocalizablesForFieldBasedInputTypes(
				formModelPath,
				input,
				(localizableFactory, i, fMP) => {
					return localizableFactory.inputLabel(i, fMP);
				}
			);
		},

		/**
		 * @param formModelPath The form model path of the input
		 * @param input The form model element
		 * @returns a selector to get the localized placeholder of a control or
		 * field overview column
		 */
		placeholderLocalizables(
			formModelPath: ModelPath,
			input: FormModel.FieldBasedInputType
		): Selector<Localizable[]> {
			return getLocalizablesForFieldBasedInputTypes(
				formModelPath,
				input,
				(localizableFactory, i, fMP) => {
					return localizableFactory.inputPlaceholder(i, fMP);
				}
			);
		},

		/**
		 * @param formModelPath The form model path of the input
		 * @param input The form model element
		 * @returns a selector to get the localized placeholder of a control or
		 * field overview column
		 */
		hintLocalizables(
			formModelPath: ModelPath,
			input: FormModel.FieldBasedInputType
		): Selector<Localizable[]> {
			return getLocalizablesForFieldBasedInputTypes(
				formModelPath,
				input,
				(localizableFactory, i, fMP) => {
					return FormModel.Control.isInstance(i)
						? localizableFactory.controlHint(i, fMP)
						: localizableFactory.repeatOverviewColumnHint(i, fMP);
				}
			);
		},

		/**
		 * @param formModelPath The form model path of the input
		 * @param input The form model element
		 * @returns a selector to get the localized helper text of a control or
		 * field overview column
		 */
		helperTextLocalizables(
			formModelPath: ModelPath,
			input: FormModel.FieldBasedInputType
		): Selector<Localizable[]> {
			return getLocalizablesForFieldBasedInputTypes(
				formModelPath,
				input,
				(localizableFactory, i) => {
					return FormModel.Control.isInstance(i) ? localizableFactory.controlHelperText(i) : [];
				}
			);
		},

		/**
		 * @param documentModelPath The document model path of the input
		 * @returns a selector to get the localized suffix text of a control or
		 * field overview column
		 */
		suffixTextLocalizables(documentModelPath: ModelPath): Selector<Localizable[]> {
			const selectDocumentModel = ModelSelectors.documentModel();
			const selectFormModel = ModelSelectors.formModel();

			return state => {
				const documentModel = selectDocumentModel(state);
				const formModel = selectFormModel(state);
				const localizableFactory = createLocalizableFactory(documentModel, formModel);

				return localizableFactory.inputSuffix(documentModelPath);
			};
		}
	};

	function getLocalizablesForFieldBasedInputTypes(
		formModelPath: ModelPath,
		input: FormModel.FieldBasedInputType,
		localizables: (
			localizableFactory: LocalizableFactory,
			input: FormModel.FieldBasedInputType,
			formModelPath: ModelPath
		) => Localizable[]
	): Selector<Localizable[]> {
		const selectDocumentModel = ModelSelectors.documentModel();
		const selectFormModel = ModelSelectors.formModel();

		return state => {
			const documentModel = selectDocumentModel(state);
			const formModel = selectFormModel(state);
			const localizableFactory = createLocalizableFactory(documentModel, formModel);

			return localizables(localizableFactory, input, formModelPath);
		};
	}

	/** @returns a selector that selects the validation state. */
	export function messages(): Selector<ReadonlyObjectMap<EngineStore.Validation.Entry>> {
		return state => engineState(state).ui.messages;
	}

	/**
	 * @param documentPath The document path of the input
	 * @param formModelPath The form model path of the input
	 * @param filter The requested severity level
	 * @returns a selector to select the validation messages for one control
	 * or field overview column
	 */
	export function messagesByPath(
		documentPath: EntityInstancePath,
		formModelPath: ModelPath,
		filter?: Lowercase<EngineStore.Validation.MessageSeverity>
	): Selector<EngineStore.Validation.Message[]> {
		const selectMessages = UiStateSelectors.messages();
		return state => {
			const allMessages = selectMessages(state);
			const messagesForField = filterMessagesByPath(allMessages, documentPath);

			return filter
				? messagesForField.filter(m => m.severity === filter.toUpperCase())
				: messagesForField;
		};
	}

	/**
	 * @returns a selector that selects the current backup from the state.
	 * @throws  If no backup exists.
	 */
	export function currentBackup(): Selector<EngineStore.BackupEntry> {
		return state => {
			const stack = engineState(state).ui.backup;
			if (stack === undefined || stack.length === 0) {
				throw new Error("no backup available");
			}

			return stack[stack.length - 1];
		};
	}

	/**
	 * @returns a selector that selects all backups.
	 */
	export function backupStack(): Selector<ReadonlyArray<EngineStore.BackupEntry>> {
		return state => engineState(state).ui.backup;
	}

	/**
	 * @returns a selector that selects the data-independent repeat state object from the ui state
	 */
	export function repeatStaticState(): Selector<
		ReadonlyObjectMap<EngineStore.Repeat.StaticState> | undefined
	> {
		return state => engineState(state).ui.repeatStaticState;
	}

	/**
	 * @returns a selector that selects the data-related repeat state object from the current screen location
	 */
	export function repeatInstanceState(): Selector<
		ReadonlyObjectMap<EngineStore.Repeat.InstanceState> | undefined
	> {
		const currentScreenLocationSelector = currentScreenLocation();
		return state => currentScreenLocationSelector(state).repeatInstanceState;
	}

	/**
	 * @returns a selector that selects the data-independent ui state of a repeat identified by a model path
	 */
	export function repeatStaticStateEntry(
		identifier: ModelPath
	): Selector<EngineStore.Repeat.StaticState | undefined> {
		return state => {
			return engineState(state).ui.repeatStaticState?.[ModelPath.toString(identifier)];
		};
	}

	/** @internal */
	export function repeatFilterById(
		columnId: string,
		repeatFormModelPath: ModelPath
	): Selector<RepeatFilter | undefined> {
		return state => repeatStaticStateEntry(repeatFormModelPath)(state)?.filters?.[columnId]?.filter;
	}

	/**
	 * @returns a selector that selects the data-related ui state of a repeat identified by a model path
	 */
	export function repeatInstanceStateEntry(
		identifier: ModelPath
	): Selector<EngineStore.Repeat.InstanceState | undefined> {
		const currentScreenLocationSelector = currentScreenLocation();

		return state => {
			return currentScreenLocationSelector(state).repeatInstanceState?.[
				ModelPath.toString(identifier)
			];
		};
	}

	/**
	 * @returns a selector that selects the current screen location from the state.
	 * @throws If location stack is empty.
	 */
	export function currentScreenLocation(): Selector<EngineStore.ScreenState> {
		return state => {
			const stack = engineState(state).ui.screenLocation;

			if (stack.length === 0) {
				throw new Error("Location stack is empty");
			}

			return stack[stack.length - 1];
		};
	}

	/** @internal */
	export function currentScreen(): Selector<FormModel.Screen> {
		return state => {
			const formModel = ModelSelectors.formModel()(state);
			const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);

			const topLevelScreen = findElementByFormModelPath(
				formModel,
				currentScreenLocation.locationPath
			);
			if (topLevelScreen !== undefined && FormModel.Screen.isInstance(topLevelScreen)) {
				return topLevelScreen;
			}

			throw new Error(
				`Internal Error: Screen "${ModelPath.toString(
					currentScreenLocation.locationPath
				)}" was not found!`
			);
		};
	}

	/**
	 * @returns a selector that selects the location stack, which has a length of n.
	 * The first n-1 elements, can reference screens (top level or detached repeat detail screen).
	 * The last element can reference a screen or an embedded repeat detail-control grid.
	 */
	export function screenLocationStack(): Selector<ReadonlyArray<EngineStore.ScreenState>> {
		return state => engineState(state).ui.screenLocation;
	}

	/** @internal */
	export function isDetachedRepeatDetailScreenOpen(): Selector<boolean> {
		return state => screenLocationStack()(state).length > 1;
	}

	/** @internal */
	export type SortingOrder = "asc" | "desc" | "none";

	/** @internal */
	export function getCurrentSortingState(
		repeatFormModelPath: ModelPath
	): Selector<EngineStore.Repeat.SortingState | undefined> {
		const formModelSelector = ModelSelectors.formModel();
		return state => {
			const formModel = formModelSelector(state);
			const repeat = findElementByFormModelPath(formModel, repeatFormModelPath);
			if (repeat === undefined || !FormModel.Repeat.isInstance(repeat)) {
				return undefined;
			}

			let sortingState =
				UiStateSelectors.repeatStaticStateEntry(repeatFormModelPath)(state)?.sortingState;

			if (sortingState === undefined && repeat.initialSorting !== undefined) {
				const col =
					repeat.repeatOverviewColumn &&
					repeat.repeatOverviewColumn.find(c => c.id === repeat.initialSorting);

				if (col) {
					const orderPath = FormModel.FieldOverviewColumn.isInstance(col)
						? [...repeatFormModelPath, { elementName: col.id }]
						: [...repeatFormModelPath, { elementName: col.name }];
					sortingState = {
						orderPath,
						sorting: col.preferredSorting
							? (col.preferredSorting.toLowerCase() as SortingOrder)
							: "asc"
					};
				}
			}

			return sortingState;
		};
	}
}

/**
 * @internal
 * Function to retrieve the validation message or parsing error of
 * a field in the document
 * @param messages The messages which should be filtered
 * @param documentPath The document path of the field
 */
export function filterMessagesByPath(
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	documentPath: EntityInstancePath
): EngineStore.Validation.Message[] {
	const stringPath = DocumentPath.toStringOrRegExp(documentPath);
	const messageByPath: EngineStore.Validation.Message[] = [];

	for (const [key, message] of ReadonlyObjectMap.entries(messages)) {
		const startsWith =
			typeof stringPath === "string" ? key.startsWith(stringPath) : key.match(stringPath);

		if (startsWith) {
			if (message.parseError !== undefined) {
				messageByPath.push(message.parseError.message);
			} else if (message.validationMessages !== undefined) {
				messageByPath.push(...message.validationMessages.map(val => val));
			}
		}
	}
	return messageByPath;
}
