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
package com.mgmtp.a12.model.ui.form.consistency.rules.other;

import java.util.ArrayList;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.ControlType;
import com.mgmtp.a12.melies.model.types.DetachedRepeatType;
import com.mgmtp.a12.melies.model.types.ScreenElementType;
import com.mgmtp.a12.melies.model.types.ScreenType;
import com.mgmtp.a12.model.ui.form.consistency.Granularity;

class ElementContextInfo {
	private final String elementId;
	private final String topLevelScreenId;
	private final String parentScreenId;
	private final Granularity elementGranularity;

	ElementContextInfo(
		final ScreenElementType element,
		final ScreenType topLevelScreen,
		final ScreenType parentScreen,
		final DocumentModelAccess documentModelService
	) {
		this.elementId = element != null ? element.getId() : "";
		this.topLevelScreenId = topLevelScreen != null ? topLevelScreen.getId() : "";
		this.parentScreenId = parentScreen != null ? parentScreen.getId() : "";
		this.elementGranularity = getScreenElementGranularity(parentScreen, documentModelService);
	}

	ElementContextInfo(
		final ControlType element,
		final ScreenType topLevelScreen,
		final ScreenType parentScreen,
		final DocumentModelAccess documentModelService
	) {
		this.elementId = element != null ? element.getId() : "";
		this.topLevelScreenId = topLevelScreen != null ? topLevelScreen.getId() : "";
		this.parentScreenId = parentScreen != null ? parentScreen.getId() : "";
		this.elementGranularity = getControlGranularity(element, documentModelService);
	}

	public String getElementId() {
		return this.elementId;
	}

	public String getTopLevelScreenId() {
		return this.topLevelScreenId;
	}

	public String getParentScreenId() {
		return this.parentScreenId;
	}

	public Granularity getElementGranularity() {
		return this.elementGranularity;
	}

	private static Granularity getScreenElementGranularity(
		final ScreenType parentScreen,
		final DocumentModelAccess documentModelService
	) {
		final DetachedRepeatType parentRepeat = parentScreen != null ? parentScreen.getParentScreenElement() : null;
		final IElement repeatGroup = parentRepeat != null
			? documentModelService.findElementById(parentRepeat.getGroupRef()).orElse(null)
			: null;
		return repeatGroup != null ? Granularity.computeGranularity(repeatGroup) : new Granularity(new ArrayList<>());
	}

	private static Granularity getControlGranularity(
		final ControlType control,
		final DocumentModelAccess documentModelService
	) {
		final IElement field = control != null
			? documentModelService.findElementById(control.getElementRef()).orElse(null)
			: null;

		final Granularity fieldGranularity = field != null ? Granularity.computeGranularity(field) : new Granularity(new ArrayList<>());

		return control != null && control.isIndexSet()
			? fieldGranularity.getParentGranularity()
			: fieldGranularity;
	}
}