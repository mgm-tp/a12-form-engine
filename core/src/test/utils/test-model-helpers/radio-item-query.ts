// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Predicate } from "fp-ts/lib/Predicate.js";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { RadioItemProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/radio/main/radio.api.ts";

const DataTestIdPrefix: (prefix: string) => Predicate<RadioItemProps> = prefix => props =>
	"data-testid" in props &&
	typeof props["data-testid"] === "string" &&
	props["data-testid"].startsWith(prefix);

export interface Query {
	withDataTestIdPrefix(prefix: string): RadioItemProps[];
}

export function queryRadioItemsProps(component: React.ComponentType<RadioItemProps>): Query {
	return {
		withDataTestIdPrefix(prefix) {
			return query(component).propsHistory().filter(DataTestIdPrefix(prefix));
		}
	};
}
