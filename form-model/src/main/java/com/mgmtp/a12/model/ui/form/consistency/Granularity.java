// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
