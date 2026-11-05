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
package com.mgmtp.a12.formengine.consistency.rules.metadata;

import com.mgmtp.a12.formengine.consistency.rules.common.metadata.UnknownLocaleChecker;
import com.mgmtp.a12.formengine.consistency.rules.language.FormLocalizationAdapter;
import com.mgmtp.a12.formengine.model.types.MultilingualTextType;
import com.mgmtp.a12.formengine.model.types.RepeatButtonLabelsType;

import java.util.Arrays;
import java.util.List;

/**
 * Checks the locales of the button labels, which a repeat declares for itself or the form declares as defaults.
 */
final class RepeatButtonLabelsLocaleCheck {

	private RepeatButtonLabelsLocaleCheck() {
	}

	/**
	 * Checks every button label, so that a label overwritten by a single repeat is checked just like the default one.
	 *
	 * @param checker collects the problems found
	 * @param buttonLabels the labels to check, may be {@code null}
	 * @param checkedElement how the element declaring the labels is named in the problem message
	 * @param checkedElementId id of the element declaring the labels
	 */
	static void checkLocales(
		final UnknownLocaleChecker checker,
		final RepeatButtonLabelsType buttonLabels,
		final String checkedElement,
		final String checkedElementId
	) {
		if (buttonLabels == null) {
			return;
		}
		for (final MultilingualTextType label : labelsOf(buttonLabels)) {
			checker.check(FormLocalizationAdapter.adapterFor(label), checkedElement, checkedElementId);
		}
	}

	private static List<MultilingualTextType> labelsOf(final RepeatButtonLabelsType buttonLabels) {
		return Arrays.asList(
			buttonLabels.getADD(),
			buttonLabels.getCOMMIT_ADD(),
			buttonLabels.getAPPLY(),
			buttonLabels.getEDIT(),
			buttonLabels.getREMOVE(),
			buttonLabels.getVIEW(),
			buttonLabels.getCANCEL(),
			buttonLabels.getCONFIRM(),
			buttonLabels.getRETURN(),
			buttonLabels.getUP(),
			buttonLabels.getDOWN(),
			buttonLabels.getCOPY(),
			buttonLabels.getCLOSE(),
			buttonLabels.getDOWNLOAD(),
			buttonLabels.getSKIP(),
			buttonLabels.getREPLACE(),
			buttonLabels.getUPLOAD_AS_COPY());
	}
}
