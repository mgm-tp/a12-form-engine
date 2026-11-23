// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * @internal
 * Utility type for the opposite of `Readonly<T>`
 */
export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

/**
 * @internal
 * Utility type for the opposite of `DeepReadonly<T>`
 */
export type DeepMutable<T> = {
	-readonly [P in keyof T]: DeepMutable<T[P]>;
};

/**
 * @internal
 * Utility type that makes all properties required, without removing undefined as type
 */
export type RequiredButUndefined<T> = {
	[K in keyof Required<T>]: T[K];
};

/**
 * @internal
 * Utility type that extracts a property from T and makes it partial
 */
export type PickPartial<T, K extends keyof T> = { [P in K]: Partial<T[P]> };

/**
 * @internal
 * Utility type to add the always allowed data-testid property to a type
 */
export type WithDataTestId<T> = T & { ["data-testid"]?: string };
