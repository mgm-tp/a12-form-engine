// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { LocalizableFactory } from "../../../../../../back-end/localization/internal/localization.js";
import type { EngineStore } from "../../../../../../back-end/store/internal/store.js";
import type { ExistingFile } from "../../../../../../client-extensions/internal/extensions/form-engine/internal/attachments/utils.js";
import type { FormModel } from "../../../../../../models/internal/form-model.js";
import type { DispatchConfiguration } from "../../../../configuration/dispatch-configuration.js";
import type { Inputs } from "../../../../configuration/engine-configuration.js";
import type { ControlProps } from "../../../form-engine/cells/controls/input-props.js";

import type { RepeatWithMultiFileUpload } from "./attachmentUtils.js";

/** @internal */
export interface AttachmentUploadProps extends Omit<ControlProps, "placeholder"> {
	readonly readonlyPresentation?: FormModel.ReadonlyPresentation;
	readonly noDataString?: string;

	readonly attachment: Attachment;
	readonly attachmentPath: EntityInstancePath;

	readonly formModelPath: ModelPath;

	readonly errorMessages?: Localizable[][];
	readonly warningMessages?: Localizable[][];
	readonly infoMessages?: Localizable[][];

	readonly isMultiFileUploadColumn?: boolean;
	readonly modelElement: Inputs.ModelElement;

	readonly dispatchUpload: DispatchConfiguration["onAttachmentUpload"];
	readonly dispatchDelete: DispatchConfiguration["onAttachmentDelete"];
	readonly dispatchDownload: DispatchConfiguration["onAttachmentDownload"];
	readonly dispatchCancel: DispatchConfiguration["onCancelAttachmentUpload"];

	readonly loading: boolean;
	readonly isUnassigned?: boolean;
	readonly thumbnail?: string;

	readonly inputRef?: React.RefObject<HTMLElement | null>;
}

/** @internal */
export interface MultiAttachmentUploadProps {
	readonly id: string;

	readonly label?: ReactElement | string;
	readonly hideLabel?: boolean;
	readonly disabled?: boolean;
	readonly readonly?: boolean;
	readonly loading: boolean;

	readonly repeat: RepeatWithMultiFileUpload;
	readonly repeatFormModelPath: ModelPath;
	readonly repeatDocumentPath: EntityInstancePath;
	readonly attachmentConfig?: FormModel.AttachmentConfig;

	readonly errorMessages?: EngineStore.Validation.Message[];

	readonly available: number;
	readonly existingFiles: ExistingFile[];

	readonly localizableFactory: LocalizableFactory;

	readonly dispatchUpload: DispatchConfiguration["onAttachmentUpload"];
	readonly dispatchCancel: DispatchConfiguration["onCancelAttachmentUpload"];
}
