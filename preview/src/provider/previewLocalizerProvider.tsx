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

import type { JSX, PropsWithChildren } from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core";
import {
	findElementByFormModelPath,
	FormEngineSelectors
} from "@com.mgmtp.a12.formengine/formengine-core";
import type { FormModel } from "@com.mgmtp.a12.formengine/formengine-core";
import type { Locale, Localizable, Localizer } from "@com.mgmtp.a12.utils/utils-localization";
import {
	addDotEscaping,
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

type FormModelElement = { readonly id?: string; readonly name?: string };

interface L10nContextProps {
	readonly activityId: string;
	readonly emptyLabelsVisible: boolean;
}

/** @internal */
export function PreviewLocalizerProvider(props: PropsWithChildren<L10nContextProps>): JSX.Element {
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
