// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { isReactElement } from "../../../../../../rtl-utils/mock-utils.js";

/**
 * Return the label value for expressions where it is rendered inside a span.
 */
export function getReactElementContentLabel(label: unknown): string | undefined {
	return isReactElement(label) && typeof label.props.content === "string"
		? label.props.content
		: undefined;
}
