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
package com.mgmtp.a12.formengine.model.types;

import java.util.ArrayList;
import java.util.Collection;

/**
 * An abstract list implementation that provides special hooks for ancestor relation management.
 *
 * @param <T> payload type
 */
public abstract class NodeTreeList<T> extends ArrayList<T> {

	@Override
	public boolean add(final T element) {
		onAdd(element);
		return super.add(element);
	}

	@Override
	public T set(final int index, final T element) {
		onAdd(element);
		return super.set(index, element);
	}

	@Override
	public void add(final int index, final T element) {
		onAdd(element);
		super.add(index, element);
	}

	@Override
	public T remove(final int index) {
		final T removed = super.remove(index);
		onRemove(removed);
		return removed;
	}

	@SuppressWarnings("unchecked")
	@Override
	public boolean remove(final Object o) {
		final boolean removed = super.remove(o);
		if (removed) {
			onRemove((T) o);
		}
		return removed;
	}

	@Override
	public boolean addAll(final Collection<? extends T> c) {
		for (final T element : c) {
			onAdd(element);
		}
		return super.addAll(c);
	}

	@Override
	public boolean addAll(final int index, final Collection<? extends T> c) {
		for (final T element : c) {
			onAdd(element);
		}
		return super.addAll(index, c);
	}

	@Override
	protected void removeRange(final int fromIndex, final int toIndex) {
		if (fromIndex >= 0 && toIndex <= size()) {
			for (int i = fromIndex; i < toIndex; i++) {
				onRemove(get(i));
			}
		}
		super.removeRange(fromIndex, toIndex);
	}

	@SuppressWarnings("unchecked")
	@Override
	public boolean removeAll(final Collection<?> c) {
		for (final Object o : c) {
			if (contains(o)) {
				onRemove((T) o);
			}
		}
		return super.removeAll(c);
	}

	@SuppressWarnings("unchecked")
	@Override
	public boolean retainAll(final Collection<?> c) {
		for (final Object o : c) {
			if (!contains(o)) {
				onRemove((T) o);
			}
		}
		return super.retainAll(c);
	}

	@Override
	public void clear() {
		for (final T element : this) {
			onRemove(element);
		}
		super.clear();
	}

	/**
	 * The given element is about to be added to the list.
	 *
	 * @param e
	 */
	protected abstract void onAdd(T e);

	/**
	 * The given element has been / is about to be removed from the list. For performance reasons, methods that remove
	 * more that one element have their onRemove called before the actual removal.
	 *
	 * @param e
	 */
	protected abstract void onRemove(T e);
}
