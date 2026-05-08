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
