// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { LocalizableFactory } from "../../../../../../../back-end/localization/internal/localization.js";
import { DataSelectors } from "../../../../../../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import { getDocumentPath } from "../../../../../../../back-end/utils/internal/path.js";
import { FormModel } from "../../../../../../../models/index.js";
import { DocumentUtils } from "../../../../../../../models/internal/utils/document-utils.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../../../../configuration/engine-configuration.js";

import { getCustomRowActionsInScope } from "./CustomRowActionButton.js";
import type { DefaultRowActionResult } from "./DefaultRowActionResult.js";

/** @internal */
export function findDefaultRowAction(
	repeat: FormModel.DetachedRepeat | FormModel.EmbeddedRepeat,
	disabled: boolean,
	readonly: boolean,
	renderOptions: FormModelMap.RenderOptions,
	repeatFormModelPath: ModelPath
): DefaultRowActionResult | undefined {
	const defaultRowAction = repeat.defaultRowAction;

	if (!defaultRowAction || disabled) {
		return undefined;
	}

	const event = defaultRowAction.event;
	const dispatchConfig = renderOptions.eventHandlers;

	if (defaultRowAction.custom) {
		const rowActionsInScope = getCustomRowActionsInScope(
			repeat,
			renderOptions,
			repeatFormModelPath
		);

		const rowAction = rowActionsInScope.find(action => action.event === event);
		if (rowAction) {
			const triggerAction = (path: EntityInstancePath, modelPath: ModelPath) =>
				dispatchConfig.repeat.onCustomRowAction(path, modelPath, event);
			const getLocalizables = (localizableFactory: LocalizableFactory) =>
				localizableFactory.repeatRowActionLabel(repeatFormModelPath, rowAction);

			return { triggerAction, getLocalizables, eventName: rowAction.event };
		}
		return undefined;
	} else {
		switch (event) {
			case "edit": {
				const triggerAction = (path: EntityInstancePath, modelPath: ModelPath) =>
					dispatchConfig.repeat.enterRow(path, modelPath, "row");
				return {
					triggerAction,
					getLocalizables: (localizableFactory: LocalizableFactory) =>
						localizableFactory.componentButtonLabels(
							repeat,
							repeatFormModelPath,
							readonly ? "VIEW" : "EDIT"
						),
					eventName: DefaultRepeatButtonNames.edit
				};
			}
			case "download": {
				if (
					(FormModel.InlineRepeat.isInstance(repeat) ||
						FormModel.EmbeddedRepeat.isInstance(repeat)) &&
					repeat.multiFileUploadOptions
				) {
					const documentModel = ModelSelectors.documentModel()(renderOptions.state);
					const document = DataSelectors.document()(renderOptions.state) as GroupInstance;

					const triggerAction = (path: EntityInstancePath) => {
						const attachmentDocumentPath = getDocumentPath(
							documentModel,
							repeat?.multiFileUploadOptions?.elementPath ?? [],
							path
						);
						const attachment = DocumentUtils.getValue({ document, path: attachmentDocumentPath });

						if (DocumentUtils.isGroupInstance(attachment)) {
							return dispatchConfig.onAttachmentDownload(attachment, attachmentDocumentPath);
						}

						return undefined;
					};

					return {
						triggerAction,
						getLocalizables: (localizableFactory: LocalizableFactory) =>
							localizableFactory.componentButtonLabels(repeat, repeatFormModelPath, "DOWNLOAD"),
						eventName: DefaultRepeatButtonNames.download
					};
				} else {
					throw new Error("Invalid default row action encountered: " + event);
				}
			}
			default:
				throw new Error("Invalid default row action encountered: " + event);
		}
	}
}
