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

import type { JSX, ReactElement } from "react";
import { useContext, useEffect, useRef } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../back-end/localization/internal/localize.js";
import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineStore } from "../../../../../../back-end/store/internal/store.js";
import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";

import type { LocationLabel, ValidationBarItem } from "../validation-bar-elements.js";
import {
	createToValidationBarItem,
	getValidationMessageKey,
	mostSeriousMessageSeverity,
	ValidationBarContent
} from "../validation-bar-elements.js";

/** @internal  */
export function MobileValidationBar(props: {
	messages: EngineStore.Validation.Message[];
	showModal: boolean;
	options: FormModelMap.RenderOptions;
	currentMessageKey?: string;
}): ReactElement {
	const { messages, currentMessageKey, showModal, options } = props;
	const { Icon, MobileValidationBarGraphic, MobileValidationBarOverview } =
		useContext(WidgetMapContext);
	const { localizer, conversion } = useContext(LocalizerContext);

	const index =
		messages.length !== 1
			? messages.findIndex(m => getValidationMessageKey(m) === currentMessageKey)
			: 0;

	const evaluateLocationStackAndLabels = showModal && index >= 0;
	const validationBarMessages = messages.map(message =>
		createToValidationBarItem(
			message,
			options,
			localizer,
			conversion,
			evaluateLocationStackAndLabels
		)
	);

	const validationMessages = validationBarMessages.map(({ locations, ...remaining }) => ({
		...remaining,
		locations: locations.map(({ label }) => label)
	}));

	const numberOfErrors = String(validationMessages.filter(m => m.type === "error").length);
	const numberOfWarnings = String(validationMessages.filter(m => m.type === "warning").length);
	const numberOfInfos = String(validationMessages.filter(m => m.type === "info").length);

	const errorGraphicOverview = (
		<MobileValidationBarGraphic variant="error" key="error" a11yTitleSupport>
			{numberOfErrors}
		</MobileValidationBarGraphic>
	);

	const warningGraphicOverview = (
		<MobileValidationBarGraphic variant="warning" key="warning" a11yTitleSupport>
			{numberOfWarnings}
		</MobileValidationBarGraphic>
	);

	const infoGraphicOverview = (
		<MobileValidationBarGraphic variant="info" key="info" a11yTitleSupport>
			{numberOfInfos}
		</MobileValidationBarGraphic>
	);

	const errorGraphicModal = (
		<MobileValidationBarGraphic variant="error" key="error">
			{numberOfErrors}
		</MobileValidationBarGraphic>
	);

	const warningGraphicModal = (
		<MobileValidationBarGraphic variant="warning" key="warning">
			{numberOfWarnings}
		</MobileValidationBarGraphic>
	);

	const infoGraphicModal = (
		<MobileValidationBarGraphic variant="info" key="info">
			{numberOfWarnings}
		</MobileValidationBarGraphic>
	);

	const validationBarMessage: ValidationBarItem | undefined = validationBarMessages[index];

	const modalView = showModal ? (
		<ModalView
			index={index >= 0 ? index : undefined}
			errorGraphic={errorGraphicModal}
			warningGraphic={warningGraphicModal}
			infoGraphic={infoGraphicModal}
			messages={validationMessages}
			onGoToIssueClick={
				validationBarMessage
					? indexInLocations => {
							options.eventHandlers.correctionMode.onGoToElement(
								validationBarMessage.locations[indexInLocations].item
							);
						}
					: undefined
			}
			onIssueIndexChange={i => {
				if (i !== undefined) {
					options.eventHandlers.correctionMode.validationBar.onShowMessage(
						getValidationMessageKey(props.messages[i])
					);
				} else {
					options.eventHandlers.correctionMode.validationBar.onExpand(true, true);
				}
			}}
			options={options}
		/>
	) : null;

	return (
		<>
			<MobileValidationBarOverview
				id={UiId.generateForValidationBar({ uiIdPrefix: props.options.config.uiIdPrefix })}
				variant={mostSeriousMessageSeverity(validationBarMessages)}
				onClick={
					!UiStateSelectors.disabled()(options.state)
						? () => options.eventHandlers.correctionMode.validationBar.onExpand(true, false)
						: undefined
				}
				leftElement={
					<>
						{errorGraphicOverview}
						{warningGraphicOverview}
						{infoGraphicOverview}
					</>
				}
				rightElement={<Icon>fullscreen</Icon>}
			/>
			{modalView}
		</>
	);
}

function PreviewList(props: {
	readonly messages: {
		readonly type: Lowercase<EngineStore.Validation.MessageSeverity>;
		readonly text: Localizable[];
		readonly locations: LocationLabel[];
	}[];
	readonly disabled: boolean;
	onIssueIndexChange(index: number): void;
}): ReactElement {
	const localizer = useContext(LocalizerContext).localizer;
	const { MobilePreviewList, MobilePreviewListIem } = useContext(WidgetMapContext);

	return (
		<MobilePreviewList>
			{props.messages.map((message, index) => {
				const mobilePreviewItem = (
					<MobilePreviewListIem
						variant={message.type}
						text={localizer(...message.text) ?? ""}
						maxLineOfText={2}
						key={index}
						onClick={!props.disabled ? () => props.onIssueIndexChange(index) : undefined}
						data-testid={`mobilePreviewListItem-${index}`}
					/>
				);

				return mobilePreviewItem;
			})}
		</MobilePreviewList>
	);
}

