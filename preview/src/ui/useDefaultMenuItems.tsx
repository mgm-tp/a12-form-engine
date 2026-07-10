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

import type { Dispatch, JSX, SetStateAction } from "react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	ActivitySelectors,
	LocaleActions,
	LocaleSelectors,
	NEW_INSTANCE_IDENTIFIER
} from "@com.mgmtp.a12.client/client-core";
import {
	Commands,
	FormEngineActions,
	FormEngineSelectors
} from "@com.mgmtp.a12.formengine/formengine-core";
import { IMetaKeys } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/a12internal";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type { MenuItem, MenuItemType } from "@com.mgmtp.a12.widgets/widgets-core";

import { PreviewThemeContext } from "../provider/previewThemeProvider.js";
import { selectDocumentNames } from "../store/previewSlice.js";
import { getLocales } from "../utils/getLocales.js";
import { LocalStorageKey } from "../utils/localStorageKeys.js";
import { WIDTHS } from "../utils/width.js";

export interface CommonHandlers {
	onResetState(): void;
	onSetCustomConditions(): void;
	onSetNowValue(): void;
	onLoadDocument(documentName: string): void;
	onSaveDocument(): void;
}

/**
 * Utility type to extract all non-optional properties from a union
 */
type ExtractNonOptional<T, P extends keyof T> = Extract<T, Required<Pick<T, P>>>[P];

/**
 * Takes in a union type of MenuItemType and collects their "id" (can be optional),
 * then recurses via the union of all "items" (can be optional too). Used to collect
 * all statically defined menu ids of all (sub) menus.
 */
type RecursiveIds<T extends MenuItemType> =
	| ExtractNonOptional<T, "id">
	| (T extends never ? never : RecursiveIds<ExtractNonOptional<T, "items">[number]>);

type MenuItems = ReturnType<typeof useDefaultMenuItems>[number];

export type PossibleMenuIds = RecursiveIds<MenuItems>;

interface Props extends CommonHandlers {
	readonly activityId: string;
	readonly formEngineWidth: string;
	setFormEngineWidth: (width: string) => void;
	readonly emptyLabelsVisible: boolean;
	setEmptyLabelsVisible: Dispatch<SetStateAction<boolean>>;
	readonly dataPreview: boolean;
	onToggleDataPreview: () => void;
}

export function useDefaultMenuItems(props: Props) {
	const { activityId } = props;

	return [
		useScreenMenuItem(activityId),
		useValidateMenuItem(activityId),
		createResetMenuItem(props),
		createWidthMenuItem(props),
		useThemeMenuItem(),
		useLocaleMenuItem(activityId),
		useReadOnlyMenuItem(activityId),
		createEmptyLabelsVisibleMenuItem(props),
		useDataMenuItem(props),
		createNowValueMenuItem(props),
		useCustomConditionsMenuItem(props)
	];
}

function useScreenMenuItem(activityId: string) {
	const dispatch = useDispatch();
	const screens = useSelector(
		state => FormEngineSelectors.models(activityId)(state)?.formModel.content.screens
	);

	const screenCount = screens?.length ?? 0;

	const currentScreenLocationName = useSelector(
		state =>
			FormEngineSelectors.uiState(activityId)(state)?.screenLocation.at(-1)?.locationPath[0]
				.elementName
	);

	function toScreenMenuItem({ name: screenName }: { readonly name: string }): MenuItem {
		return {
			label: screenName,
			icon: currentScreenLocationName === screenName ? <Icon>check</Icon> : <Icon />,
			onClick: () =>
				dispatch(
					FormEngineActions.command({
						activityId,
						engineEvent: Commands.changeScreen({ screenName })
					})
				)
		};
	}

	return {
		label: "Screens",
		id: "screens",
		disabled: screenCount <= 1,
		icon: <Icon>view_carousel</Icon>,
		...(screenCount > 1 && {
			items: screens?.map(toScreenMenuItem)
		})
	} as const satisfies MenuItem;
}

function useValidateMenuItem(activityId: string) {
	const dispatch = useDispatch();
	return {
		label: "Validate",
		id: "validate-full",
		icon: <Icon>check</Icon>,
		onClick: () =>
			dispatch(FormEngineActions.command({ activityId, engineEvent: Commands.validateFull({}) }))
	} as const satisfies MenuItem;
}

function createResetMenuItem({ onResetState }: Props) {
	return {
		label: "Reset",
		id: "reset",
		icon: <Icon>history</Icon>,
		onClick: onResetState
	} as const satisfies MenuItem;
}

function createWidthMenuItem({ formEngineWidth, setFormEngineWidth }: Props) {
	function toWidthMenuItem([label, width]: [string, string]): MenuItem {
		return {
			label,
			icon: formEngineWidth === width ? <Icon>check</Icon> : <Icon></Icon>,
			onClick: () => {
				localStorage.setItem(LocalStorageKey.FormEngineWidth, width);
				setFormEngineWidth(width);
			}
		};
	}

	return {
		label: "Width",
		id: "width",
		icon: <Icon>devices</Icon>,
		items: Object.entries(WIDTHS).map(toWidthMenuItem)
	} as const satisfies MenuItem;
}

