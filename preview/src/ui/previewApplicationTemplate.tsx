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
import { useCallback, useContext, useMemo, useState } from "react";

import {
	addPrefix,
	ApplicationFrame,
	FlyoutMenu,
	SizeContext,
	SlidingMenu,
	SplitView
} from "@com.mgmtp.a12.widgets/widgets-core";
import type { MenuItemType, SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { PreviewLocalizerProvider } from "../provider/previewLocalizerProvider.js";
import { LocalStorageKey } from "../utils/localStorageKeys.js";
import { WIDTHS } from "../utils/width.js";

import { DataPreview } from "./dataPreview.js";
import type { PreviewApplicationProps } from "./previewApplication.js";
import type { CommonHandlers } from "./useDefaultMenuItems.js";
import { useDefaultMenuItems } from "./useDefaultMenuItems.js";

type PreviewApplicationTemplateProps = PreviewApplicationProps & CommonHandlers;

/**
 * Here, `flexGrow` is set to 3 for the right area. This is because we want the width of the data preview to be 30% and for the left area 70% when isFullWidth and datapreview
 * are set to true which results in a 7:3 ratio. So, when additional space is available, the left area will get 7 parts of the space, and the right area will get 3 parts.
 * The minWidth of 500px is important to avoid layout issues that could occur if the area becomes too narrow, which could negatively impact the responsive grid. The breakpoint
 * defined by widgets is 575px.
 */
const rightAreaStyle = { flexGrow: 3, minWidth: "500px" };
const splitViewStyle = { height: "100%", display: "flex" };

export function PreviewApplicationTemplate(props: PreviewApplicationTemplateProps): JSX.Element {
	const [emptyLabelsVisible, setEmptyLabelsVisible] = useState(
		() => localStorage.getItem(LocalStorageKey.Labels) === "true"
	);

	const [formEngineWidth, setFormEngineWidth] = useState(
		localStorage.getItem(LocalStorageKey.FormEngineWidth) ?? WIDTHS.LARGE
	);

	const [dataPreview, setDataPreview] = useState(false);

	const onToggleDataPreview = useCallback(() => setDataPreview(prev => !prev), []);

	const fixedMenuItems = useDefaultMenuItems({
		...props,
		formEngineWidth,
		setFormEngineWidth,
		dataPreview,
		onToggleDataPreview,
		emptyLabelsVisible,
		setEmptyLabelsVisible
	});
	const menuItems = [
		...(addAdditionalMenuItems(fixedMenuItems, props.additionalMenuItems) ?? []),
		...(props.additionalMenuItems?.[""] ?? [])
	];

	const leftAreaStyle = useMemo(() => {
		const isFullWidth = formEngineWidth === WIDTHS.LARGE;

		/**
		 * This width is used to ensure that the left area has enough space before a wrap occurs due to margins and paddings. The width of 1080px is chosen because widgets have a wrap
		 * width of 991px, but due to additional margins and paddings, the wrap needs to occur earlier.
		 */
		const leftMinWidth = dataPreview && isFullWidth ? "1080px" : formEngineWidth;

		return {
			flexGrow: isFullWidth ? 7 : 0,
			flexBasis: isFullWidth ? WIDTHS.LARGE : formEngineWidth,
			minWidth: leftMinWidth
		};
	}, [dataPreview, formEngineWidth]);

	const [menuCollapsed, setMenuCollapsed] = useState(
		localStorage.getItem(LocalStorageKey.Menu) === "true"
	);
	const isSmallDevice = isOnSmallDevice(useContext(SizeContext).currentSize);

	return (
		<PreviewLocalizerProvider emptyLabelsVisible={emptyLabelsVisible} activityId={props.activityId}>
			<ApplicationFrame
				main={props.applicationHeader}
				sub={
					<div>
						{isSmallDevice ? (
							<SlidingMenu items={menuItems} collapsed={menuCollapsed} />
						) : (
							<FlyoutMenu type={"vertical"} items={menuItems} collapsed={menuCollapsed} />
						)}
					</div>
				}
				content={
					<SplitView style={splitViewStyle}>
						<SplitView.Area style={leftAreaStyle}>{props.children}</SplitView.Area>
						{dataPreview && (
							<SplitView.Area className={addPrefix("-u-margin-l-base")} style={rightAreaStyle}>
								<DataPreview activityId={props.activityId} />
							</SplitView.Area>
						)}
					</SplitView>
				}
				onExpansionChange={() =>
					setMenuCollapsed(isCollapsed => {
						localStorage.setItem(LocalStorageKey.Menu, `${!isCollapsed}`);
						return !isCollapsed;
					})
				}
				subExpanded={!menuCollapsed}
				useToggleButton
			/>
		</PreviewLocalizerProvider>
	);
}

function addAdditionalMenuItems(
	currentMenu: MenuItemType[] | undefined,
	additionalMenuItems?: Partial<Record<string, MenuItemType[]>>
): MenuItemType[] | undefined {
	if (!additionalMenuItems) {
		return currentMenu;
	}
	return currentMenu?.map(menu => {
		const additionalMenus = (menu.id ? additionalMenuItems[menu.id] : []) ?? [];
		const childMenus = addAdditionalMenuItems(menu.items, additionalMenuItems) ?? [];
		const items = [...childMenus, ...additionalMenus];
		return {
			...menu,
			...(items.length > 0 && {
				items
			})
		} as MenuItemType;
	});
}

function isOnSmallDevice(size?: SizeDetectorProps.Size): boolean {
	return size === "xs" || size === "sm";
}
