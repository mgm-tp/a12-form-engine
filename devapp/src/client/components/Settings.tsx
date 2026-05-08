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

import { useContext, type JSX } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import { List } from "@com.mgmtp.a12.widgets/widgets-core/lib/list/main/list.view.js";
import { PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/pop-up-menu/main/pop-up-menu.view.js";

import { DevappThemeContext } from "../ThemeContextProvider.js";

export function Settings(): JSX.Element {
	const { theme: currentTheme } = useContext(DevappThemeContext);
	return (
		<PopUpMenu
			triggerButtonTitle="settings"
			triggerElement={
				<Button
					icon={<Icon>settings</Icon>}
					invert={currentTheme !== "flat" && currentTheme !== "flat_compact"}
				></Button>
			}
		>
			<List>
				<ThemeSwitcher />
			</List>
		</PopUpMenu>
	);
}

function ThemeSwitcher(): JSX.Element {
	const { localizer } = useContext(LocalizerContext);
	const { themes, setTheme, theme: currentTheme } = useContext(DevappThemeContext);

	return (
		<>
			<List.SubHeader fill>{localizer({ key: "theme.title" })}</List.SubHeader>
			{themes.map(theme => (
				<List.Item
					text={localizer({ key: `theme.${theme}` })}
					meta={currentTheme === theme && <Icon>check</Icon>}
					key={theme}
					onClick={() => setTheme(theme)}
				/>
			))}
		</>
	);
}
