// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { mock } from "node:test";

import type { IMetaEntity } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/lib/main/js/a12internal/meta/IMetaEntity.js";
import type { IMetaKeys } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/lib/main/js/a12internal/utils/IMetaKeys.js";
import type { IGeneratedCodeAccessor } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

export function getValidatorProvider(returnValue?: {
	key: (typeof IMetaKeys)[keyof typeof IMetaKeys];
	value: unknown;
}): IGeneratedCodeAccessor {
	const metaField: IMetaEntity = {
		getValue: mock.fn(key => (key === returnValue?.key ? returnValue.value : undefined)),
		getValidKeys: mock.fn()
	};
	return {
		getValidator: mock.fn(),
		getCalculator: mock.fn(),
		getMetaModel: () => ({
			getValue: () => metaField
		})
	};
}
