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

import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance,
	IGeneratedCodeAccessor
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type {
	Locale,
	Localizable,
	ValueConversionParseError
} from "@com.mgmtp.a12.utils/utils-localization";

import type { FormModel } from "../../../models/internal/form-model.js";
import * as DocumentModelUtils from "../../../models/internal/utils/document-model-utils.js";
import { DocumentPath } from "../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";

import type { DataSelectors } from "./selectors/data.js";
import type { ModelSelectors } from "./selectors/models.js";
import type { UiStateSelectors } from "./selectors/ui-state.js";

/**
 * This type declares the slices used by the Engine.
 * The provided selectors should be used to access it!
 */
export interface EngineState {
	/**
	 * Slice which contains the data.
	 * Use the {@link DataSelectors} selector to access it.
	 */
	readonly data: EngineStore.DataState;

	/**
	 * Slice which contains the models.
	 * Use the {@link ModelSelectors} selector to access it.
	 */
	readonly models: Models;

	/**
	 * Slice which contains the state of the ui.
	 * Use the {@link UiStateSelectors} selector to access it.
	 */
	readonly ui: EngineStore.UIState;

	/** Slice which contains the locale. */
	readonly locale: Locale;
}

export namespace EngineStore {
	/** Returns an object of type T depending on the current state. */
	export interface Provider<T> {
		(state: EngineState): T;
	}

	/** The data state */
	export interface DataState {
		/**
		 * Is set to true if at least one value in the UI changed.
		 */
		readonly dirty: boolean;

		/** The current document. */
		readonly document: object;

		/** Stores loading state, unassigned ids and thumbnails */
		readonly attachmentState?: EngineStore.AttachmentState;
	}

	export interface AttachmentState {
		readonly loading?: ModelPath;
		readonly unassigned?: string[];
		readonly thumbnails?: Record<string, string>;
	}

	/**
	 * The UI state.
	 */
	export interface UIState {
		/**
		 * Is set to true if `earlyDetectDirtyControl` is set
		 * and at least one input was touched.
		 */
		readonly dirty: boolean;

		/**
		 * @internal
		 *
		 * Contains the validation type and a number of actions
		 * to dispatch depending on whether or not the user wants to react
		 * to info or warning messages from the validation.
		 *
		 * Note: This is only in state because we currently have no Sagas in FE.
		 * Otherwise, it would be a transient state inside the Saga. For this
		 * reason, it is marked internal.
		 */
		readonly actionConfirmationRequested?: {
			readonly actionsToDispatch: Action<object>[];
			readonly validation?: FormModel.ButtonValidationEnum;
		};

		/**
		 * Sets the entire view of the Form-Engine disabled.
		 *
		 * Note: In the FormState this is called setEnabled().
		 */
		readonly disabled: boolean;

		/**
		 * Sets the entire view of the Form-Engine read only.
		 *
		 * Note: In the FormState this is called setEditable().
		 */
		readonly readonly: boolean;

		/**
		 * A map of booleans whether a certain collapsible section is collapsed.
		 * The keys are the ids of the section elements.
		 */
		readonly sectionState: ReadonlyObjectMap<boolean>;

		/**
		 * The correction screen state contains information
		 * about the state of the correction screen.
		 * This includes if the screen is visible.
		 */
		readonly correctionScreen: CorrectionScreenState;

		/**
		 * The validation bar state contains information
		 * about the state of the validation bar.
		 * This includes if the bar is visible.
		 */
		readonly validationBar: ValidationBarState;

		/**
		 * Data and validation state backup,
		 * that is created before a detached repeat detail screen
		 * is entered.
		 */
		readonly backup: ReadonlyArray<EngineStore.BackupEntry>;

		/**
		 * The current screen location which is defined by a stack
		 * of screen states.
		 */
		readonly screenLocation: ReadonlyArray<EngineStore.ScreenState>;

		/**
		 * View state backup, that is created before the correction mode is enabled.
		 */
		readonly correctionModeBackup?: EngineStore.CorrectionModeBackup;

		/**
		 * The current validation state.
		 * The object maps from the DocumentPath (as string) of the affected field instance
		 * to the validation entry that contains the (error) messages.
		 */
		readonly messages: ReadonlyObjectMap<Validation.Entry>;

		/** Current width of repeat columns */
		readonly columnWidths?: { [modelPath: string]: number | undefined };

