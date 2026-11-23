// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

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
