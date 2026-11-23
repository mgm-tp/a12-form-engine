// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	LocalizableArgs,
	Localizer
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { createResourceLocalizable } from "./factory.js";

/** @internal */
export function getLocalizedResource(
	resourceKey: string,
	localizer: Localizer,
	args: { [key: string]: string } = {}
): string | undefined {
	const localizableArgs: LocalizableArgs = Object.entries(args).reduce(
		(acc, [key, value]) => ({
			...acc,
			[key]: {
				type: "plain",
				value
			}
		}),
		{}
	);
	const localizables = [createResourceLocalizable(resourceKey, localizableArgs)];
	return localizer(...localizables);
}
