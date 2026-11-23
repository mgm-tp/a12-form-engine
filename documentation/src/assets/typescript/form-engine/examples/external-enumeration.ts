// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	Config,
	IExternalEnumerationProvider,
	ReadonlyObjectMap
} from "@com.mgmtp.a12.formengine/formengine-core";
import { createEngineMiddlewares } from "@com.mgmtp.a12.formengine/formengine-core";
// Definition of an external enumeration provider
export const emptyExternalEnumerationProvider: IExternalEnumerationProvider = (
	source: string,
	path?: ModelPath
): ReadonlyObjectMap<{ [key: string]: string | undefined }> => {
	return {};
};

// tag::example[]
/**
 * Registration in the Config object which is handed
 * to thew view as props
 */
export const config: Partial<Config> = {
	externalEnumerationProvider: emptyExternalEnumerationProvider
};

/**
 * Registration in the engine middlewares by calling
 * 'createEngineMiddlewares' with the provider.
 */
export const formEngineMiddlewares = createEngineMiddlewares({
	externalEnumerationProvider: emptyExternalEnumerationProvider
});
// end::example[]
