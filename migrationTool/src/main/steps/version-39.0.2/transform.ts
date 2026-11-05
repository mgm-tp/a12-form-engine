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

import type { FormModel as OldFormModel } from "../version-39.0.1/FormModel.js";

import type { FormModel } from "./FormModel.js";

/** The annotation the SME uses to store the Relationship UI Model id of a relationship UI element repeat. */
const RELATIONSHIP_UI_MODEL_REFERENCE_ANNOTATION = "a12-relationship-ui-model-reference";

type Container = OldFormModel.Section | OldFormModel.MultiColumnSection;

export default function (model: OldFormModel): FormModel {
	return {
		...model,
		content: { ...model.content, screens: model.content.screens.map(nameScreenElementsOf) }
	} as FormModel;
}

function nameScreenElementsOf(screen: OldFormModel.Screen): OldFormModel.Screen {
	return { ...screen, screenElements: screen.screenElements.map(nameScreenElement) };
}

function nameScreenElement(element: OldFormModel.ScreenElement): OldFormModel.ScreenElement {
	switch (element.type) {
		case "CustomScreenElement":
			return withName(element, element.reference);
		case "DetachedRepeat":
			return withNamedDetailScreen(withName(element, relationshipUIModelReferenceOf(element)));
		case "Section":
		case "MultiColumnSection":
			return withNamedChildren(element);
		default:
			return element;
	}
}

function withNamedChildren<T extends Container>(container: T): T {
	if (container.screenElements === undefined) {
		return container;
	}

	return { ...container, screenElements: container.screenElements.map(nameScreenElement) };
}

function withNamedDetailScreen(repeat: OldFormModel.DetachedRepeat): OldFormModel.DetachedRepeat {
	return { ...repeat, detailScreen: nameScreenElementsOf(repeat.detailScreen) };
}

function relationshipUIModelReferenceOf(repeat: OldFormModel.DetachedRepeat): string | undefined {
	return repeat.annotations?.find(
		annotation => annotation.name === RELATIONSHIP_UI_MODEL_REFERENCE_ANNOTATION
	)?.value;
}

function withName<T extends OldFormModel.CustomScreenElement | OldFormModel.DetachedRepeat>(
	element: T,
	preferredName: string | undefined
): T {
	if (element.name !== undefined) {
		return element;
	}

	// Rebuild the element to keep `name` in the position the Form Model serializer uses.
	const { type, id, ...remainder } = element;
	return { type, id, name: preferredName ?? id, ...remainder } as T;
}
