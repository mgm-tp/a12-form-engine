// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { ModelSelectors } from "../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../back-end/store/internal/selectors/ui-state.js";
import { notUndefined } from "../../../../../client-extensions/internal/core/utils.js";
import { findElementByFormModelPath, FormModel } from "../../../../../models/index.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { getTitleLabel } from "../../form-engine/model-element-labels.js";

import type { ContentBoxRenderConfiguration } from "../content-box-render-configuration.js";

/** @internal */
export function BreadCrumbs(props: { config: ContentBoxRenderConfiguration }): ReactElement | null {
	const { localizer, conversion } = useContext(LocalizerContext);
	const componentMap = useContext(ComponentMapContext);
	const { Breadcrumb, BreadcrumbItem } = useContext(WidgetMapContext);

	const { renderOptions } = props.config;
	const screenLocation = UiStateSelectors.screenLocationStack()(renderOptions.state);
	const labels = screenLocation
		.map((location, index) => {
			const dataContext = screenLocation.at(index - 1)?.path;
			const repeat = findElementByFormModelPath(
				ModelSelectors.formModel()(renderOptions.state),
				location.locationPath.slice(0, location.locationPath.length - 1)
			);
			if (dataContext && repeat && FormModel.DetachedRepeat.isInstance(repeat)) {
				return (
					getTitleLabel(
						renderOptions,
						repeat,
						location.locationPath,
						dataContext,
						localizer,
						conversion,
						componentMap,
						false
					) ?? ""
				);
			}
			return undefined;
		})
		.filter(notUndefined);

	return labels.filter(label => label.length > 0).length > 0 ? (
		<Breadcrumb>
			{labels.map((label, index) => {
				return (
					<BreadcrumbItem key={index.toString()} data-testid={`breadcrumbItem-${index}`}>
						{label}
					</BreadcrumbItem>
				);
			})}
		</Breadcrumb>
	) : null;
}
