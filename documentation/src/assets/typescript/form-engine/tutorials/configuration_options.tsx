// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
