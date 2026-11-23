// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.other;

import com.mgmtp.a12.melies.model.types.ControlType;
import com.mgmtp.a12.melies.model.types.DependentControlsType;
import com.mgmtp.a12.melies.model.types.ScreenElementRefType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.Granularity;

import org.apache.commons.collections4.CollectionUtils;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

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
