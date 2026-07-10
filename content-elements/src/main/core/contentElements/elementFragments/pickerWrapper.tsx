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

import type { JSX, ReactNode } from "react";
import { useContext } from "react";

import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";

import { WidgetMapContext } from "../../widgetMap/widgetMap-context.js";

/** @internal */
export interface PickerWrapperProps {
	readonly referenceElement: HTMLElement;
	readonly children?: ReactNode;
	updateElementPosition?(handler: () => void): void;
	onClose?(): void;
}

/** @internal */
export function PickerWrapper(props: PickerWrapperProps): JSX.Element {
	const { AttachedPortal, ModalOverlay } = useContext(WidgetMapContext);

	if (DeviceDetector.get() === "phone") {
		return (
			<ModalOverlay id="picker-wrapper" closeOnOutsideClick={true} onClose={props.onClose}>
				{props.children}
			</ModalOverlay>
		);
	} else {
		return (
			<AttachedPortal
				id="picker-wrapper"
				closeOnOutsideClick
				updateElementPosition={props.updateElementPosition}
				referenceElement={props.referenceElement}
				onVisibilityChange={isVisible => (!isVisible && props.onClose ? props.onClose() : {})}
				selfSizing
				adjustPositionToScreen
				fixedOrientation
				// orientationList={["bottom-start", "top-start"]}
				orientationList={["bottom-start", "bottom-end", "top-start", "top-end", "right", "left"]}
				// focusOnOpen={true}
			>
				{props.children}
			</AttachedPortal>
		);
	}
}
