// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, ReactNode } from "react";
import { useContext } from "react";

import { WidgetMapContext } from "../../configuration/widget-map-context.js";

export interface TooltipsProps {
	/**
	 * Props for an error tooltip.
	 * If given the {@link Tooltips} component
	 * will render an error tooltip with the given id
	 * and content
	 */
	readonly errorTooltip?: {
		readonly id: string;
		readonly content: ReactNode;
	};

	/**
	 * Props for a warning tooltip.
	 * If given the {@link Tooltips} component
	 * will render a warning tooltip with the given id
	 * and content
	 */
	readonly warningTooltip?: {
		readonly id: string;
		readonly content: ReactNode;
	};

	/**
	 * Props for an info tooltip.
	 * If given the {@link Tooltips} component
	 * will render an info tooltip with the given id
	 * and content
	 */
	readonly infoTooltip?: {
		readonly id: string;
		readonly content: ReactNode;
	};

	/**
	 * Props for a hint tooltip.
	 * If given the {@link Tooltips} component
	 * will render a hint tooltip with the given id
	 * and content
	 */
	readonly hintTooltip?: {
		readonly id: string;
		readonly content: ReactNode;
	};
	readonly disabled?: boolean;
}

/**
 * React component to render a set of tooltips which can then be passed
 * for example to the addonAfter property of the respective widgets.
 * It will render the tooltips in the following order:
 * 1. error
 * 2. warning
 * 3. info
 * 4. hint
 */
export function Tooltips(props: TooltipsProps): JSX.Element | null {
	/*
	 * Note: The order of tooltips must be as specified above
	 */
	const { disabled, errorTooltip, warningTooltip, infoTooltip, hintTooltip } = props;
	const tooltips: JSX.Element[] = [];
	const widgetMap = useContext(WidgetMapContext);

	if (errorTooltip !== undefined) {
		tooltips.push(
			<widgetMap.ErrorTooltip
				id={errorTooltip.id}
				text={errorTooltip.content}
				key="error"
				disabled={disabled}
			/>
		);
	}

	if (warningTooltip !== undefined) {
		tooltips.push(
			<widgetMap.WarningTooltip
				id={warningTooltip.id}
				text={warningTooltip.content}
				key="warning"
				disabled={disabled}
			/>
		);
	}

	if (infoTooltip !== undefined) {
		tooltips.push(
			<widgetMap.HintTooltip
				id={infoTooltip.id}
				text={infoTooltip.content}
				key="info"
				disabled={disabled}
			/>
		);
	}

	if (hintTooltip) {
		tooltips.push(
			<widgetMap.HintTooltip
				id={hintTooltip?.id}
				text={hintTooltip?.content}
				key="hint"
				disabled={disabled}
			/>
		);
	}

	return tooltips.length > 0 ? <> {tooltips} </> : null;
}
