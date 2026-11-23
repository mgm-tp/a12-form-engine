// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { RefCallback } from "react";
import { useContext } from "react";

import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

interface DatePrefixButtonProps {
	readonly id: string;
	readonly label: string;
	readonly handleButtonClick: () => void;
	readonly handleButtonRef: RefCallback<HTMLButtonElement>;
}

/**
 * DatePrefixButton component that renders a button.
 * Used for DatePickers as a prefix of the input.
 *
 * @internal
 */
export function DatePrefixButton(props: DatePrefixButtonProps) {
	const { Button, Icon } = useContext(WidgetMapContext);
	const { id, handleButtonClick, label, handleButtonRef } = props;

	return (
		<Button
			id={id + "-picker"}
			icon={<Icon>event</Icon>}
			title={label}
			onClick={handleButtonClick}
			buttonRef={handleButtonRef}
			buttonAttributes={{
				"aria-labelledby": `${id}-label`
			}}
		/>
	);
}
