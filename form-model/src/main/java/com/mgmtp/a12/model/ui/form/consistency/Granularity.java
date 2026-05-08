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
package com.mgmtp.a12.model.ui.form.consistency;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.melies.model.internal.DocumentModelUtils;
import java.util.Objects;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Represents the repeatability context of {@link IElement}s.
 * <p>
 * For each {@link IElement} the granularity is defined as the list of repeatable {@link IGroup}s on the path from the
 * model root to the {@link IElement} itself.
 * </p>
 * <p>
 * Thus, the {@link Granularity} of non-repeatable {@link IElement}s is represented by an empty list.
 * </p>
 */
public class Granularity {

	private final List<IGroup> repeatableGroups;

	public Granularity(final List<IGroup> repeatableGroups) {
		Objects.requireNonNull(repeatableGroups);
		this.repeatableGroups = repeatableGroups;
	}

	public static Granularity computeGranularity(final IElement element) {
		Objects.requireNonNull(element);
		final List<IGroup> repeatableGroupsList = new ArrayList<>();
		IElement current = element;
		while (current != null) {
			if (current instanceof IGroup
				&& ((IGroup) current).getRepeatability() > 1
				&& !DocumentModelHelper.isMultiSelectGroup(current)) {
				repeatableGroupsList.add(0, (IGroup) current);
			}
			current = current.getParent();
		}
		return new Granularity(repeatableGroupsList);
	}

	public List<IGroup> getRepeatableGroups() {
		return repeatableGroups;
	}

	public boolean contains(final Granularity other) {
		Objects.requireNonNull(other);
		if (other.repeatableGroups.size() > this.repeatableGroups.size()) {
			return false;
		} else {
			for (int i = 0; i < other.repeatableGroups.size(); i++) {
				if (DocumentModelUtils.isNotEqual(this.repeatableGroups.get(i), other.repeatableGroups.get(i))) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * @return the granularity of the surrounding repeatable group, if there is none the empty granularity is returned
	 */
	public Granularity getParentGranularity() {
		if(repeatableGroups.isEmpty()) {
			return this;
		}
		final IGroup[] copiedGroups =
			Arrays.copyOfRange(repeatableGroups.toArray(new IGroup[0]), 0, repeatableGroups.size() - 1);
		return new Granularity(Arrays.asList(copiedGroups));
	}

	/**
	 * @return If other is in a different sibling branch, it will return MAX_VALUE
	 *         If other is not inside this, it will return a negative distance.
	 *         If other is inside this, it will return a positive distance.
	 *         If other is this, it will return zero.
	 */
	public int getRelativeDistance(final Granularity other) {
		Objects.requireNonNull(other);
		for (int i = 0; i < Math.min(this.repeatableGroups.size(), other.repeatableGroups.size()); i++) {
			if (DocumentModelUtils.isNotEqual(this.repeatableGroups.get(i), other.repeatableGroups.get(i))) {
				return Integer.MAX_VALUE;
			}
		}

		return other.getRepeatableGroups().size() - this.getRepeatableGroups().size();
	}

	@Override
	public int hashCode() {
		return repeatableGroups.hashCode();
	}

	@Override
	public boolean equals(final Object other) {
		if (other == null) {
			return false;
		}
		if (!(other instanceof Granularity)) {
			return false;
		}
		return this.getRelativeDistance((Granularity) other) == 0;
	}
}
