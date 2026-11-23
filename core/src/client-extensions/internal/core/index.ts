// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

export { FormActivity } from "./activity/internal/activity.js";
export {
	withConfiguredFormEngine,
	withFormEngine,
	withFormEngineDataHandlers,
	withFormEngineDataReducers,
	withFormEngineMiddlewares,
	withFormEngineSagas,
	withFormEngineView,
	withFormModelSupport
} from "./internal/applicationFactory.js";
export type { ApplicationWithFormEngineConfig } from "./internal/applicationFactory.js";
