// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { createLocalizableFactory } from "../../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../../back-end/store/index.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import { getSubtitle } from "../../form-engine/model-element-labels.js";

import { DEFAULT_ARIA_LEVEL } from "../AriaLevelContext.js";
import type { ContentBoxRenderConfiguration } from "../content-box-render-configuration.js";

/** @internal */
export type HeadingElementProps = {
	readonly config: ContentBoxRenderConfiguration;
};

/** @internal */
export function HeadingElement(props: HeadingElementProps): JSX.Element {
	const { localizer, conversion } = useContext(LocalizerContext);
	const componentMap = useContext(ComponentMapContext);
	const { ContentBoxHeader } = componentMap;

	const { config } = props;
	const { renderOptions } = config;

	const documentModel = ModelSelectors.documentModel()(renderOptions.state);
	const formModel = ModelSelectors.formModel()(renderOptions.state);

	const localizableFactory = createLocalizableFactory(documentModel, formModel);

	const localizedTitle = localizer(...localizableFactory.modelLabel(formModel));

	const localizedSubtitle = getSubtitle(
		renderOptions,
		formModel,
		localizer,
		conversion,
		componentMap
	);

	return (
		<ContentBoxHeader
			title={localizedTitle ?? ""}
			subtitle={localizedSubtitle}
			ariaLevel={renderOptions.config.ariaLevel ?? DEFAULT_ARIA_LEVEL}
		/>
	);
}
