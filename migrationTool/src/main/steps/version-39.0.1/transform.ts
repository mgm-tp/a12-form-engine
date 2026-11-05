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

import type { FormModel as OldFormModel } from "../version-39.0.0/FormModel.js";

import type { FormModel } from "./FormModel.js";

type Container = OldFormModel.Section | OldFormModel.MultiColumnSection;

/**
 * Relationship UI placeholders were exported as Custom Screen Elements without a name,
 * which is not schema compliant. Fill the gap with the model reference the placeholder
 * points to, so that these models can be migrated again. See A12E-3719.
 */
export default function (model: OldFormModel): FormModel {
	return {
		...model,
		content: { ...model.content, screens: model.content.screens.map(nameScreenElementsOf) }
	} as FormModel;
}

function nameScreenElementsOf(screen: OldFormModel.Screen): OldFormModel.Screen {
	return { ...screen, screenElements: screen.screenElements.map(nameCustomScreenElements) };
}

function nameCustomScreenElements(element: OldFormModel.ScreenElement): OldFormModel.ScreenElement {
	switch (element.type) {
		case "CustomScreenElement":
			return withName(element);
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

	return { ...container, screenElements: container.screenElements.map(nameCustomScreenElements) };
}

function withName(element: OldFormModel.CustomScreenElement): OldFormModel.CustomScreenElement {
	if (element.name !== undefined) {
		return element;
	}

	// Rebuild the element to keep `name` in the position the Form Model serializer uses.
	const { type, id, ...remainder } = element;
	return { type, id, name: element.reference ?? id, ...remainder };
}
