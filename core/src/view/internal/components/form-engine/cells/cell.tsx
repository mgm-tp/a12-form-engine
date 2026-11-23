// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ComponentType } from "react";
import type { ReactElement } from "react";

import type { LayoutGridProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/layout-grid/main/layout-grid.api.js";

import { ModelSelectors } from "../../../../../back-end/store/index.js";
import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import { FormModel } from "../../../../../models/index.js";
import { DocumentModelUtils } from "../../../../../models/internal/utils/document-model-utils.js";
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
	SizeContainerColumn: ComponentType<LayoutGridProps.ColumnProps>;
}): ReactElement | null {
	const { element, config, currentIndex, SizeContainerColumn } = props;
	const { renderOptions: options } = config;

	const cellId = UiId.generate({
		element: element,
		uiIdPrefix: options.config.uiIdPrefix,
		suffix: "-group"
	});

	const cellInput = createFormModelElement(element, config);

	if (cellInput !== null) {
		const classes = [];

		if (FormModel.Control.isInstance(element)) {
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
			<SizeContainerColumn
				id={cellId}
				className={nmTokensToString(classes)}
				key={String(currentIndex)}
			>
				{cellInput}
			</SizeContainerColumn>
		);
	}

	return null;
}
