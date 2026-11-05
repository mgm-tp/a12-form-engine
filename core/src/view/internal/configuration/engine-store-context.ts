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

import { createContext } from "react";

import type { EngineState } from "../../../back-end/store/index.js";

/**
 * A true, store-backed `getState`/`subscribe` pair for this activity's own `EngineState` -
 * `subscribe`'s listener fires on every dispatch, unlike a React render (a control several
 * levels down, like a markdown field, can't otherwise learn that a *different* part of the
 * document - the repeat it stores attachments in - just changed, since nothing about its own
 * props would prompt a re-render for that).
 *
 * Provided once, high up, by `client-extensions`'s own `EngineComposition` (which - unlike
 * `view` - has access to `FormEngineSelectors.engineState` to build it from the host's raw
 * store). `view` only needs the shape, not how it's built.
 */
export interface EngineStoreAccessor {
	readonly getState: () => EngineState;
	readonly subscribe: (listener: () => void) => () => void;
}

/** @internal */
export const EngineStoreContext = createContext<EngineStoreAccessor | undefined>(undefined);
