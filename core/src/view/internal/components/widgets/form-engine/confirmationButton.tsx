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
