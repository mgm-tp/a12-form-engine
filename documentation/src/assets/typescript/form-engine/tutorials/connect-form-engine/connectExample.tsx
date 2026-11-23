// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

// tag::content[]
import type { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import type {
	Config,
	DefaultDispatchProps,
	DefaultStateProps
} from "@com.mgmtp.a12.formengine/formengine-core";
import {
	Events,
	FormEngineActions,
	FormEngineStateAdapter,
	FormEngineViews
} from "@com.mgmtp.a12.formengine/formengine-core";

type StateProps = Partial<DefaultStateProps>;

export type OwnProps = View & Partial<Config>;

export function CustomFormEngineView(
	props: StateProps & DefaultDispatchProps & OwnProps
): JSX.Element {
	// default mappings created via helper functions
	const defaultStateProps = useSelector(state =>
		FormEngineStateAdapter.mapStateToProps(state, props)
	);

	const dispatch = useDispatch();
	const defaultDispatchProps = FormEngineActions.mapDispatchToProps(dispatch, props);

	// customizing the state prop mapping
	const customStateProps: Partial<DefaultStateProps> = {
		...defaultStateProps,
		state: defaultStateProps.state
			? {
					...defaultStateProps.state,
					ui: {
						...defaultStateProps.state.ui,
						readonly: true // set the form engine readonly
					}
				}
			: undefined
	};

	// customizing the dispatch prop mapping
	const customDispatchProps: Partial<DefaultDispatchProps> = {
		...defaultDispatchProps,
		eventHandlers: {
			...defaultDispatchProps.eventHandlers,
			onNavigationButton(target: string, validation: "full" | "partial"): void {
				/**
				 * Set the validation property always to full instead of taking
				 * the information from the form model
				 */
				dispatch(
					Events.navigationButton({
						target,
						validation: "full"
					})
				);
			}
		}
	};

	// using the mapped props to connect the form engine template
	return (
		<FormEngineViews.FormEngineTpl {...props} {...customStateProps} {...customDispatchProps} />
	);
}
// end::content[]