function useThemeMenuItem() {
	const { availableThemes, selectedTheme, selectTheme } = useContext(PreviewThemeContext);

	function toThemeMenuItem(theme: string): MenuItem {
		return {
			label: theme,
			icon: selectedTheme === theme ? <Icon>check</Icon> : <Icon />,
			onClick: () => selectTheme(theme)
		};
	}

	return {
		label: "Theme",
		id: "select-theme",
		icon: <Icon>palette</Icon>,
		items: availableThemes.map(toThemeMenuItem)
	} as const satisfies MenuItem;
}

function useLocaleMenuItem(activityId: string) {
	const dispatch = useDispatch();

	const localeCodes = useSelector(
		state => FormEngineSelectors.models(activityId)(state)?.formModel.header.locales
	);

	const currentLocale = useSelector(LocaleSelectors.locale());

	function toLocaleMenuItem(locale: Locale): MenuItem {
		const isCurrentLocale =
			locale.language === currentLocale.language && locale.country === currentLocale.country;
		return {
			label: `${locale.language} (${locale.country})`,
			icon: isCurrentLocale ? <Icon>check</Icon> : <Icon />,
			onClick: () => dispatch(LocaleActions.set(locale))
		};
	}

	return {
		label: "Locale",
		id: "locale",
		icon: <Icon>translate</Icon>,
		items: getLocales(localeCodes).map(toLocaleMenuItem)
	} as const satisfies MenuItem;
}

function useReadOnlyMenuItem(activityId: string) {
	const dispatch = useDispatch();

	const readonly = useSelector(state => FormEngineSelectors.uiState(activityId)(state)?.readonly);

	return {
		label: "Readonly",
		id: "readonly",
		icon: <CheckboxIcon checked={readonly ?? false} />,
		onClick: () =>
			dispatch(
				FormEngineActions.command({ activityId, engineEvent: Commands.setReadonly(!readonly) })
			)
	} as const satisfies MenuItem;
}

function createEmptyLabelsVisibleMenuItem({ emptyLabelsVisible, setEmptyLabelsVisible }: Props) {
	return {
		label: `${emptyLabelsVisible ? "Hide" : "Show"} Empty Labels`,
		id: "show-empty-labels",
		icon: <Icon>{`visibility${emptyLabelsVisible ? "" : "_off"}`}</Icon>,
		onClick: () => {
			localStorage.setItem(LocalStorageKey.Labels, "" + !emptyLabelsVisible);
			setEmptyLabelsVisible(v => !v);
		}
	} as const satisfies MenuItem;
}

function useDataMenuItem(props: Props) {
	const documentNames = useSelector(state => selectDocumentNames(state, props.activityId));
	const selectedDocument = useSelector(
		ActivitySelectors.activityPropById(props.activityId, a => a.descriptor.instance)
	);

	function toDocumentMenuItem(name: string): MenuItem {
		return {
			label: name === NEW_INSTANCE_IDENTIFIER ? "Empty" : name,
			icon: name === selectedDocument ? <Icon>check</Icon> : <Icon />,
			onClick: () => props.onLoadDocument(name)
		};
	}

	return {
		label: "Data",
		id: "data",
		items: [
			{
				type: "group",
				label: "Actions",
				id: "data-actions",
				items: [
					{
						label: "Save",
						icon: <Icon>save</Icon>,
						onClick: props.onSaveDocument
					},
					{
						label: "Show Data",
						icon: <CheckboxIcon checked={props.dataPreview} />,
						onClick: props.onToggleDataPreview
					}
				]
			},
			{
				type: "group",
				label: "Documents",
				id: "documents",
				items: [NEW_INSTANCE_IDENTIFIER, ...documentNames].map(toDocumentMenuItem)
			}
		]
	} as const satisfies MenuItem;
}

function createNowValueMenuItem(props: Props) {
	return {
		label: "NOW Value",
		id: "now-value",
		icon: <Icon>schedule</Icon>,
		onClick: props.onSetNowValue
	} as const satisfies MenuItem;
}

function useCustomConditionsMenuItem(props: Props) {
	return {
		label: "Custom Conditions",
		disabled: !useHasCustomConditions(props.activityId),
		id: "custom-conditions",
		icon: <Icon>checklist_rtl</Icon>,
		onClick: props.onSetCustomConditions
	} as const satisfies MenuItem;
}

function useHasCustomConditions(activityId: string): boolean {
	const validationCode = useSelector(
		state => FormEngineSelectors.models(activityId)(state)?.validatorProvider
	);

	return (
		validationCode !== undefined &&
		(validationCode.getMetaModel().getValue(IMetaKeys.MODEL_APPLICATION_CONDITION) as Set<string>)
			.size > 0
	);
}

function CheckboxIcon(props: { readonly checked: boolean }): JSX.Element {
	return <Icon>{"check_box" + (props.checked ? "" : "_outline_blank")}</Icon>;
}
