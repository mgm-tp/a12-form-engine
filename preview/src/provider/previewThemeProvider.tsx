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

import { createContext, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { Container } from "@com.mgmtp.a12.widgets/widgets-core";

import {
	customThemeSelected,
	selectCustomTheme,
	selectCustomThemeNames
} from "../store/previewSlice.js";
import { LocalStorageKey } from "../utils/localStorageKeys.js";

const DEFAULT_THEMES = ["Base", "Base Flat"];
const DEFAULT_THEME = DEFAULT_THEMES[0];

interface ContextProps {
	readonly availableThemes: readonly string[];
	readonly selectedTheme: string | null;
	selectTheme(theme: string): void;
}

export const PreviewThemeContext = createContext<ContextProps>({
	availableThemes: DEFAULT_THEMES,
	selectedTheme: DEFAULT_THEME,
	selectTheme: () => {
		throw Error("PreviewThemeContext was used outside of its provider");
	}
});

PreviewThemeContext.displayName = "PreviewThemeContext";

export type ThemeProviderProps = Container & {
	readonly activityId: string;
};

export const PreviewThemeProvider = (props: ThemeProviderProps) => {
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
				localStorage.setItem(LocalStorageKey.Theme, theme);
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

function getInitialTheme(): string {
	const theme = localStorage.getItem(LocalStorageKey.Theme);
	return theme && DEFAULT_THEMES.includes(theme) ? theme : DEFAULT_THEME;
}
