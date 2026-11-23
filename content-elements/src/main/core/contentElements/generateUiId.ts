// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { assertExists } from "../utils/assertions.js";

/**
 * @internal
 */
export namespace UiId {
	export function generateForControl(params: {
		controlId: string;
		elementPath: ModelPath;
		uiIdPrefix?: string;
	}): string {
		const { controlId, elementPath, uiIdPrefix } = params;

		const prefix = uiIdPrefix ? `${uiIdPrefix}-` : "";

		const elementName = elementPath.at(-1)?.elementName;
		assertExists(elementName);

		return `${prefix}a12-${controlId}-${elementName}`;
	}

	export function generateForErrorTooltip(params: { inputId: string }): string {
		return `${params.inputId}-errors-tooltip`;
	}

	export function generateForWarningTooltip(params: { inputId: string }): string {
		return `${params.inputId}-warnings-tooltip`;
	}

	export function generateForInfoTooltip(params: { inputId: string }): string {
		return `${params.inputId}-infos-tooltip`;
	}

	export function generateForHintTooltip(params: { inputId: string }): string {
		return `${params.inputId}-hint-tooltip`;
	}

	export function generateForSuffix(params: { inputId: string }): string {
		return `${params.inputId}-suffix`;
	}
}
