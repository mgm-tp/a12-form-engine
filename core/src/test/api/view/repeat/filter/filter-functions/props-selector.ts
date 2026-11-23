// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { RtlRenderWrapper } from "../../../../../rtl-utils/render-wrapper.js";

export interface FilterInputProps {
	disabled?: boolean;
	readonly?: boolean;
}

export type FilterPropsSelector<T extends FilterInputProps | FilterInputProps[]> = (
	wrapper: RtlRenderWrapper
) => T;