		/**
		 * The data-independent ui state of the repeats inside the form.
		 * The object maps from a repeat's form model path to its state.
		 */
		readonly repeatStaticState?: ReadonlyObjectMap<Repeat.StaticState>;
	}

	/**
	 * View state backup, that is created before the correction mode is enabled.
	 */
	export interface CorrectionModeBackup {
		/**
		 * A map of booleans whether a certain collapsible section is collapsed.
		 * The keys are the ids of the section elements.
		 */
		readonly sections: ReadonlyObjectMap<boolean>;

		/**
		 * Current location and state of the current view.
		 *
		 * It provides also information about the nesting of the current screen.
		 */
		readonly location: ReadonlyArray<ScreenState>;

		/**
		 * Backup of the current data-independent state of the repeats inside
		 * the form.
		 * The object maps from a repeat's form model path to its
		 * data-independent ui state.
		 */
		readonly repeatStaticState?: ReadonlyObjectMap<Repeat.StaticState>;

		/**
		 * Current backups of document and messages
		 */
		readonly backups?: ReadonlyArray<EngineStore.BackupEntry>;
	}

	/**
	 * View state of the correction screen
	 */
	export interface CorrectionScreenState {
		/** If set to true than the correction screen is visible. */
		readonly visible: boolean;
		/** Map of boolean whether details are shown for a certain validation message */
		readonly showDetailsState: { [key: string]: boolean };
	}

	/**
	 * View state of the validation bar
	 */
	export interface ValidationBarState {
		/** If set to true than the validation bar is visible */
		readonly visible: boolean;
		/**
		 * On desktop: The validation bar will show details below.
		 * On mobile: An overview or issue details will be shown in a modal overlay.
		 */
		readonly expanded: boolean;

		/**
		 * On desktop: Last issue that was shown in the validation bar.
		 * On mobile: Issue that is shown in the mobile validation bar view.
		 */
		readonly currentMessageKey: string | undefined;
	}

	/**
	 * View state of a screen
	 * The screen state can point to a FormModel.Screen or a FormModel.ControlGrid.
	 */
	export interface ScreenState {
		/** Data context of the screen */
		readonly path: EntityInstancePath;

		/**
		 * The form model path to the screen.
		 */
		readonly locationPath: ModelPath;

		/**
		 * The data related ui state of the repeats inside this screen.
		 */
		readonly repeatInstanceState?: ReadonlyObjectMap<Repeat.InstanceState>;

		/**
		 * This component will be focused the next time the view updated.
		 *
		 * Typical use cases are:
		 * * Return to repeats after leaving their detail screen
		 * * Going to controls with issues
		 */
		readonly focusedComponent?: FocusedComponent;

		/**
		 * @internal
		 *
		 * Number of focus component requests.
		 * It is used to identify if the same component shall be focused again when rerendering the `ScrollHandler`.
		 * This is only a temporary solution until we found a way to remove the focusedComponent from the store.
		 */
		readonly focusedComponentRequestCount?: number;

		/**
		 * Whether or not the data in the current screen changed.
		 * This flag is used in detached-repeat detail screens to evaluate
		 * the enablement of the commit button and to decide if dirty handling
		 * is necessary, when clicking the cancel button.
		 * Therefore it is only set for detached-repeat detail screens.
		 */
		readonly dirty?: boolean;
	}

	/**
	 * Data structure for a focused control
	 */
	export interface FocusedComponent {
		/**
		 * Form model path to the control
		 */
		readonly formModelPath: ModelPath;
		/** Optional document index to focus controls inside a table */
		readonly index?: number;

		/**
		 * @internal
		 * Defining which part in the application should be scrolled to and focused
		 * if they can not be expressed by a form-model path.
		 * form: Top of form
		 * validation-bar: The validation bar
		 * validation-bar-content: The content of a expanded message
		 * correction-screen-bar: The validation bar on top of the correction screen.
		 * expanded-row: The expanded row in an embedded repeat
		 */
		readonly subElement?:
			| "current-screen"
			| "validation-bar"
			| "correction-screen-bar"
			| "repeat-edit"
			| "repeat-add"
			| "expanded-row";
	}

	/**
	 * Validation related structures
	 */
	export namespace Validation {
		/**
		 * Data structure for a validation message.
		 */
		export interface Message {
			/** A key to identify the kind of error, e.g. for localization */
			readonly errorKey: string;

			/** A localizable error message. */
			readonly errorText: Localizable[];

			/** The (main) element in the document to which the message is associated. */
			readonly element: EntityInstancePath;

