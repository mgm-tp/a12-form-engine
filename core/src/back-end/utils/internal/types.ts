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
