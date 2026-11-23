// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext } from "react";

import type { EditableElementList } from "./useCollectEditableElements.js";

/**
 * Provides the list of editable elements collected by the nearest
 * MessageGroupContainerModule. Consumers that only need this list
 * should use this context instead of MessageGroupContext so they do
 * not rerender when unrelated message-group state changes.
 */
export const EditableElementsContext = createContext<EditableElementList>([]);
