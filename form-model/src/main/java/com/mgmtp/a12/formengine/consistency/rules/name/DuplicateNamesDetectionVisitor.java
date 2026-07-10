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
package com.mgmtp.a12.formengine.consistency.rules.name;

import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.types.ButtonPanelType;
import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.DetachedRepeatType;
import com.mgmtp.a12.formengine.model.types.HeaderFooterType;
import com.mgmtp.a12.formengine.model.types.InlineRepeatType;
import com.mgmtp.a12.formengine.model.types.Named;
import com.mgmtp.a12.formengine.model.types.RepeatType;
import com.mgmtp.a12.formengine.model.types.RowType;
import com.mgmtp.a12.formengine.model.types.ScreenType;
import com.mgmtp.a12.formengine.model.types.SectionType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class DuplicateNamesDetectionVisitor extends ModelVisitor {

	public static final String MAJOR_BUTTONS = "major buttons";
	private static final String MINOR_BUTTONS = "minor buttons";

	public interface Handler {

		void handle(
			FormModel model,
			Object modelElement,
			String modelElementId,
			String elementName,
			Set<String> duplicateChildNames
		);
	}

	private final FormModel model;
	final Handler handler;

	public DuplicateNamesDetectionVisitor(final FormModel model, final Handler handler) {
		this.model = model;
		this.handler = handler;
	}

	@Override
	public boolean visitScreen(final ScreenType screen) {
		final Set<String> screenElementDuplicates =
			findDuplicateChildNames(screen.getScreenElements());
		if (!screenElementDuplicates.isEmpty()) {
			handler.handle(
				model,
				screen,
				screen.getId(),
				screen.getName(),
				screenElementDuplicates
			);
		}
		return super.visitScreen(screen);
	}

	@Override
	public boolean visitSection(final SectionType section) {
		final Set<String> duplicates =
			findDuplicateChildNames(section.getScreenElement());
		if (!duplicates.isEmpty()) {
			handler.handle(
				model,
				section,
				section.getId(),
				section.getName(),
				duplicates
			);
		}
		return super.visitSection(section);
	}

	@Override
	public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
		checkExpressionColumns(repeat);
		return true;
	}

	@Override
	public boolean visitInlineRepeat(final InlineRepeatType repeat) {
		checkExpressionColumns(repeat);
		return true;
	}

	private void checkExpressionColumns(final RepeatType repeat) {
		final Set<String> duplicates =
			findDuplicatesInStream(
				repeat.getRepeatOverviewColumn()
					  .stream()
					  .filter(roc -> roc instanceof Named)
					  .map(Named.class::cast));
		if (!duplicates.isEmpty()) {
			handler.handle(
				model,
				repeat,
				repeat.getId(),
				repeat.getName(),
				duplicates
			);
		}
	}

	@Override
	public boolean visitControlGrid(final ControlGridType grid) {
		final Set<String> duplicates = findDuplicateChildNames(grid.getRow());
		if (!duplicates.isEmpty()) {
			handler.handle(
				model,
				grid,
				grid.getId(),
				grid.getName(),
				duplicates
			);
		}
		return super.visitControlGrid(grid);
	}

	@Override
	public boolean visitRow(final RowType row) {
		// note: rows contain controls, expressions or texts; controls do not have names / implement Named
		final Set<String> duplicates = findDuplicatesInStream(
			row.getCell()
			   .stream()
			   .filter(e -> e instanceof Named)
			   .map(Named.class::cast)
		);
		if (!duplicates.isEmpty()) {
			handler.handle(
				model,
				row,
				row.getId(),
				row.getName(),
				duplicates
			);
		}
		return super.visitRow(row);
	}

	@Override
	public boolean visitButtonPanel(final ButtonPanelType panel) {
		final Set<String> duplicates = findDuplicateChildNames(panel.getButton());
		if (!duplicates.isEmpty()) {
			handler.handle(
				model,
				panel,
				panel.getId(),
				panel.getName(),
				duplicates
			);
		}
		return super.visitButtonPanel(panel);
	}

	@Override
	public boolean visitHeaderFooter(final HeaderFooterType headerFooter) {
		if (headerFooter.getMajorButtons() != null) {
			final Set<String> majorButtonDuplicates =
				findDuplicateChildNames(headerFooter.getMajorButtons().getButton());
			if (!majorButtonDuplicates.isEmpty()) {
				handler.handle(
					model,
					headerFooter,
					headerFooter.getId(),
					MAJOR_BUTTONS,
					majorButtonDuplicates
				);
			}
		}

		if (headerFooter.getMinorButtons() != null) {
			final Set<String> minorButtonDuplicates =
				findDuplicateChildNames(headerFooter.getMinorButtons().getButton());
			if (!minorButtonDuplicates.isEmpty()) {
				handler.handle(
					model,
					headerFooter,
					headerFooter.getId(),
					MINOR_BUTTONS,
					minorButtonDuplicates
				);
			}
		}
		return super.visitHeaderFooter(headerFooter);
	}

	public static <T extends Named> Set<String> findDuplicateChildNames(final List<? extends T> children) {
		return findDuplicatesInStream(children.stream());
	}

	private static <T extends Named> Set<String> findDuplicatesInStream(final Stream<? extends T> inputStream) {
		final Set<String> allNames = new HashSet<>();
		return inputStream
			.map(T::getName)
			.filter(Objects::nonNull)
			.filter(name -> !allNames.add(name))
			.collect(Collectors.toSet());
	}
}
