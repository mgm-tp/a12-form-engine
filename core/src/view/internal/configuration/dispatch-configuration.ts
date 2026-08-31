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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access";
import type {
	EntityInstancePath,
	FieldInstanceValue
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { ValueConversionParseError } from "@com.mgmtp.a12.utils/utils-localization";

import type { Events } from "../../../back-end/store/internal/actions.js";
import type { CorrectionModeItem } from "../../../back-end/store/internal/CorrectionModeItem.js";
import type {
	FilterParseError,
	RangeFilterParseError,
	RepeatFilter
} from "../../../back-end/store/internal/store.js";
import type {
	AttachmentFile,
	DuplicateStrategy
} from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/attachmentLoader/AttachmentLoader.js";
import type { ExistingFile } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/utils.js";
import type { FormModel } from "../../../models/index.js";
import type { MultiSelectData } from "../../../models/internal/utils/document-model-utils.js";

import type { defaultMapDispatchToProps } from "./Defaults.js";

/**
 * Interface for the UI-event callback functions.
 * In the default implementation a dedicated {@link Events} action will be dispatched
 * for each callback.
 *
 * Please note that adding new mandatory properties to this interface is not considered as a breaking change.
 * For this reason instances of this interface must always be created by spreading its default implementation
 * which can be created using {@link defaultMapDispatchToProps}.
 */
export interface DispatchConfiguration {
	/** Called when an input is touched */
	onInputTouched(): void;

	/** Called when an attachment is downloaded
	 * @param attachment the attachment, that should be downloaded
	 * @param attachmentPath the path to the attachment in the document
	 */
	onAttachmentDownload(attachment: Attachment, attachmentPath: EntityInstancePath): void;

	/** Called when an attachment is deleted
	 * @param attachment the attachment, that should be deleted from the document
	 * @param attachmentPath the path to the attachment in the document
	 */
	onAttachmentDelete(attachment: Attachment, attachmentPath: EntityInstancePath): void;

	/** Called when attachments are uploaded
	 * @param files the files to be uploaded
	 * @param formModelElementPath the path to the corresponding form model control, required for indexed controls
	 * @param pathToRepeatGroup if multi-file upload, the path to the group the repeat corresponds to
	 * @param duplicateStrategy if multi-file upload, how to handle duplicates
	 * @param existingFiles if multi-file upload, the existingFiles that were already uploaded
	 */
	onAttachmentUpload(
		files: AttachmentFile[],
		formModelElementPath: ModelPath,
		pathToRepeatGroup?: EntityInstancePath,
		duplicateStrategy?: DuplicateStrategy,
		existingFiles?: ExistingFile[]
	): void;

	/** Called when a current attachment upload is canceled */
	onCancelAttachmentUpload(): void;

	/**
	 * Called when an UI-value changed.
	 * @param path the path to the field in the document
	 * @param value an already parsed value which should be changed in the document
	 * @param formModelElementPath the path to the corresponding form model control, required for indexed controls
	 */
	onValueChange(
		path: EntityInstancePath,
		value: FieldInstanceValue,
		formModelElementPath?: ModelPath
	): void;

	/**
	 * Called when an invalid UI-value was entered.
	 * @param path the path to the field in the document
	 * @param uiValue invalid entered value
	 * @param error the error which occurred
	 * @param formModelElementPath the path to the corresponding form model control, required for indexed controls
	 */
	onParseError(
		path: EntityInstancePath,
		uiValue: string,
		error: ValueConversionParseError,
		formModelElementPath?: ModelPath
	): void;

	/** Called when an attachment value changed.
	 * @param path the path to the field in the document
	 * @param value the attachment, that should be added to the document
	 * @param formModelElementPath the path to the corresponding form model control, required for indexed controls
	 */
	onAttachmentValueChange(
		path: EntityInstancePath,
		value: Attachment,
		formModelElementPath?: ModelPath
	): void;

	/**
	 * Called when files are uploaded in a multi file upload repeat.
	 * @param path the document path of the repeatable group
	 * @param toBeAdded an array of attachments, that should be added to the document
	 * @param attachmentModelPath the document model path to the attachment group
	 * @param repeatFormModelPath the form model path to the repeat
	 * @param toBeReplaced an array of objects containing a row path and an attachment, that will replace the current
	 * attachment of the given row
	 */
	onMultiFileUpload(
		path: EntityInstancePath,
		toBeAdded: Attachment[],
		attachmentModelPath: ModelPath,
		repeatFormModelPath?: ModelPath,
		toBeReplaced?: { path: EntityInstancePath; value: Attachment }[]
	): void;

	/** Called when a multi-select value changed.
	 * @param path the path to the field in the document
	 * @param value the multi-select value, that should be added to the document
	 * @param formModelElementPath the path to the corresponding form model control, required for indexed controls
	 */
	onMultiSelectValueChange(
		path: EntityInstancePath,
		value: MultiSelectData,
		formModelElementPath?: ModelPath
	): void;

	/**
	 * Called when the state of a collapsible section changed.
	 * @param collapse if set to true, the section should be collapsed
	 * @param path form model path to the section
	 */
	onCollapseSection(collapse: boolean, path: ModelPath): void;

	/**
	 * Called when a navigation button is clicked.
	 * @param target the target to which should be navigated
	 * @param validation if set to 'partial' or 'full' a validation should be conducted before changing the screen
	 */
	onNavigationButton(target: string, validation?: FormModel.ButtonValidationEnum): void;

	/**
	 * Called when an event-button is clicked.
	 * @param eventName the name of the event as defined in {@link FormModel.ButtonType.name}
	 * @param buttonPath path to the button in the form model
	 * @param validation if set to 'partial' or 'full' a validation should be conducted before triggering the event
	 */
	onEventButton(
		eventName: string,
		buttonPath: ModelPath,
		validation?: FormModel.ButtonValidationEnum
	): void;

	/** Callbacks which are related to a repeat. */
	readonly repeat: DispatchConfiguration.Repeat;

	/** Callbacks which are related to a correction mode. */
	readonly correctionMode: DispatchConfiguration.CorrectionMode;

	/** @internal */
	onUserConfirmationResponse(response: boolean): void;
}

export namespace DispatchConfiguration {
	/** Callbacks which are related to a repeat. */
	export interface Repeat {
		/** Called when the add button is clicked. */
		addRow(path: EntityInstancePath, repeatFormModelPath: ModelPath): void;

		/** Called when the remove row button is clicked. */
		removeRow(rowPath: EntityInstancePath, repeatFormModelPath: ModelPath): void;

		/** Called when the edit row button is clicked. */
		enterRow(
			rowPath: EntityInstancePath,
			repeatFormModelPath: ModelPath,
			triggerElement?: "edit-button" | "row"
		): void;

		/**
		 * Called when the move row button is clicked
		 * @param delta Delta by which the row should be moved.
		 * 					* A delta of -n means the row should be moved up by n.
		 * 					* A delta of +n means the row should be moved down by n.
		 */
		onMoveRow(repeatFormModelPath: ModelPath, rowPath: EntityInstancePath, delta: number): void;

		/** Called when then clone row button is clicked. */
		onCloneRow(rowPath: EntityInstancePath, repeatFormModelPath: ModelPath): void;

		/**
		 * Called when an inline or embedded repeat row looses its focus and the focus
		 * remains inside the repeat.
		 */
		onLeaveRepeatRow(rowPath: EntityInstancePath, repeatFormModelPath: ModelPath): void;

		/** Called when a repeat looses its focus */
		onLeaveTable(repeatFormModelPath: ModelPath): void;

		/**
		 * Called when the cancel or apply button in a detached-repeat detail screen is clicked
		 * @param cancel if set to true, the document and error state, which got
		 * backed up before entering the detail screen, should get restored.
		 */
		onLeaveDetachedRepeatRow(cancel: boolean): void;

		/**
		 * Called when the close button in an expanded row in an embedded-repeat is clicked
		 */
		onCloseEmbeddedRepeatRow(repeatFormModelPath: ModelPath): void;

		/**
		 * Called when a custom row action button is clicked.
		 * @param eventName the event defined in {@link FormModel.RowAction.event}
		 */
		onCustomRowAction(
			path: EntityInstancePath,
			repeatFormModelPath: ModelPath,
			eventName: string
		): void;

		/**
		 * Called when show filter button is clicked.
		 * @param show if set to true, the filter should be shown.
		 */
		onShowFilter(path: ModelPath, show: boolean): void;

		/** Called when clear filter button is clicked. */
		onClearFilters(repeatFormModelPath: ModelPath): void;

		/**
		 * Called when an UI filter value changed.
		 * @param columnId id for the repeat overview column for which this filter should be applied
		 * @param filter an optional {@link RepeatFilter} with already parsed values. If the filter is not given, all
		 * filters for this column will be deleted.
		 */
		onFilterValueChange(
			repeatFormModelPath: ModelPath,
			columnId: string,
			filter?: RepeatFilter
		): void;

		/**
		 * Called when an invalid UI filter value was entered.
		 * @param errors Object of parse errors.
		 * The object can be either a parse error for a range filter with
		 * `fromError` and `toError` or a simple parse error.
		 * A given `fromError` means, that the
		 * parsing error occurred in the from value of the range filter.
		 * A given `toError` means, that the parsing error occurred in the to value
		 * of the range filter.
		 */
		onFilterParseError(
			columnId: string,
			repeatFormModelPath: ModelPath,
			errors: RangeFilterParseError | FilterParseError
		): void;

		/** Called when the pagination changed. */
		onChangePage(page: number, path: ModelPath): void;

		/**
		 * Called when a sortable column header is clicked.
		 * @param sorting the next sorting which should be used for the column
		 * 					* `asc`: ascending sorting
		 * 					* `desc`: descending sorting
		 * 					* `none`: no sorting, the rows are shown as they are in the document
		 * If non is given the initial sorting from the form model will be used or `asc` if non is given.
		 */
		onSortingChange(
			repeatFormModelPath: ModelPath,
			orderPath: ModelPath,
			sorting: "asc" | "desc" | "none" | undefined
		): void;

		/**
		 * Called when a column is resized
		 * @param columnPath The model path of the column which was resized
		 * @param width The new width of the column
		 */
		onColumnWidthChange(columnPath: ModelPath, width: number): void;
	}

	/** Callbacks which are related to a correction mode. */
	export interface CorrectionMode {
		/** Called when the validate button is clicked. */
		onRevalidate(): void;

		/**
		 * Called when the link to an issue or if the "GoToIssue" button in the
		 * quick-access-menu is clicked.
		 * @param messageKey optional key to the message which should be shown in the validation
		 * bar when the element gets focused. If non is given, the current message from the
		 * state will be taken.
		 *
		 */
		onGoToElement(item: CorrectionModeItem, messageKey?: string): void;

		/** Called when the exit button is clicked. */
		onExitCorrectionMode(): void;

		/** Callbacks which are related to a correction view. */
		readonly correctionView: CorrectionMode.CorrectionView;

		readonly validationBar: CorrectionMode.ValidationBar;
	}

	export namespace CorrectionMode {
		/** Callbacks which are related to a correction view. */
		export interface CorrectionView {
			/** Called when the show all issues entry in the quick-access-menu is clicked. */
			onShow(show: boolean): void;

			/** Called when the show/hide details button is clicked. */
			onShowDetails(element: string, showDetails: boolean): void;
		}

		/** Callbacks which are related to a validation bar. */
		export interface ValidationBar {
			/** Called when the message pagination is clicked. */
			onShowMessage(messageKey: string): void;

			/**
			 * Called when the expand/collapse message button is clicked.
			 * @param expand the validation bar should be expanded if set to true
			 * @param resetCurrentMessage the current message in the state should be
			 * reset if set to true.
			 */
			onExpand(expand: boolean, resetCurrentMessage: boolean): void;
		}
	}
}
