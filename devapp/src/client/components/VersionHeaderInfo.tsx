// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { JSX } from "react";

import { HeaderTrigger } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/header-trigger/header-trigger.view.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector/main/size-context.js";
import { List } from "@com.mgmtp.a12.widgets/widgets-core/lib/list/main/list.view.js";
import { PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/pop-up-menu/main/pop-up-menu.view.js";

declare const __VERSION__: string;
declare const __COMMIT_HASH__: string;

function useSmallDevice(): boolean {
	const { currentSize } = useContext(SizeContext);
	return currentSize === "xs" || currentSize === "sm";
}

export function VersionHeaderInfo(): JSX.Element {
	return (
		<PopUpMenu
			triggerElement={
				useSmallDevice() ? (
					<HeaderTrigger>
						<Icon>info</Icon>
					</HeaderTrigger>
				) : (
					<HeaderTrigger>
						<Icon>info</Icon>
						<span>{"v" + __VERSION__}</span>
						<Icon>arrow_drop_down</Icon>
					</HeaderTrigger>
				)
			}
		>
			<List>
				<List.Item text={__VERSION__} secondaryText="Version" flipped onClick={onVersionClick} />
				<List.Item
					text={__COMMIT_HASH__}
					secondaryText="Commit hash"
					flipped
					onClick={onCommitHashClick}
				/>
			</List>
		</PopUpMenu>
	);
}

async function copyToClipboard(text: string) {
	try {
		// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
		await navigator.clipboard.writeText(text);
		alert(`Copying to clipboard succeeded!`);
	} catch (error) {
		alert(`Copying to clipboard failed!`);
		// oxlint-disable-next-line no-console
		console.error("Could not copy text: ", error);
	}
}

function onCommitHashClick() {
	copyToClipboard(__COMMIT_HASH__);
}

function onVersionClick() {
	copyToClipboard(__VERSION__);
}
