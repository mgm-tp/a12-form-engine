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

import type { DefaultStateProps } from "../../../../../view/index.js";
import { defaultMapStateToProps } from "../../../../../view/index.js";

import { FormEngineSelectors } from "./selectors.js";
import type { FormEngineProps } from "./view.js";

/**
 * Adapter to map the Client state to the engine state.
 */
export namespace FormEngineStateAdapter {
	export type StateProps = Partial<DefaultStateProps>;

	/**
	 * Creates a Form Engine state from an Activity state, if possible. Use this function whenever you need to feed a
	 * Form Engine component with state which is stored inside an Activity.
	 *
	 * @param clientState The whole client state
	 * @param ownProps Props for the Form Engine
	 * @returns the respective Form Engine state or an empty object if some information is missing in the Client state
	 */
	export function mapStateToProps(clientState: object, ownProps: FormEngineProps): StateProps {
		const engineState = FormEngineSelectors.engineState(ownProps.activityId)(clientState);
		return engineState ? defaultMapStateToProps(engineState, { config: ownProps }) : {};
	}
}
