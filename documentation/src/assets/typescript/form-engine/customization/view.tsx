// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

import type { View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import { FormEngineViews } from "@com.mgmtp.a12.formengine/formengine-core";

export namespace AdditionalOptionsExample {
	// tag::additionalOptionsExample[]
	export function formEngineViewsComponentProvider(props: View): JSX.Element {
		return <FormEngineViews.FormEngine {...props} cardView={true} />;
	}
	// end::additionalOptionsExample[]
}
