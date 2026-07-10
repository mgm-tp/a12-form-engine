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
import type { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { View } from "@com.mgmtp.a12.client/client-core";
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
