// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, ReactNode } from "react";
import { useState } from "react";

import { ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core/lib/button-group/main/button-group.view.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { ModalNotification } from "@com.mgmtp.a12.widgets/widgets-core/lib/modal-notification/main/modal-notification.view.js";

/** @internal */
export interface ConfirmationButtonProps {
	readonly label?: string;
	readonly icon?: ReactNode;
	readonly confirmationTitle?: string;
	readonly confirmationMessage?: string;
	action: (event: React.MouseEvent<HTMLElement>) => void;
}

/** @internal */
export function ConfirmationButton(props: ConfirmationButtonProps): JSX.Element {
	const { label, icon, confirmationTitle, confirmationMessage, action } = props;

	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<Button
				label={label}
				icon={icon}
				destructive
				onClick={() => {
					setShowModal(true);
				}}
			/>
			{showModal && (
				<ModalNotification
					title={confirmationTitle}
					focusBack={true}
					footer={
						<ButtonGroup alignment="right">
							<Button
								label={"Cancel"}
								onClick={() => {
									setShowModal(false);
								}}
							/>
							<Button
								label={"Delete"}
								primary
								destructive
								onClick={(event: React.MouseEvent<HTMLElement>) => {
									action(event);
									setShowModal(false);
								}}
							></Button>
						</ButtonGroup>
					}
					variant="warning"
					key="dialog"
					onClose={() => {
						setShowModal(false);
					}}
				>
					<p>{confirmationMessage}</p>
				</ModalNotification>
			)}
		</>
	);
}
