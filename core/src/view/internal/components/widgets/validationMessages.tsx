// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { Fragment, useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { WidgetMapContext } from "../../configuration/widget-map-context.js";

/**
 * Props for ValidationMessages
 */
export interface ValidationMessagesProps {
	/**
	 * The localizables for the validation messages texts
	 * If only one message is given a single text is rendered
	 * by {@link ValidationMessages}.
	 * If multiple messages are given a list of texts is rendered.
	 */
	readonly messages: readonly Localizable[][];
	readonly id?: string;
}

/**
 * React Component which renders a single validation message or a list of validation
 * messages
 */
export function ValidationMessages(props: ValidationMessagesProps): JSX.Element | null {
	const localizer = useContext(LocalizerContext).localizer;
	const { BulletListUnordered, BulletListItem } = useContext(WidgetMapContext);

	if (props.messages.length === 0) {
		return null;
	}

	if (props.messages.length === 1) {
		return <Fragment>{localizer(...props.messages[0]) ?? ""}</Fragment>;
	}

	return (
		<BulletListUnordered type="disc" indent={false} id={props.id}>
			{props.messages.map((errorMessage, index) => {
				return <BulletListItem key={index}>{localizer(...errorMessage) ?? ""}</BulletListItem>;
			})}
		</BulletListUnordered>
	);
}
