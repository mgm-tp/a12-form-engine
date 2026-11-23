// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, PropsWithChildren, RefCallback } from "react";

export interface MockComponentProps extends PropsWithChildren, Record<string, unknown> {
	/**
	 * Id of the react component.
	 */
	id?: string;
	/**
	 * The data-role describes the type of react component, that was rendered.
	 */
	dataRole: string;
	/**
	 * The data-testid can be set if the component itself does not have an id.
	 */
	dataTestId?: string;
	/**
	 * The reference to the underlying div element.
	 */
	ref?: RefCallback<unknown>;
}

export function MockComponent(props: MockComponentProps): JSX.Element {
	const { id, dataRole, dataTestId, children, ref, ...rest } = props;
	return (
		<div id={id} data-role={dataRole} data-testid={dataTestId} tabIndex={0} ref={ref} {...rest}>
			{children}
		</div>
	);
}
