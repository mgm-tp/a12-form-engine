// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { actionCreatorFactory } from "typescript-fsa";

import type { Annotation } from "@com.mgmtp.a12.base/base-model-api/lib/main/header/index.js";

const acf = actionCreatorFactory("Annotation");

/** @internal */
export const AddAnnotation = acf("Add");

/** @internal */
export const DeleteAnnotation = acf<DeleteAnnotationPayload>("Delete");

/** @internal */
export interface DeleteAnnotationPayload {
	readonly rowIndex: number;
}

/** @internal */
export const ChangeAnnotation = acf<ChangeAnnotationPayload>("Change");

/** @internal */
export interface ChangeAnnotationPayload {
	readonly rowIndex: number;
	readonly annotation: Partial<Annotation>;
}
