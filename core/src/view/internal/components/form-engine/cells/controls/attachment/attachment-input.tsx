// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/index.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import { DataSelectors } from "../../../../../../../back-end/store/index.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../../back-end/store/internal/selectors/ui-state.js";
import { findElementByFormModelPath } from "../../../../../../../models/internal/findElementByFormModelPath.js";
import { FormModel } from "../../../../../../../models/internal/form-model.js";
import { DocumentUtils } from "../../../../../../../models/internal/utils/document-utils.js";
import { ComponentMapContext } from "../../../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap, Inputs } from "../../../../../configuration/engine-configuration.js";
import { SelectorContext } from "../../../../../configuration/selectorContext.js";
import { useDocumentPathForInput } from "../../../../../utilities/document-path.js";
import { evaluateReadonlyPresentation } from "../../../../../utilities/enablements/readonly-presentation.js";

import { useBaseProps } from "../use-input-props.js";

/** @internal */
export function AttachmentInput(props: Inputs.InputProps<DocumentModel.Group>): ReactElement {
	const localizer = useContext(LocalizerContext).localizer;
	const { AttachmentUpload } = useContext(ComponentMapContext);

	const { attachmentThumbnail } = useContext(SelectorContext);

	const options = props.renderConfiguration.renderOptions;

	const value = props.value;

	const attachment = value.data ?? {};
	if (DocumentUtils.isFieldInstanceValue(attachment)) {
		throw new Error("Value is not an attachment!");
	}

	const {
		suffixes,
		errorMessage,
		warningMessage,
		infoMessage,
		addonAfter,
		placeholder,
		...inputProps
	} = useBaseProps(props);

	const { onAttachmentUpload, onAttachmentDelete, onAttachmentDownload, onCancelAttachmentUpload } =
		options.eventHandlers;

	return (
		<AttachmentUpload
			{...inputProps}
			inputRef={props.inputRef}
			attachment={attachment}
			attachmentPath={value.path}
			formModelPath={props.formModelPath}
			errorMessages={props.validationMessages.errors}
			warningMessages={props.validationMessages.warnings}
			infoMessages={props.validationMessages.infos}
			modelElement={props.modelElement}
			readonlyPresentation={evaluateReadonlyPresentation(props.formModelPath, options.state)}
			noDataString={`- ${getLocalizedResource(RESOURCE_KEYS.textOutput.noData, localizer)} -`}
			isMultiFileUploadColumn={isMultiFileUploadColumn(
				ModelSelectors.formModel()(options.state),
				props.formModelPath
			)}
			dispatchUpload={onAttachmentUpload}
			dispatchDelete={onAttachmentDelete}
			dispatchDownload={onAttachmentDownload}
			dispatchCancel={onCancelAttachmentUpload}
			thumbnail={attachmentThumbnail(attachment)(options.state)}
			loading={DataSelectors.Attachments.isLoading(options.state, props.modelElement.elementPath)}
			isUnassigned={DataSelectors.Attachments.isUnassigned(options.state, attachment)}
		/>
	);
}

interface AttachmentForDetachedRepeatTableProps {
	readonly options: FormModelMap.RenderOptions;
	readonly attachment: Attachment;
	readonly repeat: FormModel.Repeat;
	readonly formModelPath: ModelPath;
	readonly uiId: string;
	readonly modelElement: Inputs.ModelElement;
}

/** @internal */
export function AttachmentForDetachedRepeatTable(
	props: AttachmentForDetachedRepeatTableProps
): ReactElement {
	const { AttachmentPreview, AttachmentUpload } = useContext(ComponentMapContext);

	const { options, attachment, repeat, formModelPath, uiId, modelElement } = props;

	const documentModel = ModelSelectors.documentModel()(options.state);

	const attachmentPath = useDocumentPathForInput(modelElement.elementPath, documentModel);

	const { attachmentThumbnail } = useContext(SelectorContext);

	if (modelElement.exposition === "THUMBNAIL_OR_ICON") {
		return (
			<AttachmentPreview
				id={uiId}
				attachment={attachment}
				thumbnail={attachmentThumbnail(attachment)(options.state)}
				repeatRowHeight={
					(FormModel.InlineRepeat.isInstance(repeat) ||
						FormModel.DetachedRepeat.isInstance(repeat)) &&
					repeat.infiniteScrolling
						? repeat.tableStyle?.rowHeight
						: undefined
				}
			/>
		);
	}

	const { onAttachmentUpload, onAttachmentDelete, onAttachmentDownload, onCancelAttachmentUpload } =
		options.eventHandlers;

	return (
		<AttachmentUpload
			id={uiId}
			attachment={attachment}
			attachmentPath={attachmentPath}
			formModelPath={formModelPath}
			readonly={true}
			readonlyPresentation={"TEXT"}
			disabled={UiStateSelectors.disabled()(options.state)}
			modelElement={modelElement}
			isMultiFileUploadColumn={isMultiFileUploadColumn(
				ModelSelectors.formModel()(options.state),
				formModelPath
			)}
			dispatchUpload={onAttachmentUpload}
			dispatchDelete={onAttachmentDelete}
			dispatchDownload={onAttachmentDownload}
			dispatchCancel={onCancelAttachmentUpload}
			thumbnail={attachmentThumbnail(attachment)(options.state)}
			loading={DataSelectors.Attachments.isLoading(options.state, props.modelElement.elementPath)}
			isUnassigned={DataSelectors.Attachments.isUnassigned(options.state, attachment)}
		/>
	);
}

function isMultiFileUploadColumn(formModel: FormModel, formModelPath: ModelPath): boolean {
	const parentPath = formModelPath.slice(0, -1);
	const parentElement = findElementByFormModelPath(formModel, parentPath);
	return (
		!!parentElement &&
		(FormModel.InlineRepeat.isInstance(parentElement) ||
			FormModel.EmbeddedRepeat.isInstance(parentElement)) &&
		!!parentElement.multiFileUpload
	);
}
