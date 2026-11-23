// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, ReactNode } from "react";
import { useContext } from "react";

import { WidgetMapContext } from "../../widgetMap/widgetMap-context.js";

/**
 * @internal
 */
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
}

/**
 * @internal
 */
export function Tooltips(props: TooltipsProps): JSX.Element | null {
	/*
	 * Note: The order of tooltips must be:
	 * 1. error
	 * 2. warning
	 * 3. info
	 * 4. hint
	 */
	const { errorTooltip, warningTooltip, infoTooltip, hintTooltip } = props;
	const { ErrorTooltip, WarningTooltip, HintTooltip } = useContext(WidgetMapContext);

	const tooltips: JSX.Element[] = [];

	if (errorTooltip !== undefined) {
		tooltips.push(<ErrorTooltip id={errorTooltip.id} text={errorTooltip.content} key="error" />);
	}

	if (warningTooltip !== undefined) {
		tooltips.push(
			<WarningTooltip id={warningTooltip.id} text={warningTooltip.content} key="warning" />
		);
	}

	if (infoTooltip !== undefined) {
		tooltips.push(<HintTooltip id={infoTooltip.id} text={infoTooltip.content} key="info" />);
	}

	if (hintTooltip) {
		tooltips.push(<HintTooltip id={hintTooltip?.id} text={hintTooltip?.content} key="hint" />);
	}

	return tooltips.length > 0 ? <> {tooltips} </> : null;
}
