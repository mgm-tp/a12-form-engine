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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type {
	Localizable,
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../back-end/localization/internal/languages/keys.js";
import { createLocalizableFactory } from "../../../../../back-end/localization/internal/localization.js";
import { getLocalizedResource } from "../../../../../back-end/localization/internal/localize.js";
import type { CorrectionModeItem } from "../../../../../back-end/store/internal/CorrectionModeItem.js";
import { ModelSelectors } from "../../../../../back-end/store/internal/selectors/models.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import { findElementByFormModelPath, FormModel } from "../../../../../models/index.js";
import { DocumentPath } from "../../../../../models/internal/utils/document-utils.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

import { CorrectionModeUtil } from "./utils.js";

/**
 * Type alias for convenience
 *
 * In the validation bar context, the label of a "location"
 * consists of a list of localizables (with each one defining a path element label)
 *
 * @internal
 */
export type LocationLabel = Localizable[][];

/** @internal  */
export function getValidationMessageKey(message: EngineStore.Validation.Message): string {
	return [
		message.severity,
		DocumentPath.toString(message.element),
		message.errorKey,
		message.errorCode
	].join(":");
}

/** @internal */
export interface ValidationBarItem {
	readonly type: Lowercase<EngineStore.Validation.MessageSeverity>;
	readonly text: Localizable[];
	readonly locations: {
		readonly label: LocationLabel;
		readonly item: CorrectionModeItem;
	}[];
	readonly isFixable?: boolean;
}

/** @internal */
export function mostSeriousMessageSeverity(
	messages: Pick<ValidationBarItem, "type">[]
): Lowercase<EngineStore.Validation.MessageSeverity> {
	return messages.some(m => m.type === "error")
		? "error"
		: messages.some(m => m.type === "warning")
			? "warning"
			: "info";
}

/** @internal */
export function createToValidationBarItem(
	message: EngineStore.Validation.Message,
	renderOptions: FormModelMap.RenderOptions,
	localizer: Localizer,
	converter: ValueConversion,
	includeLocations: boolean
): ValidationBarItem {
	const items: CorrectionModeItem[] = [];
	const uiIssueReport = CorrectionModeUtil.getUIIssueReport(
		message,
		renderOptions,
		localizer,
		converter
	);
	if (includeLocations && uiIssueReport.fixable) {
		items.push(...uiIssueReport.items);
	}

	return {
		type: message.severity.toLowerCase() as Lowercase<EngineStore.Validation.MessageSeverity>,
		text: message.errorText,
		locations: items.map(item => {
			const label = localizeLocationStack(renderOptions, item.locationStack);

			const ec = localizeEditableComponent(item.formModelPath, renderOptions);

			return {
				label: ec ? [...label, ec] : label,
				item
			};
		}),
		isFixable: uiIssueReport.fixable
	};
}

const ARIA_LINK: React.HTMLAttributes<HTMLButtonElement> = { role: "link" };

/** @internal  */
export function ValidationBarContent(props: {
	disabled?: boolean;
	text: Localizable[];
	locations: LocationLabel[];
	isFixable?: boolean;
	onGoToIssueClick?(index: number): void;
}): ReactElement {
	const { disabled, text, locations, isFixable } = props;

	const localizer = useContext(LocalizerContext).localizer;
	const { Button, SizeContainer, SizeContainerColumn, SizeContainerRow } =
		useContext(WidgetMapContext);

	return (
		<SizeContainer>
			<SizeContainerColumn size={{ sm: 12, md: 12, lg: 12 }}>
				<SizeContainerRow key="0" data-testid={`row-0`}>
					{localizer(...text)}
				</SizeContainerRow>
				{locations.length !== 1 ? (
					<SizeContainerRow key="1" data-testid={`row-1`}>
						{locations.length === 0
							? isFixable
								? getLocalizedResource(RESOURCE_KEYS.validation.issueCanBeFixed, localizer)
								: getLocalizedResource(RESOURCE_KEYS.validation.issueCannotBeFixed, localizer)
							: getLocalizedResource(RESOURCE_KEYS.validation.multiplePossibleCauses, localizer)}
					</SizeContainerRow>
				) : null}
				{locations.map((location, index) => {
					return (
						<SizeContainerRow key={String(index + 2)} data-testid={`row-${index + 2}`}>
							<Button
								disabled={disabled}
								label={location.map(localizables => localizer(...localizables) ?? "").join(" > ")}
								onClick={props.onGoToIssueClick ? () => props.onGoToIssueClick?.(index) : undefined}
								buttonAttributes={ARIA_LINK}
								data-testid={`row-button-${index + 2}`}
							/>
						</SizeContainerRow>
					);
				})}
			</SizeContainerColumn>
		</SizeContainer>
	);
}

/** @internal  */
export function localizeLocationStack(
	renderOptions: FormModelMap.RenderOptions,
	locationStack: ReadonlyArray<EngineStore.ScreenState>
): Localizable[][] {
	const localizedLocationStack: Localizable[][] = [];

	// First entry is a TopLevel Screen --> Take name directly
	const topLevelScreenPath = locationStack[0].locationPath;
	const labelForTopLevelScreen = localizeLocation(topLevelScreenPath, renderOptions);
	localizedLocationStack.push(labelForTopLevelScreen);

	// For the rest the detached-repeat has to be taken for the localization
	for (let i = 1; i < locationStack.length; i++) {
		const screenPath = locationStack[i].locationPath;
		const detachedRepeatPath = screenPath.slice(0, screenPath.length - 1);
		const labelForDetachedRepeat = localizeLocation(detachedRepeatPath, renderOptions);
		localizedLocationStack.push(labelForDetachedRepeat);
	}

	return localizedLocationStack;
}

function localizeLocation(
	formModelPath: ModelPath,
	renderOptions: FormModelMap.RenderOptions
): Localizable[] {
	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(renderOptions.state),
		ModelSelectors.formModel()(renderOptions.state)
	);

	const element = findElementByFormModelPath(
		ModelSelectors.formModel()(renderOptions.state),
		formModelPath
	);

	if (element === undefined) {
		throw new Error("No element found for path " + formModelPath);
	}

	if (!FormModel.Screen.isInstance(element) && !FormModel.DetachedRepeat.isInstance(element)) {
		throw new Error(
			"Expected that element is of type FormModel.Screen or FormModel.DetachedRepeat"
		);
	}

	return localizableFactory.componentTitle(element, formModelPath);
}

