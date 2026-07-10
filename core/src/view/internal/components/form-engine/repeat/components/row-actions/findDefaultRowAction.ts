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
import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { LocalizableFactory } from "../../../../../../../back-end/localization/internal/localization.js";
import { DataSelectors } from "../../../../../../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import { getDocumentPath } from "../../../../../../../back-end/utils/internal/path.js";
import type { FormModel } from "../../../../../../../models/index.js";
import {
	isFormModelEmbeddedRepeat,
	isFormModelInlineRepeat
} from "../../../../../../../models/internal/FormModelGuards.js";
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
					(isFormModelInlineRepeat(repeat) || isFormModelEmbeddedRepeat(repeat)) &&
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
