// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, ReactNode } from "react";
import { useContext } from "react";

import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";

import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

/** @internal */
export interface PickerWrapperProps {
	readonly referenceElement: HTMLElement;
	readonly children?: ReactNode;
	updateElementPosition?(handler: () => void): void;
	onClose?(): void;
}

/** @internal */
export function PickerWrapper(props: PickerWrapperProps): JSX.Element | null {
	const widgetMap = useContext(WidgetMapContext);

	if (DeviceDetector.get() === "phone") {
		return (
			<widgetMap.ModalOverlay
				id="picker-wrapper"
				closeOnEsc
				closeOnOutsideClick
				onClose={props.onClose}
			>
				{props.children}
			</widgetMap.ModalOverlay>
		);
	} else {
		return (
			<widgetMap.AttachedPortal
				id="picker-wrapper"
				closeOnEsc
				closeOnOutsideClick
				updateElementPosition={props.updateElementPosition}
				referenceElement={props.referenceElement}
				onVisibilityChange={isVisible => (!isVisible && props.onClose ? props.onClose() : {})}
				selfSizing
				adjustPositionToScreen
				fixedOrientation
				orientationList={["bottom-start", "top-start"]}
				focusOnOpen={true}
			>
				{props.children}
			</widgetMap.AttachedPortal>
		);
	}
}
