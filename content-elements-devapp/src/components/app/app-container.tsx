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

import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";

import { de } from "date-fns/locale/de";
import { enUS } from "date-fns/locale/en-US";
import type { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { StyleSheetManager, ThemeProvider } from "styled-components";

import { ApplicationSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale/index.js";
import { NotificationViews } from "@com.mgmtp.a12.client/client-core/lib/core/notification/index.js";
import { ViewViews } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import { DirtyHandlingViews } from "@com.mgmtp.a12.client/client-core/lib/extensions/dirtyHandling/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import {
	A11YLanguageContext,
	getA11yResource
} from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization/language-context.js";
import { DateTimeContext } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/date-time/date-time-context.js";
import { shouldForwardProp } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/should-forward-prop.js";
import { SizeContext } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector/main/size-context.js";
import { useWindowSize } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/size-detector/main/size-detector.view.js";
import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base/global-styles.js";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme.js";

import { DEFAULT_TRANSLATIONS } from "../../localization/index.js";

function A12ViewWrapper({ children }: PropsWithChildren) {
	const busyState = useSelector(ApplicationSelectors.busy());
	return (
		<NotificationViews.Frame>
			<DirtyHandlingViews.VetoDialog>
				<ViewViews.ProgressIndicator progress={busyState ? "loading" : "none"} global>
					{children}
				</ViewViews.ProgressIndicator>
			</DirtyHandlingViews.VetoDialog>
		</NotificationViews.Frame>
	);
}

function A12Provider({ children }: PropsWithChildren) {
	const { breakPoint } = useWindowSize();
	const locale = useSelector(LocaleSelectors.locale());
	const dataFormats = defaultDataFormats(locale);
	const conversion = defaultValueConversion(dataFormats);
	const localizer = defaultLocalizerFactory({
		locale,
		conversion,
		dataFormats,
		translationSource: DEFAULT_TRANSLATIONS
	});
	const A11yResource = getA11yResource(locale.language);

	const dateTimeLocale = locale.language === "en" ? enUS : de;

	return (
		<SizeContext.Provider value={{ currentSize: breakPoint.size }}>
			<LocalizerContext.Provider value={{ locale, dataFormats, localizer, conversion }}>
				<A11YLanguageContext.Provider value={A11yResource}>
					<DateTimeContext value={{ locale: dateTimeLocale }}>{children}</DateTimeContext>
				</A11YLanguageContext.Provider>
			</LocalizerContext.Provider>
		</SizeContext.Provider>
	);
}

export function AppContainer({ children }: PropsWithChildren) {
	return (
		<StyleSheetManager shouldForwardProp={shouldForwardProp}>
			<ThemeProvider theme={flatTheme}>
				<GlobalStyles />
				<A12Provider>
					<A12ViewWrapper>{children}</A12ViewWrapper>
				</A12Provider>
			</ThemeProvider>
		</StyleSheetManager>
	);
}
