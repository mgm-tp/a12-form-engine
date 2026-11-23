// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createPlatformServerModelLoader } from "@com.mgmtp.a12.client/client-core/lib/extensions/modelLoader/index.js";
import { FormModelProcessor } from "@com.mgmtp.a12.formengine/formengine-core";

import { mockCreateEmptyDocumentDataProvider } from "../mock/mockCreateEmptyDataProvider.js";

import { createPlatformSingleDocumentDataProvider } from "./platformSingleDocumentDataProvider.js";

export const defaultBackendConfig = {
	modelLoader: createPlatformServerModelLoader({ modelProcessors: [FormModelProcessor] }),
	dataHandlers: [mockCreateEmptyDocumentDataProvider(), createPlatformSingleDocumentDataProvider()]
};
