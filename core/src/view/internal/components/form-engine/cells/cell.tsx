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

import type { ComponentType } from "react";
import type { ReactElement } from "react";

import type { LayoutGridProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { ModelSelectors } from "../../../../../back-end/store/index.js";
import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../../../models/index.js";
import { isFormModelControl } from "../../../../../models/internal/FormModelGuards.js";
import * as DocumentModelUtils from "../../../../../models/internal/utils/document-model-utils.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { HelperClasses } from "../../../utilities/css-classes.js";
import { nmTokensToString } from "../../../utilities/nmtokens.js";

import { createFormModelElement } from "../model-components.js";

/**
 * @internal
 *
 * This cannot be a React component, because the LayoutGrid Row expects a
 * LayoutGrid column as its direct descendant. Rendering an additional 'Cell'
 * component in between will break the LayoutGrid.
 * Therefore, React contexts cannot be used here directly and the corresponding
 * values need to be provided as a prop.
 */
export function createCell(props: {
	element: FormModel.Cell;
	config: FormModelMap.RenderConfiguration;
	currentIndex: number;
	LayoutGridColumn: ComponentType<LayoutGridProps.ColumnProps>;
}): ReactElement | null {
	const { element, config, currentIndex, LayoutGridColumn } = props;
	const { renderOptions: options } = config;

	const cellId = UiId.generate({
		element: element,
		uiIdPrefix: options.config.uiIdPrefix,
		suffix: "-group"
	});

	const cellInput = createFormModelElement(element, config);

	if (cellInput !== null) {
		const classes = [];

		if (isFormModelControl(element)) {
			const documentElement = DocumentModelUtils.findByPath(
				ModelSelectors.documentModel()(options.state),
				element.elementPath
			);
			if (
				documentElement.type === "Field" &&
				documentElement.fieldType.type === "NumberType" &&
				(element.style === undefined || element.style.length === 0)
			) {
				classes.push(HelperClasses.RIGHT_ALIGN);
			}

			if (element.style) {
				for (const style of element.style) {
					classes.push(style.name);
				}
			}
		}

		return (
			<LayoutGridColumn
				id={cellId}
				className={nmTokensToString(classes)}
				key={String(currentIndex)}
			>
				{cellInput}
			</LayoutGridColumn>
		);
	}

	return null;
}