			/** All fields in the document that are related to the message. */
			readonly referencedFields: ReadonlyArray<EntityInstancePath>;
			readonly errorCode: string;

			readonly severity: MessageSeverity;
		}

		export type MessageSeverity = "ERROR" | "WARNING" | "INFO";

		export namespace Message {
			/**
			 * @internal
			 * @param the message
			 * @returns whether or not the message has an "ERROR" severity
			 */
			export function isError({ severity }: EngineStore.Validation.Message): boolean {
				return severity === "ERROR";
			}

			/**
			 * @internal
			 * @param the message
			 * @returns whether or not the message has a "WARNING" severity
			 */
			export function isWarning({ severity }: EngineStore.Validation.Message): boolean {
				return severity === "WARNING";
			}

			/**
			 * @internal
			 * @param the message
			 * @returns whether or not the message has an "INFO" severity
			 */
			export function isInfo({ severity }: EngineStore.Validation.Message): boolean {
				return severity === "INFO";
			}

			/**
			 * @internal
			 *
			 * Compares the messages by the document path of the "error field" and the errorKey.
			 * The errorKey is the name of the validation rule that fired or "formalValidation" for formal type checks.
			 */
			export function areEqual(
				left: EngineStore.Validation.Message,
				right: EngineStore.Validation.Message
			): boolean {
				return DocumentPath.equal(left.element, right.element) && left.errorKey === right.errorKey;
			}

			/**
			 * @internal
			 * Function to update the paths for messages
			 * This function is called if a row is removed or moved
			 * @param messages The messages which need to be updated.
			 * If you do not supply a delta all messages referencing a row with index > rowIndex will be updated
			 * by setting the index to index - 1.
			 * If you removed a row, you need to remove all belonging messages before from this object.
			 * @param repeatableGroupInstancePath The row instance which is moved or removed
			 * @param documentModel The documentModel
			 * @param delta An optional delta which needs to be given a a row is moved.
			 */
			export function updateMessagesPaths(
				messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
				repeatableGroupInstancePath: EntityInstancePath,
				documentModel: DocumentModel,
				delta?: number
			): ReadonlyObjectMap<EngineStore.Validation.Entry> {
				let newMessages: ReadonlyObjectMap<EngineStore.Validation.Entry> = {};

				for (const [path, message] of ReadonlyObjectMap.entries(messages)) {
					const elementPath = DocumentPath.fromString(path);

					const newPath = calculateNewPathForElementIfNeeded(
						documentModel,
						repeatableGroupInstancePath,
						elementPath,
						delta
					);
					const newEntry = replaceIdentifier(
						documentModel,
						message,
						repeatableGroupInstancePath,
						delta
					);
					newMessages = { ...newMessages, [DocumentPath.toString(newPath)]: newEntry };
				}
				return newMessages;
			}

			/**
			 * @internal (only exported for tests)
			 */
			export function calculateNewIndex(
				changedRowIndex: number,
				referencedRowIndex: number,
				delta?: number
			): number {
				// Remove case
				if (delta === undefined) {
					return referencedRowIndex > changedRowIndex ? referencedRowIndex - 1 : referencedRowIndex;
				}

				// Move case
				const newPosition = changedRowIndex + delta;
				if (referencedRowIndex === changedRowIndex) {
					return newPosition;
				}

				if (referencedRowIndex === newPosition) {
					return referencedRowIndex - delta;
				}

				return referencedRowIndex;
			}

			/**
			 * Returns true if elementPath is a child of repeatableGroupInstancePath
			 * or one of its siblings.
			 *
			 * Note: Because we do not support the all index "0" in the path
			 * (/root/R1[1]/.../RN-1[2]/RN[0]), we have to check the context path
			 * of the parent as well as the instance path of its parent.
			 *
			 * Examples:
			 *
			 * 1:
			 * 		repeatableGroupInstancePath: /root/R1[1]/G1/R2[1]
			 * 		elementPath:  				/root/R1[1]/G1/R2[2]  --> returns true
			 *
			 * 2:
			 * 		repeatableGroupInstancePath: /root/R1[1]/G1/R2[1]
			 * 		elementPath:  				/root/R1[2]/R2[2]  --> returns false
			 *
			 * 3:
			 * 		repeatableGroupInstancePath: /root/R1[1]
			 * 		elementPath:  				 /root/R1[2]/F6  --> returns true
			 *
			 *  4:
			 * 		repeatableGroupInstancePath: /root/R1[1]
			 * 		elementPath:  				/root/R2[2]/N1  --> returns false
			 *
			 */
			function isPartOfRepeatableGroup(
				documentModel: DocumentModel,
				repeatableGroupInstancePath: EntityInstancePath,
				elementPath: EntityInstancePath
			): boolean {
				const repeatableGroupPath = DocumentModelUtils.computeGranularity(
					documentModel,
					elementPath
				);
				if (repeatableGroupPath.length <= 0) {
					return false;
				}

				if (!ModelPath.equal(repeatableGroupInstancePath, repeatableGroupPath)) {
					return false;
				}

				const contextGroupPath = DocumentModelUtils.computeGranularity(
					documentModel,
					repeatableGroupPath.slice(0, repeatableGroupPath.length - 1)
				);

				return DocumentPath.equal(
					elementPath.slice(0, contextGroupPath.length),
					repeatableGroupInstancePath.slice(0, contextGroupPath.length)
				);
			}

