// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.migration;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSearchService;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelService;

import java.util.Collections;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * DM-specific logic to expand a group recursively to collect all of its descendants.
 */
class GroupExpander {

	private final IDocumentModelService dmService = new DocumentModelServiceFactory().createDocumentModelService();
	private final IDocumentModelSearchService searchService;

	GroupExpander(final IDocumentModel documentModel) {
		this.searchService = new DocumentModelServiceFactory().createDocumentModelSearchService(documentModel);
	}

	ExpandedGroup expand(final String elementPath) {
		final var element = this.searchService.getByPath(elementPath).orElseThrow(() -> new RuntimeException("Failed to find element: " + elementPath));

		if ((element instanceof IGroup)) {
			final var transitiveElements = ((IGroup) element)
				.getElements()
				.stream()
				.flatMap(GroupExpander.this::expand)
				.map(e -> String.format("%s/%s", elementPath, e))
				.collect(Collectors.toSet());

			return new ExpandedGroup(elementPath, transitiveElements);
		}
		// the initial group is not returned since its overlap with non-relevant groups is checked elsewhere
		return new ExpandedGroup(elementPath, Collections.emptySet());
	}

	private Stream<String> expand(final IElement element) {
		var resultStream = Stream.of(element.getName());

		if ((element instanceof IGroup)) {
			resultStream = Stream.concat(
				resultStream,
				((IGroup) element)
					.getElements()
					.stream()
					.flatMap(GroupExpander.this::expand)
					.map(e -> String.format("%s/%s", element.getName(), e))
			);
		}
		return resultStream;
	}

	record ExpandedGroup(String groupPath, Set<String> elementPaths) {
		public String toString() {
			return String.format(
				"Operand [path: %s]: %s",
				groupPath,
				elementPaths.stream()
							.filter(path -> isLeastSpecificReference(path, elementPaths))
							.collect(Collectors.joining(", "))
			);
		}

		@Override
		public boolean equals(final Object o) {
			if (this == o) {
				return true;
			}
			if (!(o instanceof ExpandedGroup that)) {
				return false;
			}
			return Objects.equals(groupPath, that.groupPath) && elementPaths.containsAll(that.elementPaths)
				   && that.elementPaths.containsAll(elementPaths);
		}

		@Override
		public int hashCode() {
			return Objects.hash(groupPath, elementPaths);
		}

		private boolean isLeastSpecificReference(
			final String current, final Iterable<String> references
		) {
			for (final String reference : references) {
				if (!current.equals(reference) && current.startsWith(reference)) {
					return false;
				}
			}
			return true;
		}
	}
}
