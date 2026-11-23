// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext, useCallback, useMemo, useState } from "react";
import type { JSX } from "react";
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
