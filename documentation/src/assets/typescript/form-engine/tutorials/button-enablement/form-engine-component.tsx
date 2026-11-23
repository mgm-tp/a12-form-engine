// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, ReactNode } from "react";
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

const EngineConnected = connect<
	DefaultStateProps,
	DefaultDispatchProps,
	DefaultOwnProps,
	EngineState
>(
	defaultMapStateToProps,
	defaultMapDispatchToProps
)(FormEngineRenderer);

const ScrollHandlerConnected = connect<
	ScrollHandlerProps,
	{},
	{ children?: ReactNode },
	EngineState
>(function mapStateToProps(state) {
	return {
		uiState: state.ui,
		models: state.models
	};
})(ScrollHandler);

export function FormEngineComponent(props: { config: Partial<Config> }): JSX.Element {
	return (
		<ScrollHandlerConnected>
			<EngineConnected config={props.config} />
		</ScrollHandlerConnected>
	);
}
