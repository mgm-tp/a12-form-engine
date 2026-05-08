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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DataSelectors } from "../../../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineState } from "../../../../back-end/store/internal/store.js";
import { FormModel } from "../../../../models/internal/form-model.js";
import { DocumentModelUtils } from "../../../../models/internal/utils/document-model-utils.js";
import { IndexedControl } from "../../../../models/internal/utils/document-utils.js";
import { calcTargetScreenName } from "../../../../models/internal/utils/targetScreenName.js";
import type { EnablementByButtonName } from "../../configuration/engine-configuration.js";

import { ElementStateUtil } from "../elementState.js";

import { checkScope } from "./enablement-utilities.js";

/**
 * Evaluate if the given form model element is supposed to be hidden.
 * A form model element is hidden, if either the element itself is hidden or
 * if every child element is hidden.
 *
 * Reasons for a specific element to be hidden can be:
 * - Dependent Control
 * - Dependent Field/Group with notRelevant=true
 * - Enablements
 * - Hide condition on the element itself
 *
 * Note: If you want to take event or navigation buttons into account and are
 * using a custom enablement map, you should also provide this map in the
 * enablements parameter.
 *
 * Caution: The hidden status of ancestor elements of the given form model
 * element is not taken into account here. This does not cause any problems as
 * long as the method is called inside of the corresponding react component,
 * because the component will not be rendered if an ancestor is hidden. However,
 * it might lead to unexpected results when it is called outside of the
 * component. To ensure correct results, it needs to be executed for every
 * element on the corresponding path.
 * Additionally, it is currently not considered whether a section or an embedded
 * repeat row is collapsed. Consequently, the result for respective child
 * components might not be correct.
 *
 * @param options.formModelElement The form model element to be checked
 * @param options.state The current state
 * @param options.dataContext The current data context
 * @param options.enablements An object containing custom enablement maps
 * @param options.enablements.buttons The enablement map for event and navigation buttons
 * @returns Whether the given form model element is hidden
 */
export function isHidden(options: {
	readonly formModelElement: object;
	readonly state: EngineState;
	readonly dataContext: EntityInstancePath;
	readonly enablements?: {
		buttons?: EnablementByButtonName;
	};
}): boolean {
	const { formModelElement, dataContext, state, enablements } = options;

	if (isHiddenElement(formModelElement, dataContext, state, enablements?.buttons)) {
		return true;
	}

	const children = getRelativeChildren(formModelElement);

	if (children === undefined) {
		return false;
	}

	if (children.length === 0) {
		return true;
	}

	const documentModel = ModelSelectors.documentModel()(state);
	const document = DataSelectors.document()(state) as GroupInstance;

	function isChildHidden(child: object): boolean {
		const extendedDataContext = FormModel.Control.isInstance(child)
			? IndexedControl.getContextOfControlWithIndex({
					elementPath: child.elementPath,
					controlIndex: child.index,
					documentModel,
					document,
					currentDataContext: dataContext
				})
			: dataContext;

		return isHidden({
			formModelElement: child,
			dataContext: extendedDataContext,
			state,
			enablements
		});
	}

	return children.every(isChildHidden);
}

