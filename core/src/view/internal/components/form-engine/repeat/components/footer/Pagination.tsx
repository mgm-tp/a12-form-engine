// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { ReactElement } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { UiStateSelectors } from "../../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

/** @internal */
export function Pagination(
	options: FormModelMap.RenderOptions,
	pageCount: number,
	pageNumber: number,
	formModelPath: ModelPath,
	key: string | undefined
): ReactElement | null {
	const { Pagination } = useContext(WidgetMapContext);

	return pageCount > 1 ? (
		<Pagination
			alignment="right"
			disabled={UiStateSelectors.disabled()(options.state)}
			currentPage={pageNumber}
			pageCount={pageCount}
			pageLabelTemplate="{page} / {total}"
			onPageChanged={(nextPageNumber: number) => {
				options.eventHandlers.repeat.onChangePage(nextPageNumber, formModelPath);
			}}
			key={key}
		/>
	) : null;
}
