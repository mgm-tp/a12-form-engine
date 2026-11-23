// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement, RefObject } from "react";
import { useImperativeHandle, useRef } from "react";

import { ModelSelectors, UiStateSelectors } from "../../../../back-end/store/index.js";
import { UiId } from "../../../../back-end/utils/internal/generateUiId.js";
import type { FormModelMap } from "../../configuration/engine-configuration.js";
import { UtilityClasses } from "../../utilities/css-classes.js";

import type { ScrollApi } from "../scroll-api.js";

import { InputRefContext } from "./input-reference-provider.js";
import { createScreen } from "./model-components.js";

type FormEngineComponentProps = {
	readonly config: FormModelMap.RenderConfiguration;
	readonly scrollRef?: RefObject<ScrollApi | null | undefined>;
};

/** @internal */
export function FormEngineComponent(props: FormEngineComponentProps): ReactElement | null {
	const { config } = props;
	const { renderOptions: options } = config;
	const formModel = ModelSelectors.formModel()(options.state);

	const formWrapperElement = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(props.scrollRef, () => ({
		scrollToTop: () => {
			formWrapperElement.current?.scrollIntoView(true);
		},
		focusElement: () => {
			inputRef.current?.focus();
		}
	}));

	if (UiStateSelectors.correctionScreenState()(options.state).visible) {
		return null;
	} else {
		const currentScreenLocation = UiStateSelectors.currentScreenLocation()(options.state);
		const currentScreen = UiStateSelectors.currentScreen()(options.state);

		const screen = currentScreen
			? createScreen(currentScreen, {
					...config,
					parentPath: currentScreenLocation.locationPath
				})
			: null;

		const id = UiId.generate({ element: formModel, uiIdPrefix: options.config.uiIdPrefix });

		return screen !== null ? (
			<div
				key={id}
				id={id}
				tabIndex={-1}
				data-role="form"
				className={UtilityClasses.OUTLINE_NONE}
				ref={formWrapperElement}
			>
				<InputRefContext.Provider value={inputRef}>{screen}</InputRefContext.Provider>
			</div>
		) : null;
	}
}
