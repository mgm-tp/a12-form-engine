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
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

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
