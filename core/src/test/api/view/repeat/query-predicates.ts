// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { isRecord } from "../../../../back-end/utils/internal/guards.js";

export const IdEquals = (id: string) => (value: unknown) =>
	isRecord(value) && "id" in value && value.id === id;

export const ModelElementIdEquals = (id: string) => (value: unknown) =>
	isRecord(value) && "modelElement" in value && IdEquals(id)(value.modelElement);
