// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import {
	addDotEscaping,
	localizableKeyFromSegments
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { FormModel } from "../../../models/internal/form-model.js";

/**
 * @internal
 * @ignore
 */
export namespace MeliesKeySegmentFactory {
	/** @internal */
	export function getModelKey(formModel: FormModel): string {
		return localizableKeyFromSegments(["uiModel", formModel.header.id]);
	}

	/** @internal */
	export function getHeaderKey(formModel: FormModel, propertyName?: string): string {
		const headerKey = `${getModelKey(formModel)}.header`;
		return propertyName ? `${headerKey}.${addDotEscaping(propertyName)}` : headerKey;
	}

	/** @internal */
	export function getComponentKey(
		formModel: FormModel,
		formModelPath: ModelPath,
		propertyName?: string
	): string {
		const componentKey = `${getModelKey(formModel)}.${localizableKeyFromSegments(
			formModelPath.map(e => e.elementName)
		)}`;
		return propertyName ? `${componentKey}.${addDotEscaping(propertyName)}` : componentKey;
	}

	/** @internal */
	export function getComponentDefaultButtonLabel(
		formModel: FormModel,
		type: FormModel.RepeatButtonLabelEnum
	): string {
		return `${getModelKey(formModel)}.defaults.buttonLabel.${addDotEscaping(type.toLowerCase())}`;
	}

	/** @internal */
	export function getComponentButtonLabel(
		formModel: FormModel,
		formModelPath: ModelPath,
		type: FormModel.RepeatButtonLabelEnum
	): string {
		return `${getComponentKey(formModel, formModelPath)}.buttonLabel.${addDotEscaping(
			type.toLowerCase()
		)}`;
	}

	/** @internal */
	export function getComponentDefaultConfirmationTitle(
		formModel: FormModel,
		type: FormModel.ConfirmationTextEnum
	): string {
		return `${getModelKey(formModel)}.defaults.confirmationText.${addDotEscaping(
			type.toLowerCase()
		)}.title`;
	}

	/** @internal */
	export function getComponentConfirmationTitle(
		formModel: FormModel,
		formModelPath: ModelPath,
		type: FormModel.ConfirmationTextEnum
	): string {
		return `${getComponentKey(formModel, formModelPath)}.confirmationText.${addDotEscaping(
			type.toLowerCase()
		)}.title`;
	}

	/** @internal */
	export function getComponentDefaultConfirmationMessage(
		formModel: FormModel,
		type: FormModel.ConfirmationTextEnum
	): string {
		return `${getModelKey(formModel)}.defaults.confirmationText.${addDotEscaping(
			type.toLowerCase()
		)}.message`;
	}

	/** @internal */
	export function getComponentConfirmationMessage(
		formModel: FormModel,
		formModelPath: ModelPath,
		type: FormModel.ConfirmationTextEnum
	): string {
		return `${getComponentKey(formModel, formModelPath)}.confirmationText.${addDotEscaping(
			type.toLowerCase()
		)}.message`;
	}

	/** @internal */
	export function getRepeatRowActionKey(
		formModel: FormModel,
		formModelPath: ModelPath,
		action: FormModel.RowAction,
		property: string
	): string {
		return `${getComponentKey(formModel, formModelPath)}.rowActions.${addDotEscaping(
			action.event
		)}.${addDotEscaping(property)}`;
	}

	/** @internal */
	export function getRepeatMultiFileUploadKey(
		formModel: FormModel,
		formModelPath: ModelPath,
		property: string
	): string {
		return `${getComponentKey(formModel, formModelPath)}.multiFileUpload.${addDotEscaping(
			property
		)}`;
	}
}
