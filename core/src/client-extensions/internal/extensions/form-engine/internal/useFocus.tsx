// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";

import type { ScrollApi } from "../../../../../view/index.js";

/**
 * How ScrollApi.focusElement is used
 * ----------------------------------
 *
 * Focus the "initially focused element" when "a form for a _new_ document has
 * been opened and the document is loaded"
 *
 * Detection of "new form opened" is done by detection of a change of the
 * activity id from <anything> and checking if the instance is _NEW_. See
 * useEffect inside the useFocus hook "listen to activity id change and the
 * loading state"
 *
 * The hook also waits for the form to become editable (loadingState: loaded).
 * There are cases where the loadingState becomes loaded again later (e.g. in CDM forms),
 * therefore a ref is used to ensure that the effect only runs once.
 *
 * In addition to the actual focusing, the form is also scrolled to the top.
 * This is necessary because at the moment when the input is focused, an
 * animation (like master detail "slide in" effect) might still be in progress
 * that breaks the layout / shifts the input down.
 *
 * Finally, the scrolling is deferred using a setTimeout hack to work around a
 * race condition and/or layouting issue in Firefox that causes the scrollToTop
 * to be executed too early.
 *
 * Remarks:
 *
 * The activity id can change, because the view is reused across different
 * activities - this is done to avoid flickering and to improve performance.
 *
 * Maybe this whole code - along with other focus / scrolling code in the FE
 * repo - should be centralized, maybe in a saga.
 */
interface FocusArgs {
	readonly scrollRef: RefObject<ScrollApi | null | undefined>;
	readonly activityId: string;
}

/** @internal */
export function useFocus({ activityId, scrollRef }: FocusArgs) {
	const loadingState = useSelector(ActivitySelectors.loadingStateById(activityId));
	const descriptor = useSelector(ActivitySelectors.activityPropById(activityId, a => a.descriptor));

	const once = useRef(false);

	useEffect(() => {
		once.current = false;
	}, [activityId]);

	useEffect(() => {
		if (
			!once.current &&
			loadingState === "loaded" &&
			descriptor?.instance === NEW_INSTANCE_IDENTIFIER
		) {
			scrollRef.current?.focusElement();
			setTimeout(() => scrollRef.current?.scrollToTop());

			once.current = true;
		}

		// oxlint-disable-next-line react/exhaustive-deps
	}, [activityId, loadingState]);
}
