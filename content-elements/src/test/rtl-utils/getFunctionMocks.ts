// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { mock } from "node:test";

import { DefaultFunctionMap } from "../../main/core/contentElements/functionMap/defaultFunctionMap.js";
import type { FunctionMap } from "../../main/core/contentElements/functionMap/functionMap.js";

export function getFunctionMocks(): FunctionMap {
	return {
		...DefaultFunctionMap,
		publishFocusFieldEvent: mock.fn(),
		publishFocusInputEvent: mock.fn(),
		useCollectDocumentElementIds: mock.fn(),
		useFocusField: mock.fn(),
		useFocusFirstError: mock.fn(),
		useFocusInput: mock.fn(),
		useLinkData: mock.fn()
	};
}
