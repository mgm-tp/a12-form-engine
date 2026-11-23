// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../../back-end/store/internal/selectors/ui-state.js";
import { getDocumentPath } from "../../../../../../../back-end/utils/internal/path.js";
import type { FormModel } from "../../../../../../../models/index.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import { UtilityClasses } from "../../../../../utilities/css-classes.js";

import { AddButton } from "./AddButton.js";

/** @internal */
export function RepeatAddButton(props: {
	modelElement: FormModel.Repeat;
	config: FormModelMap.RenderConfiguration;
}): JSX.Element {
	const config = props.config;
	const { renderOptions: options } = props.config;
	const { ButtonGroup } = useContext(WidgetMapContext);

	const documentModel = ModelSelectors.documentModel()(options.state);
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(options.state);
	const dataContext = currentScreenLocation.path;
	const documentPath = getDocumentPath(documentModel, props.modelElement.groupPath, dataContext);

	function onAddButtonClick(): void {
		options.eventHandlers.repeat.addRow(documentPath, config.parentPath);
	}

	return (
		<ButtonGroup alignment="left" key="repeat-buttons" className={UtilityClasses.MARGIN_TOP_SM}>
			<AddButton
				element={props.modelElement}
				formModelPath={props.config.parentPath}
				onClick={onAddButtonClick}
				options={config.renderOptions}
			/>
		</ButtonGroup>
	);
}
