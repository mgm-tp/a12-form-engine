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
package com.mgmtp.a12.model.ui.form.consistency.fixes;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.types.ButtonPanelType;
import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.ExpressionRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.HeaderFooterType;
import com.mgmtp.a12.melies.model.types.Named;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.melies.model.types.RowType;
import com.mgmtp.a12.melies.model.types.ScreenType;
import com.mgmtp.a12.melies.model.types.SectionType;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.ui.form.consistency.rules.name.DuplicateNamesDetectionVisitor;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.mgmtp.a12.model.ui.form.consistency.rules.name.DuplicateNamesDetectionVisitor.MAJOR_BUTTONS;

public class DuplicateSiblingNameFix implements ProblemFix {

	@Override
	public void fix(final MeliesModel model) {
		final DuplicateNamesDetectionVisitor.Handler nameFixer = new NameFixer();
		final ModelWalker walker = new ModelWalker(new DuplicateNamesDetectionVisitor(model, nameFixer));
		walker.acceptModel(model);

		// screen name duplicates cannot be fixed by the visitor since it cannot detect them properly
		// the respective rule implementation has the same problem
		fixScreenNames(model);
	}

	private void fixScreenNames(final MeliesModel model) {
		final Set<String> duplicateScreenNames =
			DuplicateNamesDetectionVisitor.findDuplicateChildNames(model.getContent().getScreens());
		renameDuplicateChildNames(
			model.getContent().getScreens(),
			duplicateScreenNames,
			new NameCounter(duplicateScreenNames)
		);
	}

	private static class NameFixer implements DuplicateNamesDetectionVisitor.Handler {

		@Override
		public void handle(
			final MeliesModel model,
			final Object modelElement,
			final String modelElementId,
			final String elementName,
			final Set<String> duplicateChildNames
		) {
			final NameCounter nameCounter = new NameCounter(duplicateChildNames);

			// the following cascade ignores ScreenGroupElementTypes since they cannot actually occur in real-world form models
			if (modelElement instanceof HeaderFooterType) {
				if (MAJOR_BUTTONS.equals(elementName)) {
					renameDuplicateChildNames(
						((HeaderFooterType) modelElement).getMajorButtons().getButton(),
						duplicateChildNames,
						nameCounter
					);
				} else {
					renameDuplicateChildNames(
						((HeaderFooterType) modelElement).getMinorButtons().getButton(),
						duplicateChildNames,
						nameCounter
					);
				}
			} else if (modelElement instanceof ScreenType) {
				renameDuplicateChildNames(
					((ScreenType) modelElement).getScreenElements(),
					duplicateChildNames,
					nameCounter
				);
			} else if (modelElement instanceof SectionType) {
				renameDuplicateChildNames(
					((SectionType) modelElement).getScreenElement(),
					duplicateChildNames,
					nameCounter
				);
			} else if (modelElement instanceof RepeatType) {
				renameDuplicatesInStream(
					((RepeatType) modelElement).getRepeatOverviewColumn()
											   .stream()
											   .filter(column -> column instanceof ExpressionRepeatOverviewColumnType)
											   .map(ExpressionRepeatOverviewColumnType.class::cast),
					duplicateChildNames,
					nameCounter
				);

			} else if (modelElement instanceof ControlGridType) {
				renameDuplicateChildNames(
					((ControlGridType) modelElement).getRow(),
					duplicateChildNames,
					nameCounter
				);
			} else if (modelElement instanceof RowType) {
				renameDuplicatesInStream(
					((RowType) modelElement).getCell()
											.stream()
											.filter(cell -> cell instanceof Named)
											.map(Named.class::cast),
					duplicateChildNames,
					nameCounter
				);
			} else if (modelElement instanceof ButtonPanelType) {
				renameDuplicateChildNames(
					((ButtonPanelType) modelElement).getButton(),
					duplicateChildNames,
					nameCounter
				);
			}
		}
	}

	private static <T extends Named> void renameDuplicateChildNames(
		final List<? extends T> children,
		final Set<String> duplicateChildNames,
		final NameCounter nameCounter
	) {
		renameDuplicatesInStream(children.stream(), duplicateChildNames, nameCounter);
	}

	private static <T extends Named> void renameDuplicatesInStream(
		final Stream<? extends T> inputStream,
		final Set<String> duplicateChildNames,
		final NameCounter nameCounter
	) {
		inputStream.forEach(item -> {
			final String name = item.getName();
			if (duplicateChildNames.contains(name)) {
				item.setName(String.format("%s-%d", name, nameCounter.next(name)));
			}
		});
	}

	private static class NameCounter {

		final Map<String, Integer> counterPerName;

		NameCounter(final Set<String> names) {
			counterPerName = names.stream().collect(Collectors.toMap(Function.identity(), key -> 1));
		}

		int next(final String name) {
			final int nextIndex = counterPerName.get(name);
			counterPerName.put(name, nextIndex + 1);
			return nextIndex;
		}
	}
}