/** @internal */
export function isHiddenElement(
	element: object,
	context: EntityInstancePath,
	state: EngineState,
	enablementByButtonName?: EnablementByButtonName
): boolean {
	if (FormModel.Section.isInstance(element)) {
		return isSectionHidden(element, context, state);
	} else if (FormModel.MultiColumnSection.isInstance(element)) {
		return isMultiColumnSectionHidden(element, context, state);
	} else if (FormModel.ControlGrid.isInstance(element)) {
		return isControlGridHidden(element, context, state);
	} else if (FormModel.ButtonPanel.isInstance(element)) {
		return isButtonPanelHidden(element, context, state);
	} else if (FormModel.CustomScreenElement.isInstance(element)) {
		return isCustomScreenElementHidden(element, context, state);
	} else if (FormModel.InlineRepeat.isInstance(element)) {
		return isInlineRepeatHidden(element, context, state);
	} else if (FormModel.DetachedRepeat.isInstance(element)) {
		return isDetachedRepeatHidden(element, context, state);
	} else if (FormModel.EmbeddedRepeat.isInstance(element)) {
		return isEmbeddedRepeatHidden(element, context, state);
	} else if (FormModel.Row.isInstance(element)) {
		return isRowHidden(element, context, state);
	} else if (FormModel.Control.isInstance(element)) {
		return isControlHidden(element, context, state);
	} else if (FormModel.FieldOverviewColumn.isInstance(element)) {
		return isFieldOverviewColumnHidden(element, context, state);
	} else if (FormModel.TextCell.isInstance(element)) {
		return isTextCellHidden(element, context, state);
	} else if (FormModel.ExpressionCell.isInstance(element)) {
		return isExpressionCellHidden(element, context, state);
	} else if (FormModel.ExpressionOverviewColumn.isInstance(element)) {
		return isExpressionOverviewColumnHidden(element, context, state);
	} else if (FormModel.CustomCell.isInstance(element)) {
		return isCustomCellHidden(element, context, state);
	} else if (FormModel.ButtonType.isNavigationButton(element)) {
		return isNavigationButtonHidden(element, state, enablementByButtonName);
	} else if (FormModel.ButtonType.isEventButton(element)) {
		return isEventButtonHidden(element, state, enablementByButtonName);
	}

	return false;
}

/** @internal */
export function evaluateNotRelevantForDocumentElement(
	documentElementPath: EntityInstancePath,
	state: EngineState
): boolean {
	const documentModel = ModelSelectors.documentModel()(state);
	const element = DocumentModelUtils.findByPath(documentModel, documentElementPath);
	if (!element) {
		return false;
	}

	return (
		ElementStateUtil.evaluateFieldNotRelevant(
			DataSelectors.document()(state),
			state.models,
			documentElementPath,
			documentElementPath
		) ||
		ElementStateUtil.evaluateGroupNotRelevant(
			DataSelectors.document()(state),
			state.models,
			documentElementPath,
			documentElementPath
		)
	);
}

function isSectionHidden(
	element: FormModel.Section,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByDependentControlOrCondition(element, context, state);
}

function isMultiColumnSectionHidden(
	element: FormModel.MultiColumnSection,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByDependentControlOrCondition(element, context, state);
}

function isControlGridHidden(
	element: FormModel.ControlGrid,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByDependentControlOrCondition(element, context, state);
}

function isCustomScreenElementHidden(
	element: FormModel.CustomScreenElement,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByDependentControlOrCondition(element, context, state);
}

function isControlHidden(
	element: FormModel.Control,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByFieldRelevanceOrCondition(element, context, state);
}

function isFieldOverviewColumnHidden(
	element: FormModel.FieldOverviewColumn,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByFieldRelevanceOrCondition(element, context, state);
}

function isInlineRepeatHidden(
	element: FormModel.InlineRepeat,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByGroupRelevanceOrCondition(element, context, state);
}

function isDetachedRepeatHidden(
	element: FormModel.DetachedRepeat,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByGroupRelevanceOrCondition(element, context, state);
}

function isEmbeddedRepeatHidden(
	element: FormModel.EmbeddedRepeat,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByGroupRelevanceOrCondition(element, context, state);
}

function isRowHidden(
	element: FormModel.Row,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByCondition(element, context, state);
}

function isButtonPanelHidden(
	element: FormModel.ButtonPanel,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByCondition(element, context, state);
}

function isTextCellHidden(
	element: FormModel.TextCell,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByCondition(element, context, state);
}

function isExpressionCellHidden(
	element: FormModel.ExpressionCell,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByCondition(element, context, state);
}

function isExpressionOverviewColumnHidden(
	element: FormModel.ExpressionOverviewColumn,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByCondition(element, context, state);
}

function isCustomCellHidden(
	element: FormModel.CustomCell,
	context: EntityInstancePath,
	state: EngineState
): boolean {
	return evaluateHiddenByCondition(element, context, state);
}

