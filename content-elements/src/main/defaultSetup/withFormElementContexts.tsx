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
import { useSelector } from "react-redux";

import type { ViewNGProps } from "@com.mgmtp.a12.client/client-core";
import { ModelSelectors } from "@com.mgmtp.a12.client/client-core";

import type { FormElementConfig, WidgetMap } from "../core/index.js";

import { FormElementContextsProvider } from "./FormElementContextsProvider.js";

/**
 * Higher-order component that wraps a view component with all React contexts required for
 * rendering form content elements. It automatically derives necessary information from the
 * Redux store based on the view's activity ID.
 *
 * Note: For usage without a Redux store or wrapping non-view components the plain
 * `FormElementContextsProvider` can be used directly.
 */
export function withFormElementContexts<T extends ViewNGProps>(options: {
	ViewComponent: React.ComponentType<T>;
	configuration?: FormElementConfig;
	widgetMap?: WidgetMap;
}): React.ComponentType<T> {
	const { ViewComponent, configuration, widgetMap } = options;

	return function FormElementContextsWrapper(props: Readonly<T>): JSX.Element {
		const contentModelName = useSelector(state => selectContentModelName(state, props.activityId));

		return (
			<FormElementContextsProvider
				contentModelName={contentModelName}
				configuration={configuration}
				widgetMap={widgetMap}
			>
				<ViewComponent {...props} />
			</FormElementContextsProvider>
		);
	};
}

function selectContentModelName(state: object, activityId: string): string {
	const modelDescriptors = ModelSelectors.modelDescriptorsByActivityId(activityId)(state);
	return modelDescriptors?.find(d => d.modelType === "content")?.name ?? "";
}
