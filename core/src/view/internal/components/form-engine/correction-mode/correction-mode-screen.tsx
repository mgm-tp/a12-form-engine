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

import type { ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../back-end/localization/internal/languages/keys.js";
import { createLocalizableFactory } from "../../../../../back-end/localization/internal/localization.js";
import { getLocalizedResource } from "../../../../../back-end/localization/internal/localize.js";
import type { CorrectionModeItem } from "../../../../../back-end/store/internal/CorrectionModeItem.js";
import { ModelSelectors } from "../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import { findElementByFormModelPath, FormModel } from "../../../../../models/index.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import { DefaultWidgetMap } from "../../../configuration/DefaultWidgetMap.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { getErrors, getInfos, getWarnings } from "../../../utilities/control-utilities.js";
import { AriaLevelContext, DEFAULT_ARIA_LEVEL } from "../../content-box/AriaLevelContext.js";

import { CorrectionModeUtil } from "./utils.js";
import { getValidationMessageKey, localizeLocationStack } from "./validation-bar-elements.js";

/** @internal  */
export function CorrectionModeScreen(config: FormModelMap.RenderConfiguration): ReactElement {
	const { renderOptions: options } = config;
	const localizer = useContext(LocalizerContext).localizer;
	const { ActionContentbox, List, ListItem, SizeContainer } = useContext(WidgetMapContext);
	const { ContentBoxHeader } = useContext(ComponentMapContext);

	const titleText = getLocalizedResource(RESOURCE_KEYS.validation.correctionMode.title, localizer);
	const ariaLevel = options.config.ariaLevel ?? DEFAULT_ARIA_LEVEL;
	const headingElements = <ContentBoxHeader title={titleText ?? ""} ariaLevel={ariaLevel} />;

	const messages = UiStateSelectors.messages()(options.state);
	const messagesArray = Object.keys(messages).reduce<EngineStore.Validation.Message[]>(
		(acc, message) => {
			const realMessage = messages[message];
			return [
				...acc,
				...(realMessage?.validationMessages ?? []),
				...(realMessage?.parseError ? [realMessage.parseError.message] : [])
			];
		},
		[]
	);

	const sortedMessages = [...messagesArray].sort(
		// keep message order but sort by severity, starting with errors
		(m1, m2) =>
			(m1.severity === "ERROR" && (m2.severity === "WARNING" || m2.severity === "INFO")) ||
			(m1.severity === "WARNING" && m2.severity === "INFO")
				? -1
				: m1.severity === m2.severity
					? 0
					: 1
	);

	const errors = getErrors(sortedMessages).length;
	const warnings = getWarnings(sortedMessages).length;
	const infos = getInfos(sortedMessages).length;

	const noErrorsText = (
		<div>{getLocalizedResource(RESOURCE_KEYS.validation.correctionMode.noErrors, localizer)}</div>
	);

	const uiId = UiId.generateForCorrectionModeDetailScreen({
		uiIdPrefix: config.renderOptions.config.uiIdPrefix
	});

	const contentBoxContent = (
		<SizeContainer id={uiId}>
			{sortedMessages.length > 0 ? (
				<List>
					{sortedMessages.map((message, index) => {
						return (
							<ListItem
								key={index}
								readonly
								text={
									<ValidationMessage
										validationMessage={message}
										renderOptions={options}
										listIndex={index}
									/>
								}
							/>
						);
					})}
				</List>
			) : (
				noErrorsText
			)}
		</SizeContainer>
	);

	return (
		<ActionContentbox
			headingElements={headingElements}
			notificationArea={
				<CorrectionModeNotificationArea
					errors={errors}
					warnings={warnings}
					infos={infos}
					options={options}
					disabled={UiStateSelectors.disabled()(options.state)}
				/>
			}
		>
			<AriaLevelContext.Provider value={{ ariaLevel: ariaLevel + 1 }}>
				{contentBoxContent}
			</AriaLevelContext.Provider>
		</ActionContentbox>
	);
}

function ValidationMessage(props: {
	validationMessage: EngineStore.Validation.Message;
	renderOptions: FormModelMap.RenderOptions;
	listIndex: number;
}): ReactElement {
	const { validationMessage, renderOptions: options, listIndex } = props;
	const key = String(listIndex);
	const { localizer, conversion } = useContext(LocalizerContext);
	const { Button, Icon, MessageBox } = useContext(WidgetMapContext);

	const items: CorrectionModeItem[] = [];
	const uiIssueReport = CorrectionModeUtil.getUIIssueReport(
		validationMessage,
		options,
		localizer,
		conversion
	);
	if (uiIssueReport.fixable) {
		items.push(...uiIssueReport.items);
	}

	const label = validationMessage.errorText;
	const severity =
		validationMessage.severity.toLowerCase() as Lowercase<EngineStore.Validation.MessageSeverity>;

	const icon = <Icon>{severity}</Icon>;

	const correctionScreen = UiStateSelectors.correctionScreenState()(options.state);
	const showDetails = correctionScreen.showDetailsState[key];

	const actionButton = (
		<Button
			label={getLocalizedResource(
				showDetails
					? RESOURCE_KEYS.validation.correctionMode.hideMessageBoxDetails
					: RESOURCE_KEYS.validation.correctionMode.showMessageBoxDetails,
				localizer
			)}
			primary
			disabled={UiStateSelectors.disabled()(options.state)}
			onClick={() => {
				options.eventHandlers.correctionMode.correctionView.onShowDetails(key, !showDetails);
			}}
			data-testid={`button-${listIndex}`}
		/>
	);

	const children = showDetails
		? items.map((item, index) => (
				<CorrectionModeItemComponent
					validationMessage={validationMessage}
					item={item}
					index={index}
					options={options}
					disabled={UiStateSelectors.disabled()(options.state)}
					key={index}
				/>
			))
		: undefined;

	return items.length <= 1 ? (
		<MessageBox
			key={key}
			label={localizer(...label)}
			variant={severity}
			icon={icon}
			action={
				items.length === 1 ? (
					<CorrectionModeItemComponent
						validationMessage={validationMessage}
						item={items[0]}
						index={0}
						options={options}
					/>
				) : undefined
			}
			focusOnMessage={false}
			data-testid={`messageBox-${listIndex}`}
		/>
	) : (
		<MessageBox
			key={key}
			label={localizer(...label)}
			variant={severity}
			icon={icon}
			action={actionButton}
			focusOnMessage={false}
			data-testid={`messageBox-${listIndex}`}
		>
			{children}
		</MessageBox>
	);
}

const ARIA_LINK: React.HTMLAttributes<HTMLButtonElement> = { role: "link" };

function CorrectionModeItemComponent(props: {
	readonly validationMessage: EngineStore.Validation.Message;
	readonly item: CorrectionModeItem;
	readonly index: number;
	readonly options: FormModelMap.RenderOptions;
	readonly disabled?: boolean;
}): ReactElement {
	const { validationMessage, item, index, options, disabled } = props;
	const { Button } = options.config.widgetMap ?? DefaultWidgetMap;
	const localizer = useContext(LocalizerContext).localizer;

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(options.state),
		ModelSelectors.formModel()(options.state)
	);

	const { formModelPath, locationStack } = item;
	const element = findElementByFormModelPath(
		ModelSelectors.formModel()(options.state),
		formModelPath
	);
	if (element === undefined) {
		throw new Error("Could not find element " + formModelPath);
	}

	const label = FormModel.Control.isInstance(element)
		? localizer(...localizableFactory.inputLabel(element, formModelPath))
		: FormModel.FieldOverviewColumn.isInstance(element)
			? localizer(...localizableFactory.repeatOverviewColumnTitle(element, formModelPath))
			: undefined;

	const locationLabels = localizeLocationStack(options, locationStack).map(
		localizables => localizer(...localizables) ?? ""
	);

	const validationBar = UiStateSelectors.validationBarState()(options.state);
	const expanded = validationBar.expanded;

	return (
		<Button
			key={String(index)}
			label={[...locationLabels, label].join(" > ")}
			disabled={disabled}
			onClick={() => {
				if (expanded) {
					options.eventHandlers.correctionMode.validationBar.onExpand(false, false);
				}
				options.eventHandlers.correctionMode.onGoToElement(
					item,
					getValidationMessageKey(validationMessage)
				);
			}}
			buttonAttributes={ARIA_LINK}
			data-testid={`button-${props.index}`}
		/>
	);
}

