// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactNode } from "react";
import { useContext, useState } from "react";

import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";

import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { MenuContext } from "../../form-engine/repeat/components/MenuContext.js";
import { getListItemProps } from "../../form-engine/repeat/components/row-actions/getListItemProps.js";

/** @internal */
export interface ConfirmationButtonProps extends ButtonProps {
	confirmButtonLabel: string;
	cancelButtonLabel: string;
	confirmationMessage: string;
	destructive?: boolean;
	confirmButtonDestructive?: boolean;
	confirmationDialogTitle?: string;
	labelForContextMenuItem?: ReactNode;
	titleForContextMenuItem?: string;
	doNotShowConfirmationDialog?: boolean;
	action(): void;
}

/** @internal */
export interface ConfirmationButtonState {
	showDialog?: boolean;
}

/** @internal */
export function ConfirmationButton(props: ConfirmationButtonProps): ReactNode {
	const {
		action,
		destructive,
		confirmationMessage,
		confirmButtonDestructive,
		confirmButtonLabel,
		cancelButtonLabel,
		confirmationDialogTitle,
		labelForContextMenuItem,
		titleForContextMenuItem,
		doNotShowConfirmationDialog,
		...buttonProps
	} = props;

	const { ListItem, Button, ModalNotification, ButtonGroup } = useContext(WidgetMapContext);

	const [showDialog, setShowDialog] = useState(false);

	const handleOpenDialogClick = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();

		if (!doNotShowConfirmationDialog) {
			setShowDialog(true);
		}

		if (props.onClick) {
			props.onClick(event);
		}
	};

	const handleConfirmDialogClick = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		action();
		setShowDialog(false);
	};

	const handleCancelDialogClick = (event: React.MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		setShowDialog(false);

		const triggerButton = document.getElementById(props.id!);
		triggerButton?.focus();
	};

	return (
		<>
			<MenuContext.Consumer>
				{value =>
					value.renderAsListItem ? (
						<ListItem
							{...getListItemProps({
								...buttonProps,
								label: labelForContextMenuItem ?? buttonProps.label,
								title: titleForContextMenuItem
							})}
							onClick={handleOpenDialogClick}
						/>
					) : (
						<Button {...buttonProps} destructive={destructive} onClick={handleOpenDialogClick} />
					)
				}
			</MenuContext.Consumer>

			{showDialog && (
				<ModalNotification
					title={confirmationDialogTitle}
					focusBack={false}
					footer={
						<ButtonGroup alignment="right">
							<Button
								id={props.id + "-cancel"}
								label={cancelButtonLabel}
								onClick={handleCancelDialogClick}
							/>
							<Button
								id={props.id + "-confirm"}
								label={confirmButtonLabel}
								primary
								destructive={confirmButtonDestructive}
								onClick={handleConfirmDialogClick}
							/>
						</ButtonGroup>
					}
					variant="warning"
					closeOnEsc
					closeOnOutsideClick
					onClose={() => {
						setShowDialog(false);
					}}
				>
					<p>{confirmationMessage}</p>
				</ModalNotification>
			)}
		</>
	);
}
