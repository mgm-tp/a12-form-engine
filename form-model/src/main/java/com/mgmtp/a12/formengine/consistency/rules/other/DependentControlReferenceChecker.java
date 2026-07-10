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
package com.mgmtp.a12.formengine.consistency.rules.other;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.Granularity;
import com.mgmtp.a12.formengine.model.types.ControlType;
import com.mgmtp.a12.formengine.model.types.DependentControlsType;
import com.mgmtp.a12.formengine.model.types.ScreenElementRefType;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;

/**
 * Check reference to a screen element in dependent control. Check for missing reference or parent ref.
 */
class DependentControlReferenceChecker {

	private final String modelName;
	private final Map<String, ElementContextInfo> screenElementContextInfoMap;

	public DependentControlReferenceChecker(
		final String modelName,
		final Map<String, ElementContextInfo> screenElementContextInfoMap
	) {
		this.modelName = modelName;
		this.screenElementContextInfoMap = screenElementContextInfoMap;
	}

	List<Problem> checkScreenReferences(
		final DependentControlsType dependentControl,
		final List<String> parentScreenElementIds,
		final ControlType checkedElement,
		final ElementContextInfo controlScreens
	) {
		final List<Problem> problems = new LinkedList<>();

		final List<ScreenElementRefType> screenElements = dependentControl.getScreenElement();
		for (final ScreenElementRefType screenElement : screenElements) {
			CollectionUtils.addIgnoreNull(
				problems,
				checkScreenElementRef(screenElement, parentScreenElementIds, checkedElement, controlScreens)
			);
		}

		return problems;
	}

	private Problem checkScreenElementRef(
		final ScreenElementRefType screenElement,
		final List<String> parentScreenElementIds,
		final ControlType checkedElement,
		final ElementContextInfo controlContextInfo
	) {
		final String controlId = checkedElement.getId();

		final String screenElementRef = screenElement.getIdref();

		if (!screenElementContextInfoMap.containsKey(screenElementRef)) {
			// screen element does not exist
			return new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_DEPENDENT_CONTROL_REFERENCE,
				new FormModelProblemSource(controlId),
				controlId,
				screenElementRef
			);
		}
		if (parentScreenElementIds.contains(screenElementRef)) {
			// screen element is parent of control
			return new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_DEPENDENT_CONTROL_PARENT,
				new FormModelProblemSource(controlId),
				controlId,
				screenElementRef
			);
		}

		final ElementContextInfo screenElementContextInfo = screenElementContextInfoMap.get(screenElementRef);

		final String screenElementTopLevelScreen = screenElementContextInfo.getTopLevelScreenId();
		final String screenElementParentScreen = screenElementContextInfo.getParentScreenId();
		final Granularity screenElementGranularity = screenElementContextInfo.getElementGranularity();

		final String controlTopLevelScreen = controlContextInfo.getTopLevelScreenId();
		final String controlParentScreen = controlContextInfo.getParentScreenId();
		final Granularity controlGranularity = controlContextInfo.getElementGranularity();

		if (screenElementTopLevelScreen != null && !screenElementTopLevelScreen.equals(controlTopLevelScreen)) {
			// screen element and control are on different top level screens
			return new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_DEPENDENT_CONTROL_DIFFERENT_TOP_LEVEL_SCREEN,
				new FormModelProblemSource(controlId),
				controlId,
				screenElementRef
			);
		}
		if (
			checkedElement.isIndexSet() &&
				screenElementParentScreen != null && !screenElementParentScreen.equals(controlParentScreen)
		) {
			// control has an index and has a different parent screen than screen element
			return new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_DEPENDENT_CONTROL_INDEXED_DIFFERENT_SCREEN,
				new FormModelProblemSource(controlId),
				controlId,
				screenElementRef
			);
		}
		if (screenElementGranularity != null && screenElementGranularity.getRelativeDistance(controlGranularity) > 0) {
			/*
			 * Screen element and control have incompatible granularities.
			 * The control is in a different path or its context path is longer, than the context path of the
			 * screen element. Therefore, we are missing index information for the trigger field.
			 */
			return new ConsistencyProblem(
				modelName,
				FormModelCategory.FORM_MODEL_DEPENDENT_CONTROL_INCOMPATIBLE_CONTEXT,
				new FormModelProblemSource(controlId),
				controlId,
				screenElementRef
			);
		}
		return null;
	}
}
