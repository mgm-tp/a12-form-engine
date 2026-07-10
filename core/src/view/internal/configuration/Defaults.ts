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

import type { Dispatch } from "redux";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access";
import type {
	EntityInstancePath,
	FieldInstanceValue
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { ValueConversionParseError } from "@com.mgmtp.a12.utils/utils-localization";

import type { IExternalEnumerationProvider } from "../../../back-end/services/external-enumeration-provider.js";
import { Events } from "../../../back-end/store/internal/actions.js";
import type { CorrectionModeItem } from "../../../back-end/store/internal/CorrectionModeItem.js";
import type {
	EngineState,
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

import { ButtonPanel } from "../components/form-engine/buttons/button-panel.js";
import { EventButton } from "../components/form-engine/buttons/event-button.js";
import { NavigationButton } from "../components/form-engine/buttons/navigation-button.js";
import {
	Control,
	FieldOverviewColumn
} from "../components/form-engine/cells/controls/input-control.js";
import { ExpressionCell } from "../components/form-engine/cells/expression-cell/ExpressionCell.js";
import { ExpressionOverviewColumn } from "../components/form-engine/cells/expression-cell/ExpressionOverviewColumn.js";
import { TextCell } from "../components/form-engine/cells/text-cell/text-cell.js";
import {
	CustomCell,
	CustomScreenElement
} from "../components/form-engine/customizations/custom-element.js";
import { FormEngineComponent } from "../components/form-engine/form-engine-component.js";
import type { FormEngineRendererPropsType } from "../components/form-engine/form-engine-props.js";
import { ControlGrid } from "../components/form-engine/layout/control-grid.js";
import { MultiColumnSection } from "../components/form-engine/layout/multi-column-section.js";
import { Row } from "../components/form-engine/layout/row.js";
import { ScreenComponent } from "../components/form-engine/layout/screen.js";
import { Section } from "../components/form-engine/layout/section.js";
import {
	DetachedRepeat,
	EmbeddedRepeat,
	InlineRepeat
} from "../components/form-engine/repeat/repeats.js";

import { DefaultWidgetMap } from "./DefaultWidgetMap.js";
import type { Config, FormModelMap } from "./engine-configuration.js";
import { DefaultSelectorMap } from "./selectorContext.js";

/**
 * Creates the default DispatchConfiguration.
 * For each UI-event a {@link Events} action will be dispatched.
 * @param dispatch The Redux dispatcher
 */
export function defaultMapDispatchToProps(dispatch: Dispatch): DefaultDispatchProps {
	return {
		eventHandlers: {
			onAttachmentUpload(
				files: AttachmentFile[],
				formModelElementPath: ModelPath,
				pathToRepeatGroup?: EntityInstancePath,
				duplicateStrategy?: DuplicateStrategy,
				existingFiles?: ExistingFile[]
			) {
				dispatch(
					Events.Attachments.uploadAttachments({
						formModelElementPath,
						files,
						pathToRepeatGroup,
						duplicateStrategy,
						existingFiles
					})
				);
			},
			onAttachmentDelete(attachment: Attachment, attachmentPath: EntityInstancePath) {
				dispatch(Events.Attachments.deleteAttachment({ attachment, attachmentPath }));
			},
			onAttachmentDownload(attachment: Attachment, attachmentPath: EntityInstancePath) {
				dispatch(Events.Attachments.downloadAttachment({ attachment, attachmentPath }));
			},
			onCancelAttachmentUpload() {
				dispatch(Events.Attachments.cancelUploadAttachments());
			},
			onValueChange(
				path: EntityInstancePath,
				value: FieldInstanceValue,
				formModelElementPath: ModelPath
			): void {
				dispatch(Events.valueChange({ path, value, formModelElementPath }));
			},
			onInputTouched(): void {
				dispatch(Events.inputTouched());
			},
			onParseError(
				path: EntityInstancePath,
				uiValue: string,
				error: ValueConversionParseError
			): void {
				dispatch(Events.parseError({ path, uiValue, error }));
			},
			onCollapseSection(collapse: boolean, path: ModelPath): void {
				dispatch(Events.collapseSection({ path, collapse }));
			},
			onNavigationButton(target: string, validation?: FormModel.ButtonValidationEnum): void {
				dispatch(Events.navigationButton({ target, validation }));
			},
			onEventButton(
				name: string,
				buttonPath: ModelPath,
				validation?: FormModel.ButtonValidationEnum
			): void {
				dispatch(Events.eventButtonTriggered({ name, validation, buttonPath }));
			},
			onAttachmentValueChange(
				path: EntityInstancePath,
				value: Attachment,
				formModelElementPath: ModelPath
			): void {
				dispatch(Events.attachmentValueChange({ path, value, formModelElementPath }));
			},
			onMultiFileUpload(
				path: EntityInstancePath,
				toBeAdded: Attachment[],
				attachmentModelPath: ModelPath,
				repeatFormModelPath?: ModelPath,
				toBeReplaced?: { path: EntityInstancePath; value: Attachment }[]
			): void {
				dispatch(
					Events.Repeat.multiFileUpload({
						path,
						repeatFormModelPath,
						attachmentModelPath,
						toBeAdded,
						toBeReplaced
					})
				);
			},
			onMultiSelectValueChange(
				path: EntityInstancePath,
				value: MultiSelectData,
				formModelElementPath: ModelPath
			): void {
				dispatch(Events.multiSelectValueChange({ path, value, formModelElementPath }));
			},
			onUserConfirmationResponse(response) {
				dispatch(Events.userConfirmationResponse(response));
			},
			repeat: {
				onMoveRow(
					repeatFormModelPath: ModelPath,
					rowPath: EntityInstancePath,
					delta: number
				): void {
					dispatch(Events.Repeat.moveRowTriggered({ repeatFormModelPath, rowPath, delta }));
				},
				onCloneRow(rowPath: EntityInstancePath, repeatFormModelPath: ModelPath): void {
					dispatch(Events.Repeat.cloneRowTriggered({ rowPath, repeatFormModelPath }));
				},
				onLeaveRepeatRow(rowPath: EntityInstancePath, repeatFormModelPath: ModelPath): void {
					dispatch(Events.Repeat.leaveRepeatRow({ rowPath, repeatFormModelPath }));
				},
				onLeaveTable(repeatFormModelPath: ModelPath): void {
					dispatch(Events.Repeat.leaveRepeatTable({ repeatFormModelPath }));
				},
				addRow(path: EntityInstancePath, repeatFormModelPath: ModelPath): void {
					dispatch(Events.Repeat.addRow({ path, repeatFormModelPath }));
				},
				onLeaveDetachedRepeatRow(cancel: boolean): void {
					dispatch(Events.Repeat.leaveDetachedRepeatRow({ cancel }));
				},
				onCloseEmbeddedRepeatRow(repeatFormModelPath: ModelPath): void {
					dispatch(Events.Repeat.closeEmbeddedRepeatRow({ repeatFormModelPath }));
				},
				onSortingChange(
					repeatFormModelPath: ModelPath,
					orderPath: EntityInstancePath,
					sorting: "asc" | "desc" | undefined
				): void {
					dispatch(Events.Repeat.sortingChange({ repeatFormModelPath, orderPath, sorting }));
				},
				onShowFilter(repeatFormModelPath: ModelPath, opened: boolean): void {
					// rename opened to show
					dispatch(Events.Repeat.showFilter({ repeatFormModelPath, opened }));
				},
				onFilterValueChange(
					repeatFormModelPath: ModelPath,
					columnId: string,
					filter?: RepeatFilter
				): void {
					dispatch(Events.Repeat.filterValueChange({ repeatFormModelPath, filter, columnId }));
				},
				onFilterParseError(
					columnId: string,
					repeatFormModelPath: ModelPath,
					errors: RangeFilterParseError | FilterParseError
				): void {
					dispatch(Events.Repeat.filterParseError({ columnId, repeatFormModelPath, errors }));
				},
				onClearFilters(repeatFormModelPath: ModelPath): void {
					dispatch(Events.Repeat.clearFilters({ repeatFormModelPath }));
				},
				removeRow(rowPath: EntityInstancePath, repeatFormModelPath: ModelPath): void {
					dispatch(Events.Repeat.removeRow({ rowPath, repeatFormModelPath }));
				},
				onChangePage(page: number, repeatFormModelPath: EntityInstancePath): void {
					dispatch(Events.Repeat.changePage({ repeatFormModelPath, page }));
				},
				onCustomRowAction(
					rowPath: EntityInstancePath,
					repeatFormModelPath: ModelPath,
					eventName: string
				): void {
					dispatch(Events.Repeat.customRowAction({ rowPath, eventName, repeatFormModelPath }));
				},
				enterRow(
					rowPath: EntityInstancePath,
					repeatFormModelPath: ModelPath,
					triggerElement: "edit-button" | "row"
				): void {
					dispatch(Events.Repeat.enterRow({ rowPath, repeatFormModelPath, triggerElement }));
				},
				onColumnWidthChange(columnPath: ModelPath, width: number): void {
					dispatch(Events.Repeat.changeColumnWidth({ columnPath, width }));
				}
			},
			correctionMode: {
				onRevalidate(): void {
					dispatch(Events.CorrectionMode.revalidate());
				},
				onGoToElement(item: CorrectionModeItem, messageKey?: string): void {
					dispatch(Events.CorrectionMode.goToElement({ item, messageKey }));
				},
				onExitCorrectionMode(): void {
					dispatch(Events.CorrectionMode.exitCorrectionMode({}));
				},
				correctionView: {
					onShow(show: boolean): void {
						dispatch(Events.CorrectionMode.CorrectionView.show({ show }));
					},
					onShowDetails(element: string, showDetails: boolean): void {
						dispatch(Events.CorrectionMode.CorrectionView.showDetails({ element, showDetails }));
					}
				},

				validationBar: {
					onShowMessage(messageKey: string): void {
						dispatch(Events.CorrectionMode.ValidationBar.showMessage({ messageKey }));
					},
					onExpand(expanded: boolean, resetCurrentMessage: boolean): void {
						dispatch(Events.CorrectionMode.ValidationBar.expand({ expanded, resetCurrentMessage }));
					}
				}
			}
		}
	};
}

/** Type for the default state props which is returned by {@link defaultMapStateToProps} */
export type DefaultStateProps = Pick<FormEngineRendererPropsType, "state" | "config">;
/** Type for the default state props which is returned by {@link defaultMapDispatchToProps} */
export type DefaultDispatchProps = Pick<FormEngineRendererPropsType, "eventHandlers">;
/** Default own props for the render. */
export interface DefaultOwnProps {
	/**
	 * Partial {@link Config} for the view.
	 */
	readonly config?: Partial<Config>;
}

/**
 * Function to map the state to the state props which are needed to
 * render the view.
 * The default implementation maps the state directly to the props.
 */
export function defaultMapStateToProps(
	state: EngineState,
	ownProps: DefaultOwnProps
): DefaultStateProps {
	return {
		state,
		config: createConfig(ownProps.config ?? {})
	};
}

/** @internal */
export function createConfig(config: Partial<Config>): Config {
	return {
		...config,
		cardView: config.cardView ?? false,
		disableDatePicker: config.disableDatePicker ?? false,
		hideCustomEnumerationValue: config.hideCustomEnumerationValue ?? false,
		earlyDetectDirtyControl: config.earlyDetectDirtyControl ?? false,
		externalEnumerationProvider:
			config.externalEnumerationProvider ?? DefaultExternalEnumerationProvider,
		uiIdPrefix: config.uiIdPrefix,
		ariaLevel: config.ariaLevel ?? 1,
		formModelMap: config.formModelMap ?? DefaultFormModelMap,
		widgetMap: config.widgetMap ?? DefaultWidgetMap,
		selectorMap: config.selectorMap ?? DefaultSelectorMap
	};
}

/** @internal */
export const DefaultExternalEnumerationProvider: IExternalEnumerationProvider = () => ({});

/**
 * Default map for the form model elements.
 */
export const DefaultFormModelMap: FormModelMap = {
	// Container
	Form: { component: FormEngineComponent },
	Screen: { component: ScreenComponent },
	Section: { component: Section },
	ControlGrid: { component: ControlGrid },
	MultiColumnSection: { component: MultiColumnSection },
	Row: { component: Row },
	ButtonPanel: { component: ButtonPanel },

	// Cells and FieldColumns
	Control: { component: Control },
	FieldOverviewColumn: { component: FieldOverviewColumn },
	TextCell: { component: TextCell },
	ExpressionCell: { component: ExpressionCell },
	ExpressionOverviewColumn: { component: ExpressionOverviewColumn },

	// Repeats
	InlineRepeat: { component: InlineRepeat },
	DetachedRepeat: { component: DetachedRepeat },
	EmbeddedRepeat: { component: EmbeddedRepeat },

	// Buttons
	NavigationButton: { component: NavigationButton },
	EventButton: { component: EventButton },

	// Customizations
	CustomCell: { component: CustomCell },
	CustomScreenElement: { component: CustomScreenElement }
};
