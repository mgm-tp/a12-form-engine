// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * Imperative API for DOM scrolling and focusing operations. Can be obtained through the
 * FormEngineRenderer.scrollRef prop. Note that it requires the Form Engine
 * component to be rendered (present in the DOM).
 */
export interface ScrollApi {
	scrollToTop(): void;
	focusElement(): void;
}