function ModalView(props: {
	readonly index?: number;
	readonly messages: {
		readonly type: Lowercase<EngineStore.Validation.MessageSeverity>;
		readonly text: Localizable[];
		readonly locations: LocationLabel[];
		readonly isFixable?: boolean;
	}[];
	readonly options: FormModelMap.RenderOptions;

	readonly errorGraphic: ReactElement;
	readonly warningGraphic: ReactElement;
	readonly infoGraphic: ReactElement;
	onIssueIndexChange(index: number | undefined): void;
	onGoToIssueClick?(index: number): void;
}): ReactElement {
	const { messages, index, options } = props;

	const localizer = useContext(LocalizerContext).localizer;

	const {
		Button,
		Icon,
		ModalOverlay,
		MobileValidationBar,
		MobileValidationContent,
		MobileValidationBarGraphic
	} = useContext(WidgetMapContext);

	const validationBarModalRef = useRef<HTMLDivElement>(null);
	const getValidationBarModalRef = (ref: HTMLDivElement) => {
		if (ref) {
			validationBarModalRef.current = ref;
		}
	};

	useEffect(() => {
		validationBarModalRef.current?.focus();
	}, [index]);

	const isDisabled = UiStateSelectors.disabled()(props.options.state);

	const leftElement =
		index !== undefined ? (
			<MobileValidationBarGraphic variant={messages[index].type}>
				{[
					getLocalizedResource(RESOURCE_KEYS.validation[messages[index].type], localizer),
					` (${index + 1}/${messages.length})`
				]}
			</MobileValidationBarGraphic>
		) : (
			<>
				{props.errorGraphic} {props.warningGraphic} {props.infoGraphic}
			</>
		);

	const closeButton = (
		<Button
			key="close-button"
			disabled={isDisabled}
			invert
			onClick={() => props.options.eventHandlers.correctionMode.validationBar.onExpand(false, true)}
			icon={<Icon>close</Icon>}
			data-testid={"button-close"}
		/>
	);

	const footer =
		index === undefined ? undefined : (
			<Footer
				messages={messages}
				options={options}
				index={index}
				onIssueIndexChange={props.onIssueIndexChange}
			/>
		);

	return (
		<ModalOverlay
			fullscreen
			focusBack={false}
			closeOnEsc
			closeOnOutsideClick
			onClose={() => props.options.eventHandlers.correctionMode.validationBar.onExpand(false, true)}
		>
			<MobileValidationBar
				variant={index !== undefined ? messages[index].type : mostSeriousMessageSeverity(messages)}
				headingTitle={leftElement}
				headingSuffixes={closeButton}
				footer={footer}
				wrapperRef={getValidationBarModalRef}
				id={UiId.generateForMobileValidationBarModal({ uiIdPrefix: options.config.uiIdPrefix })}
			>
				{index === undefined ? (
					<PreviewList
						messages={messages}
						disabled={isDisabled}
						onIssueIndexChange={props.onIssueIndexChange}
					/>
				) : (
					<MobileValidationContent>
						<ValidationBarContent
							disabled={isDisabled}
							locations={props.messages[index].locations}
							onGoToIssueClick={props.onGoToIssueClick}
							text={props.messages[index].text}
							isFixable={props.messages[index].isFixable}
						/>
					</MobileValidationContent>
				)}
			</MobileValidationBar>
		</ModalOverlay>
	);
}

function Footer(props: {
	readonly options: FormModelMap.RenderOptions;
	readonly index: number;
	readonly messages: {
		readonly type: Lowercase<EngineStore.Validation.MessageSeverity>;
		readonly text: Localizable[];
		readonly locations: LocationLabel[];
	}[];
	onIssueIndexChange(index: number | undefined): void;
}): JSX.Element {
	const localizer = useContext(LocalizerContext).localizer;
	const { Button, Icon, MobileAction, MobileActionItem } = useContext(WidgetMapContext);
	const isDisabled = UiStateSelectors.disabled()(props.options.state);

	const previousButton = (
		<Button
			key="previous-button"
			label={getLocalizedResource(RESOURCE_KEYS.validation.mobile.previous, localizer)}
			disabled={isDisabled || props.index <= 0}
			onClick={() => props.onIssueIndexChange(props.index - 1)}
			icon={<Icon key="arrow_left">keyboard_arrow_left</Icon>}
		/>
	);

	const showAllButton = (
		<Button
			key="show-all-button"
			label={getLocalizedResource(RESOURCE_KEYS.validation.mobile.showAll, localizer)}
			disabled={isDisabled || props.messages.length === 1}
			onClick={() => props.onIssueIndexChange(undefined)}
			icon={<Icon key="view_list">view_list</Icon>}
		/>
	);

	const nextButton = (
		<Button
			key="next-button"
			label={getLocalizedResource(RESOURCE_KEYS.validation.mobile.next, localizer)}
			disabled={isDisabled || props.index >= props.messages.length - 1}
			onClick={() => props.onIssueIndexChange(props.index + 1)}
			icon={<Icon key="arrow_right">keyboard_arrow_right</Icon>}
		/>
	);

	const actions = (
		<MobileAction>
			<MobileActionItem>{previousButton}</MobileActionItem>
			<MobileActionItem>{showAllButton}</MobileActionItem>
			<MobileActionItem>{nextButton}</MobileActionItem>
		</MobileAction>
	);

	return actions;
}
