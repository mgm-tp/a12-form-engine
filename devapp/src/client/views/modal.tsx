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

import type { ComponentType, ReactNode } from "react";

import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization";
import { PreviewDataModal } from "@com.mgmtp.a12.formengine/formengine-a12internal-preview";

import { devappTranslationSource } from "../config/devappTranslationSource.js";

export type ModalType = "OVERWRITE_LOCAL_STORAGE_DATA" | "OVERWRITE_FORM_DATA";

interface ModalProps {
	onClose(): void;
	onConfirm?(): void;
	readonly activityId: string;
}

export function getModal(type?: ModalType): ComponentType<ModalProps> | undefined {
	if (!type) {
		return undefined;
	}
	switch (type) {
		case "OVERWRITE_LOCAL_STORAGE_DATA":
			return OverwriteLocalStorageDataModal;
		case "OVERWRITE_FORM_DATA":
			return OverwriteFormDataModal;
	}
}

export function OverwriteFormDataModal(props: ModalProps): ReactNode {
	return (
		<PreviewDataModal
			activityId={props.activityId}
			title={localizableFromLocalizationTreeMap(
				"data.modal.overwriteForm.title",
				devappTranslationSource
			)}
			message={localizableFromLocalizationTreeMap(
				"data.modal.overwriteForm.message",
				devappTranslationSource
			)}
			confirmLabel={localizableFromLocalizationTreeMap(
				"data.modal.overwriteForm.confirmLabel",
				devappTranslationSource
			)}
			onClose={props.onClose}
			onConfirm={props.onConfirm}
		/>
	);
}

export function OverwriteLocalStorageDataModal(props: ModalProps): ReactNode {
	return (
		<PreviewDataModal
			activityId={props.activityId}
			title={localizableFromLocalizationTreeMap(
				"data.modal.overwriteLocalStorage.title",
				devappTranslationSource
			)}
			message={localizableFromLocalizationTreeMap(
				"data.modal.overwriteLocalStorage.message",
				devappTranslationSource
			)}
			confirmLabel={localizableFromLocalizationTreeMap(
				"data.modal.overwriteLocalStorage.confirmLabel",
				devappTranslationSource
			)}
			onClose={props.onClose}
			onConfirm={props.onConfirm}
		/>
	);
}
