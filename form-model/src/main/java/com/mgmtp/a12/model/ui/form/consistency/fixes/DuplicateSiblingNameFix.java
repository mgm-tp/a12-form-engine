// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
