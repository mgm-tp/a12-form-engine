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

import type { JSX } from "react";
import { useCallback, useContext, useMemo, useState } from "react";

import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils.js";
import { ApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/application-frame/main/application-frame.view.js";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector/main/size-context.js";
import { SplitView } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/split-view/main/split-view.view.js";
import { FlyoutMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/flyout-menu.view.js";
import type { MenuItemType } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/menu.api.js";
import { SlidingMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/sliding-menu.view.js";

import { isOnSmallDevice } from "../../view/internal/utilities/size-context.js";

import { DataPreview } from "./DataPreview.js";
import type { PreviewApplicationProps } from "./PreviewApplication.js";
import { PreviewLocalizerContext } from "./PreviewLocalizerContext.js";
import { FORM_ENGINE_WIDTH_LS_KEY, LABELS_LS_KEY, MENU_LS_KEY } from "./localStorageKeys.js";
import type { CommonHandlers } from "./useDefaultMenuItems.js";
import { useDefaultMenuItems } from "./useDefaultMenuItems.js";
import { WIDTHS } from "./width.js";

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
		() => localStorage.getItem(LABELS_LS_KEY) === "true"
	);

	const [formEngineWidth, setFormEngineWidth] = useState(
		localStorage.getItem(FORM_ENGINE_WIDTH_LS_KEY) ?? WIDTHS.LARGE
	);

	const [dataPreview, setDataPreview] = useState(false);

	const onToggleDataPreview = useCallback(() => {
		setDataPreview(!dataPreview);
	}, [dataPreview]);

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

	const leftAreaView = <SplitView.Area style={leftAreaStyle}>{props.children}</SplitView.Area>;

	const rightAreaView = (
		<SplitView.Area className={addPrefix("-u-margin-l-base")} style={rightAreaStyle}>
			<DataPreview activityId={props.activityId} />
		</SplitView.Area>
	);

	const [menuCollapsed, setMenuCollapsed] = useState(localStorage.getItem(MENU_LS_KEY) === "true");

	return (
		<PreviewLocalizerContext emptyLabelsVisible={emptyLabelsVisible} activityId={props.activityId}>
			<ApplicationFrame
				main={props.applicationHeader}
				sub={
					<div>
						{isOnSmallDevice(useContext(SizeContext).currentSize) ? (
							<SlidingMenu items={menuItems} collapsed={menuCollapsed} />
						) : (
							<FlyoutMenu type={"vertical"} items={menuItems} collapsed={menuCollapsed} />
						)}
					</div>
				}
				content={
					<SplitView style={splitViewStyle}>
						{leftAreaView} {dataPreview && rightAreaView}
					</SplitView>
				}
				onExpansionChange={() =>
					setMenuCollapsed(isCollapsed => {
						localStorage.setItem(MENU_LS_KEY, `${!isCollapsed}`);
						return !isCollapsed;
					})
				}
				subExpanded={!menuCollapsed}
				useToggleButton
			/>
		</PreviewLocalizerContext>
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
		const additionalMenus = (menu.id ? additionalMenuItems?.[menu.id] : []) ?? [];
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
