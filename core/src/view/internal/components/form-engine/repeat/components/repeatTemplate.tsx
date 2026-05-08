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
 * 1. Open-Source License – EUPL v1.2
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

import type { JSX } from "react";
import { useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { createLocalizableFactory } from "../../../../../../back-end/localization/internal/localization.js";
import { DataSelectors } from "../../../../../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";
import { getDocumentPath } from "../../../../../../back-end/utils/internal/path.js";
import { RepeatData } from "../../../../../../data/internal/repeat.js";
import { FormModel } from "../../../../../../models/index.js";
import { DocumentUtils } from "../../../../../../models/internal/utils/document-utils.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import { UtilityClasses } from "../../../../utilities/css-classes.js";
import { AriaLevelContext } from "../../../content-box/AriaLevelContext.js";
import { isRepeatWithMultiFileUpload } from "../../../widgets/form-engine/attachments/attachmentUtils.js";
import { getTitleLabel } from "../../model-element-labels.js";

import { RepeatUtils } from "./repeat-utils.js";
import { RepeatContent } from "./repeatContent.js";
import type { RepeatTemplateProps } from "./repeatProps.js";

/** @internal */
export function RepeatTemplate(props: RepeatTemplateProps): JSX.Element | null {
	const { modelElement: repeat, dataRole } = props;
	const { renderOptions: options, parentPath: repeatFormModelPath } = props.config;
	const componentMap = useContext(ComponentMapContext);
	const { MultiAttachmentUpload, Title } = componentMap;
	const { localizer, conversion: converter } = useContext(LocalizerContext);

	const currentScreen = UiStateSelectors.currentScreenLocation()(options.state);
	const dataContext = currentScreen.path;

	const documentModel = ModelSelectors.documentModel()(options.state);
	const formModel = ModelSelectors.formModel()(options.state);

	const rowsPath = getDocumentPath(documentModel, repeat.groupPath, dataContext);

	const totalNumberOfRows = DocumentUtils.getRows(
		DataSelectors.document()(options.state) as GroupInstance,
		rowsPath
	).length;

	const processedData = RepeatData.getProcessedData({
		converter,
		localizer,
		repeatDocumentPath: rowsPath,
		state: options.state,
		repeatFormModelPath,
		externalEnumerationProvider: options.config.externalEnumerationProvider,
		filterExpression: repeat.filterExpressionTree,
		tableInteractionDocument: UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
			options.state
		)?.tableInteractionDocument
	});

	const cardView = props.config.renderOptions.config.cardView;

	const uiId = UiId.generate({ element: repeat, uiIdPrefix: options.config.uiIdPrefix });

	const titleLabel = getTitleLabel(
		options,
		repeat,
		props.config.parentPath,
		dataContext,
		localizer,
		converter,
		componentMap
	);
	const titleId = UiId.generateForTitle({
		id: repeat.id,
		uiIdPrefix: options.config.uiIdPrefix
	});
	const className = FormModel.stylableToClassName(repeat);

	const maxRepeatabilityReached = RepeatUtils.maxRepeatabilityReached(
		repeat,
		totalNumberOfRows,
		options.state
	);

	return (
		<div id={uiId} key={uiId} className={className} data-role={dataRole}>
			{titleLabel && !repeat.titleHidden && (
				<AriaLevelContext.Consumer>
					{value => (
						<Title
							id={titleId}
							text={titleLabel}
							ariaLevel={value.ariaLevel}
							initialAriaLevel={options.config.ariaLevel}
							data-testid={UiId.generateForTitle({
								id: repeat.id,
								uiIdPrefix: options.config.uiIdPrefix
							})}
						/>
					)}
				</AriaLevelContext.Consumer>
			)}
			{isRepeatWithMultiFileUpload(repeat) && (
				<div className={UtilityClasses.MARGIN_BOTTOM_SM}>
					<MultiAttachmentUpload
						id={UiId.generateForMultiAttachmentUpload({
							repeat,
							uiIdPrefix: options.config.uiIdPrefix
						})}
						readonly={
							UiStateSelectors.readonly()(options.state) || repeat.readonly || props.readonly
						}
						disabled={UiStateSelectors.disabled()(options.state) || maxRepeatabilityReached}
						repeat={repeat}
						repeatFormModelPath={repeatFormModelPath}
						repeatDocumentPath={rowsPath}
						attachmentConfig={
							formModel.content.fieldConfiguration.fieldMap[
								ModelPath.toString(repeat.multiFileUploadOptions.elementPath)
							]?.attachmentConfig
						}
						localizableFactory={createLocalizableFactory(documentModel, formModel)}
						available={RepeatUtils.getRepeatability(repeat, documentModel) - totalNumberOfRows}
						existingFiles={DataSelectors.Attachments.currentFiles(
							options.state,
							rowsPath,
							repeat.multiFileUploadOptions.elementPath
						)}
						dispatchUpload={options.eventHandlers.onAttachmentUpload}
						dispatchCancel={options.eventHandlers.onCancelAttachmentUpload}
						errorMessages={UiStateSelectors.messagesByPath(
							rowsPath,
							repeatFormModelPath,
							"error"
						)(options.state)}
						loading={DataSelectors.Attachments.isLoading(
							options.state,
							repeat.multiFileUploadOptions.elementPath
						)}
					/>
				</div>
			)}
			<RepeatContent
				{...props}
				cardView={cardView}
				totalNumberOfRows={totalNumberOfRows}
				processedData={processedData}
				tableStyleOptions={props.tableStyleOptions}
			/>
		</div>
	);
}
