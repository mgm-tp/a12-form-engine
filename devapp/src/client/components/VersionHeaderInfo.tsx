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

import { useContext, type JSX } from "react";

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
		// eslint-disable-next-line no-console
		console.error("Could not copy text: ", error);
	}
}

function onCommitHashClick() {
	copyToClipboard(__COMMIT_HASH__);
}

function onVersionClick() {
	copyToClipboard(__VERSION__);
}
