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
import { useContext } from "react";

import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

/** @internal */
export interface TitleProps {
	/**
	 * Id rendered by the headline widget. Also used to create a data-testid for the headline.
	 */
	readonly id?: string;
	readonly text?: ReactElement | string;

	/**
	 * The aria level given to the content box of the form engine, i.e. the root aria level in the form engine context.
	 */
	readonly initialAriaLevel?: number;

	/**
	 * The aria level of the current container
	 */
	readonly ariaLevel?: number;

	readonly collapsed?: boolean;

	readonly "data-testid"?: string;

	onCollapsingChange?(): void;
}

type NormalizedLevel = 1 | 2 | 3 | 4 | 5;

/** @internal */
export function Title(props: TitleProps): JSX.Element {
	const widgetMap = useContext(WidgetMapContext);

	const level = calculateHeadingLevel(props.ariaLevel, props.initialAriaLevel);

	const ariaLevel =
		props.text && props.ariaLevel && props.ariaLevel > 0 ? props.ariaLevel : undefined;

	return (
		<widgetMap.TypographyHeadline
			id={props.id}
			level={level as NormalizedLevel}
			ariaLevel={ariaLevel}
			collapsible={props.collapsed || props.onCollapsingChange ? true : undefined}
			collapsed={props.collapsed}
			onCollapsingChange={props.onCollapsingChange}
			divider={level === 2 || level === 3}
			data-testid={
				props.id
					? `${props.id}-headline`
					: props["data-testid"]
						? `${props["data-testid"]}-headline`
						: undefined
			}
		>
			{props.text}
		</widgetMap.TypographyHeadline>
	);
}

/**
 * The heading level rises with the aria level, but it always starts at 2 and
 * can maximally reach 5, i.e. headings nested in level 5 headings still get
 * level 5.
 */
function calculateHeadingLevel(ariaLevel?: number, initialAriaLevel?: number): number {
	const maximalHeadingLevel = 5;
	const minimalHeadingLevel = 2;

	return ariaLevel && initialAriaLevel && ariaLevel >= initialAriaLevel
		? Math.min(maximalHeadingLevel, ariaLevel - initialAriaLevel + 1)
		: minimalHeadingLevel;
}
