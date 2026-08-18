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

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";

import type { Container } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/base-props.js";
import { compactTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/compact/compact-theme.js";
import { defaultTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/default/default-theme.js";
import { flatCompactTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat-compact/flat-compact-theme.js";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme.js";

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

	useEffect(() => {
		if (customTheme && selectedTheme && DEFAULT_THEMES.includes(selectedTheme)) {
			// reset the selected theme if a custom theme was updated that is not in the theme list
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setSelectedTheme(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [customTheme]);

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
