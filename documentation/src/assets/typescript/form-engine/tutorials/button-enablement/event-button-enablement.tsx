// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useMemo } from "react";
import type { JSX } from "react";
import { useSelector } from "react-redux";

import type { Config, EngineState } from "@com.mgmtp.a12.formengine/formengine-core";
import { DataSelectors } from "@com.mgmtp.a12.formengine/formengine-core";

import { FormEngineComponent } from "./form-engine-component.js";

// tag::engine[]
export function CustomButtonEnablementEngine(): JSX.Element {
	const dirty = useSelector(state => DataSelectors.dirty()(state as EngineState));

	const config: Partial<Config> = useMemo(
		() => ({
			enablements: {
				byButtonName: {
					["submit"]: {
						disabled: !dirty
					}
				}
			}
		}),
		[dirty]
	);
	return <FormEngineComponent config={config} />;
}
// end::engine[]
