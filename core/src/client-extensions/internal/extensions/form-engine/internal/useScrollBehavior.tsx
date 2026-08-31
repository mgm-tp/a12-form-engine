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
import type { RefObject } from "react";
import { useEffect, useEffectEvent, useRef } from "react";
import { useSelector } from "react-redux";

import { ActivitySelectors, NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core";

import type { ScrollApi } from "../../../../../view/index.js";

import { FormEngineSelectors } from "./selectors.js";

interface ScrollArgs {
	readonly scrollRef: RefObject<ScrollApi | null | undefined>;
	readonly disable?: boolean;
	readonly activityId: string;
}

/**
 * @internal
 * Focus the "initially focused element" when a form for a _new_ document has been opened
 * and the document is loaded, or scroll to the top of the form if there is no such element.
 *
 * Detection of "new form opened" is done by detecting a change of the activity id and
 * checking whether the instance is new. The hook also waits for the form to become
 * editable (loadingState: "loaded"); there are cases where loadingState becomes loaded
 * again later (e.g. in CDM forms), therefore a ref is used to ensure the effect only acts
 * once per activity.
 *
 * The activity id can change without the view unmounting, because the view is reused
 * across different activities - this is done to avoid flickering and to improve
 * performance - so scrolling to top does not happen implicitly and must be done
 * explicitly when there is nothing to focus.
 */
export function useScrollBehavior(args: ScrollArgs) {
	// shared by both EffectEvents: the two are mutually exclusive per activity, so at
	// most one of them should ever act on a given activityId
	const once = useRef(false);

	useEffect(() => {
		once.current = false;
	}, [args.activityId]);

	// undefined: the form model is not loaded yet, so it is not yet known whether there is
	// an element to focus. true/false once the model is available.
	const noFocussedElement = useSelector(state => {
		const model = FormEngineSelectors.models(args.activityId)(state);
		return model === undefined
			? undefined
			: !model.formModel.content.screens[0].initiallyFocusedElementId;
	});
	const loadingState = useSelector(ActivitySelectors.loadingStateById(args.activityId));
	const isNewInstance = useSelector(
		ActivitySelectors.activityPropById(
			args.activityId,
			a => a.descriptor.instance === NEW_INSTANCE_IDENTIFIER
		)
	);

	const onScrollToTop = useEffectEvent(() => {
		if (!once.current && !args.disable && (noFocussedElement === true || !isNewInstance)) {
			args.scrollRef.current?.scrollToTop();
			once.current = true;
		}
	});

	useEffect(() => {
		onScrollToTop();
	}, [args.activityId, noFocussedElement]);

	const onFocusElement = useEffectEvent(() => {
		if (
			noFocussedElement === false &&
			!once.current &&
			loadingState === "loaded" &&
			isNewInstance
		) {
			args.scrollRef.current?.focusElement();
			once.current = true;
		}
	});

	useEffect(() => {
		onFocusElement();
	}, [args.activityId, loadingState, noFocussedElement]);
}
