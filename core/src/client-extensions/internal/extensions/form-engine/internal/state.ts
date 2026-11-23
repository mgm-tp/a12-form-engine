// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Config, DefaultStateProps } from "../../../../../view/index.js";
import { defaultMapStateToProps } from "../../../../../view/index.js";

import { FormEngineSelectors } from "./selectors.js";

/**
 * Adapter to map the Client state to the
 * engine state.
 */
export namespace FormEngineStateAdapter {
	/**
	 * Props for the Form-Engine view.
	 */
	export interface OwnProps extends Partial<Config> {
		readonly activityId: string;
	}

	export type StateProps = Partial<DefaultStateProps>;

	/**
	 * Creates a Form Engine state from an Activity state, if possible. Use this function whenever you need to feed a
	 * Form Engine component with state which is stored inside an Activity.
	 *
	 * @param clientState The whole client state
	 * @param ownProps Props for the Form Engine
	 * @returns the respective Form Engine state or undefined if some information is missing in the Client state
	 */
	export function mapStateToProps(clientState: object, ownProps: OwnProps): StateProps {
		const engineState = FormEngineSelectors.engineState(ownProps.activityId)(clientState);
		return engineState ? defaultMapStateToProps(engineState, { config: ownProps }) : {};
	}
}
