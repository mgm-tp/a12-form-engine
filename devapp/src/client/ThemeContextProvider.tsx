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

import { createContext, useCallback, useMemo, useState, type JSX } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";

import type { Container } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/base-props.js";
import { shouldForwardProp } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/should-forward-prop.js";
import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base/global-styles.js";
import { compactTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/compact/compact-theme.js";
import { defaultTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/default/default-theme.js";
import { flatCompactTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat-compact/flat-compact-theme.js";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme.js";

const THEMES = ["default", "compact", "flat", "flat_compact"] as const;
type Theme = (typeof THEMES)[number];

interface DevappThemeContextProps {
	readonly themes: readonly Theme[];
	readonly theme: Theme;
	setTheme(theme: Theme): void;
}

const invalidState = new Proxy({} as DevappThemeContextProps, {
	get() {
		throw new Error(
			"Empty DevappThemeContext, did you forget to wrap your application in <DevappThemeContextProvider>?"
		);
	}
});

export const DevappThemeContext = createContext<DevappThemeContextProps>(invalidState);

export function DevappThemeContextProvider(props: Container): JSX.Element {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	const onSelectTheme = useCallback((theme: Theme) => {
		setTheme(theme);
		localStorage.setItem("theme", theme);
	}, []);

	const currentTheme = useMemo(() => {
		if (theme === "flat") {
			return flatTheme;
		}
		if (theme === "compact") {
			return compactTheme;
		}
		if (theme === "flat_compact") {
			return flatCompactTheme;
		}
		return defaultTheme;
	}, [theme]);

	return (
		<DevappThemeContext.Provider value={{ themes: THEMES, theme, setTheme: onSelectTheme }}>
			<StyleSheetManager shouldForwardProp={shouldForwardProp}>
				<ThemeProvider theme={currentTheme}>
					<GlobalStyles />
					{props.children}
				</ThemeProvider>
			</StyleSheetManager>
		</DevappThemeContext.Provider>
	);
}

function getInitialTheme(): Theme {
	const theme = localStorage.getItem("theme") as Theme;

	return THEMES.includes(theme) ? theme : THEMES[0];
}
