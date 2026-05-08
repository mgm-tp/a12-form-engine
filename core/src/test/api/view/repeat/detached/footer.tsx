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

import { deepEqual, equal } from "node:assert/strict";
import { mock } from "node:test";

import { act, type ComponentType } from "react";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import type { ActionContentboxProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.api.js";

import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import type { ConfirmationButtonProps } from "../../../../../view/internal/components/widgets/form-engine/confirmationButton.js";
import { ConfirmationButton } from "../../../../../view/internal/components/widgets/form-engine/confirmationButton.js";
import type { ComponentMap } from "../../../../../view/internal/configuration/componentMap/component-map.js";
import {
	DefaultFormModelMap,
	defaultMapDispatchToProps
} from "../../../../../view/internal/configuration/Defaults.js";
import type { Config } from "../../../../../view/internal/configuration/engine-configuration.js";
import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import { mockFunctions } from "../../../../rtl-utils/mock-map.js";
import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { BUTTONS } from "../../../../utils/test-model-helpers/button.melies.js";

const { createDocumentPath } = DocumentHelpers;
const { createModelPath } = ModelHelpers;

export function executeFooterTests() {
	const models = setupModelsFixture("buttons");

	const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
	const onLeaveDetachedRepeatRow = mock.fn();
	const dispatchConfig = {
		...stubbedDispatch.eventHandlers,
		repeat: {
			...stubbedDispatch.eventHandlers.repeat,
			onLeaveDetachedRepeatRow
		}
	};

	afterEach(() => {
		onLeaveDetachedRepeatRow.mock.resetCalls();
	});

	const repeatStateForNewRow: ReadonlyObjectMap<EngineStore.Repeat.InstanceState> = {
		"/Screen1/Repeat": {
			newRow: {
				rowPath: createDocumentPath(["Root"], ["Nested_L1"]),
				rowState: "workingOn"
			}
		}
	};

	const locationStackForDetachedRepeat: EngineStore.ScreenState[] = [
		{
			path: createDocumentPath(),
			locationPath: createModelPath(BUTTONS.screen1)
		},
		{
			path: BUTTONS.groupDocumentPath,
			locationPath: BUTTONS.detachedRepeatDetailScreen
		}
	];

	const locationStackForDirtyDetachedRepeat: EngineStore.ScreenState[] = [
		{
			path: createDocumentPath(),
			locationPath: createModelPath(BUTTONS.screen1)
		},
		{
			path: BUTTONS.groupDocumentPath,
			locationPath: BUTTONS.detachedRepeatDetailScreen,
			dirty: true
		}
	];

	const locationStackForNewRowDetachedRepeat: EngineStore.ScreenState[] = [
		{
			path: createDocumentPath(),
			locationPath: createModelPath(BUTTONS.screen1),
			repeatInstanceState: repeatStateForNewRow
		},
		{
			path: BUTTONS.groupDocumentPath,
			locationPath: BUTTONS.detachedRepeatDetailScreen
		}
	];

	describe("When the form is set to readonly", () => {
		describe("Return button", () => {
			testButton({
				buttonType: "return",
				buttonId: BUTTONS.DETACHED_REPEAT_BUTTON_RETURN,
				expectedComponent: Button,
				locationStack: locationStackForDetachedRepeat,
				readonly: true
			});
		});
	});

	describe("When the form is not set to readonly", () => {
		describe("Commit button", () => {
			describe("When a new row is added", () => {
				testButton({
					buttonType: "commit",
					buttonId: BUTTONS.DETACHED_REPEAT_BUTTON_ADD_APPLY,
					expectedComponent: Button,
					locationStack: locationStackForNewRowDetachedRepeat
				});
			});

			describe("When a row is edited", () => {
				testButton({
					buttonType: "commit",
					buttonId: BUTTONS.DETACHED_REPEAT_BUTTON_EDIT_APPLY,
					expectedComponent: Button,
					locationStack: locationStackForDetachedRepeat
				});
			});
		});

		describe("Cancel button", () => {
			describe("When the screen is not dirty", () => {
				testButton({
					buttonType: "cancel",
					buttonId: BUTTONS.DETACHED_REPEAT_BUTTON_EDIT_CANCEL,
					expectedComponent: Button,
					locationStack: locationStackForDetachedRepeat
				});
			});

			describe("When the screen is dirty", () => {
				describe("and disableDirtyHandlingForDetachedRepeat is set to true in the config", () => {
					testButton({
						buttonType: "cancel",
						buttonId: BUTTONS.DETACHED_REPEAT_BUTTON_EDIT_CANCEL,
						expectedComponent: Button,
						locationStack: locationStackForDirtyDetachedRepeat,
						uiConfig: {
							disableDirtyHandlingForDetachedRepeat: true
						}
					});
				});

				describe("and disableDirtyHandlingForDetachedRepeat is set to undefined in the config", () => {
					testButton({
						buttonType: "cancel",
						buttonId: BUTTONS.DETACHED_REPEAT_BUTTON_EDIT_CANCEL,
						expectedComponent: ConfirmationButton,
						locationStack: locationStackForDirtyDetachedRepeat
					});
				});
			});
		});
	});

	/**
	 * Test rendering of a footer button.
	 *
	 * Tests rendering calls on components. To ensure that the rendering
	 * happened inside the footer, only the footer is rendered.
	 */
	function testButton(options: {
		buttonType: string;
		buttonId: string;
		expectedComponent: ComponentType<ButtonProps> | ComponentType<ConfirmationButtonProps>;
		locationStack: EngineStore.ScreenState[];
		readonly?: boolean;
		uiConfig?: Partial<Config>;
	}) {
		const RenderFooterOnly: React.ComponentType<ActionContentboxProps> = props => props.footer;

		const componentMap: ComponentMap = mockFunctions(getComponentMocks());

		for (const disabled of [false, true]) {
			it(`renders a${disabled ? " disabled" : ""} ${options.buttonType} button${disabled ? " when the disabled state is true" : ""}`, async () => {
				const formModelMap = mockFunctions(DefaultFormModelMap);

				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					componentMap,
					models,
					ui: {
						readonly: options.readonly,
						screenLocation: options.locationStack,
						disabled
					},
					config: {
						...options.uiConfig,
						widgetMap: {
							ActionContentbox: RenderFooterOnly
						},
						formModelMap
					}
				});

				const q =
					options.expectedComponent === Button
						? query(wrapper.widgetMap.Button)
						: query(wrapper.componentMap.ConfirmationButton);
				const props = q.withId(options.buttonId).props();
				equal(props.disabled, disabled);
			});
		}

		describe("when the button is clicked", () => {
			if (options.expectedComponent === Button) {
				it(`triggers onLeaveDetachedRepeatRow with cancel === ${
					options.buttonType !== "commit"
				}`, async () => {
					const wrapper = await SetupHelpers.setupConnectedFormEngineWithRtlAsync({
						models,
						ui: {
							screenLocation: options.locationStack,
							readonly: options.readonly
						},
						config: options.uiConfig,
						dispatchConfig
					});

					const button = query(wrapper.widgetMap.Button).withId(options.buttonId).props();

					button.onClick?.(mouseEventMock);

					equal(
						onLeaveDetachedRepeatRow.mock.callCount(),
						1,
						`Dispatch function was called
						${onLeaveDetachedRepeatRow.mock.callCount()} time(s). Expected call count: 1`
					);

					deepEqual(
						onLeaveDetachedRepeatRow.mock.calls[0].arguments[0],
						options.buttonType !== "commit"
					);
				});
			} else {
				it("triggers onLeaveDetachedRepeatRow with cancel === true, when the confirm button is clicked", async () => {
					const wrapper = await SetupHelpers.setupConnectedFormEngineWithRtlAsync({
						models,
						ui: {
							screenLocation: options.locationStack,
							readonly: options.readonly
						},
						config: options.uiConfig,
						dispatchConfig
					});

					const button = query(wrapper.widgetMap.Button).withId(options.buttonId).props();

					query(wrapper.widgetMap.ModalNotification).assertNotRendered();

					act(() => {
						button.onClick?.(mouseEventMock);
					});

					query(wrapper.widgetMap.ModalNotification).assertRendered();

					const confirmButton = query(wrapper.widgetMap.Button)
						.withId(BUTTONS.DETACHED_REPEAT_CONFIRMATION_BUTTON_CONFIRM)
						.props();

					act(() => {
						confirmButton.onClick?.(mouseEventMock);
					});

					equal(
						onLeaveDetachedRepeatRow.mock.callCount(),
						1,
						`Dispatch function was called
						${onLeaveDetachedRepeatRow.mock.callCount()} time(s). Expected call count: 1`
					);

					deepEqual(
						onLeaveDetachedRepeatRow.mock.calls[0].arguments[0],
						options.buttonType !== "commit"
					);
				});
			}
		});
	}
}