			function calculateNewPathForElementIfNeeded(
				documentModel: DocumentModel,
				repeatableGroupInstancePath: EntityInstancePath,
				elementPath: EntityInstancePath,
				delta?: number
			): EntityInstancePath {
				if (!isPartOfRepeatableGroup(documentModel, repeatableGroupInstancePath, elementPath)) {
					return elementPath;
				}

				const elementContextGroupPath = DocumentModelUtils.computeGranularity(
					documentModel,
					elementPath
				);
				const referencedRowIndex = elementPath[elementContextGroupPath.length - 1].index;
				const changedRowIndex =
					repeatableGroupInstancePath[repeatableGroupInstancePath.length - 1].index;
				const newIndex = calculateNewIndex(changedRowIndex, referencedRowIndex, delta);

				return [
					...elementPath.slice(0, elementContextGroupPath.length - 1),
					{
						elementName: elementPath[elementContextGroupPath.length - 1].elementName,
						index: newIndex
					},
					...elementPath.slice(elementContextGroupPath.length)
				];
			}

			function replaceIdentifier(
				documentModel: DocumentModel,
				message: EngineStore.Validation.Entry,
				rowPath: EntityInstancePath,
				delta?: number
			): EngineStore.Validation.Entry {
				function replaceIdentifierIfNeeded(pathToUpdate: EntityInstancePath): EntityInstancePath {
					return calculateNewPathForElementIfNeeded(documentModel, rowPath, pathToUpdate, delta);
				}
				function replaceIdentifierInMessage({
					element,
					referencedFields,
					...others
				}: EngineStore.Validation.Message): EngineStore.Validation.Message {
					return {
						...others,
						element: replaceIdentifierIfNeeded(element),
						referencedFields: referencedFields.map(replaceIdentifierIfNeeded)
					};
				}
				const validationMessages = message.validationMessages.map(replaceIdentifierInMessage);
				return message.parseError !== undefined
					? {
							validationMessages,
							parseError: {
								...message.parseError,
								message: replaceIdentifierInMessage(message.parseError.message)
							}
						}
					: { validationMessages };
			}
		}

		/**
		 * A message entry which consists of a set of {@link EngineStore.Validation.Message}
		 * and an optional {@link ParseError}.
		 */
		export interface Entry {
			readonly validationMessages: ReadonlyArray<EngineStore.Validation.Message>;
			readonly parseError?: ParseError;
		}

		export namespace Entry {
			/** @internal */
			export function isError(
				{ parseError, validationMessages }: EngineStore.Validation.Entry = {
					validationMessages: []
				}
			): boolean {
				return (
					parseError !== undefined ||
					validationMessages.some(EngineStore.Validation.Message.isError)
				);
			}

			/** @internal */
			export function extractMessages(
				validationEntries: ReadonlyObjectMap<EngineStore.Validation.Entry>
			): EngineStore.Validation.Message[] {
				return Object.values(validationEntries).flatMap(entry => {
					const messages = [...(entry?.validationMessages ?? [])];
					if (entry?.parseError) {
						messages.push(entry.parseError.message);
					}
					return messages;
				});
			}

			/** @internal */
			export function assign(...entries: (Entry | undefined)[]): Entry {
				return entries.reduce<Entry>((m1, m2) => (m2 !== undefined ? { ...m1, ...m2 } : m1), {
					validationMessages: []
				});
			}

