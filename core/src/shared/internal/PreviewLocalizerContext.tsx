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

import type { JSX, PropsWithChildren } from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import type { Model } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type {
	Localizable,
	Localizer
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import {
	addDotEscaping,
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion,
	Locale
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { FormEngineSelectors } from "../../client-extensions/index.js";
import type { FormModel } from "../../models/index.js";
import { findElementByFormModelPath } from "../../models/index.js";

import { CLDRData } from "./CLDRData.js";

/**
 * Parses locales from the form model.
 *
 * Notes:
 * - Partial locales are converted into full ones via fallback data
 * - partial locales with the same language as an existing full one are removed
 */
export function getLocales(locales: Model["header"]["locales"]) {
	const parsed = locales?.map(({ code }) => Locale.fromString(code)) ?? [];

	const fullLocaleLanguages = parsed.filter(Locale.isLocale).map(locale => locale.language);

	return parsed.flatMap(locale => {
		const cldrFallback = CLDRData[locale.language];
		return Locale.isLocale(locale)
			? locale
			: !fullLocaleLanguages.includes(locale.language) && cldrFallback !== undefined
				? (Locale.fromString(`${locale.language}_${cldrFallback.territoryCode}`) as Locale)
				: [];
	});
}

type FormModelElement = { readonly id?: string; readonly name?: string };

interface L10nContextProps {
	readonly activityId: string;
	readonly emptyLabelsVisible: boolean;
}

export function PreviewLocalizerContext(props: PropsWithChildren<L10nContextProps>): JSX.Element {
	const locale = useSelector(LocaleSelectors.locale());
	const formModel = useSelector(
		state => FormEngineSelectors.models(props.activityId)(state)?.formModel
	);

	const contextValue = useMemo(() => {
		const localizer =
			formModel && props.emptyLabelsVisible
				? createEmptyLabelsLocalizer(locale, formModel)
				: getDefaultLocalizer(locale);

		const dataFormats = defaultDataFormats(locale);

		return {
			locale,
			dataFormats,
			localizer,
			conversion: defaultValueConversion(dataFormats)
		};
	}, [formModel, locale, props.emptyLabelsVisible]);

	return (
		<LocalizerContext.Provider value={contextValue}>{props.children}</LocalizerContext.Provider>
	);
}

/**
 * Extends the default {@link Localizer} with specific labels for elements with no given label.
 */
function createEmptyLabelsLocalizer(locale: Locale, formModel: FormModel): Localizer {
	const localizer = getDefaultLocalizer(locale);
	return (...localizables: Localizable[]) => {
		const next = localizer(...localizables);
		if (next) {
			return next;
		}

		const namespace = `uiModel.${addDotEscaping(formModel.header.id)}`;
		const paths = convertLocalizablesToModelPaths(localizables, namespace);

		for (const path of paths) {
			// The key contains the model path with an optional property suffix (e.g. title)
			const element: FormModelElement | undefined =
				findElementByFormModelPath(formModel, path) ||
				findElementByFormModelPath(formModel, path.slice(0, path.length - 1));
			if (element !== undefined && (element.name || element.id)) {
				return `[${element.name || element.id}]`;
			}
		}

		return undefined;
	};
}

function convertLocalizablesToModelPaths(
	localizables: Localizable[],
	namespace: string
): ModelPath[] {
	return localizables.flatMap(l =>
		l.key.startsWith(namespace)
			? [ModelPath.fromString(convertLocalizableToModelPathString(l, namespace))]
			: []
	);
}

/**
 * The given namespace is cut from the key of the given {@link Localizable} and all '.'
 * are replaced with a '/' so that the {@link ModelPath.fromString} function can work
 * with the remaining part of the key.
 */
function convertLocalizableToModelPathString(localizable: Localizable, namespace: string): string {
	const localizableKeyWithoutNamespacePrefix = localizable.key.slice(namespace.length);
	return localizableKeyWithoutNamespacePrefix.replace(/\./g, "/");
}

function getDefaultLocalizer(locale: Locale): Localizer {
	return defaultLocalizerFactory({
		locale,
		dataFormats: defaultDataFormats(locale)
	});
}
