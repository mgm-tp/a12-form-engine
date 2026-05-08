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