			/**
			 * @internal
			 *
			 * Similar to ``MessageEntry.assign`` but merges the properties instead of
			 * the object itself.
			 */
			export function merge(...entries: (Entry | undefined)[]): Entry {
				return entries.reduce<Entry>(
					(m1, m2) =>
						m2 !== undefined
							? {
									...m1,
									...m2,
									validationMessages: [...m1.validationMessages, ...m2.validationMessages]
								}
							: m1,
					{ validationMessages: [] }
				);
			}
		}

		/**
		 * Contains an error message as well as the value that caused the error.
		 */
		export interface ParseError {
			readonly message: EngineStore.Validation.Message;
			readonly value: string;
		}
	}

	export namespace Repeat {
		/**
		 * View state of a repeat.
		 */
		export interface Entry extends InstanceState, StaticState {}

		/**
		 * View state of a repeat related to a concrete EntityInstance.
		 */
		export interface InstanceState {
			/** The current page which is shown. */
			readonly page?: number;
			/** The state of an active new row. */
			readonly newRow?: NewRow;
			/** Document path of the currently expanded row */
			readonly expandedRowPath?: EntityInstancePath;
			/** For embedded repeats, the document at the point a row is expanded */
			readonly tableInteractionDocument?: GroupInstance;
		}

		/**
		 * Data-independent View state of a repeat.
		 */
		export interface StaticState {
			/** The current sorting state */
			readonly sortingState?: SortingState;
			/** Whether the filter row is open or not */
			readonly filterRowOpen?: boolean;

			/** The current active filters. */
			readonly filters?: { [columnId: string]: FilterEntry | undefined };
		}

		/**
		 * The state of a filter entry.
		 */
		export interface FilterEntry {
			/** The form model path to the column, which should be filtered. */
			readonly columnPath: ModelPath;
			/** The current filter. */
			readonly filter: RepeatFilter;
		}

		/**
		 * The state of an active new row.
		 */
		export interface NewRow {
			/** Document path to the new row. */
			readonly rowPath: EntityInstancePath;
			readonly rowState: "workingOn" | "recentlyAdded";
		}

		/**
		 * The current sorting state.
		 */
		export interface SortingState {
			/**
			 * The form model path to the column, by which the data should be sorted
			 */
			readonly orderPath: ModelPath;
			readonly sorting?: "asc" | "desc" | "none";
		}
	}

	/**
	 * A backup for the document and validation messages.
	 * The data structure is the same as for the original
	 * objects.
	 */
	export interface BackupEntry {
		readonly document: object;
		readonly messages: ReadonlyObjectMap<Validation.Entry>;
	}
}

/**
 * Function to compare two {@link EngineStore.FocusedComponent}s.
 * @returns true if the given components are equal
 */
export function areFocusedComponentsEqual(
	f1: EngineStore.FocusedComponent | undefined,
	f2: EngineStore.FocusedComponent | undefined
): boolean {
	return (
		f1 === f2 ||
		(f1 !== undefined &&
			f2 !== undefined &&
			f1.index === f2.index &&
			ModelPath.equal(f1.formModelPath, f2.formModelPath) &&
			f1.subElement === f2.subElement)
	);
}

/**
 * Data structure for the models
 */
export interface Models {
	/** The document model */
	readonly documentModel: DocumentModel;
	/**
	 * The in-memory representation of the form model.
	 * It contains all information from the persistence
	 * model, as well as additional information like
	 * the path to a referenced field.
	 */
	readonly formModel: FormModel;
	// It's ok to store this set of functions here because it is self-contained
	// It does not enclosure any state outside the function(s)
	/** The validation code accessor. */
	readonly validatorProvider?: IGeneratedCodeAccessor;
}

/**
 * Type for repeat filters.
 */
export type RepeatFilter =
	| NumberRepeatFilter
	| StringRepeatFilter
	| BooleanRepeatFilter
	| EnumerationRepeatFilter
	| DateRepeatFilter
	| DateRangeRepeatFilter
	| ConfirmRepeatFilter
	| MultiSelectRepeatFilter;

export interface RepeatFilterBase {
	/**
	 * If set to true all values which are null
	 * are shown
	 */
	readonly filterNull?: boolean;
}

/**
 * The number repeat filter is used for number fields.
 * Number fields can be filtered by ranges.
 * If just the from-value is given, all values which are smaller than
 * the from-value are filtered out.
 * If just the to-value is given, all values which are bigger than the
 * to-value are filtered out.
 * If both are given, all values which are smaller than the from-value or
 * bigger than the to-value are filtered out.
 */
