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

import type { ReactElement } from "react";
import { useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../back-end/localization/internal/languages/keys.js";
import { createLocalizableFactory } from "../../../../../back-end/localization/internal/localization.js";
import { getLocalizedResource } from "../../../../../back-end/localization/internal/localize.js";
import type { EngineStore } from "../../../../../back-end/store/index.js";
import { ModelSelectors, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import { noop } from "../../../../../internal/noop.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import {
	DocumentPath,
	FormModel,
	findElementByFormModelPath
} from "../../../../../models/index.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import {
	isCommitButtonDisabled,
	isStandardRowActionDisabled
} from "../../../utilities/enablements/disabled-row-actions.js";
import { isStandardRowActionHidden } from "../../../utilities/enablements/hidden-row-actions.js";
import { isReadonly } from "../../../utilities/enablements/readonly.js";

/** @internal */
export function RepeatFooter(props: {
	config: FormModelMap.RenderConfiguration;
	location: EngineStore.ScreenState;
	repeatInstanceState?: ReadonlyObjectMap<EngineStore.Repeat.InstanceState>;
	onButtonClick(cancel: boolean): void;
}): ReactElement | null {
	const localizer = useContext(LocalizerContext).localizer;
	const { ConfirmationButton, ContentBoxFooter } = useContext(ComponentMapContext);

	const { config, repeatInstanceState } = props;
	const { renderOptions } = config;
	const widgetMap = useContext(WidgetMapContext);

	const formModel = ModelSelectors.formModel()(renderOptions.state);

	const dataContext = props.location.path;
	const currentLocationPath = props.location.locationPath;
	const repeatModelPath = currentLocationPath.slice(0, currentLocationPath.length - 1);
	const repeat = findElementByFormModelPath(formModel, repeatModelPath);

	if (
		repeat &&
		(FormModel.EmbeddedRepeat.isInstance(repeat) || FormModel.DetachedRepeat.isInstance(repeat))
	) {
		const isReadOnlyRepeat = isReadonly({
			formModelPath: repeatModelPath,
			dataContext,
			state: renderOptions.state
		});

		const isDisabled = (event: string) =>
			isStandardRowActionDisabled({
				byRow: renderOptions.config.enablements?.byRow || {},
				eventName: event,
				rowIndex: DocumentPath.rowIndex(dataContext),
				state: renderOptions.state,
				repeat
			});

		const isHidden = (event: string) =>
			isStandardRowActionHidden({
				byRow: renderOptions.config.enablements?.byRow || {},
				eventName: event,
				rowIndex: DocumentPath.rowIndex(dataContext),
				state: renderOptions.state,
				repeat,
				enabledInModel: true,
				repeatReadonly: isReadOnlyRepeat
			});

		const buttons: ReactElement[] = [];

		const localizableFactory = createLocalizableFactory(
			ModelSelectors.documentModel()(renderOptions.state),
			ModelSelectors.formModel()(renderOptions.state)
		);

		if (isReadOnlyRepeat) {
			const idReturnButton = UiId.generate({
				element: repeat as { id: string },
				infix: "return-button",
				uiIdPrefix: renderOptions.config.uiIdPrefix
			});

			const returnButtonLocalizables = localizableFactory.componentButtonLabels(
				repeat,
				repeatModelPath,
				"RETURN"
			);
			const returnButtonLabel = localizer(...returnButtonLocalizables);

			const btnReturn = (
				<widgetMap.Button
					key="return"
					id={idReturnButton}
					label={returnButtonLabel ? returnButtonLabel : ""}
					primary={true}
					destructive={false}
					disabled={isDisabled(DefaultRepeatButtonNames.cancel_detached_repeat)}
					onClick={() => {
						props.onButtonClick(true);
					}}
				/>
			);

			if (!isHidden(DefaultRepeatButtonNames.cancel_detached_repeat)) {
				buttons.push(btnReturn);
			}
		} else {
			const currentRepeatPath = ModelPath.toString(repeatModelPath);
			const repeatInstanceStateEntry = repeatInstanceState
				? repeatInstanceState[currentRepeatPath]
				: undefined;

			const mode = repeatInstanceStateEntry
				? repeatInstanceStateEntry.newRow
					? repeatInstanceStateEntry.newRow.rowState === "workingOn"
						? "add"
						: "edit"
					: "edit"
				: "edit";
			const idCancelButton = UiId.generate({
				element: repeat as { id: string },
				infix: `${mode}-cancel-button`,
				uiIdPrefix: renderOptions.config.uiIdPrefix
			});
			const idConfirmButton = UiId.generate({
				element: repeat as { id: string },
				infix: `${mode}-apply-button`,
				uiIdPrefix: renderOptions.config.uiIdPrefix
			});

			const cancelButtonLocalizables = localizableFactory.componentButtonLabels(
				repeat,
				repeatModelPath,
				"CANCEL"
			);
			const cancelButtonLabel = localizer(...cancelButtonLocalizables);

			const screenDirty = UiStateSelectors.currentScreenLocation()(renderOptions.state).dirty;

			const shouldShowConfirmationDialog =
				screenDirty && !renderOptions.config.disableDirtyHandlingForDetachedRepeat;

			const confirmationDialogConfirmButtonLabel = getLocalizedResource(
				RESOURCE_KEYS.repeat.detachedRepeat.button.cancel.confirmation.button.discard,
				localizer
			);
			const confirmationDialogCancelButtonLabel = getLocalizedResource(
				RESOURCE_KEYS.repeat.detachedRepeat.button.cancel.confirmation.button.abort,
				localizer
			);
			const confirmationDialogTitle = getLocalizedResource(
				RESOURCE_KEYS.repeat.detachedRepeat.button.cancel.confirmation.title,
				localizer
			);
			const confirmationDialogMessage = getLocalizedResource(
				RESOURCE_KEYS.repeat.detachedRepeat.button.cancel.confirmation.text,
				localizer
			);

			const cancelButton = (
				<ConfirmationButton
					key={idCancelButton}
					id={idCancelButton}
					label={cancelButtonLabel ? cancelButtonLabel : ""}
					destructive={true}
					confirmButtonDestructive={true}
					primary={false}
					disabled={isDisabled(DefaultRepeatButtonNames.cancel_detached_repeat)}
					action={
						shouldShowConfirmationDialog
							? () => {
									props.onButtonClick(true);
								}
							: noop
					}
					onClick={
						shouldShowConfirmationDialog
							? event => {
									event.stopPropagation();
								}
							: () => {
									props.onButtonClick(true);
								}
					}
					doNotShowConfirmationDialog={!shouldShowConfirmationDialog}
					confirmButtonLabel={confirmationDialogConfirmButtonLabel ?? ""}
					cancelButtonLabel={confirmationDialogCancelButtonLabel ?? ""}
					confirmationDialogTitle={confirmationDialogTitle ?? ""}
					confirmationMessage={confirmationDialogMessage ?? ""}
				/>
			);

			const applyButtonType = mode === "add" ? "COMMIT_ADD" : "APPLY";
			const applyButtonButtonLabel = localizer(
				...localizableFactory.componentButtonLabels(repeat, repeatModelPath, applyButtonType)
			);

			const disable = isCommitButtonDisabled({
				byRow: renderOptions.config.enablements?.byRow || {},
				eventName: DefaultRepeatButtonNames.commit_detached_repeat,
				rowIndex: DocumentPath.rowIndex(dataContext),
				state: renderOptions.state,
				repeat,
				buttonEnablement: formModel.content.detachedRepeatCommitButtonEnablement
			});

			const applyButton = (
				<widgetMap.Button
					key={idConfirmButton}
					id={idConfirmButton}
					label={applyButtonButtonLabel ? applyButtonButtonLabel : ""}
					disabled={disable}
					primary={true}
					onClick={() => {
						props.onButtonClick(false);
					}}
				/>
			);

			if (!isHidden(DefaultRepeatButtonNames.cancel_detached_repeat)) {
				buttons.push(cancelButton);
			}

			if (!isHidden(DefaultRepeatButtonNames.commit_detached_repeat)) {
				buttons.push(applyButton);
			}
		}

		return (
			<ContentBoxFooter>
				<widgetMap.ButtonGroup alignment="right" key="detached-repeat-footer-button-group">
					{buttons}
				</widgetMap.ButtonGroup>
			</ContentBoxFooter>
		);
	}
	return null;
}
