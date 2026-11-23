// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { FormElementContextsProvider } from "@com.mgmtp.a12.formengine/formengine-content-elements";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import {
	A11YLanguageContext,
	getA11yResource
} from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/a11y-localization/language-context.js";

/**
 * @internal
 */
export function createEditingRenderer<Node extends ContentModel.Node<unknown>>(
	Renderer: React.ComponentType<NodeRendererProps<Node>>
): React.ComponentType<NodeRendererProps<Node>> {
	const locale: Locale = { language: "en", country: "US" };
	const dataFormats = defaultDataFormats(locale);
	const conversion = defaultValueConversion(dataFormats);
	const localizer = defaultLocalizerFactory({
		locale,
		conversion,
		dataFormats,
		fallbackLocales: [
			{ language: "en" },
			{ language: "en", country: "US" },
			{ language: "de" },
			{ language: "de", country: "DE" }
		]
	});
	const A11yResource = getA11yResource(locale.language);

	return (props: NodeRendererProps<Node>) => {
		return (
			<LocalizerContext.Provider value={{ locale, localizer, dataFormats, conversion }}>
				<A11YLanguageContext.Provider value={A11yResource}>
					<FormElementContextsProvider contentModelName="DUMMY">
						<Renderer {...props} />
					</FormElementContextsProvider>
				</A11YLanguageContext.Provider>
			</LocalizerContext.Provider>
		);
	};
}
