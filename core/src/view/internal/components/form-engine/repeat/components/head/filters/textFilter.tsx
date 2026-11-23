// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { ReactElement } from "react";

import type { FilterParseError } from "../../../../../../../../back-end/store/internal/store.js";
import { ComponentMapContext } from "../../../../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";

/** @internal */
export function TextFilter(props: {
	onFilterChange(value: string): void;
	alignment?: "left" | "right";
	initialValue?: string;
	disabled: boolean;
	message?: FilterParseError;
	label: string;
	id: string;
	options: FormModelMap.RenderOptions;
}): ReactElement {
	const { alignment, initialValue, message, onFilterChange } = props;
	const { BufferedTextLine, MessageList } = useContext(ComponentMapContext);

	const errorMessageContainer = message ? (
		<MessageList id="-error" messages={[[message.error.errorText]]} key="errors" />
	) : undefined;

	return (
		<BufferedTextLine
			id={props.id}
			value={message ? message.value : initialValue !== undefined ? initialValue : ""}
			onValueSubmit={onFilterChange}
			textAlignment={alignment}
			disabled={props.disabled}
			label={props.label}
			errorMessage={errorMessageContainer}
		/>
	);
}
