// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";
import { useMemo } from "react";
import type { JSX } from "react";
import { useSelector } from "react-redux";

import { ApplicationSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import { DynamicRegionUi } from "@com.mgmtp.a12.client/client-core/lib/core/frame/index.js";
import { NotificationViews } from "@com.mgmtp.a12.client/client-core/lib/core/notification/index.js";
import { ViewViews } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import { DirtyHandlingViews } from "@com.mgmtp.a12.client/client-core/lib/extensions/dirtyHandling/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion,
	Locale
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector/main/size-context.js";
import { useWindowSize } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector/main/size-detector.view.js";

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
