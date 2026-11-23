// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
