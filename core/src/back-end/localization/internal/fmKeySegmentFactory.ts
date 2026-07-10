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
import {
	addDotEscaping,
	localizableKeyFromSegments
} from "@com.mgmtp.a12.utils/utils-localization";

import type { FormModel } from "../../../models/internal/form-model.js";

/**
 * @internal
 * @ignore
 */
export const FmKeySegmentFactory = {
	/** @internal */
	getModelKey(formModel: FormModel): string {
		return localizableKeyFromSegments(["uiModel", formModel.header.id]);
	},

	/** @internal */
	getHeaderKey(formModel: FormModel, propertyName?: string): string {
		const headerKey = `${FmKeySegmentFactory.getModelKey(formModel)}.header`;
		return propertyName ? `${headerKey}.${addDotEscaping(propertyName)}` : headerKey;
	},

	/** @internal */
	getComponentKey(formModel: FormModel, formModelPath: ModelPath, propertyName?: string): string {
		const componentKey = `${FmKeySegmentFactory.getModelKey(formModel)}.${localizableKeyFromSegments(
			formModelPath.map(e => e.elementName)
		)}`;
		return propertyName ? `${componentKey}.${addDotEscaping(propertyName)}` : componentKey;
	},

	/** @internal */
	getComponentDefaultButtonLabel(
		formModel: FormModel,
		type: FormModel.RepeatButtonLabelEnum
	): string {
		return `${FmKeySegmentFactory.getModelKey(formModel)}.defaults.buttonLabel.${addDotEscaping(type.toLowerCase())}`;
	},

	/** @internal */
	getComponentButtonLabel(
		formModel: FormModel,
		formModelPath: ModelPath,
		type: FormModel.RepeatButtonLabelEnum
	): string {
		return `${FmKeySegmentFactory.getComponentKey(formModel, formModelPath)}.buttonLabel.${addDotEscaping(
			type.toLowerCase()
		)}`;
	},

	/** @internal */
	getComponentDefaultConfirmationTitle(
		formModel: FormModel,
		type: FormModel.ConfirmationTextEnum
	): string {
		return `${FmKeySegmentFactory.getModelKey(formModel)}.defaults.confirmationText.${addDotEscaping(
			type.toLowerCase()
		)}.title`;
	},

	/** @internal */
	getComponentConfirmationTitle(
		formModel: FormModel,
		formModelPath: ModelPath,
		type: FormModel.ConfirmationTextEnum
	): string {
		return `${FmKeySegmentFactory.getComponentKey(formModel, formModelPath)}.confirmationText.${addDotEscaping(
			type.toLowerCase()
		)}.title`;
	},

	/** @internal */
	getComponentDefaultConfirmationMessage(
		formModel: FormModel,
		type: FormModel.ConfirmationTextEnum
	): string {
		return `${FmKeySegmentFactory.getModelKey(formModel)}.defaults.confirmationText.${addDotEscaping(
			type.toLowerCase()
		)}.message`;
	},

	/** @internal */
	getComponentConfirmationMessage(
		formModel: FormModel,
		formModelPath: ModelPath,
		type: FormModel.ConfirmationTextEnum
	): string {
		return `${FmKeySegmentFactory.getComponentKey(formModel, formModelPath)}.confirmationText.${addDotEscaping(
			type.toLowerCase()
		)}.message`;
	},

	/** @internal */
	getRepeatRowActionKey(
		formModel: FormModel,
		formModelPath: ModelPath,
		action: FormModel.RowAction,
		property: string
	): string {
		return `${FmKeySegmentFactory.getComponentKey(formModel, formModelPath)}.rowActions.${addDotEscaping(
			action.event
		)}.${addDotEscaping(property)}`;
	},

	/** @internal */
	getRepeatMultiFileUploadKey(
		formModel: FormModel,
		formModelPath: ModelPath,
		property: string
	): string {
		return `${FmKeySegmentFactory.getComponentKey(formModel, formModelPath)}.multiFileUpload.${addDotEscaping(
			property
		)}`;
	}
};
