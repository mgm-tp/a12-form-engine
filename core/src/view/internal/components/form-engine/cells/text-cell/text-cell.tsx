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

import DomPurify from "dompurify";
import type { ReactElement } from "react";
import { useContext, useMemo } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { createLocalizableFactory } from "../../../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../../../back-end/store/index.js";
import type { FormModel } from "../../../../../../models/index.js";
import { FormModelPath } from "../../../../../../models/internal/utils/form-model-path.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";
import { isHidden } from "../../../../utilities/enablements/hidden.js";
import { DataContext } from "../../data-context.js";

const HTML_REGEX = /<\/?[a-z][\s\S]*>/i;

/** @internal */
export function TextCell(props: {
	modelElement: FormModel.TextCell;
	config: FormModelMap.RenderConfiguration;
}): ReactElement | null {
	const {
		modelElement,
		config: { parentPath, renderOptions }
	} = props;

	const { MessageBox } = useContext(WidgetMapContext);
	const { HtmlTextDiv } = useContext(ComponentMapContext);
	const localizer = useContext(LocalizerContext).localizer;
	const dataContext = useContext(DataContext);

	const dm = ModelSelectors.documentModel()(props.config.renderOptions.state);
	const fm = ModelSelectors.formModel()(props.config.renderOptions.state);

	const textCellContent = useMemo(() => {
		const localizableFactory = createLocalizableFactory(dm, fm);
		const formModelPath = FormModelPath.extend(parentPath, modelElement);

		const localizable = localizableFactory.componentContent(modelElement, formModelPath);
		const localizedText = localizer(...localizable) ?? "";

		const sanitizedText = HTML_REGEX.test(localizedText)
			? DomPurify.sanitize(localizer(...localizable) ?? "")
			: localizedText;

		return <HtmlTextDiv content={sanitizedText} data-testid={`${modelElement.id}-htmlTextDiv`} />;
	}, [localizer, dm, fm, modelElement, parentPath, HtmlTextDiv]);

	const isTextCellHidden = isHidden({
		formModelElement: modelElement,
		dataContext,
		state: renderOptions.state
	});
	if (isTextCellHidden) {
		return null;
	}

	return modelElement.decoration ? (
		<MessageBox
			id={modelElement.id}
			label={textCellContent}
			variant={variant(modelElement.decoration)}
			focusOnMessage={false}
		/>
	) : (
		textCellContent
	);
}

const variant = (decoration: FormModel.TextCellDecoration) => {
	switch (decoration) {
		case "INFO":
			return "info";
		case "WARNING":
			return "warning";
		case "SUCCESS":
			return "success";
		case "ERROR":
			return "error";
	}
};
