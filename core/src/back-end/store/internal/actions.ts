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

import type { ActionCreator, Action as ReduxAction } from "redux";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import { actionCreatorFactory } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access";
import type {
	EntityInstancePath,
	FieldInstanceValue
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Locale, ValueConversionParseError } from "@com.mgmtp.a12.utils/utils-localization";

import type {
	AttachmentFile,
	DuplicateStrategy
} from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/attachmentLoader/AttachmentLoader.js";
import type { ExistingFile } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/utils.js";
import type { FormModel } from "../../../models/index.js";
import type { MultiSelectData } from "../../../models/internal/utils/document-model-utils.js";
import type { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";

import type { CorrectionModeItem } from "./CorrectionModeItem.js";
import type { Change } from "./documentChange.js";
import type {
	EngineStore,
	FilterParseError,
	Models,
	RangeFilterParseError,
	RepeatFilter
} from "./store.js";

const event = actionCreatorFactory("form-engine/event");
const command = actionCreatorFactory("form-engine/command");

/**
 * Actions which are dispatched by `DispatchConfiguration` when an UI-event happens
 */
export namespace Events {
	/**
	 * Action which is dispatched by `DispatchConfiguration.onValueChange`
	 * when a value changed in the UI.
	 * The value must already be parsed.
	 */
	export const valueChange = event<ValueChangePayload>("VALUE_CHANGE");

	/** Payload for the {@link valueChange} action */
	export interface ValueChangePayload {
		/** The document path to the value. */
		readonly path: EntityInstancePath;
		/** The changed value. */
		readonly value: FieldInstanceValue;
		/** Path to the triggering form model element */
		readonly formModelElementPath?: ModelPath;
	}

	/**
	 * Action which is dispatched by `DispatchConfiguration.onParseError`
	 * when an invalid value was entered in the UI.
	 */
	export const parseError = event<ParseErrorPayload>("PARSE_ERROR");

	/** Payload for the {@link parseError} action */
	export interface ParseErrorPayload {
		/** The document path to the value. */
		readonly path: EntityInstancePath;
		/** The invalid entered value. */
		readonly uiValue: string;
		/** The parsing error. */
		readonly error: ValueConversionParseError;
	}

	/**
	 * Action which is dispatched by `DispatchConfiguration.onAttachmentValueChange`
	 * when an attachment value changed.
	 */
	export const attachmentValueChange = event<AttachmentValueChange>("ATTACHMENT_VALUE_CHANGE");

	/** Payload for the {@link attachmentValueChange} action */
	export interface AttachmentValueChange {
		/** The document path to the value. */
		readonly path: EntityInstancePath;
		/** The changed value. */
		readonly value: Attachment;
		/** Path to the triggering form model element */
		readonly formModelElementPath?: ModelPath;
	}

	/**
	 * Action which is dispatched by `DispatchConfiguration.onMultiSelectValueChange`
	 * when a multi-select value changed.
	 */
	export const multiSelectValueChange = event<MultiSelectValueChange>("MULTI_SELECT_VALUE_CHANGE");

	/** Payload for the {@link multiSelectValueChange} action */
	export interface MultiSelectValueChange {
		/** The document path to the value. */
		readonly path: EntityInstancePath;
		/** The changed value. */
		readonly value: MultiSelectData;
		/** Path to the triggering form model element */
		readonly formModelElementPath?: ModelPath;
	}

	/**
	 * Action which is dispatched by `DispatchConfiguration.onNavigationButton`
	 * when a navigation button is clicked.
	 */
	export const navigationButton = event<NavigationButtonPayload>("NAVIGATION_BUTTON");

	/** Payload for the {@link navigationButton} action */
	export interface NavigationButtonPayload {
		/**
		 * Target to which should be navigated.
		 * The target can be "#next", "#previous" or the name of the screen.
		 */
		readonly target: FormModel.NavigationButtonTarget;
		/**
		 * If set to 'partial' or 'full', the default middleware will validate and only change
		 * the screen if it is valid.
		 */
		readonly validation?: FormModel.ButtonValidationEnum;
	}

	/**
	 * Action which is dispatched by {@link eventButtonTriggered} when an event button is clicked
	 * and the validation was successful or not configured for the button.
	 * In general, you want to use this action to react to button clicks.
	 */
	export const eventButton = event<EventButtonPayload>("EVENT_BUTTON");

	/** Payload for the {@link eventButton} action */
	export interface EventButtonPayload {
		/** The name of the event. */
		readonly name: string;

		/**
		 * The path to the button in the form model
		 */
		readonly buttonPath: ModelPath;
	}

	/**
	 * Action to trigger validation if configured for the button and to dispatch {@link eventButton}
	 * if the validation was successful or not configured. It it dispatched by
	 * `DispatchConfiguration.onEventButton` when an event button is clicked.
	 */
	export const eventButtonTriggered = event<EventButtonTriggeredPayload>("EVENT_BUTTON_TRIGGERED");

	/** Payload for the {@link eventButtonTriggered} action */
	export interface EventButtonTriggeredPayload {
		/** The name of the event. */
		readonly name: string;

		/**
		 * If set to 'partial' or 'full', the default middleware will validate and only trigger an
		 * {@link eventButton} action if it is valid. If undefined, the {@link eventButton} action will
		 * always be dispatched.
		 */
		readonly validation?: FormModel.ButtonValidationEnum;

		/** The path to the button in the form model */
		readonly buttonPath: ModelPath;
	}

	/**
	 * Action which is dispatched by `DispatchConfiguration.onInputTouched`
	 * when an input is touched
	 *
	 * Note: Touch means changing without submitting the change.
	 */
	export const inputTouched = event("INPUT_TOUCHED");

	/**
	 * Action which is dispatched by `DispatchConfiguration.onCollapseSection`
	 * when a collapsible section is clicked.
	 */
	export const collapseSection = event<CollapseSectionPayload>("COLLAPSE_SECTION");

	/** Payload for the {@link collapseSection} action */
	export interface CollapseSectionPayload {
		/** Form model path to the section */
		readonly path: ModelPath;
		/** If set to true the section should be set to collapsed. */
		readonly collapse: boolean;
	}

	export namespace Attachments {
		export const downloadAttachment = event<DownloadAttachmentPayload>("DOWNLOAD_ATTACHMENT");
		export interface DownloadAttachmentPayload {
			/**
			 * The attachment that should be downloaded
			 */
			readonly attachment: Attachment;
			/**
			 * The path to the attachment in the document model
			 */
			readonly attachmentPath: EntityInstancePath;
		}

		export const deleteAttachment = event<DeleteAttachmentPayload>("DELETE_ATTACHMENT");
		export interface DeleteAttachmentPayload {
			/**
			 * The attachment that should be deleted
			 */
			readonly attachment: Attachment;

			/**
			 * The path to the attachment in the document model
			 */
			readonly attachmentPath: EntityInstancePath;
		}

		export const cancelUploadAttachments = event("CANCEL_UPLOAD_ATTACHMENTS");

		export const uploadAttachments = event<UploadAttachmentsPayload>("UPLOAD_ATTACHMENTS");

		export interface UploadAttachmentsPayload {
			/**
			 * The data to upload
			 *
			 * Each {@link AttachmentFile} has to contain the
			 * actual file content as well as the attachment document path.
			 */
			readonly files: AttachmentFile[];

			/**
			 * The `ModelPath` to the form model element
			 */
			readonly formModelElementPath: ModelPath;

			/**
			 * Specifies how duplicate filenames are handled,
			 * see {@link DuplicateStrategy}.
			 *
			 * When not given, *no* duplicate checking is done.
			 *
			 * NOTE: Only relevant when uploading multiple files at once
			 */
			readonly duplicateStrategy?: DuplicateStrategy;

			/**
			 * The `EntityInstancePath` to the group in the document model that
			 * belongs to the repeat that triggered the multi-file upload
			 *
			 * NOTE: This property is required for multi-file uploads and will
			 * be ignored for single file uploads.
			 */
			readonly pathToRepeatGroup?: EntityInstancePath;

			/**
			 * Specifies existing attachments when uploading multiple files
			 *
			 * NOTE: Required when uploading multiple files at once and a {@link DuplicateStrategy} is set.
			 */
			readonly existingFiles?: ExistingFile[];
		}
	}

	/**
	 * Actions which are related to an event which gets triggered from a
	 * Repeat
	 */
	export namespace Repeat {
		/**
		 * Action which is dispatched by
		 * `DispatchConfiguration.Repeat.onLeaveDetachedRepeatRow`
		 * when the cancel or commit button
		 * in a detached repeat detail screen is clicked
		 */
		export const leaveDetachedRepeatRow = event<LeaveDetachedRepeatRowPayload>(
			"LEAVE_DETACHED_REPEAT_ROW"
		);

		/** Payload for the {@link leaveDetachedRepeatRow} action */
		export interface LeaveDetachedRepeatRowPayload {
			/**
			 * If cancel is true, the document and error state, which got
			 * backed up before entering the detail screen, will get restored.
			 */
			readonly cancel?: boolean;
		}

		/**
		 * Action which is dispatched by
		 * `DispatchConfiguration.Repeat.onCloseEmbeddedRepeatRow`
		 * when the close button in an expanded row in an embedded repeat is clicked.
		 */
		export const closeEmbeddedRepeatRow = event<CloseEmbeddedRepeatRowPayload>(
			"CLOSE_EMBEDDED_REPEAT_ROW"
		);

		/** Payload for the {@link closeEmbeddedRepeatRow} action */
		export interface CloseEmbeddedRepeatRowPayload {
			/** Form model path to the parent Repeat. */
			readonly repeatFormModelPath: ModelPath;
		}

		/**
		 * Action which is dispatched by `DispatchConfiguration.Repeat.onLeaveRepeatRow`
		 * when a row in a repeat looses its focus.
		 */
		export const leaveRepeatRow = event<LeaveRepeatRowPayload>("LEAVE_REPEAT_ROW");

		/** Payload for the {@link leaveRepeatRow} action */
		export interface LeaveRepeatRowPayload {
			/** Form model path to the parent Repeat. */
			readonly repeatFormModelPath: ModelPath;
			/** Path to the row */
			readonly rowPath: EntityInstancePath;
		}

		/**
		 * Action which is dispatched by `DispatchConfiguration.Repeat.onLeaveRepeatTable`
		 * when a inline or embedded repeat looses its focus.
		 */
		export const leaveRepeatTable = event<LeaveRepeatTablePayload>("LEAVE_TABLE");

		/** Payload for the {@link leaveRepeatTable} action */
		export interface LeaveRepeatTablePayload {
			/** Form model path to the parent Repeat. */
			readonly repeatFormModelPath: ModelPath;
		}

		/**
		 * Action which is dispatched by `DispatchConfiguration.Repeat.addRow`
		 * when the add button is clicked.
		 */
		export const addRow = event<AddRowPayload>("ADD_ROW");

		/** Payload for the {@link addRow} action */
		export interface AddRowPayload {
			/** Document path to the repeatable group */
			readonly path: EntityInstancePath;
			/** Form model path to the Repeat */
			readonly repeatFormModelPath: ModelPath;
		}

		/**
		 * Action which is dispatched by
		 * `DispatchConfiguration.Repeat.enterRow`
		 * when the edit button of a row is clicked.
		 */
		export const enterRow = event<EnterRowPayload>("ENTER_ROW");

		/** Payload for the {@link enterRow} action */
		export interface EnterRowPayload {
			/** Document path to the row */
			readonly rowPath: EntityInstancePath;
			/** Form model path to the parent Repeat */
			readonly repeatFormModelPath: ModelPath;
			/**
			 * The element which triggered the entering of the row:
			 * 'edit-button': The edit button in a row triggered this action.
			 * 'row': The default row action "EDIT" in a row triggered this action.
			 *
			 * Default: edit-button
			 */
			readonly triggerElement?: "edit-button" | "row";
		}

		/**
		 * Action which is dispatched by
		 * `DispatchConfiguration.Repeat.changeColumnWidth`
		 * when the width of a resizable column is changed.
		 */
		export const changeColumnWidth = event<ChangeColumnWidthPayload>("CHANGE_COLUMN_WIDTH");

		/** Payload for the {@link changeColumnWidth} action */
		export interface ChangeColumnWidthPayload {
			/** Form model path to the column */
			readonly columnPath: ModelPath;
			/** New width of the column */
			readonly width: number;
		}

		/**
		 * Action which is dispatched by
		 * `DispatchConfiguration.Repeat.removeRow`
		 * when the remove button of a row is clicked.
		 */
		export const removeRow = event<RemoveRowPayload>("REMOVE_ROW");

		/** Payload for the {@link removeRow} action */
		export interface RemoveRowPayload {
			/** Document path to the row */
			readonly rowPath: EntityInstancePath;
			/** Form model path to the parent Repeat */
			readonly repeatFormModelPath: ModelPath;
		}

		/**
		 * Action which is dispatched by `DispatchConfiguration.Repeat.onMoveRow`
		 * when the move-up or move-down button of a row is clicked.
		 */
		export const moveRowTriggered = event<MoveRowPayload>("MOVE_ROW");

		/** Payload for the {@link moveRowTriggered} action */
		export interface MoveRowPayload {
			/** Document path to the row */
			readonly rowPath: EntityInstancePath;
			/**
			 * Delta by which the row should be moved.
			 * A delta of -1 means the row should be moved up by 1.
			 * A delta of +1 means the row should be moved down by 1.
			 */
			readonly delta: number;
			/** Form model path to the parent Repeat */
			readonly repeatFormModelPath: ModelPath;
		}

		/**
		 * Action which is dispatched by
		 * `DispatchConfiguration.Repeat.onCloneRow`
		 * when the clone button of a row is clicked.
		 */
		export const cloneRowTriggered = event<CloneRowPayload>("CLONE_ROW");

		/** Payload for the {@link cloneRowTriggered} action */
		export interface CloneRowPayload {
			/** Document path to the row */
			readonly rowPath: EntityInstancePath;
			/** Form model path to the parent Repeat */
			readonly repeatFormModelPath: ModelPath;
		}

		/**
		 * Action which is dispatched by `DispatchConfiguration.Repeat.onChangePage`
		 * when the page is changed
		 */
		export const changePage = event<ChangePagePayload>("CHANGE_PAGE");

		/** Payload for the {@link changePage} action */
		export interface ChangePagePayload {
			/** Form model path to the parent Repeat. */
			readonly repeatFormModelPath: ModelPath;
			/** The new page number. */
			readonly page: number;
		}

		/**
		 * Action which is dispatched by `DispatchConfiguration.Repeat.onSortingChange`
		 * when repeat column header is clicked.
		 */
		export const sortingChange = event<SortingChangePayload>("SORTING_CHANGE");

		/** Payload for the {@link sortingChange} action */
		export interface SortingChangePayload {
			/** Form model path to the column by which the table gets sorted. */
			readonly orderPath: ModelPath;
			/** Form model path to the parent Repeat. */
			readonly repeatFormModelPath: ModelPath;

			/** The new sorting state. */
			readonly sorting: "asc" | "desc" | undefined;
		}

		/**
		 * Action which is dispatched by `DispatchConfiguration.Repeat.onShowFilter`
		 * when the filter button is clicked.
		 */
		export const showFilter = event<ShowFilterPayload>("SHOW_FILTER");

		/** Payload for the {@link showFilter} action */
		export interface ShowFilterPayload {
			/** Form model path to the parent Repeat. */
			readonly repeatFormModelPath: ModelPath;
			/**
			 * If set to true the filter will be shown.
			 */
			readonly opened: boolean;
		}

		/**
		 * Action which is dispatched by `DispatchConfiguration.Repeat.onFilterValueChange`
		 * when a filter value changed. The value must already be parsed.
		 */
		export const filterValueChange = event<FilterValueChangePayload>("FILTER_VALUE_CHANGE");

		/** Payload for the {@link filterValueChange} action */
		export interface FilterValueChangePayload {
			/** Form model path to the parent Repeat. */
			readonly repeatFormModelPath: ModelPath;
			/** The new filter */
			readonly filter?: RepeatFilter;
			/** The id of the column for which the filter should apply. */
			readonly columnId: string;
		}

		/**
		 * Action which is dispatched by `DispatchConfiguration.Repeat.onFilterParseError`
		 * when the filter value is changed to an invalid value.
		 */
		export const filterParseError = event<FilterParseErrorPayload>("FILTER_PARSE_ERROR");

		/** Payload for the {@link filterParseError} action */
		export interface FilterParseErrorPayload {
			/** The id of the column for which the filter should apply. */
			readonly columnId: string;
			/** Form model path to the parent Repeat. */
			readonly repeatFormModelPath: ModelPath;
			/** The parsing errors */
			readonly errors: RangeFilterParseError | FilterParseError;
		}

		/**
		 * Action which is dispatched by `DispatchConfiguration.Repeat.onClearFilters`
		 * when the clear filter button is clicked.
		 */
		export const clearFilters = event<ClearFiltersPayload>("CLEAR_FILTERS");

		/** Payload for the {@link clearFilters} action */
		export interface ClearFiltersPayload {
			/** Form model path to the parent Repeat. */
			readonly repeatFormModelPath: ModelPath;
		}

		/**
		 * Action which is dispatched by `DispatchConfiguration.Repeat.onCustomRowAction`
		 *  when a custom row action button is clicked.
		 */
		export const customRowAction = event<CustomRowActionPayload>("CUSTOM_ROW_ACTION");

		/** Payload for the {@link customRowAction} action */
		export interface CustomRowActionPayload {
			/** The name of the event. */
			readonly eventName: string;
			/** Document path to the row. */
			readonly rowPath: EntityInstancePath;
			/** Form model path to the parent Repeat. */
			readonly repeatFormModelPath: ModelPath;
		}

		export const multiFileUpload = event<MultiFileUploadPayload>("MULTI_FILE_UPLOAD");

		export interface MultiFileUploadPayload {
			/** The document path to the repeatable group */
			readonly path: EntityInstancePath;
			/** Path to the attachment */
			readonly attachmentModelPath: ModelPath;
			/** Path to the triggering repeat */
			readonly repeatFormModelPath?: ModelPath;
			/** The uploaded attachments */
			readonly toBeAdded: Attachment[];
			/** File names of attachments, that will be replaced by a new attachment */
			readonly toBeReplaced?: { path: EntityInstancePath; value: Attachment }[];
		}
	}

	/**
	 * Actions which are related with the CorrectionMode
	 */
	export namespace CorrectionMode {
		/**
		 * Action which is dispatched by
		 * `DispatchConfiguration.CorrectionMode.onRevalidate`
		 * when the validate button is clicked.
		 */
		export const revalidate = event("VALIDATION_BUTTON");

		/**
		 * Action which is dispatched by
		 * `DispatchConfiguration.CorrectionMode.onExitCorrectionMode`
		 * when the exit button is clicked.
		 */
		export const exitCorrectionMode = event<{}>("EXIT_CORRECTION_MODE");

		/**
		 * Action which is dispatched by
		 * `DispatchConfiguration.CorrectionMode.onGoToElement`
		 * when the link to an issue or of the "GoToIssue" button in the
		 * quick-access-menu is clicked.
		 */
		export const goToElement = event<GoToElementPayload>("GO_TO_ELEMENT");

		/** Payload for the {@link goToElement} action */
		export interface GoToElementPayload {
			/**
			 * The item, containing the control, which should
			 * be focused.
			 */
			readonly item: CorrectionModeItem;
			/**
			 * An optional message key, which indicates that the
			 * current messages should be  changed
			 */
			readonly messageKey?: string;
		}

		/**
		 * Actions which are related to the correction view.
		 */
		export namespace CorrectionView {
			/**
			 * Action which gets dispatched by
			 * `DispatchConfiguration.CorrectionMode.CorrectionView.onShow`
			 * when the show all issues entry in the quick-access-menu is clicked.
			 */
			export const show = event<{ readonly show: boolean }>("SHOW_CORRECTION_VIEW");

			/**
			 * Action which is dispatched by
			 * `DispatchConfiguration.CorrectionMode.CorrectionView.onShowDetails`
			 * when the show/hide details button is clicked.
			 */
			export const showDetails = event<ShowDetailsPayload>("SHOW_DETAILS");

			/** Payload for the {@link showDetails} action */
			export interface ShowDetailsPayload {
				/**
				 * The element for which the details should be shown/hidden
				 */
				readonly element: string;
				/** If set to true the details shown. */
				readonly showDetails: boolean;
			}
		}

		/**
		 * Action which are related to the validation bar.
		 */
		export namespace ValidationBar {
			/**
			 * Action which is dispatched by
			 * `DispatchConfiguration.CorrectionMode.ValidationBar.onExpand`
			 * when the expand/collapse message
			 * is clicked.
			 */
			export const expand = event<ExpandValidationBarPayload>("EXPAND_VALIDATION_BAR");

			/** Payload for the {@link expand} action */
			export interface ExpandValidationBarPayload {
				/** If set to true the validation bar will be expanded. */
				readonly expanded: boolean;
				/** If set to true the current message will be reset. */
				readonly resetCurrentMessage: boolean;
			}

			/**
			 * Action which is dispatched by
			 * `DispatchConfiguration.CorrectionMode.ValidationBar.onShowMessage`
			 * when the message pagination is clicked.
			 */
			export const showMessage = event<MessageChangePayload>("SHOW_MESSAGE");

			/** Payload for the {@link showMessage} action */
			export interface MessageChangePayload {
				/** The key of the message which should be shown. */
				readonly messageKey: string;
			}
		}
	}

	/** @internal */
	export const userConfirmationResponse = event<boolean>("USER_CONFIRMATION_RESPONSE");
}

/**
 * Actions which lead to a state change.
 */
export namespace Commands {
	/**
	 * Action to set a document.
	 */
	export const setDocument = command<SetDocumentPayload>("SET_DOCUMENT");

	/** Payload for the {@link setDocument} action */
	export interface SetDocumentPayload {
		/** The updated document */
		readonly document: object;

		/**
		 * @experimental
		 * An array of changes which were made to get the
		 * updated document.
		 */
		readonly changes: readonly Change[];
	}

	/**
	 * Action to set the error state.
	 */
	export const setMessageState = command<SetMessageStatePayload>("SET_MESSAGE_STATE");

	/** Payload for the `setMessageState` action */

	export interface SetMessageStatePayload {
		/**  The messages of the error state */
		readonly messages: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	}

	/** Action to set an error state entry. */
	export const setMessageStateEntry = command<SetMessageStateEntryPayload>("ADD_MESSAGE_STATE");

	/** Payload for the `setMessageStateEntry` action */

	export interface SetMessageStateEntryPayload {
		/** The path of the element for which the error entry is set */
		readonly path: string;
		/** The message state entry. */
		readonly messageStateEntry: EngineStore.Validation.Entry;
	}

	/** Action to set the section state */
	export const setSectionsCollapsed =
		command<SetSectionsCollapsedPayload>("SET_SECTIONS_COLLAPSED");

	/** Payload for the {@link setSectionsCollapsed} action */
	export interface SetSectionsCollapsedPayload {
		/** The new state of the sections. */
		readonly sections: ReadonlyArray<{ path: ModelPath; collapse: boolean }>;
	}

	/** Action to set the location stack. */
	export const setLocationStack = command<SetLocationStackPayload>("SET_LOCATION_STACK");

	/** Payload for the {@link setLocationStack} action */
	export interface SetLocationStackPayload {
		/** The new location stack. */
		readonly locationStack: ReadonlyArray<EngineStore.ScreenState>;
	}

	/** Action to change a screen. */
	export const changeScreen = command<ChangeScreenPayload>("CHANGE_SCREEN");

	/** Payload for the {@link changeScreen} action */
	export interface ChangeScreenPayload {
		/** Name of the new screen */
		readonly screenName: string;
	}

	/** Action to change the state of a screen */
	export const changeScreenState = command<ChangeScreenStatePayload>("CHANGE_SCREEN_STATE");

	/** Payload for the {@link changeScreenState} action */
	export interface ChangeScreenStatePayload {
		/** The index of the screen which should be changed */
		readonly index: number;

		/** Path of the data context. */
		readonly path?: EntityInstancePath;
		/** Form model path to the screen. */
		readonly locationPath?: ModelPath;
		/** The state of repeats inside the screen */
		readonly repeatState?: ReadonlyObjectMap<EngineStore.Repeat.Entry>;

		/**
		 * This component will be focused the next time the view is updated.
		 *
		 * Typical use cases are:
		 * * Return to repeats after leaving their detail screen
		 * * Going to controls with issues
		 */
		readonly focusedComponent?: EngineStore.FocusedComponent;

		/** Whether or not the data in the current screen changed  */
		readonly dirty?: boolean;
	}

	/** Action to set the disabled property. */
	export const setDisabled = command<boolean>("SET_DISABLED");
	/** Action to set the readonly property. */
	export const setReadonly = command<boolean>("SET_READONLY");
	/** Action to set the dirty state of the data. */
	export const setDataDirty = command<boolean>("SET_DATA_DIRTY");
	/** Action to set the dirty state of the ui. */
	export const setUIDirty = command<boolean>("SET_UI_DIRTY");

	/** Action to set a width for a column */
	export const setColumnWidth = command<SetColumnWidthPayload>("SET_COLUMN_WIDTH");

	/** Payload for the {@link setColumnWidth} action */
	export interface SetColumnWidthPayload {
		/** Form model path to the column */
		readonly columnPath: ModelPath;
		/** New width of the column */
		readonly width: number;
	}

	/**
	 * Action to set the locale.
	 * Mind: If you set the locale already shown validation messages will not
	 * be automatically translated. The reason for this is that the validation
	 * messages are translated by the kernel during validation.
	 * After changing the Locale it is not possible to revalidate automatically
	 * since it could lead to a different validation result.
	 */
	export const setLocale = command<SetLocalePayload>("SET_LOCALE");

	/** Payload for the {@link SetLocalePayload} action */
	export interface SetLocalePayload {
		readonly locale: Locale;
	}

	/** Action to set the models. */
	export const setModels = command<Models>("SET_MODELS");

	/**  Action to drop the last backup. */
	export const dropBackup = command<DropBackupPayload>("DROP_BACKUP");

	/**
	 * Payload for the {@link dropBackup} action
	 */
	export interface DropBackupPayload {
		/** Used by SCDM for changelog handling. */
		readonly trigger: "cancel" | "apply";
	}

	/** Action to push a backup. */
	export const pushBackup = command<PushBackupPayload>("PUSH_BACKUP");

	/** Payload for the {@link pushBackup} action */
	export interface PushBackupPayload {
		/** The current document. */
		readonly document: object;
		/** The current validation messages. */
		readonly messages: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	}

	/** Action to execute a full validation */
	export const validateFull = command<ValidateFullPayload | void>("VALIDATE_FULL");

	/**
	 * Payload for the {@link validateFull} action
	 */
	export interface ValidateFullPayload {
		/**
		 * If this option is not set or set to false the
		 * following focus behavior is applied:
		 * 	 - if there are no error after the validation: the form is focused
		 *   - if there are errors after the validation: the validation-bar is focused
		 * This is done for accessibility reasons.
		 *
		 * If this options is set to true then the focus will not be set to the
		 * form/validation-bar.
		 * Mind: If this behavior is disabled then validation will not be accessible.
		 */
		readonly disableFocusBehavior?: boolean;
	}

	/** Action to execute a partial validation */
	export const validatePart = command<ValidatePartPayload>("VALIDATE_PART");

	/** Payload for the {@link validatePart} action */
	export interface ValidatePartPayload {
		/** If set to true the first control containing an error will be focused. */
		readonly focusFirstError?: boolean;
	}

	/** Action to push a screen to the screenLocation. */
	export const pushScreen = command<PushScreenPayload>("PUSH_SCREEN");

	/** Payload for the {@link pushScreen} action */
	export interface PushScreenPayload {
		/** The data context. */
		readonly path: EntityInstancePath;
		/** The location path to the screen. */
		readonly locationPath: ModelPath;
		/** The state of repeats inside the screen. */
		readonly repeatState?: ReadonlyObjectMap<EngineStore.Repeat.Entry>;
	}

	/** Action to drop the current screen. */
	export const dropScreen = command("DROP_SCREEN");

	/**  Action to change the data-independent state of a repeat. */
	export const changeRepeatStaticStateEntry = command<ChangeRepeatStaticStateEntryPayload>(
		"CHANGE_REPEAT_STATIC_STATE_ENTRY"
	);

	/** Payload for the {@link changeRepeatStaticStateEntry} action */
	export interface ChangeRepeatStaticStateEntryPayload {
		/** The form model path to the repeat. */
		readonly repeatFormModelPath: ModelPath;

		/** The new data-independent state of the repeat. */
		readonly entry: EngineStore.Repeat.StaticState;
	}

	/**  Action to change the data-related state of a repeat. */
	export const changeRepeatInstanceStateEntry = command<ChangeRepeatInstanceStateEntryPayload>(
		"CHANGE_REPEAT_INSTANCE_STATE_ENTRY"
	);

	/** Payload for the {@link changeRepeatInstanceStateEntry} action */
	export interface ChangeRepeatInstanceStateEntryPayload {
		/** The form model path of the screen which contains the repeat. */
		readonly locationPath: ModelPath;
		/** The form model path to the repeat. */
		readonly repeatFormModelPath: ModelPath;

		/** The new data-related state of the repeat. */
		readonly entry: EngineStore.Repeat.InstanceState;
	}

	/** Action to set the data-independent repeat state of the form */
	export const setRepeatStaticState = command<SetRepeatStaticStatePayload>("SET_REPEAT_STATE");

	/** Payload for the {@link setRepeatStaticState} action */
	export interface SetRepeatStaticStatePayload {
		/** The data-independent state of repeats inside the form */
		readonly repeatStaticState?: ReadonlyObjectMap<EngineStore.Repeat.StaticState>;
	}

	/**
	 * Actions which are related to the CorrectionMode.
	 */
	export namespace CorrectionMode {
		/** Action to set the state of the validation bar */
		export const setValidationBarState = command<SetValidationBarStatePayload>(
			"SET_VALIDATION_BAR_STATE"
		);

		/** Payload for the {@link setValidationBarState} action */
		export interface SetValidationBarStatePayload {
			/** The state of the validation bar */
			readonly validationBar: Partial<EngineStore.ValidationBarState>;
		}

		/** Action to set the state of the correction screen */
		export const setCorrectionScreenState = command<SetCorrectionScreenStatePayload>(
			"SET_CORRECTION_SCREEN_STATE"
		);

		/** Payload for the {@link setCorrectionScreenState} action */
		export interface SetCorrectionScreenStatePayload {
			/** The state of the correction screen. */
			readonly correctionScreen: EngineStore.CorrectionScreenState;
		}

		/** Action to set a correction mode backup */
		export const setCorrectionModeBackup = command<SetCorrectionModeBackupPayload>(
			"SET_CORRECTION_MODE_BACKUP"
		);

		/** Payload for the {@link setCorrectionModeBackup} action */
		export interface SetCorrectionModeBackupPayload {
			/** The correction mode backup. */
			readonly backup: EngineStore.CorrectionModeBackup;
		}

		/**
		 * Action to restore a correction mode backup.
		 */
		export const restoreCorrectionModeBackup = command<RestoreCorrectionModeBackupPayload>(
			"RESTORE_CORRECTION_MODE_BACKUP"
		);

		/** Payload for the {@link restoreCorrectionModeBackup} action */
		export interface RestoreCorrectionModeBackupPayload {
			/** The backup which is restored. */
			readonly backup: EngineStore.CorrectionModeBackup;
		}
	}

	/** @internal */
	export const userConfirmationRequested = command<{
		readonly actionsToDispatch: Action<object>[];
		readonly validation?: FormModel.ButtonValidationEnum;
	}>("USER_CONFIRMATION_REQUESTED");

	/** @internal */
	export const clearUserConfirmation = command("CLEAR_USER_CONFIRMATION");
}

/**
 * Function to retrieve a list of all event actions.
 *
 * This function is used by the the middleware adapter in Client.
 *
 * Note that some returned actions might be internal, which should not be used
 * outside of the form engine. For internal actions, no action creator is
 * exported.
 */
export function getAllEventActions(): ActionCreator<ReduxAction>[] {
	return getAllActionsFromNamespace(Events);
}

/**
 * Function to retrieve a list of all command actions - see
 * {@link getAllEventActions} for more information.
 */
export function getAllCommandActions(): ActionCreator<ReduxAction>[] {
	return getAllActionsFromNamespace(Commands);
}

/**
 * Iterate over the entries of the given namespace.
 * Add values of type function to the list of available actions.
 * If the value is of type object, call the function recursively with
 * the new namespace.
 */
function getAllActionsFromNamespace(namespace: object): ActionCreator<ReduxAction>[] {
	const actions: ActionCreator<ReduxAction>[] = [];

	function getActions(n: object): void {
		for (const value of Object.values(n)) {
			if (typeof value === "function") {
				actions.push(value);
			} else if (typeof value === "object") {
				getActions(value);
			}
		}
	}

	getActions(namespace);
	return actions;
}
