// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import type { BaseControlProps } from "../../../../types/controlProps.js";
import { TextLineRenderer } from "../../textLine/textLineModule.js";

/**
 * @internal
 *
 * The main purpose of this component is to simplify tests by adding an
 * indirection via the ComponentMap.
 */
export function DateFragmentInput(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element {
	return <TextLineRenderer {...props} />;
}
