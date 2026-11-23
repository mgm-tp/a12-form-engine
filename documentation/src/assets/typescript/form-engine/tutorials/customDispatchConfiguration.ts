// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

// tag::content[]
import { connect } from "react-redux";
import type { Dispatch } from "redux";

import type {
	DefaultDispatchProps,
	DefaultOwnProps,
	DefaultStateProps,
	EngineState
} from "@com.mgmtp.a12.formengine/formengine-core";
import {
	defaultMapDispatchToProps,
	defaultMapStateToProps,
	Events,
	FormEngineRenderer
} from "@com.mgmtp.a12.formengine/formengine-core";

export const EngineConnected = connect<
	DefaultStateProps,
	DefaultDispatchProps,
	DefaultOwnProps,
	EngineState
>(defaultMapStateToProps, function mapDispatchToProps(dispatch: Dispatch): DefaultDispatchProps {
	const defaultDispatchProps = defaultMapDispatchToProps(dispatch);
	return {
		eventHandlers: {
			...defaultDispatchProps.eventHandlers,
			onNavigationButton(target: string): void {
				dispatch(
					Events.navigationButton({
						target,
						validation: "full"
					})
				);
			}
		}
	};
})(FormEngineRenderer);
// end::content[]