type SeverityCombination =
	| "errors"
	| "warnings"
	| "infos"
	| "errorsandwarnings"
	| "errorsandinfos"
	| "warningsandinfos"
	| "errorsandwarningsandinfos";

function CorrectionModeNotificationArea(props: {
	readonly errors: number;
	readonly warnings: number;
	readonly infos: number;
	readonly options: FormModelMap.RenderOptions;
	readonly disabled?: boolean;
}): ReactElement {
	const localizer = useContext(LocalizerContext).localizer;
	const { Button, GlobalMessageBox, NotificationArea } = useContext(WidgetMapContext);

	const severities = ["errors", "warnings", "infos"] as const;

	// fallback to "errors" if no messages at all
	const resourceId = severities.filter(severity => props[severity] > 0).join("and") || "errors";
	const key = RESOURCE_KEYS.validation[resourceId as SeverityCombination];

	const text = getLocalizedResource(key, localizer, {
		ERROR_COUNT: String(props.errors),
		WARNING_COUNT: String(props.warnings),
		INFO_COUNT: String(props.infos)
	});

	const actionButton = (
		<Button
			label={getLocalizedResource(RESOURCE_KEYS.validation.correctionScreen.back, localizer)}
			disabled={props.disabled}
			invert
			onClick={() => props.options.eventHandlers.correctionMode.correctionView.onShow(false)}
		/>
	);

	return (
		<NotificationArea>
			<GlobalMessageBox
				content={text}
				variant={props.errors > 0 ? "error" : props.warnings > 0 ? "warning" : "info"}
				key="NotificationAreaBox"
				actions={actionButton}
				focusOnMount
				id={UiId.generateForCorrectionScreenBar({ uiIdPrefix: props.options.config.uiIdPrefix })}
			/>
		</NotificationArea>
	);
}
