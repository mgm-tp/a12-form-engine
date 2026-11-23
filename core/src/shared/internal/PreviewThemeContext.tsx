// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";

import type { Container } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/base-props.js";
import { compactTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/compact/compact-theme.js";
import { defaultTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/default/default-theme.js";
import { flatCompactTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat-compact/flat-compact-theme.js";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme.js";
import type { DefaultThemeType } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/schema.js";

import { THEME_LS_KEY } from "./localStorageKeys.js";
import { customThemeSelected, selectCustomTheme, selectCustomThemeNames } from "./previewSlice.js";

const DEFAULT_THEMES = ["Default", "Compact", "Flat", "Flat Compact"];

interface ContextProps {
	readonly availableThemes: readonly string[];
	readonly selectedTheme: string | null;
	selectTheme(theme: string): void;
}

export const PreviewThemeContext = createContext<ContextProps>({
	availableThemes: DEFAULT_THEMES,
	selectedTheme: "Default",
	selectTheme: () => {
		throw Error("PreviewThemeContext was used outside of its provider");
	}
});

PreviewThemeContext.displayName = "PreviewThemeContext";

type PreviewThemeContextProviderProps = Container & {
	readonly activityId: string;
};

export const PreviewThemeContextProvider = (props: PreviewThemeContextProviderProps) => {
	const { children, activityId } = props;

	const dispatch = useDispatch();
	const customThemeNames = useSelector(state => selectCustomThemeNames(state, activityId));
	const customTheme = useSelector(state => selectCustomTheme(state, activityId));
	const [selectedTheme, setSelectedTheme] = useState<string | null>(getInitialTheme);
	const [prevCustomTheme, setPrevCustomTheme] = useState<DefaultThemeType | undefined>(undefined);

	const selectTheme = useCallback(
		(theme: string) => {
			setSelectedTheme(theme);
			if (customThemeNames.includes(theme)) {
				dispatch(customThemeSelected({ selectedTheme: theme, activityId }));
			} else {
				// we only persist default themes, since we can't guarantee others are still there the next time
				localStorage.setItem(THEME_LS_KEY, theme);
			}
		},
		[activityId, customThemeNames, dispatch]
	);

	if (customTheme !== prevCustomTheme) {
		setPrevCustomTheme(customTheme);
		if (customTheme && selectedTheme && DEFAULT_THEMES.includes(selectedTheme)) {
			setSelectedTheme(null);
		}
	}

	return (
		<PreviewThemeContext.Provider
			value={{
				availableThemes: [...DEFAULT_THEMES, ...customThemeNames],
				selectedTheme,
				selectTheme
			}}
		>
			{children}
		</PreviewThemeContext.Provider>
	);
};

export function WidgetThemeContext(props: PreviewThemeContextProviderProps) {
	const { children, activityId } = props;

	const { selectedTheme } = useContext(PreviewThemeContext);
	const customTheme = useSelector(state => selectCustomTheme(state, activityId));

	const currentTheme = useMemo(() => {
		switch (selectedTheme) {
			case "Flat":
				return flatTheme;
			case "Compact":
				return compactTheme;
			case "Flat Compact":
				return flatCompactTheme;
			case "Default":
				return defaultTheme;
			default:
				return customTheme ?? defaultTheme;
		}
	}, [selectedTheme, customTheme]);

	return <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>;
}

function getInitialTheme(): string {
	const theme = localStorage.getItem(THEME_LS_KEY);
	return theme && DEFAULT_THEMES.includes(theme) ? theme : DEFAULT_THEMES[0];
}
