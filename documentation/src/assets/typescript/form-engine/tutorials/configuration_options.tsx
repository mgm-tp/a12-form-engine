/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

// tag::content[]
import type { JSX, ReactNode } from "react";

import type { Config, DefaultOwnProps } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	FormEngineRenderer,
	ScrollHandler,
	useDefaultDispatchProps,
	useDefaultStateProps,
	useScrollHandlerProps
} from "@com.mgmtp.a12.formengine/formengine-core";

export function Engine(props: { readonly uiIdPrefix?: string }): JSX.Element {
	// Setup the Config
	const config: Partial<Config> = {
		uiIdPrefix: props.uiIdPrefix,
		cardView: true
	};

	// Put all together and hand the config via props to the components
	return (
		<ScrollHandlerConnected uiIdPrefix={props.uiIdPrefix}>
			<EngineConnected config={config} />
		</ScrollHandlerConnected>
	);
}

/**
 * Read the connected state via hooks.
 * It is important that the ScrollHandler receives the same uiIdPrefix than the FormEngine
 */
function ScrollHandlerConnected(props: {
	readonly uiIdPrefix?: string;
	readonly children?: ReactNode;
}): JSX.Element {
	const stateProps = useScrollHandlerProps();

	return <ScrollHandler {...props} {...stateProps} />;
}

function EngineConnected(props: DefaultOwnProps): JSX.Element {
	const stateProps = useDefaultStateProps(props);
	const dispatchProps = useDefaultDispatchProps();

	return <FormEngineRenderer {...props} {...stateProps} {...dispatchProps} />;
}
// end::content[]
