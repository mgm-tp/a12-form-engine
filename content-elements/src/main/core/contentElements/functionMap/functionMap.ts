// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	publishFocusFieldEvent,
	useFocusField,
	useFocusFirstError,
	VirtualNode
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import type { publishFocusInputEvent, useFocusInput } from "../focus.js";
import type { useCollectDocumentElementIds } from "../modules/messageGroupContainer/useCollectDocumentElementIds.js";
import type { useCollectEditableElements } from "../modules/messageGroupContainer/useCollectEditableElements.js";
import type { useLinkData } from "../modules/messageGroupDisplay/useLinkData.js";

/** @internal */
export interface FunctionMap {
	computeVirtualNodeId: typeof VirtualNode.computeId;
	publishFocusFieldEvent: typeof publishFocusFieldEvent;
	publishFocusInputEvent: typeof publishFocusInputEvent;
	useCollectDocumentElementIds: typeof useCollectDocumentElementIds;
	useCollectEditableElements: typeof useCollectEditableElements;
	useLinkData: typeof useLinkData;
	useFocusField: typeof useFocusField;
	useFocusFirstError: typeof useFocusFirstError;
	useFocusInput: typeof useFocusInput;
}
