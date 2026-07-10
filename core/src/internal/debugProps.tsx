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

/**
 * Development utils to debug (unwanted) prop changes.
 */

import type { ComponentType, JSX } from "react";
import { useEffect, useRef } from "react";

/**
 * @internal
 *
 * Add prop changes logging to any React component.
 *
 * Logs to the console.
 */
export function DiffProps<PropsType extends Record<string, unknown>>(
	Target: ComponentType<PropsType>
): ComponentType<PropsType> {
	return function CompareProps(props): JSX.Element {
		const prevProps = usePrevious(props);
		const changedProps = diffingProps(prevProps, props);
		if (changedProps.length > 0) {
			// eslint-disable-next-line no-console
			console.warn(changedProps.join(", "));
		}
		return <Target {...props} />;
	};
}

/**
 * @internal
 * Given two objects, returns a list of property names that differ. This is a
 * shallow, top level compare useful for React props (or state).
 */
export function diffingProps(
	p1: Record<string, unknown> = {},
	p2: Record<string, unknown> = {}
): string[] {
	const allKeys = [...new Set([...Object.keys(p1), ...Object.keys(p2)])];
	return allKeys.filter(key => p1[key] !== p2[key]);
}

/**
 * @internal
 * React hook that returns the value of the given value from the previous
 * rendering.
 */
export function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T>(undefined);
	// eslint-disable-next-line useEffectNoDeps/use-effect-no-deps
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}
