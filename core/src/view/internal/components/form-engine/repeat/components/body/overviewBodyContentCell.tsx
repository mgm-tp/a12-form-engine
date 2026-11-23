// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import { UiId } from "../../../../../../../back-end/utils/internal/generateUiId.js";
import { getDocumentPath } from "../../../../../../../back-end/utils/internal/path.js";
import { getFieldTextValue } from "../../../../../../../data/internal/field-text-value.js";
import type { FormModel } from "../../../../../../../models/index.js";
import { DocumentModelUtils } from "../../../../../../../models/internal/utils/document-model-utils.js";
import { DocumentUtils } from "../../../../../../../models/internal/utils/document-utils.js";
import { FormModelPath } from "../../../../../../../models/internal/utils/form-model-path.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import { ContentWithNewLines } from "../../../../../utilities/contentWithNewLines.js";
import { isHidden } from "../../../../../utilities/enablements/hidden.js";
import type { Value } from "../../../../../utilities/value.js";
import { AttachmentForDetachedRepeatTable } from "../../../cells/controls/attachment/attachment-input.js";
import { getValueForUI } from "../../../cells/controls/getValueForUI.js";
import { getMultiSelectContent } from "../../../cells/controls/multi-select/multi-select-text-output-content.js";
import { DataContext } from "../../../data-context.js";

import type { FieldRepeatTableColumn, RepeatRow } from "../tableColumnTypes.js";

/** @internal */
export interface BodyContentCellProps {
	readonly repeat: FormModel.Repeat;
	readonly column: FieldRepeatTableColumn;
	readonly row: RepeatRow;
	readonly config: FormModelMap.RenderConfiguration;
	readonly displayPartialText?: boolean;
}

/** @internal */
export function OverviewBodyContentCell(props: BodyContentCellProps): JSX.Element | null {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { CssEllipsis, TextOutput } = useContext(WidgetMapContext);

	const { column, config, displayPartialText } = props;

	const state = config.renderOptions.state;
	const documentModel = ModelSelectors.documentModel()(state);
	const dataContext = useContext(DataContext);
	const documentElementPath = getDocumentPath(
		documentModel,
		column.modelElement.elementPath,
		dataContext
	);

	const value = getValueForUI(
		conversion,
		documentElementPath,
		localizer,
		config.renderOptions.config.externalEnumerationProvider
	)(state);

	const col = column.modelElement;
	const isColumnHidden = isHidden({
		formModelElement: col,
		dataContext: value.path,
		state
	});
	if (isColumnHidden) {
		return null;
	}
	const field = DocumentModelUtils.findByPath(
		ModelSelectors.documentModel()(state),
		col.elementPath
	);
	if (field.type === "Field") {
		return <FieldContent {...props} value={value} field={field} />;
	} else if (DocumentModelUtils.isAttachment(field)) {
		return <AttachmentContent {...props} value={value} />;
	} else if (DocumentModelUtils.isMultiSelect(field)) {
		return (
			<TextOutput alignment={column.specificHorizontalAlignment?.body} disableParagraphWrapping>
				{displayPartialText ? (
					<CssEllipsis>{getMultiSelectContent(value, config, localizer, true)}</CssEllipsis>
				) : (
					getMultiSelectContent(value, config, localizer, column.showCommaSeparated)
				)}
			</TextOutput>
		);
	} else {
		throw new Error("Unknown custom type");
	}
}

interface FieldContentProps extends BodyContentCellProps {
	readonly value: Value;
	readonly field: DocumentModel.Field;
}

function FieldContent(props: FieldContentProps): JSX.Element {
	const { column, value, field, config, displayPartialText } = props;
	const { localizer, conversion: converter } = useContext(LocalizerContext);
	const { CssEllipsis, TextOutput } = useContext(WidgetMapContext);

	const content = getFieldTextValue({
		...config.renderOptions.config,
		converter,
		localizer,
		field,
		path: value.path,
		state: config.renderOptions.state,
		value
	});

	return (
		<TextOutput alignment={column.specificHorizontalAlignment?.body} disableParagraphWrapping>
			{displayPartialText ? (
				<CssEllipsis useTooltip>
					<ContentWithNewLines content={content} />
				</CssEllipsis>
			) : (
				<ContentWithNewLines content={content} />
			)}
		</TextOutput>
	);
}

interface AttachmentContentProps extends BodyContentCellProps {
	readonly value: Value;
}

function AttachmentContent(props: AttachmentContentProps): JSX.Element | null {
	const { value, repeat, column, row, config } = props;
	const modelColumn = column.modelElement;

	const attachment = value.data ?? {};
	if (DocumentUtils.isFieldInstanceValue(attachment)) {
		throw new Error("Internal Error!");
	}

	if (Attachment.isInstance(attachment)) {
		// if attachment is not empty
		const formModelPath = FormModelPath.extend(config.parentPath, modelColumn);
		const uiId = UiId.generateForRepeatTableBodyCell({
			id: modelColumn.id,
			uiIdPrefix: config.renderOptions.config.uiIdPrefix,
			rowIndex: row.rowIndexInDocument
		});

		const formModel = ModelSelectors.formModel()(config.renderOptions.state);
		const fce =
			formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(modelColumn.elementPath)];

		return (
			<AttachmentForDetachedRepeatTable
				attachment={attachment}
				repeat={repeat}
				formModelPath={formModelPath}
				options={config.renderOptions}
				uiId={uiId}
				modelElement={{
					elementRef: modelColumn.elementRef,
					elementPath: modelColumn.elementPath,
					exposition: modelColumn.exposition ?? "FULL",
					attachmentConfig: fce?.attachmentConfig
				}}
			/>
		);
	}

	return null;
}