export interface NumberRepeatFilter extends RepeatFilterBase {
	readonly from: FilterValue | null;
	readonly to: FilterValue | null;
}

/**
 * The date repeat filter is used for date, date time and time fields.
 * These fields can be filtered by ranges.
 * If just the from-value is given, all values which are smaller than
 * the from-value are filtered out.
 * If just the to-value is given, all values which are bigger than the
 * to-value are filtered out.
 * If both are given, all values which are smaller than the from-value or
 * bigger than the to-value are filtered out.
 */
export interface DateRepeatFilter extends RepeatFilterBase {
	readonly from: FilterValue | null;
	readonly to: FilterValue | null;
}

/**
 * The date range repeat filter is used for date range fields.
 * A complete range containing start and end value has to be given.
 * All values, which are not completely contained in the given date range
 * are filtered out.
 */
export interface DateRangeRepeatFilter extends RepeatFilterBase {
	readonly filterRange: {
		data?: Date[];
		message?: FilterParseError;
	} | null;
}

/**
 * Data structure for a filter value.
 * It contains next to the data, possible
 * parsing errors.
 */
export interface FilterValue {
	readonly data?: number | Date;
	readonly message?: FilterParseError;
}

/**
 * Data structure for a parsing error,
 * which can occur in a repeat filter.
 */
export interface FilterParseError {
	readonly type: "FilterParseError";
	/** The parsing error. */
	readonly error: ValueConversionParseError;
	/** The invalid value. */
	readonly value: string;
}

/**
 * Data structure for a parsing error,
 * which can occur in a repeat range filter.
 */
export interface RangeFilterParseError {
	readonly type: "RangeFilterParseError";
	/** The parsing error for the from filter value. */
	readonly fromError?: FilterParseError;
	/** The parsing error for the to filter value. */
	readonly toError?: FilterParseError;
}

/**
 * Filter for a string field.
 * Input and filter value are converted to lower case.
 * and a partial match is conducted.
 */
export interface StringRepeatFilter extends RepeatFilterBase {
	readonly filterValue: string;
}

/**
 * Filter for a boolean field.
 */
export interface BooleanRepeatFilter extends RepeatFilterBase {
	/**
	 * If set to true all values which are true
	 * are shown
	 */
	readonly filterTrue: boolean;
	/**
	 * If set to true all values which are false
	 * are shown
	 */
	readonly filterFalse: boolean;
	/**
	 * If set to true all values which are null
	 * are shown
	 */
	readonly filterNull: boolean;
}

/**
 * Filter for a confirm field.
 */
export interface ConfirmRepeatFilter extends RepeatFilterBase {
	/**
	 * If set to true all values which are true
	 * are shown
	 */
	readonly filterTrue: boolean;
	/**
	 * If set to true all values which have no value.
	 * are shown
	 */
	readonly filterNull: boolean;
}

/**
 * Filter for an enumeration field.
 */
export interface EnumerationRepeatFilter extends RepeatFilterBase {
	/** Map of boolean whether a certain value is shown */
	readonly values: ReadonlyObjectMap<boolean>;
}

/**
 * Filter for a multi-select field
 */
export interface MultiSelectRepeatFilter extends EnumerationRepeatFilter {
	/** default: "or" */
	readonly mode?: "or" | "and";
}

/** @internal */
export function isRangeFilter(
	filter: RepeatFilter
): filter is NumberRepeatFilter | DateRepeatFilter {
	return "to" in filter && "from" in filter;
}
/** @internal */
export function isStringFilter(filter: RepeatFilter): filter is StringRepeatFilter {
	return "filterValue" in filter;
}
/** @internal */
export function isBooleanFilter(filter: RepeatFilter): filter is BooleanRepeatFilter {
	return "filterFalse" in filter && "filterTrue" in filter && "filterNull" in filter;
}
/** @internal */
export function isConfirmFilter(filter: RepeatFilter): filter is ConfirmRepeatFilter {
	return "filterTrue" in filter && "filterNull" in filter;
}
/** @internal */
export function isEnumerationFilter(filter: RepeatFilter): filter is EnumerationRepeatFilter {
	return "values" in filter;
}

/** @internal */
export function isMultiSelectFilter(filter: RepeatFilter): filter is MultiSelectRepeatFilter {
	return isEnumerationFilter(filter) && "mode" in filter;
}

/** @internal */
export function isDateRangeFilter(filter: RepeatFilter): filter is DateRangeRepeatFilter {
	return "filterRange" in filter;
}
