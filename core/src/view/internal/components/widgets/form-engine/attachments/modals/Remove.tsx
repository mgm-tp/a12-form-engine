// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { createResourceLocalizable } from "../../../../../../../back-end/localization/internal/factory.js";
import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/internal/languages/keys.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

interface RemoveModalProps {
	onRemove(): void;
	onClose(): void;
}

/**@internal */
export function RemoveModal(props: RemoveModalProps): JSX.Element {
	const { onClose, onRemove } = props;

	const { ModalNotification, ButtonGroup, Button } = useContext(WidgetMapContext);
	const { localizer } = useContext(LocalizerContext);

	return (
		<ModalNotification
			title={localizer(createResourceLocalizable(RESOURCE_KEYS.attachment.dialog.remove.title))}
			footer={
				<ButtonGroup alignment="right">
					<Button
						key={"remove-cancel"}
						label={localizer(
							createResourceLocalizable(RESOURCE_KEYS.attachment.dialog.remove.button.cancel)
						)}
						onClick={onClose}
						data-testid={"remove-modal-cancel"}
					/>
					<Button
						key={"remove-continue"}
						label={localizer(
							createResourceLocalizable(RESOURCE_KEYS.attachment.dialog.remove.button.continue)
						)}
						primary
						destructive
						onClick={onRemove}
						data-testid={"remove-modal-continue"}
					/>
				</ButtonGroup>
			}
			variant="warning"
			key="dialog"
			closeOnEsc
			closeOnOutsideClick
			onClose={onClose}
		>
			<p>{localizer(createResourceLocalizable(RESOURCE_KEYS.attachment.dialog.remove.content))}</p>
		</ModalNotification>
	);
}
