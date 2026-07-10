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

import { useRef, useState } from "react";
import type { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { ViewNGProps } from "@com.mgmtp.a12.client/client-core";
import {
	Activity,
	ActivityActions,
	ActivitySelectors,
	LocaleSelectors,
	NEW_INSTANCE_IDENTIFIER,
	NotificationActions
} from "@com.mgmtp.a12.client/client-core";
import {
	PreviewApplication,
	setCustomTheme,
	triggerComputeAndValidate
} from "@com.mgmtp.a12.formengine/formengine-a12internal-preview";
import type { FormActivity } from "@com.mgmtp.a12.formengine/formengine-core";
import { FormEngineSelectors } from "@com.mgmtp.a12.formengine/formengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization";
import { DefaultLocalizerContextProvider } from "@com.mgmtp.a12.utils/utils-localization-react";
import { ApplicationHeader, ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core";
import type { Container, DefaultThemeType } from "@com.mgmtp.a12.widgets/widgets-core";

import { VersionHeaderInfo } from "../components/VersionHeaderInfo.js";
import { devappTranslationSource } from "../config/devappTranslationSource.js";

import { HiddenFileInput } from "./HiddenFileInput.js";
import type { ModalType } from "./modal.js";
import { getModal } from "./modal.js";
import { useMenuItems } from "./useMenuItems.js";

const DATA_LS_KEY = "devapp.data";

const documentService = new DocumentServiceFactory().getDocumentService();

const tmpAnchorElement = document.createElement("a");

export interface PreviewProps extends ViewNGProps, Container {}

type FileUploadType = "document" | "theme";

/**
 * A wrapper component for the FormEngine view
 *
 * Uses a customized PreviewApplication to:
 *
 * - extend the default sidebar with buttons
 * - visualize activity errors at the top
 */
export default function CustomPreviewApp(props: PreviewProps): JSX.Element {
	const { activityId } = props;

	const dispatch = useDispatch();

	const [modal, setModal] = useState<ModalType | undefined>(undefined);

	const locale = useSelector(
		LocaleSelectors.locale(),
		(left, right) => left.country === right.country && left.language === right.language
	);

	const BackButton = (
		<ContentBoxElements.BackButton
			onClick={() => dispatch(ActivityActions.cancel({ activityId }))}
			key="back-button"
		/>
	);

	const applicationHeader = (
		<>
			<ApplicationHeader
				leftSlots={[BackButton, <span key="name">Form Engine DevApp</span>]}
				rightSlots={[<VersionHeaderInfo key="version" />]}
			/>
		</>
	);

	const fileUploadElementRef = useRef<HTMLInputElement>(null);
	const fileUploadType = useRef<FileUploadType>(null);

	const documentModel = useSelector(
		state => FormEngineSelectors.models(activityId)(state)?.documentModel
	);

	const { id, modelId, ...feDocument } =
		useSelector(
			state =>
				(
					ActivitySelectors.data(activityId)(state) as
						| FormActivity.Data.SingleDocumentData
						| undefined
				)?.document
		) ?? {};

	function handleOnDataUploaded(data: object): void {
		if (documentModel) {
			const parsedData = documentService.parseDates(data, documentModel);
			const document = {
				...parsedData,
				id: NEW_INSTANCE_IDENTIFIER,
				modelId: documentModel.header.id
			};
			if (!Activity.Data.Document.isInstance(document)) {
				throw new Error("Imported data is not a valid document!");
			}
			dispatch(triggerComputeAndValidate({ activityId, document }));
		}
	}

	function handleOnThemeUploaded(data: object): void {
		// there is no typeguard for Widget themes (yet?), for now assume its correct
		dispatch(setCustomTheme({ activityId, customTheme: data as DefaultThemeType }));
	}

	function handleOverwriteFormData(): void {
		const data = localStorage.getItem(DATA_LS_KEY);

		if (data) {
			handleOnDataUploaded(JSON.parse(data));
		}
	}

	function handleOnSaveData(data: object, documentModel: DocumentModel): string {
		const formattedData = documentService.formatDates(data, documentModel);
		const dataJson = JSON.stringify(formattedData, null, 2);
		return dataJson;
	}

	function handleOverwriteLocalStorageData(): void {
		if (!documentModel) {
			return;
		}
		const dataJson = handleOnSaveData(feDocument, documentModel);
		localStorage.setItem(DATA_LS_KEY, dataJson);

		dispatch(
			NotificationActions.add({
				activityId,
				title: localizableFromLocalizationTreeMap("data.export.success", devappTranslationSource),
				severity: "success",
				duration: 5000
			})
		);
	}

	const additionalMenuItems = useMenuItems({
		activityId,
		onExportData: () => {
			if (!documentModel) {
				return;
			}
			const dataJson = handleOnSaveData(feDocument, documentModel);

			const blob = new Blob([dataJson], { type: "data:application/json;charset=utf-8" });
			const fileName = `data-${new Date().getTime()}.json`;

			const url = URL.createObjectURL(blob);

			tmpAnchorElement.href = url;
			tmpAnchorElement.download = fileName;
			tmpAnchorElement.click();

			URL.revokeObjectURL(url);
		},
		onImportData: () => {
			fileUploadType.current = "document";
			fileUploadElementRef.current?.click();
		},
		onSaveData: () => {
			if (localStorage.getItem(DATA_LS_KEY) === null) {
				handleOverwriteLocalStorageData();
			} else {
				setModal("OVERWRITE_LOCAL_STORAGE_DATA");
			}
		},
		onRestoreData: () => {
			const data = localStorage.getItem(DATA_LS_KEY);
			if (!data) {
				dispatch(
					NotificationActions.add({
						activityId,
						title: localizableFromLocalizationTreeMap(
							"data.restore.noData",
							devappTranslationSource
						),
						duration: 5000
					})
				);
			} else {
				setModal("OVERWRITE_FORM_DATA");
			}
		},
		onImportTheme: () => {
			fileUploadType.current = "theme";
			fileUploadElementRef.current?.click();
		}
	});

	const Modal = getModal(modal);

	return (
		<DefaultLocalizerContextProvider locale={locale}>
			{Modal && (
				<Modal
					activityId={activityId}
					onClose={() => setModal(undefined)}
					onConfirm={() => {
						if (modal === "OVERWRITE_LOCAL_STORAGE_DATA") {
							handleOverwriteLocalStorageData();
						} else if (modal === "OVERWRITE_FORM_DATA") {
							handleOverwriteFormData();
						}
					}}
				/>
			)}
			<HiddenFileInput
				activityId={activityId}
				inputRef={fileUploadElementRef}
				onDataUploaded={data => {
					if (fileUploadType.current === "document") {
						handleOnDataUploaded(data);
					} else if (fileUploadType.current === "theme") {
						handleOnThemeUploaded(data);
					}
				}}
			/>
			<PreviewApplication
				{...props}
				name="preview"
				applicationHeader={applicationHeader}
				additionalMenuItems={additionalMenuItems}
			/>
		</DefaultLocalizerContextProvider>
	);
}
