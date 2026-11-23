// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { WithDataTestId } from "../../../../../back-end/utils/internal/types.js";
import type { FormModel } from "../../../../../models/index.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

import type { NavigationMenuProps } from "./getNavigationButtonProps.js";

type ButtonViewProps = WithDataTestId<{
	readonly modelElement: FormModel.ButtonType;
	readonly buttonProps: NavigationMenuProps;
}>;

/**
 * @internal
 *
 * Shared component for form model button elements.
 */
export function ButtonView(props: ButtonViewProps): ReactElement {
	const widgetMap = useContext(WidgetMapContext);
	const button = props.modelElement;
	const { ariaLabel, selected, ...rest } = props.buttonProps;

	return (
		<widgetMap.Button
			{...rest}
			data-testid={props["data-testid"]}
			buttonAttributes={{
				"aria-label": ariaLabel,
				role: button.type === "NAVIGATION" ? "link" : undefined
			}}
			primary={button.buttonStyling?.priority === "PRIMARY"}
			destructive={button.buttonStyling?.destructive}
		/>
	);
}
