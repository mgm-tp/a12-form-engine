// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { JSX } from "react";

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
