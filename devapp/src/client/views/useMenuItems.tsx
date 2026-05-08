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

import { useDispatch, useSelector } from "react-redux";

import {
	Commands,
	FormEngineActions,
	FormEngineSelectors
} from "@com.mgmtp.a12.formengine/formengine-core";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import type { MenuItemType } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/menu.api.js";

import type { PreviewApplicationProps } from "../shared.js";

interface Props {
	readonly activityId: string;
	onExportData(): void;
	onImportData(): void;
	onSaveData(): void;
	onRestoreData(): void;
	onImportTheme(): void;
}

export function useMenuItems(props: Props): PreviewApplicationProps["additionalMenuItems"] {
	return {
		"": useRootMenuItems(props),
		"data-actions": useDataMenuItems(props),
		"select-theme": useThemeMenuItems(props)
	};
}

function useRootMenuItems({ activityId }: Props): MenuItemType[] {
	const dispatch = useDispatch();
	const disabled = useSelector(state => FormEngineSelectors.uiState(activityId)(state)?.disabled);

	return [
		{
			label: "Disabled",
			icon: <Icon>{"check_box" + (disabled ? "" : "_outline_blank")}</Icon>,
			onClick: () =>
				dispatch(
					FormEngineActions.command({
						activityId,
						engineEvent: Commands.setDisabled(!disabled)
					})
				)
		}
	];
}

function useDataMenuItems(props: Props): MenuItemType[] {
	return [
		{
			label: "Export to file",
			icon: <Icon>file_download</Icon>,
			onClick: props.onExportData
		},
		{
			label: "Import from file",
			icon: <Icon>file_upload</Icon>,
			onClick: props.onImportData
		},
		{
			label: "Save to local storage",
			icon: <Icon>save</Icon>,
			onClick: props.onSaveData
		},
		{
			label: "Restore from local storage",
			icon: <Icon>restore</Icon>,
			onClick: props.onRestoreData
		}
	];
}

function useThemeMenuItems(props: Props): MenuItemType[] {
	return [
		{
			label: "Import from file",
			icon: <Icon>file_upload</Icon>,
			onClick: props.onImportTheme
		}
	];
}
