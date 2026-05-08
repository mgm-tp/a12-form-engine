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

import type { ReactElement } from "react";

import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";

import { UiStateSelectors } from "../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";

import { DesktopValidationBar } from "./desktop/desktop-validation-bar.js";
import { MobileValidationBar } from "./mobile/mobile-validation-bar.js";

/** @internal  */
export function ValidationBar(config: FormModelMap.RenderConfiguration): ReactElement {
	const { renderOptions } = config;
	const validationBar = UiStateSelectors.validationBarState()(renderOptions.state);
	const expanded = validationBar.expanded;
	const messages = UiStateSelectors.messages()(renderOptions.state);
	const currentMessageKey = validationBar.currentMessageKey;

	const messagesArray = Object.values(messages).flatMap(message => {
		return [
			...(message?.validationMessages ?? []),
			...(message?.parseError ? [message.parseError.message] : [])
		];
	});

	const sortedMessages = [...messagesArray].sort(
		// Do not change the order of the messages except that at first error should be listed and afterwards warnings
		(m1, m2) =>
			m1.severity === "ERROR" && m2.severity === "WARNING"
				? -1
				: m1.severity === m2.severity
					? 0
					: 1
	);

	if (DeviceDetector.get() !== "phone") {
		return (
			<DesktopValidationBar
				messages={sortedMessages}
				expanded={expanded}
				options={renderOptions}
				currentMessageKey={currentMessageKey}
			/>
		);
	} else {
		return (
			<MobileValidationBar
				messages={sortedMessages}
				showModal={expanded}
				options={renderOptions}
				currentMessageKey={currentMessageKey}
			/>
		);
	}
}
