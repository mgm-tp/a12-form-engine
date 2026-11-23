// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type {
	DateRangeRepeatFilter,
	DateRepeatFilter,
	RepeatFilter,
	StringRepeatFilter
} from "../../../../../../../../back-end/store/index.js";
import type { FormModel } from "../../../../../../../../models/index.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";

export interface FilterCellPropsBase {
	readonly repeatFormModelPath: ModelPath;
	readonly options: FormModelMap.RenderOptions;
	readonly filter?: RepeatFilter;
}

export interface FilterCellProps extends FilterCellPropsBase {
	readonly element: FormModel.FieldOverviewColumn;
}

export interface DateFilterCellProps extends FilterCellProps {
	readonly dataType: DocumentModel.FieldType;
	readonly filter?: DateRepeatFilter | DateRangeRepeatFilter;
}

export interface StringFilterCellProps extends FilterCellPropsBase {
	readonly element: FormModel.RepeatOverviewColumn;
	readonly filter?: StringRepeatFilter;
}
