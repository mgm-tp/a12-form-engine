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
