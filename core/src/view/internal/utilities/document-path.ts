// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { getDocumentPath } from "../../../back-end/utils/internal/path.js";

import { DataContext } from "../components/form-engine/data-context.js";

/**
 * A hook for retrieving the document path for a given document model path
 * taking the current data context into account
 *
 * @param documentModelPath The document model path of the field for which the
 * document path should be selected
 *
 */
export function useDocumentPathForInput(
	documentModelPath: ModelPath,
	documentModel: DocumentModel
): EntityInstancePath {
	const dataContext = useContext(DataContext);
	return getDocumentPath(documentModel, documentModelPath, dataContext);
}
