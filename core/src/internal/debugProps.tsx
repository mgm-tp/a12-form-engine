// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
			// oxlint-disable-next-line no-console
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
	// oxlint-disable-next-line useEffectNoDeps/use-effect-no-deps
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}
