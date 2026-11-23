// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import DomPurify from "dompurify";
import type { ReactElement } from "react";
import { useContext, useMemo } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

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
