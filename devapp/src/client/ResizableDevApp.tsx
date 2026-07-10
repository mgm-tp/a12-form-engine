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

import { useMemo } from "react";
import type { JSX } from "react";
import { useSelector } from "react-redux";

import {
	ApplicationSelectors,
	DynamicRegionUi,
	NotificationViews,
	ViewViews
} from "@com.mgmtp.a12.client/client-core";
import { DirtyHandlingViews } from "@com.mgmtp.a12.client/client-core/dirtyHandling";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion,
	Locale
} from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import { SizeContext, useWindowSize } from "@com.mgmtp.a12.widgets/widgets-core";

import { devappTranslationSource } from "./config/devappTranslationSource.js";
import { DevappThemeContextProvider } from "./ThemeContextProvider.js";

const DEVAPP_LOCALE = Locale.fromString("en_US") as Locale;

export function ResizableDevApp(): JSX.Element {
	const { breakPoint } = useWindowSize();

	return (
		<SizeContext.Provider value={{ currentSize: breakPoint.size }}>
			<DevappThemeContextProvider>
				<Devapp />
			</DevappThemeContextProvider>
		</SizeContext.Provider>
	);
}

function Devapp(): JSX.Element {
	const localizerCtx = useMemo(() => {
		const dataFormats = defaultDataFormats(DEVAPP_LOCALE);
		const conversion = defaultValueConversion(dataFormats);
		const localizer = defaultLocalizerFactory({
			locale: DEVAPP_LOCALE,
			conversion,
			dataFormats,
			translationSource: devappTranslationSource
		});

		return { locale: DEVAPP_LOCALE, dataFormats, localizer, conversion };
	}, []);

	return (
		<LocalizerContext.Provider value={localizerCtx}>
			<DirtyHandlingViews.VetoDialog>
				<NotificationViews.Frame>
					<RootRegion />
				</NotificationViews.Frame>
			</DirtyHandlingViews.VetoDialog>
		</LocalizerContext.Provider>
	);
}

function RootRegion() {
	const busy = useSelector(ApplicationSelectors.busy());

	return (
		<ViewViews.ProgressIndicator progress={busy ? "loading" : "none"} global>
			<DynamicRegionUi />
		</ViewViews.ProgressIndicator>
	);
}
