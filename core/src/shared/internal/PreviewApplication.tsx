// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, ReactNode } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { View } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import type { MenuItemType } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/menu.api.js";

import type { ModalType } from "./modal.js";
import { getModal } from "./modal.js";
import { PreviewApplicationTemplate } from "./PreviewApplicationTemplate.js";
import { replaceActivity } from "./previewSlice.js";
import { PreviewThemeContextProvider, WidgetThemeContext } from "./PreviewThemeContext.js";
import type { CommonHandlers, PossibleMenuIds } from "./useDefaultMenuItems.js";

export interface PreviewApplicationProps extends View {
	/**
	 * Specifies additional menu items to add at the end of the sub menu specified by the given parent id.
	 * Use an empty string to add items to the root menu.
	 */
	readonly additionalMenuItems?: Partial<Record<PossibleMenuIds | "", MenuItemType[]>>;
	readonly applicationHeader: JSX.Element;
	readonly children?: ReactNode;
}

export function PreviewApplication(props: PreviewApplicationProps): JSX.Element {
	const [modal, setModal] = useState<ModalType | undefined>(undefined);

	const { activityId } = props;

	const dispatch = useDispatch();

	function handleResetState(): void {
		dispatch(ActivityActions.loadData({ activityId }));
	}

	function handleLoadDocument(documentName: string): void {
		dispatch(replaceActivity({ activityId, newInstance: documentName }));
	}

	function handleSaveDocument(): void {
		dispatch(ActivityActions.save.started({ activityId }));
	}

	const previewProps = {
		...props,
		onSetCustomConditions: () => setModal("CUSTOM_CONDITION"),
		onSetNowValue: () => setModal("NOW"),
		onResetState: () => setModal("RESET_STATE"),
		onLoadDocument: handleLoadDocument,
		onSaveDocument: handleSaveDocument
	} satisfies PreviewApplicationProps & CommonHandlers;

	const Modal = getModal(modal);

	return (
		<PreviewThemeContextProvider activityId={activityId}>
			{Modal && (
				<Modal
					activityId={activityId}
					onClose={() => setModal(undefined)}
					onConfirm={() => {
						if (modal === "RESET_STATE") {
							handleResetState();
						}
					}}
				/>
			)}
			<PreviewApplicationTemplate {...previewProps}>
				<WidgetThemeContext activityId={activityId}>{props.children}</WidgetThemeContext>
			</PreviewApplicationTemplate>
		</PreviewThemeContextProvider>
	);
}
