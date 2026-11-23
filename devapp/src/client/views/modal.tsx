// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ComponentType, ReactNode } from "react";

import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { devappTranslationSource } from "../config/devappTranslationSource.js";
import { PreviewDataModal } from "../shared.js";

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
