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

import type { JSX } from "react";
import { StyleSheetManager, ThemeProvider } from "styled-components";

import { DynamicRegionUi, NotificationViews } from "@com.mgmtp.a12.client/client-core";
import { DirtyHandlingViews } from "@com.mgmtp.a12.client/client-core/dirtyHandling";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import { DefaultLocalizerContextProvider } from "@com.mgmtp.a12.utils/utils-localization-react";
import {
	getBaseTheme,
	GlobalStyles,
	shouldForwardProp,
	SizeContext,
	useWindowSize
} from "@com.mgmtp.a12.widgets/widgets-core";

const DEFAULT_LOCALE = Locale.fromString("en_US") as Locale;

export interface PreviewClientAppProps {
	/**
	 * Locale used for the notification frame and dirty-handling dialog.
	 * The form engine preview itself manages its own localizer context.
	 * Defaults to en_US.
	 */
	readonly locale?: Locale;
}

/**
 * App shell for a standalone form engine preview.
 *
 * Renders the outer layers every preview consumer needs:
 * - window-size breakpoint context
 * - styled-components sheet manager
 * - a fixed flat-compact theme for the shell UI (the preview manages its own theme internally)
 * - localizer context for notifications / dirty-handling
 * - notification frame
 * - dirty-state veto dialog
 * - root DynamicRegionUi
 */
export function PreviewClientApp({ locale }: PreviewClientAppProps): JSX.Element {
	const { breakPoint } = useWindowSize();

	return (
		<SizeContext.Provider value={{ currentSize: breakPoint.size }}>
			<StyleSheetManager shouldForwardProp={shouldForwardProp}>
				<ThemeProvider theme={getBaseTheme()}>
					<GlobalStyles />
					<DefaultLocalizerContextProvider locale={locale ?? DEFAULT_LOCALE}>
						<NotificationViews.Frame>
							<DirtyHandlingViews.VetoDialog>
								<DynamicRegionUi />
							</DirtyHandlingViews.VetoDialog>
						</NotificationViews.Frame>
					</DefaultLocalizerContextProvider>
				</ThemeProvider>
			</StyleSheetManager>
		</SizeContext.Provider>
	);
}
