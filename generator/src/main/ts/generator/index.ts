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

import type { Header } from "@com.mgmtp.a12.base/base-model-api/lib/main/header/index.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DocumentModelContextAPI } from "../dm/dm_context.js";
import {
	getLocales,
	isFieldLike,
	isGroup,
	isGroupLike,
	isRepeatable,
	localeFromString
} from "../dm/dm_types.js";
import type { FormModel } from "../form_model.js";
import { FORM_MODEL_VERSION } from "../version.js";

import { createColumns } from "./columns.js";
import { ControlFactory } from "./controls.js";
import { createFieldConfiguration } from "./field_configuration.js";
import { createFooterBox, createSubHeaderBox } from "./header_footer.js";
import { createLabelFromDMElement } from "./label.js";

/**
 * A12-internal scaffolding tool to generate a form model from a given document
 * model.
 *
 * The given document model must be fully expanded (includes, type defs, ...)
 *
 * Note: This tool is part of the A12 modeling tools and not supported
 * for project use. It does not follow the A12 breaking change management
 * policy.
 */
// This file contains the outer recursion including the creation of the
// respective elements. The code for the leaf elements is in separate files.
export default function FormModelGeneratorAPI(
	documentModel: DocumentModel,
	locales = getLocales(documentModel)
) {
	const dmContextApi = DocumentModelContextAPI(documentModel);
	const controlFactory = ControlFactory(locales, dmContextApi.isReadonly);

	return {
		createFormModel
	};

	function createFormModel(formModelName: string): FormModel {
		const header = createHeader(formModelName);
		const content = createContent();

		return {
			header,
			content
		};
	}
	function createHeader(formModelName: string): Header {
		return {
			id: formModelName,
			modelType: "form",
			modelVersion: FORM_MODEL_VERSION,
			locales: locales.map(localeFromString),
			modelReferences: [
				{
					alias: documentModel.header.id,
					modelType: "document",
					purpose: "data binding",
					reference: documentModel.header.id
				}
			]
		};
	}

	function createContent(): FormModel.Content {
		const screens = createScreens();
		const subHeaderBox = createSubHeaderBox(screens);
		const footerBox = createFooterBox();
		const fieldConfiguration = createFieldConfiguration(documentModel, locales);

		return {
			subHeaderBox,
			footerBox,
			screens,
			fieldConfiguration,
			groupConfiguration: {},
			defaults: {}
		};
	}

	// create a screen for each top level group (no physical fields allowed here)
	function createScreens(): FormModel.Screen[] {
		const topLevelGroups = documentModel.content.modelRoot.elements.filter(isGroup);
		return topLevelGroups.map(createScreenFromGroup);
	}

	/**
	 * Depending on the nature of the top level element, create a screen with
	 * the respective content:
	 *
	 * - repeatable group-like -> repeat
	 * - field-like -> control (grid)
	 * - unique group-like -> generic screen content
	 */
	function createScreenFromGroup(group: DocumentModel.Group): FormModel.Screen {
		const screenElements = isRepeatable(group)
			? // repeatable group
				[createRepeat(group)]
			: isFieldLike(group)
				? // top level attachment/multi-select
					[controlFactory.createControlGridForSingleField(group)]
				: // normal top level group
					createScreenContent(group);

		const screen = createScreenForScreenElements(group, screenElements);

		// in case of a top level repeatable group, two screens are generated
		// for the same group (one top level and one detail screen). to avoid
		// duplicate IDs, the TL screen ID is changed.
		const adjustScreenID = isRepeatable(group);
		return adjustScreenID
			? {
					...screen,
					id: `TL_${screen.id}`
				}
			: screen;
	}

	/**
	 * The following functions create screen elements, starting from a single
	 * group.
	 */
	function createScreenContent(group: DocumentModel.Group): FormModel.ScreenElement[] {
		return group.elements.reduce(addScreenContentForGroup(group), []);
	}

	function addScreenContentForGroup(parentGroup: DocumentModel.Group) {
		return function (
			screenElements: FormModel.ScreenElement[],
			element: DocumentModel.Element
		): FormModel.ScreenElement[] {
			return isFieldLike(element)
				? controlFactory.addControl(screenElements, element, parentGroup)
				: isGroupLike(element)
					? isRepeatable(element)
						? addRepeat(screenElements, element)
						: addSection(screenElements, element)
					: [];
		};
	}

	function addRepeat(
		screenElements: FormModel.ScreenElement[],
		group: DocumentModel.Group
	): FormModel.ScreenElement[] {
		const repeat = createRepeat(group);
		return [...screenElements, repeat];
	}

	function createRepeat(group: DocumentModel.Group): FormModel.DetachedRepeat {
		const title = createLabelFromDMElement(locales)(group);

		const columns = createColumns(group);
		const detailScreen = createRepeatDetailScreen(group);
		return {
			type: "DetachedRepeat",
			id: `DetachedRepeat_for_${group.id}`,
			name: `${group.name}_Repeat`,
			title,
			repeatOverviewColumn: columns,
			groupRef: group.id,
			enableAdd: true,
			enableRemove: true,
			detailScreen
		};
	}

	function createRepeatDetailScreen(group: DocumentModel.Group): FormModel.Screen {
		const screenElements = createScreenContent(group);
		const screen = createScreenForScreenElements(group, screenElements);
		return {
			...screen,
			name: "Details"
		};
	}

	function addSection(
		screenElements: FormModel.ScreenElement[],
		group: DocumentModel.Group
	): FormModel.ScreenElement[] {
		const section = createSection(group);
		return [...screenElements, section];
	}

	function createSection(group: DocumentModel.Group): FormModel.Section {
		const title = createLabelFromDMElement(locales)(group);
		const screenElements = createScreenContent(group);
		return {
			type: "Section",
			id: `Section_for_${group.id}`,
			name: group.name,
			title,
			screenElements
		};
	}

	// common function for all screens
	function createScreenForScreenElements(
		element: DocumentModel.Element,
		screenElements: FormModel.ScreenElement[]
	): FormModel.Screen {
		const name = element.name;
		const title = createLabelFromDMElement(locales)(element);

		return {
			id: `Screen_for_${element.id}`,
			name,
			title,
			screenElements
		};
	}
}