function evaluateHiddenByDependentControlOrCondition(
	modelElement: { id: string },
	dataContext: EntityInstancePath,
	state: EngineState
): boolean {
	const document = DataSelectors.document()(state);
	return (
		ElementStateUtil.evaluateHiddenDependentScreenElement(
			document,
			state.models,
			modelElement.id,
			dataContext
		) ||
		ElementStateUtil.evaluateHiddenByCondition(document, state.models, modelElement.id, dataContext)
	);
}
/**
 * This also works for Attachment or Multi-Select based controls and
 * columns, since evaluateFieldNotRelevant already covers these group-like
 * types.
 */
function evaluateHiddenByFieldRelevanceOrCondition(
	modelElement: { elementPath: ModelPath; id: string },
	dataContext: EntityInstancePath,
	state: EngineState
): boolean {
	const document = DataSelectors.document()(state);
	return (
		ElementStateUtil.evaluateFieldNotRelevant(
			document,
			state.models,
			modelElement.elementPath,
			dataContext
		) ||
		ElementStateUtil.evaluateHiddenByCondition(document, state.models, modelElement.id, dataContext)
	);
}

function evaluateHiddenByGroupRelevanceOrCondition(
	modelElement: { groupPath: ModelPath; id: string },
	dataContext: EntityInstancePath,
	state: EngineState
): boolean {
	const document = DataSelectors.document()(state);
	return (
		ElementStateUtil.evaluateGroupNotRelevant(
			document,
			state.models,
			modelElement.groupPath,
			dataContext
		) ||
		ElementStateUtil.evaluateHiddenByCondition(document, state.models, modelElement.id, dataContext)
	);
}

function evaluateHiddenByCondition(
	modelElement: { id: string },
	dataContext: EntityInstancePath,
	state: EngineState
): boolean {
	const document = DataSelectors.document()(state);
	return ElementStateUtil.evaluateHiddenByCondition(
		document,
		state.models,
		modelElement.id,
		dataContext
	);
}

function isNavigationButtonHidden(
	modelElement: FormModel.NavigationButton,
	state: EngineState,
	byButtonName: EnablementByButtonName = {}
): boolean {
	const buttonHidden = byButtonName[modelElement.name]?.hidden;
	if (buttonHidden !== undefined) {
		return buttonHidden;
	}

	const readonly = UiStateSelectors.readonly()(state);
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);
	const formModel = ModelSelectors.formModel()(state);

	const hiddenByScope = checkScope(readonly, "HIDDEN", modelElement.scope);

	if (hiddenByScope) {
		return true;
	}

	const target = modelElement.target;
	if (target === undefined) {
		return false;
	}

	const currentScreenPath = currentScreenLocation.locationPath;
	// TODO:Calculate this once and give it in payload?
	return target
		? calcTargetScreenName(
				currentScreenPath[currentScreenPath.length - 1].elementName,
				target,
				formModel
			) === undefined
		: false;
}

function isEventButtonHidden(
	modelElement: FormModel.EventButton,
	state: EngineState,
	byEventName: EnablementByButtonName = {}
): boolean {
	const buttonHidden = byEventName[modelElement.name]?.hidden;
	if (buttonHidden !== undefined) {
		return buttonHidden;
	}

	const isDirty = UiStateSelectors.dirty()(state) || DataSelectors.dirty()(state);
	const hiddenByDirtyState = modelElement.enablement === "HIDDEN" && !isDirty;

	if (hiddenByDirtyState) {
		return true;
	}

	const readonly = UiStateSelectors.readonly()(state);
	const hiddenByScope = checkScope(readonly, "HIDDEN", modelElement.scope);

	return hiddenByScope;
}

function getRelativeChildren(element: object): readonly object[] | undefined {
	if (FormModel.Screen.isInstance(element)) {
		return element.screenElements ?? [];
	} else if (FormModel.Section.isInstance(element)) {
		return element.screenElements ?? [];
	} else if (FormModel.MultiColumnSection.isInstance(element)) {
		return element.screenElements ?? [];
	} else if (FormModel.ControlGrid.isInstance(element)) {
		return element.row ?? [];
	} else if (FormModel.Row.isInstance(element)) {
		return element.cell ?? [];
	} else if (FormModel.ButtonPanel.isInstance(element)) {
		return element.button ?? [];
	}

	return undefined;
}
