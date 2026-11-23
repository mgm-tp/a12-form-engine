// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { RefObject } from "react";
import { useEffect } from "react";

import type { ScrollApi } from "../../../../../view/index.js";

// scroll to top of form when new activity is started
interface ScrollToTopArgs {
	scrollRef: RefObject<ScrollApi | null | undefined>;
	disable?: boolean;
	activityId: string;
}

/** @internal */
export function useScrollToTop(args: ScrollToTopArgs) {
	useEffect(() => {
		if (!args.disable) {
			args.scrollRef.current?.scrollToTop();
		}
		// oxlint-disable-next-line react/exhaustive-deps
	}, [args.activityId]);
}
