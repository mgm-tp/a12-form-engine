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

import type { ReactElement, ReactNode } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { NavigationContentboxContext } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.view.js";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector/main/size-context.js";

import { createLocalizableFactory } from "../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../back-end/store/internal/selectors/ui-state.js";
import { isObjectEmpty } from "../../../../back-end/utils/internal/guards.js";
import { ComponentMapContext } from "../../configuration/componentMap/component-map-context.js";
import { WidgetMapContext } from "../../configuration/widget-map-context.js";
import { isOnSmallDevice } from "../../utilities/size-context.js";

import { CorrectionModeFooter } from "../form-engine/correction-mode/correction-mode-footer.js";
import { CorrectionModeScreen } from "../form-engine/correction-mode/correction-mode-screen.js";
import { ValidationBar } from "../form-engine/correction-mode/validation-bar.js";

import { AriaLevelContext, DEFAULT_ARIA_LEVEL } from "./AriaLevelContext.js";
import type { ContentBoxRenderConfiguration } from "./content-box-render-configuration.js";
import { getButtonConfiguration, isActionButtonsVisible } from "./sub-items/action-buttons.js";
import { BreadCrumbs } from "./sub-items/bread-crumbs.js";
import { DetachedRepeatFooter } from "./sub-items/detached-repeat-footer.js";

/** @internal */
interface ContentBoxProps {
	readonly config: ContentBoxRenderConfiguration;
	readonly children: ReactNode;
}

/** @internal */
export function ContentBox(props: ContentBoxProps): ReactElement {
	const { config } = props;

	const { renderOptions } = config;

	const correctionScreen = UiStateSelectors.correctionScreenState()(renderOptions.state);

	if (correctionScreen.visible) {
		return <CorrectionModeScreen {...config} />;
	} else {
		return <FormScreen {...props} />;
	}
}

function FormScreen(props: {
	config: ContentBoxRenderConfiguration;
	children: ReactNode;
}): ReactElement {
	const { config, children } = props;

	const { renderOptions } = config;

	const localizer = useContext(LocalizerContext).localizer;
	const navigationContentbox = useContext(NavigationContentboxContext);
	const size = useContext(SizeContext).currentSize;
	const widgetMap = useContext(WidgetMapContext);
	const { ActionButtons, ScreenFooter, HeadingElement, NavigationBar } =
		useContext(ComponentMapContext);

	const currentScreen = UiStateSelectors.currentScreen()(renderOptions.state);

	const navigationBar = <NavigationBar config={config} element={currentScreen.subHeaderBox} />;
	const subActionBar = isActionButtonsVisible({ config, element: currentScreen.subHeaderBox }) ? (
		isOnSmallDevice(size) ? (
			getButtonConfiguration({
				screenSubHeaderBox: currentScreen.subHeaderBox,
				config
			})
		) : (
			<ActionButtons config={config} element={currentScreen.subHeaderBox} />
		)
	) : undefined;

	const detachedRepeatDetailScreenOpen = UiStateSelectors.isDetachedRepeatDetailScreenOpen()(
		renderOptions.state
	);

	const footer = UiStateSelectors.correctionModeBackup()(renderOptions.state) ? (
		<CorrectionModeFooter {...config} />
	) : detachedRepeatDetailScreenOpen ? (
		<DetachedRepeatFooter config={config} />
	) : (
		<ScreenFooter config={config} element={currentScreen} />
	);

	const headingElements = <HeadingElement config={config} />;

	const validationBar =
		UiStateSelectors.validationBarState()(renderOptions.state).visible &&
		!isObjectEmpty(UiStateSelectors.messages()(renderOptions.state)) ? (
			<ValidationBar {...config} />
		) : undefined;

	const breadCrumb = <BreadCrumbs config={config} />;

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(renderOptions.state),
		ModelSelectors.formModel()(renderOptions.state)
	);
	const ariaLabelLocalized = localizer(
		...localizableFactory.modelLabel(ModelSelectors.formModel()(renderOptions.state))
	);

	const ActionContentBox =
		config.renderOptions.config.widgetMap?.ActionContentbox ?? widgetMap.ActionContentbox;

	const actionContentBoxComponent = (
		<AriaLevelContext.Provider
			value={{ ariaLevel: (renderOptions.config.ariaLevel ?? DEFAULT_ARIA_LEVEL) + 1 }}
		>
			<ActionContentBox
				navigation={navigationBar}
				headingElements={headingElements}
				footer={footer}
				buttons={subActionBar}
				notificationArea={validationBar}
				breadcrumbs={breadCrumb}
				listenToNavigationContext={true}
				role="form"
				ariaLabel={ariaLabelLocalized}
			>
				{children}
			</ActionContentBox>
		</AriaLevelContext.Provider>
	);

	if ("onBackButtonClicked" in navigationContentbox) {
		return (
			<NavigationContentboxContext.Provider
				value={{
					onBackButtonClicked:
						detachedRepeatDetailScreenOpen && isOnSmallDevice(size)
							? () => {
									props.config.renderOptions.eventHandlers.repeat.onLeaveDetachedRepeatRow(true);
								}
							: navigationContentbox.onBackButtonClicked
				}}
			>
				{actionContentBoxComponent}
			</NavigationContentboxContext.Provider>
		);
	} else {
		return actionContentBoxComponent;
	}
}