function localizeEditableComponent(
	formModelPath: ModelPath,
	renderOptions: FormModelMap.RenderOptions
): Localizable[] | undefined {
	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(renderOptions.state),
		ModelSelectors.formModel()(renderOptions.state)
	);

	const formModelElement = findElementByFormModelPath(
		ModelSelectors.formModel()(renderOptions.state),
		formModelPath
	);

	if (formModelElement === undefined) {
		return undefined;
	}

	if (FormModel.Control.isInstance(formModelElement)) {
		return localizableFactory.inputLabel(formModelElement, formModelPath);
	} else {
		const repeat = findElementByFormModelPath(
			ModelSelectors.formModel()(renderOptions.state),
			formModelPath.slice(0, formModelPath.length - 1)
		);
		if (repeat && FormModel.InlineRepeat.isInstance(repeat)) {
			const column = repeat.repeatOverviewColumn?.find(c =>
				columnMatchesModelPath(c, formModelPath)
			);
			return column
				? localizableFactory.repeatOverviewColumnTitle(column, formModelPath)
				: undefined;
		}
	}

	return undefined;
}

function columnMatchesModelPath(
	column: FormModel.RepeatOverviewColumn,
	formModelPath: ModelPath
): boolean {
	return (
		(FormModel.FieldOverviewColumn.isInstance(column) ? column.id : column.name) ===
		formModelPath[formModelPath.length - 1].elementName
	);
}
