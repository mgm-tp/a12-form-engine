// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * Convenience re-exports of the Form Engine internals the devapp uses, collected here so the deep
 * `lib/**\/internal/` paths stay in one place.
 */

export { createPreviewFormEngineMiddlewares } from "@com.mgmtp.a12.formengine/formengine-core/lib/shared/internal/middlewares/createPreviewFormEngineMiddlewares.js";
export { PreviewDataModal } from "@com.mgmtp.a12.formengine/formengine-core/lib/shared/internal/modal.js";
export { nowProvider } from "@com.mgmtp.a12.formengine/formengine-core/lib/shared/internal/nowValue.js";
export { PreviewApplication } from "@com.mgmtp.a12.formengine/formengine-core/lib/shared/internal/PreviewApplication.js";
export type { PreviewApplicationProps } from "@com.mgmtp.a12.formengine/formengine-core/lib/shared/internal/PreviewApplication.js";
export { getLocales } from "@com.mgmtp.a12.formengine/formengine-core/lib/shared/internal/PreviewLocalizerContext.js";
export {
	previewReducers,
	setCustomTheme,
	setDocumentNames,
	triggerComputeAndValidate
} from "@com.mgmtp.a12.formengine/formengine-core/lib/shared/internal/previewSlice.js";
