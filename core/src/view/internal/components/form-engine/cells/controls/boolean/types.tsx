// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Inputs } from "../../../../../configuration/engine-configuration.js";

/** @internal */
export type BooleanOrConfirm = DocumentModel.BooleanType | DocumentModel.ConfirmType;
/** * @internal */
export type BooleanOrConfirmInputProps = Inputs.InputProps<BooleanOrConfirm> & {
	readonly coalescing?: boolean;
};
