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
import type { ComponentType, JSX, ReactNode } from "react";
import { connect } from "react-redux";

import type {
	Config,
	DefaultDispatchProps,
	DefaultOwnProps,
	DefaultStateProps,
	EngineState,
	ScrollHandlerProps
} from "@com.mgmtp.a12.formengine/formengine-core";
import {
	defaultMapDispatchToProps,
	defaultMapStateToProps,
	FormEngineRenderer,
	ScrollHandler
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
 * Create the connected components.
 * It is important that the ScrollHandler receives the same uiIdPrefix than the FormEngine
 */
const ScrollHandlerConnected: ComponentType<{
	readonly uiIdPrefix?: string;
	readonly children?: ReactNode;
}> = connect<ScrollHandlerProps, {}, { readonly uiIdPrefix?: string }, EngineState>(
	function mapStateToProps(state) {
		return {
			uiState: state.ui,
			models: state.models
		};
	}
)(ScrollHandler);

const EngineConnected = connect<
	DefaultStateProps,
	DefaultDispatchProps,
	DefaultOwnProps,
	EngineState
>(
	defaultMapStateToProps,
	defaultMapDispatchToProps
)(FormEngineRenderer);
// end::content[]
