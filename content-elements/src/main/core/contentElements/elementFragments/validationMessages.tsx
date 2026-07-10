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

import type { JSX } from "react";
import { Fragment, useContext } from "react";

import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { WidgetMapContext } from "../../widgetMap/widgetMap-context.js";

/**
 * @internal
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
 * @internal
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
