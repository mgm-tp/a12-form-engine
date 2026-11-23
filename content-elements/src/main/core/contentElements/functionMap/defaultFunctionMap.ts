// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import {
	publishFocusFieldEvent,
	useFocusField,
	useFocusFirstError,
	VirtualNode
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import { publishFocusInputEvent, useFocusInput } from "../focus.js";
import { useCollectDocumentElementIds } from "../modules/messageGroupContainer/useCollectDocumentElementIds.js";
import { useCollectEditableElements } from "../modules/messageGroupContainer/useCollectEditableElements.js";
import { useLinkData } from "../modules/messageGroupDisplay/useLinkData.js";

export const DefaultFunctionMap = {
	computeVirtualNodeId: VirtualNode.computeId,
	publishFocusFieldEvent,
	publishFocusInputEvent,
	useCollectDocumentElementIds,
	useCollectEditableElements,
	useLinkData,
	useFocusField,
	useFocusFirstError,
	useFocusInput
};
