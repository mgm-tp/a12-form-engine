// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, ReactNode } from "react";
import { useContext } from "react";

import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";

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
