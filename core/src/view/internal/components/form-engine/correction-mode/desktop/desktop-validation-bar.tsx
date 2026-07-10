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

import type { JSX, ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { RESOURCE_KEYS } from "../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../back-end/localization/internal/localize.js";
import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineStore } from "../../../../../../back-end/store/internal/store.js";
import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";

import type { LocationLabel } from "../validation-bar-elements.js";
import {
	createToValidationBarItem,
	getValidationMessageKey,
	ValidationBarContent
} from "../validation-bar-elements.js";

/** @internal  */
export function DesktopValidationBar(props: {
	messages: EngineStore.Validation.Message[];
	expanded: boolean;
	currentMessageKey?: string;
	options: FormModelMap.RenderOptions;
}): ReactElement {
	const { eventHandlers } = props.options;
	const { localizer, conversion } = useContext(LocalizerContext);
	const { Pagination, ValidationBar } = useContext(WidgetMapContext);

	const onGoToIssueClick = (i: number): void => {
		if (props.expanded) {
			eventHandlers.correctionMode.validationBar.onExpand(false, false);
		}

		eventHandlers.correctionMode.onGoToElement(validationBarMessage.locations[i].item);
	};
	const onExpansionStateChange = (v: boolean): void => {
		eventHandlers.correctionMode.validationBar.onExpand(v, false);
	};
	const onShowAllIssuesClick = (): void => {
		eventHandlers.correctionMode.correctionView.onShow(true);
	};
	const onIssueIndexChange = (i: number): void => {
		eventHandlers.correctionMode.validationBar.onShowMessage(
			getValidationMessageKey(props.messages[i])
		);
	};

	const onPaginationChanged = (page: number): void => {
		onIssueIndexChange(page - 1);
	};

	const index = Math.max(
		0,
		props.messages.findIndex(m => getValidationMessageKey(m) === props.currentMessageKey)
	);

	const validationBarMessage = createToValidationBarItem(
		props.messages[index],
		props.options,
		localizer,
		conversion,
		true
	);
	const locations = validationBarMessage.locations.map(({ label }) => label);
	const isDisabled = UiStateSelectors.disabled()(props.options.state);

	return (
		<ValidationBar
			id={UiId.generateForValidationBar({ uiIdPrefix: props.options.config.uiIdPrefix })}
			variant={validationBarMessage.type}
			primaryTitle={
				!props.expanded
					? localizer(...validationBarMessage.text)
					: getLocalizedResource(RESOURCE_KEYS.validation[validationBarMessage.type], localizer)
			}
			secondaryTitle={
				!props.expanded
					? locations.length === 1
						? locations[0].map(localizables => localizer(...localizables)).join(" > ")
						: locations.length === 0
							? validationBarMessage.isFixable
								? getLocalizedResource(RESOURCE_KEYS.validation.issueCanBeFixed, localizer)
								: getLocalizedResource(RESOURCE_KEYS.validation.issueCannotBeFixed, localizer)
							: getLocalizedResource(RESOURCE_KEYS.validation.multiplePossibleCauses, localizer)
					: null
			}
			quickAccessMenu={
				<QuickAccessMenu
					options={props.options}
					expanded={props.expanded}
					locations={locations}
					onGoToIssueClick={onGoToIssueClick}
					onExpansionStateChange={onExpansionStateChange}
					onShowAllIssuesClick={onShowAllIssuesClick}
				/>
			}
			pagination={
				<Pagination
					type="simple"
					disabled={isDisabled}
					currentPage={index + 1}
					pageCount={props.messages.length}
					pageLabelTemplate="{page} / {total}"
					onPageChanged={onPaginationChanged}
				/>
			}
			autoFocus={false}
		>
			{props.expanded ? (
				<ValidationBarContent
					disabled={isDisabled}
					locations={locations}
					text={validationBarMessage.text}
					isFixable={validationBarMessage.isFixable}
					onGoToIssueClick={onGoToIssueClick}
				/>
			) : undefined}
		</ValidationBar>
	);
}

const ARIA_LINK: React.HTMLAttributes<HTMLButtonElement> = { role: "link" };

function QuickAccessMenu(props: {
	options: FormModelMap.RenderOptions;
	locations: LocationLabel[];
	expanded: boolean;
	onGoToIssueClick(index: number): void;
	onExpansionStateChange(expanded: boolean): void;
	onShowAllIssuesClick(): void;
}): JSX.Element {
	const localizer = useContext(LocalizerContext).localizer;
	const { Button, Icon, List, ListItem, QuickAccessButton } = useContext(WidgetMapContext);

	const isDisabled = UiStateSelectors.disabled()(props.options.state);

	const mainAction =
		props.locations.length === 1 && !props.expanded ? (
			<Button
				primary
				invert
				disabled={isDisabled}
				title={getLocalizedResource(RESOURCE_KEYS.validation.goToIssue, localizer)}
				onClick={() => props.onGoToIssueClick(0)}
				icon={<Icon>location_searching</Icon>}
				buttonAttributes={ARIA_LINK}
			/>
		) : (
			<Button
				primary
				invert
				disabled={isDisabled}
				title={getLocalizedResource(
					props.expanded
						? RESOURCE_KEYS.validation.collapseMessage
						: RESOURCE_KEYS.validation.expandMessage,
					localizer
				)}
				onClick={() => props.onExpansionStateChange(!props.expanded)}
				icon={<Icon>{`unfold_${props.expanded ? "less" : "more"}`}</Icon>}
			/>
		);

	const gotoToListItem = (
		<ListItem
			key="goto"
			disabled={isDisabled || props.locations.length !== 1}
			text={getLocalizedResource(RESOURCE_KEYS.validation.goToIssue, localizer)}
			onClick={() => props.onGoToIssueClick(0)}
			graphic={<Icon>location_searching</Icon>}
			htmlAttributes={ARIA_LINK}
			data-testid={"listItem-goto"}
		/>
	);

	const expandItemList = (
		<ListItem
			key="expand"
			disabled={isDisabled}
			text={getLocalizedResource(
				props.expanded
					? RESOURCE_KEYS.validation.collapseMessage
					: RESOURCE_KEYS.validation.expandMessage,
				localizer
			)}
			onClick={() => props.onExpansionStateChange(!props.expanded)}
			graphic={<Icon>{`unfold_${props.expanded ? "less" : "more"}`}</Icon>}
			data-testid={"listItem-expand"}
		/>
	);

	const viewList = (
		<ListItem
			key="view"
			disabled={isDisabled}
			text={getLocalizedResource(RESOURCE_KEYS.validation.showAllIssues, localizer)}
			onClick={props.onShowAllIssuesClick}
			graphic={<Icon>view_list</Icon>}
			data-testid={"listItem-view"}
		/>
	);

	return (
		<QuickAccessButton
			primary
			invert
			disabled={isDisabled}
			mainAction={mainAction}
			focusOnTriggerElementAfterClose={false}
		>
			<List>
				{gotoToListItem}
				{expandItemList}
				{viewList}
			</List>
		</QuickAccessButton>
	);
}
