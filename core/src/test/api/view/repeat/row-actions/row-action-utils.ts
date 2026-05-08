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

import { equal, fail, ok, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { fireEvent } from "@testing-library/react";
import { act } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { query, within } from "@com.mgmtp.a12.devtools/react";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/data-roles.js";

import type { Models } from "../../../../../back-end/store/internal/store.js";
import { findElementByFormModelPath, FormModel } from "../../../../../models/index.js";
import type { DispatchConfiguration, EnablementByRow } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import {
	EXPANDABLE_ROW_BODY,
	ICON,
	LIST_ITEM_CONTENT,
	LIST_ITEM_TEXT
} from "../../../../rtl-utils/data-roles.js";
import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import {
	DEFAULT_ROW_ACTION_VISIBILITY,
	FORM_MODEL
} from "../../../../utils/test-model-helpers/repeat.row-actions.js";
import { getReactElementContentLabel } from "../../inputs/control/test-cases/labels/getReactElementContentLabel.js";

const { createModelPath } = ModelHelpers;

const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
export const stubbedDispatchConfig = {
	...stubbedDispatch.eventHandlers,
	repeat: {
		...stubbedDispatch.eventHandlers.repeat,
		removeRow: mock.fn(),
		enterRow: mock.fn(),
		onMoveRow: mock.fn(),
		onCloneRow: mock.fn(),
		onCustomRowAction: mock.fn()
	},
	onAttachmentDownload: mock.fn(),
	onAttachmentDelete: mock.fn(),
	onCancelAttachmentUpload: mock.fn(),
	onAttachmentUpload: mock.fn()
} satisfies DispatchConfiguration;

export type StubbedDispatchConfig = DispatchConfiguration & {
	repeat: {
		enterRow: Mock<DispatchConfiguration.Repeat["enterRow"]>;
		removeRow: Mock<DispatchConfiguration.Repeat["removeRow"]>;
		onMoveRow: Mock<DispatchConfiguration.Repeat["onMoveRow"]>;
		onCloneRow: Mock<DispatchConfiguration.Repeat["onCloneRow"]>;
		onCustomRowAction: Mock<DispatchConfiguration.Repeat["onCustomRowAction"]>;
	};
	onAttachmentDownload: Mock<DispatchConfiguration["onAttachmentDownload"]>;
	onAttachmentDelete: Mock<DispatchConfiguration["onAttachmentDelete"]>;
	onAttachmentUpload: Mock<DispatchConfiguration["onAttachmentUpload"]>;
	onCancelAttachmentUpload: Mock<DispatchConfiguration["onCancelAttachmentUpload"]>;
};

export function createRepeatModelPath(repeatName: string): ModelPath {
	return [{ elementName: FORM_MODEL.rowActionScreen }, { elementName: repeatName }];
}

export function setupFormEngineRendererForVisibilityTests(
	models: Models,
	document: GroupInstance,
	readonly: boolean,
	disabled: boolean,
	dispatchConfig: DispatchConfiguration,
	screenModelPath?: ModelPath
): Promise<RtlRenderWrapper> {
	const SCREEN_MODEL_PATH = screenModelPath || createModelPath(FORM_MODEL.rowActionScreen);

	return SetupHelpers.setupFormEngineRendererWithRtlAsync({
		models,
		data: { document },
		ui: {
			readonly,
			disabled,
			screenLocation: [{ locationPath: SCREEN_MODEL_PATH, path: [] }]
		},
		dispatchConfig
	});
}

export function createEnablementMapForVisibilityTests(options: {
	event: string;
	entry: {
		[rowIndex: number]: {
			hidden?: boolean;
			disabled?: boolean;
		};
	};
}): EnablementByRow {
	const { entry, event } = options;

	return {
		[DEFAULT_ROW_ACTION_VISIBILITY.EDIT_HIDDEN.REPEAT_NAME]: {
			[event]: entry
		},
		[DEFAULT_ROW_ACTION_VISIBILITY.CUSTOM_HIDDEN.REPEAT_NAME]: {
			[event]: entry
		},
		[DEFAULT_ROW_ACTION_VISIBILITY.DOWNLOAD_HIDDEN.REPEAT_NAME]: {
			[event]: entry
		}
	};
}

export function resetStubbedDispatchConfig(dispatchConfig: StubbedDispatchConfig): void {
	dispatchConfig.repeat.enterRow.mock.resetCalls();
	dispatchConfig.repeat.removeRow.mock.resetCalls();
	dispatchConfig.repeat.onMoveRow.mock.resetCalls();
	dispatchConfig.repeat.onCloneRow.mock.resetCalls();
	dispatchConfig.repeat.onCustomRowAction.mock.resetCalls();
	dispatchConfig.onAttachmentDownload.mock.resetCalls();
	dispatchConfig.onAttachmentDelete.mock.resetCalls();
	dispatchConfig.onAttachmentUpload.mock.resetCalls();
	dispatchConfig.onCancelAttachmentUpload.mock.resetCalls();
}

export function assertModelSetupCorrect(
	formModel: FormModel,
	repeatPath: ModelPath,
	expectedStatus?: boolean
): void {
	const repeat = findElementByFormModelPath(formModel, repeatPath);
	if (repeat === undefined || !FormModel.Repeat.isInstance(repeat)) {
		fail(`Wrong setup: Expected to find a repeat with path ${repeatPath}`);
	}

	strictEqual(repeat.enableCopy, expectedStatus);
	strictEqual(repeat.enableRemove, expectedStatus);
	strictEqual(repeat.enableReorder, expectedStatus);
}

export function rowActionAvailableInActionColumn(
	wrapper: RtlRenderWrapper,
	buttonId: string
): void {
	assertRowActionInActionColumnState(wrapper, buttonId, true);
}

export function rowActionNotAvailableInActionColumn(
	wrapper: RtlRenderWrapper,
	buttonId: string
): void {
	assertRowActionInActionColumnState(wrapper, buttonId, false);
}

export function assertRowActionInActionColumnState(
	wrapper: RtlRenderWrapper,
	buttonId: string,
	visible: boolean
): void {
	const actual = within(wrapper.baseElement).queryAllById(buttonId).length;
	const expected = visible ? 1 : 0;
	equal(
		actual,
		expected,
		`expected row action to be ${expected === 0 ? "not " : ""}visible: ${buttonId}`
	);
}

export function rowActionDisabledInActionColumn(wrapper: RtlRenderWrapper, buttonId: string): void {
	const { widgetMap } = wrapper;
	const buttonProps = query(widgetMap.Button).withId(buttonId).props();
	strictEqual(buttonProps.disabled, true);
}

export function rowActionNotDisabledInActionColumn(
	wrapper: RtlRenderWrapper,
	buttonId: string
): void {
	const { widgetMap } = wrapper;
	const buttonProps = query(widgetMap.Button).withId(buttonId).props();
	strictEqual(buttonProps.disabled, false);
}

export async function openRowActionContextMenu(
	wrapper: RtlRenderWrapper,
	cellId: string
): Promise<void> {
	const cell = within(wrapper.baseElement).getById(cellId);
	act(() => fireEvent.contextMenu(cell, mouseEventMock));
}

export function assertRowActionContextMenuState(
	wrapper: RtlRenderWrapper,
	itemId: string,
	status: { available?: boolean; disabled?: boolean }
): void {
	const item = query(wrapper.widgetMap.ListItem).withId(itemId);

	if (status.available !== undefined) {
		status.available ? item.assertRendered() : item.assertNotRendered();
	}

	if (status.disabled !== undefined) {
		const itemProps = query(wrapper.widgetMap.ListItem).withId(itemId).props();
		strictEqual(itemProps.disabled, status.disabled);
	}
}

export function rowActionAvailableInContextMenu(wrapper: RtlRenderWrapper, itemId: string): void {
	assertRowActionContextMenuState(wrapper, itemId, {
		available: true
	});
}

export function rowActionNotAvailableInContextMenu(
	wrapper: RtlRenderWrapper,
	itemId: string
): void {
	assertRowActionContextMenuState(wrapper, itemId, {
		available: false
	});
}

export function rowActionDisabledInContextMenu(wrapper: RtlRenderWrapper, itemId: string): void {
	assertRowActionContextMenuState(wrapper, itemId, {
		disabled: true
	});
}

export function rowActionNotDisabledInContextMenu(wrapper: RtlRenderWrapper, itemId: string): void {
	assertRowActionContextMenuState(wrapper, itemId, {
		disabled: false
	});
}

export function setupFormEngineRendererForButtonConfigurationTests(
	models: Models,
	document: GroupInstance,
	screen = FORM_MODEL.rowActionButtonsScreen
): Promise<RtlRenderWrapper> {
	const SCREEN_MODEL_PATH = createModelPath(screen);

	return SetupHelpers.setupFormEngineRendererWithRtlAsync({
		models,
		data: { document },
		ui: {
			screenLocation: [{ locationPath: SCREEN_MODEL_PATH, path: [] }]
		}
	});
}

export function findAndAssertButtonProps(params: {
	readonly msgPrefix?: string;
	readonly wrapper: RtlRenderWrapper;
	readonly buttonId: string;
	readonly expectedLabel?: string;
	readonly expectedTitle?: string;
	readonly expectedIcon?: string;
	readonly expectedPrimary?: boolean;
	readonly expectedDestructive?: boolean;
	readonly expectedDisabled?: boolean;
	readonly expectedAriaLabel?: string;
}): void {
	const {
		msgPrefix,
		wrapper,
		buttonId,
		expectedLabel,
		expectedTitle,
		expectedIcon,
		expectedPrimary,
		expectedDestructive,
		expectedDisabled,
		expectedAriaLabel
	} = params;

	const prefix = msgPrefix ? msgPrefix + ": " : "";

	const button = within(wrapper.baseElement).getById(buttonId);
	const buttonProps = query(wrapper.widgetMap.Button).withId(buttonId).props();

	const buttonLabel =
		typeof buttonProps.label === "string"
			? buttonProps.label
			: getReactElementContentLabel(buttonProps.label);

	strictEqual(
		buttonLabel,
		expectedLabel,
		`${prefix}Label of button (${buttonLabel}) doesn't match expected label: ${expectedLabel}`
	);

	const buttonTitle = buttonProps.title;
	strictEqual(
		buttonTitle,
		expectedTitle,
		`${prefix}Title of button (${buttonTitle}) doesn't match expected title: ${expectedTitle}`
	);

	const icon = within(button).queryAllByDataRole(ICON);

	if (expectedIcon === undefined) {
		strictEqual(icon.length, 0, "Expected Button to have no Icon");
	} else {
		strictEqual(icon.length, 1, "Expected Button to have an Icon");

		const iconText = icon[0].textContent;
		strictEqual(
			iconText,
			expectedIcon,
			`${prefix}Prop children of button's icon (${iconText}) doesn't match expected value: ${expectedIcon}`
		);
	}

	const primary = buttonProps.primary;
	strictEqual(
		primary,
		expectedPrimary,
		`${prefix}The primary property of the button (${primary}) doesn't match expected value: ${expectedPrimary}`
	);

	const destructive = buttonProps.destructive;
	strictEqual(
		destructive,
		expectedDestructive,
		`${prefix}The destructive property of the button (${destructive}) doesn't match expected value: ${expectedDestructive}`
	);

	const disabled = buttonProps.disabled;
	strictEqual(
		disabled,
		expectedDisabled ?? false,
		`${prefix}The disabled property of the button (${disabled}) doesn't match expected value: ${
			expectedDisabled ?? false
		}`
	);

	if (expectedAriaLabel) {
		const ariaLabel = buttonProps.buttonAttributes?.["aria-label"];
		strictEqual(
			ariaLabel,
			expectedAriaLabel,
			`${prefix}The aria-label property of the button (${ariaLabel}) doesn't match the expected value: ${expectedAriaLabel}`
		);
	}
}

export function assertAriaLabelledBy(
	wrapper: RtlRenderWrapper,
	buttonId: string,
	columnRef: string
): void {
	const buttonProps = query(wrapper.widgetMap.Button).withId(buttonId).props();

	const ariaLabelledBy = buttonProps.buttonAttributes?.["aria-labelledby"];
	strictEqual(ariaLabelledBy, `${buttonId} ${columnRef}`);
}

export async function findAndAssertListItemProps(params: {
	readonly msgPrefix?: string;
	readonly wrapper: RtlRenderWrapper;
	readonly cellId: string;
	readonly itemId: string;
	readonly expectedGraphic?: string;
	readonly expectedText?: string;
	readonly expectedTitle?: string;
}): Promise<void> {
	const { msgPrefix, wrapper, cellId, itemId, expectedGraphic, expectedText, expectedTitle } =
		params;
	const prefix = msgPrefix ? msgPrefix + ": " : "";

	const cell = within(wrapper.baseElement).getById(cellId);
	fireEvent.contextMenu(cell, mouseEventMock);

	const item = within(wrapper.baseElement).getById(itemId);
	const icon = within(item).queryByDataRole(DataRoles.Icon);

	if (expectedGraphic === undefined) {
		equal(icon, null, prefix + "Expected item to have no graphic");
	} else {
		ok(icon, prefix + "Expected item to have an graphic");

		const iconName = icon?.textContent;
		strictEqual(
			iconName,
			expectedGraphic,
			`${prefix}Prop children of item's graphic (${iconName}) doesn't match expected value: ${expectedGraphic}`
		);
	}

	const itemText = within(item).queryByDataRole(LIST_ITEM_TEXT);
	const itemTextContent =
		itemText?.firstElementChild?.tagName === "SPAN"
			? itemText?.firstElementChild?.innerHTML
			: itemText?.textContent;

	strictEqual(
		itemTextContent,
		expectedText,
		`${prefix}Text of item (${itemText}) doesn't match expected text: ${expectedText}`
	);

	if (expectedTitle !== undefined) {
		const itemTitle = within(item).queryByDataRole(LIST_ITEM_CONTENT)?.title;
		strictEqual(
			itemTitle,
			expectedTitle,
			`${prefix}Title of item (${itemTitle}) doesn't match expected title: ${expectedTitle}`
		);
	}
}

export function findAndAssertExpandedRowFooterButtonProps(params: {
	wrapper: RtlRenderWrapper;
	buttonId: string;
	isExpected: boolean;
	isDisabled?: boolean;
}): void {
	const { wrapper, buttonId, isExpected, isDisabled } = params;

	// assert expanded row is present
	within(wrapper.baseElement).getByDataRole(EXPANDABLE_ROW_BODY);

	if (isExpected) {
		const button = query(wrapper.widgetMap.Button).withId(buttonId).props();

		if (isDisabled !== undefined) {
			strictEqual(
				button.disabled,
				isDisabled,
				`Expected ER row footer button${isDisabled ? "" : " not"} to be disabled.`
			);
		}
	} else {
		query(wrapper.widgetMap.Button).withId(buttonId).assertNotRendered();
	}
}
