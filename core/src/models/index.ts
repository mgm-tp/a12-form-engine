// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * This module contains the model related functionality of the Form-Engine.
 *
 * @packageDocumentation
 */
export { findElementByFormModelPath } from "./internal/findElementByFormModelPath.js";
export { FormModel } from "./internal/form-model.js";
export { isFormModel } from "./internal/is-form-model.js";
export type { MultiSelectData } from "./internal/utils/document-model-utils.js";
export { DocumentPath, createEmptyDocument } from "./internal/utils/document-utils.js";
export { FormModelPath } from "./internal/utils/form-model-path.js";
export { ReadonlyObjectMap } from "./internal/utils/json.js";
export { defaultValueParser, unmarshallFormModel } from "./internal/utils/unmarshallFormModel.js";
export type { ValueParser } from "./internal/utils/unmarshallFormModel.js";
