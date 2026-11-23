// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public interface InfiniteScrollableRepeat {
	public Boolean getInfiniteScrolling();

	public void setInfiniteScrolling(final Boolean InfiniteScrolling);

	public void unsetInfiniteScrolling();

	public boolean isInfiniteScrollingSet();

	public RepeatType withInfiniteScrolling(final boolean value);
}
