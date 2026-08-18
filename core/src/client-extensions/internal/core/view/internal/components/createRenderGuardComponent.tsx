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
 * 1. Open-Source License – EUPL v1.2
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

import type { ComponentType, JSX, ReactNode } from "react";
import { Component as ReactComponent } from "react";
import { connect } from "react-redux";

import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils.js";

const className = addPrefix("-u-height-full", "-u-width-full");
function Placeholder(): JSX.Element | null {
	return <div className={className}></div>;
}

/**
 * @internal
 *
 * @summary This factory creates a component that guarantees that the provided
 * `Component` is only rendered if all necessary props are complete. In addition,
 * it can prevent unintended updates of the provided `Component` during state
 * transitions in order to minimize flickering of th UI.
 *
 * @description For the initial render the created component shows the
 * `PlaceholderComponent` as long as the props are not complete. As soon as the
 * props are complete the provided `Component` is shown, even though the state
 * may not be complete yet. Like this the `PlaceholderComponent` is shown as
 * short as possible.
 * After the initial rendering of the provided `Component` the created component
 * only updates the provided `Component` if the props and state are complete. This
 * prevents unintended updates of the provided `Component` during state
 * transitions.
 *
 * @param Component that should be guarded
 * @param propsAreComplete returns true if the props of the provided `Component` are complete
 * @param stateIsComplete returns true if the state of the provided `Component` is complete
 * @param PlaceholderComponent is shown until the `Component` was rendered once
 * @returns React component that shows the `PlaceholderComponent` until the props
 * for the provided `Component` are complete once and updates the provided
 * `Component` if the props and state are complete.
 *
 * Example for Usage:
 *
 * * Selecting a document in the Overview-Engine shows the Form-Engine. First,
 * the `PlaceholderComponent` is shown during the loading of the models
 * (`propsAreComplete` returns `false`).
 * As soon as the models are loaded (`propsAreComplete` returns `true`), the
 * Form-Engine renders with an empty document in order to present the user a
 * progress. Afterwards, when the data is loaded (`stateIsComplete` returns
 * `true`), the Form-Engine updates.
 *
 * * Selecting a different document in the Overview-Engine replaces the old
 * activity with a new one that needs to load the data (`stateIsComplete`
 * returns false). Without `stateIsComplete` the Form-Engine would update with
 * an empty document, because the models are already loaded (`propsAreComplete`
 * returns `true`). `stateIsComplete` prevents updates and therefore minimizes
 * flickering of the UI.
 * As soon as the data is loaded (`stateIsComplete` returns `true`), the
 * Form-Engine updates.
 */
export function createRenderGuardComponent<T extends {} = {}>(
	Component: ComponentType<T>,
	propsAreComplete: (props: Partial<T>) => props is T,
	stateIsComplete: (state: object, props: T) => boolean = () => true,
	PlaceholderComponent: ComponentType = Placeholder
): ComponentType<Partial<T>> {
	interface RenderGuardProps {
		readonly propsAreComplete: boolean;
		readonly stateIsComplete: boolean;
		readonly componentProps: Partial<T>;
	}

	class RenderGuard extends ReactComponent<RenderGuardProps> {
		/** Is `true` if `Component` was rendered once. */
		private componentIsInitialized = false;

		/**
		 * Returns `true` if the `Component` was rendered once or the props are complete.
		 *
		 * The edge case, that the `Component` was rendered once and the props are not
		 * complete, is not an issue, because `shouldComponentUpdate` prevents
		 * that this case occur and therefore `render` is not executed at all.
		 */
		private renderComponent(_props: Partial<T>): _props is T {
			return this.componentIsInitialized || this.props.propsAreComplete;
		}

		shouldComponentUpdate(nextProps: RenderGuardProps): boolean {
			return (
				!this.componentIsInitialized || (nextProps.propsAreComplete && nextProps.stateIsComplete)
			);
		}

		render(): ReactNode {
			if (!this.renderComponent(this.props.componentProps)) {
				return <PlaceholderComponent />;
			}

			this.componentIsInitialized = true;
			return <Component {...this.props.componentProps} />;
		}
	}

	/**
	 * The connected component maps all `ownProps` to the property `componentProps`
	 * in order to prevent issues with the internally used props `propsAreComplete`
	 * and `stateIsComplete`.
	 */
	return connect(
		function mapStateToProps(state, ownProps) {
			return propsAreComplete(ownProps)
				? {
						propsAreComplete: true,
						stateIsComplete: stateIsComplete(state, ownProps)
					}
				: // `stateIsComplete` is only relevant if `propsAreComplete` is `true`
					{ propsAreComplete: false, stateIsComplete: false };
		},
		undefined,
		function mergeProps(stateProps, dispatchProps, ownProps) {
			return { ...stateProps, componentProps: ownProps };
		}
	)(function FunctionalRenderGuard(props: RenderGuardProps): JSX.Element | null {
		// RenderGuard needs to be wrapped inside a function component in order to prevent a typing inferring issue!
		return <RenderGuard {...props} />;
	});
}
