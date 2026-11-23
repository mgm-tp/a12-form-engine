// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";

import { createLocalizableFactory } from "../../../../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../../back-end/store/internal/selectors/ui-state.js";
import { FormModel } from "../../../../../../../models/index.js";
import { DocumentPath } from "../../../../../../../models/internal/utils/document-utils.js";
import { ComponentMapContext } from "../../../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import { isCustomRowActionDisabled } from "../../../../../utilities/enablements/disabled-row-actions.js";
import { isCustomRowActionHidden } from "../../../../../utilities/enablements/hidden-row-actions.js";
import { isReadonly } from "../../../../../utilities/enablements/readonly.js";
import { DataContext } from "../../../data-context.js";
import { getDescription, getLabel, getLabelAsHtml } from "../../../model-element-labels.js";

import { MenuContext } from "../MenuContext.js";
import type { RepeatRow } from "../tableColumnTypes.js";

import { getListItemProps } from "./getListItemProps.js";
import { getScreenReaderCellId } from "./getScreenReaderCellId.js";

/** @internal */
export function getCustomRowActionsInScope(
	repeat: FormModel.InlineRepeat | FormModel.DetachedRepeat | FormModel.EmbeddedRepeat,
	renderOptions: FormModelMap.RenderOptions,
	repeatFormModelPath: ModelPath
): FormModel.RowAction[] {
	const rowActionGroup = repeat.rowActionGroup;

	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(renderOptions.state);
	const dataContext = currentScreenLocation.path;
	const isRepeatReadonly = isReadonly({
		formModelPath: repeatFormModelPath,
		dataContext,
		state: renderOptions.state
	});

	if (rowActionGroup && rowActionGroup.action) {
		return rowActionGroup.action.filter(a =>
			isRepeatReadonly
				? a.scope !== "DISABLED_IN_READONLY_MODE" && a.scope !== "HIDDEN_IN_READONLY_MODE"
				: a.scope !== "DISABLED_IN_EDIT_MODE" && a.scope !== "HIDDEN_IN_EDIT_MODE"
		);
	}
	return [];
}

/** @internal */
export function CustomRowActionButton(props: {
	id: string;
	row: RepeatRow;
	repeatFormModelPath: ModelPath;
	action: FormModel.RowAction;
	index: number;
	renderOptions: FormModelMap.RenderOptions;
	repeat: FormModel.Repeat;
	repeatReadonly?: boolean;
}): ReactElement | null {
	const { id, row, repeatFormModelPath, action, index, renderOptions, repeat } = props;
	const componentMap = useContext(ComponentMapContext);
	const { ConfirmationButton } = componentMap;
	const { Button, Icon, ListItem } = useContext(WidgetMapContext);
	const currentContext = useContext(DataContext);
	const { renderAsListItem } = useContext(MenuContext);
	const { localizer, conversion } = useContext(LocalizerContext);

	const hidden = isCustomRowActionHidden({
		byRow: renderOptions.config.enablements?.byRow ?? {},
		eventName: action.event,
		rowIndex: DocumentPath.rowIndex(row.path),
		state: renderOptions.state,
		repeat,
		repeatFormModelPath,
		scope: action.scope,
		repeatReadonly: props.repeatReadonly
	});

	if (hidden) {
		return null;
	}

	const actionLabel = getLabel({
		options: renderOptions,
		element: action,
		formModelPath: repeatFormModelPath,
		dataContext: currentContext,
		localizer,
		converter: conversion
	});

	const actionLabelAsHtml = getLabelAsHtml(actionLabel, action, componentMap);

	const actionDescription = getDescription({
		options: renderOptions,
		element: action,
		formModelPath: repeatFormModelPath,
		localizer
	});

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(renderOptions.state),
		ModelSelectors.formModel()(renderOptions.state)
	);

	const actionDialogTitle = localizer(
		...localizableFactory.repeatRowActionDialogTitle(repeatFormModelPath, action)
	);

	const icon = action.buttonStyling?.icon ? (
		<Icon iconTheme={action.buttonStyling.icon?.theme}>{action.buttonStyling.icon?.name}</Icon>
	) : undefined;

	const cellId = getScreenReaderCellId(repeat, row, props.renderOptions.config.uiIdPrefix);

	const ariaLabelText =
		actionLabel && actionDescription
			? `${actionLabel} - ${actionDescription}`
			: (actionLabel ?? actionDescription);

	const baseButtonProps: Partial<ButtonProps> = {
		id,
		label: icon && action.buttonStyling?.labelHidden ? undefined : actionLabelAsHtml,
		title:
			icon && action.buttonStyling?.labelHidden
				? (actionDescription ?? actionLabel)
				: actionDescription,
		buttonAttributes: {
			"aria-labelledby": cellId ? `${id} ${cellId}` : id,
			"aria-label": ariaLabelText
		},
		icon,
		primary: action.buttonStyling?.priority === "PRIMARY",
		destructive: action.buttonStyling?.destructive,
		disabled: isCustomRowActionDisabled({
			byRow: renderOptions.config.enablements?.byRow ?? {},
			eventName: action.event,
			rowIndex: DocumentPath.rowIndex(row.path),
			scope: action.scope,
			state: renderOptions.state,
			repeat,
			repeatReadonly: props.repeatReadonly
		}),
		className: FormModel.stylableToClassName(action.buttonStyling)
	};

	if (action.confirmation) {
		const cancelButtonLabel = localizer(
			...localizableFactory.componentButtonLabels(repeat, repeatFormModelPath, "CANCEL")
		);

		const confirmButtonLabel = localizer(
			...localizableFactory.componentButtonLabels(repeat, repeatFormModelPath, "CONFIRM")
		);

		const confirmationMessageLabel = localizer(
			...localizableFactory.repeatRowActionConfirmation(repeatFormModelPath, action)
		);

		return (
			<ConfirmationButton
				key={String(index)}
				{...baseButtonProps}
				action={() => {
					renderOptions.eventHandlers.repeat.onCustomRowAction(
						row.path,
						repeatFormModelPath,
						action.event
					);
				}}
				onClick={event => {
					event.stopPropagation();
				}}
				confirmButtonDestructive={baseButtonProps.destructive}
				confirmButtonLabel={confirmButtonLabel ?? ""}
				cancelButtonLabel={cancelButtonLabel ?? ""}
				confirmationMessage={confirmationMessageLabel ?? ""}
				confirmationDialogTitle={actionDialogTitle || actionLabel}
				labelForContextMenuItem={actionLabelAsHtml}
				titleForContextMenuItem={actionDescription}
			/>
		);
	} else {
		const buttonProps = {
			...baseButtonProps,
			onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
				renderOptions.eventHandlers.repeat.onCustomRowAction(
					row.path,
					repeatFormModelPath,
					action.event
				);
				event.stopPropagation();
			}
		};

		return renderAsListItem ? (
			<ListItem
				key={String(index)}
				{...getListItemProps({
					...buttonProps,
					label: actionLabelAsHtml,
					title: actionDescription
				})}
			/>
		) : (
			<Button key={String(index)} {...buttonProps} />
		);
	}
}
