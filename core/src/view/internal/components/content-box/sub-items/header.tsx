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

import type { JSX } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

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
