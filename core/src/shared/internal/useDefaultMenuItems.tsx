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

import type { Dispatch, JSX, SetStateAction } from "react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import {
	LocaleActions,
	LocaleSelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/locale/index.js";
import { IMetaKeys } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/lib/main/js/a12internal/utils/IMetaKeys.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import type {
	MenuItem,
	MenuItemType
} from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/menu.api.js";

import { Commands } from "../../back-end/store/index.js";
import { FormEngineActions, FormEngineSelectors } from "../../client-extensions/index.js";

import { getLocales } from "./PreviewLocalizerContext.js";
import { PreviewThemeContext } from "./PreviewThemeContext.js";
import { FORM_ENGINE_WIDTH_LS_KEY, LABELS_LS_KEY } from "./localStorageKeys.js";
import { selectDocumentNames } from "./previewSlice.js";
import { WIDTHS } from "./width.js";

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
		useResetMenuItem(props),
		createWidthMenuItem(props),
		useThemeMenuItem(),
		useLocaleMenuItem(activityId),
		useReadOnlyMenuItem(activityId),
		createEmptyLabelsVisibleMenuItem(props),
		useDataMenuItem(props),
		useNowValueMenuItem(props),
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

	const screenItems: MenuItem[] | undefined = screens?.map(({ name: screenName }) => {
		return {
			label: screenName,
			icon: currentScreenLocationName === screenName ? <Icon>check</Icon> : <Icon />,
			onClick: () => {
				dispatch(
					FormEngineActions.command({
						activityId,
						engineEvent: Commands.changeScreen({ screenName })
					})
				);
			}
		};
	});

	return {
		label: "Screens",
		id: "screens",
		disabled: screenCount <= 1,
		icon: <Icon>view_carousel</Icon>,
		...(screenCount > 1 && {
			items: screenItems
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

function useResetMenuItem({ onResetState }: Props) {
	return {
		label: "Reset",
		id: "reset",
		icon: <Icon>history</Icon>,
		onClick: onResetState
	} as const satisfies MenuItem;
}

function createWidthMenuItem({ formEngineWidth, setFormEngineWidth }: Props) {
	return {
		label: "Width",
		id: "width",
		icon: <Icon>devices</Icon>,
		items: Object.entries(WIDTHS).map(([label, width]) => ({
			label,
			icon: formEngineWidth === width ? <Icon>check</Icon> : <Icon></Icon>,
			onClick: () => {
				localStorage.setItem(FORM_ENGINE_WIDTH_LS_KEY, width);
				setFormEngineWidth(width);
			}
		}))
	} as const satisfies MenuItem;
}

function useThemeMenuItem() {
	const { availableThemes, selectedTheme, selectTheme } = useContext(PreviewThemeContext);

	return {
		label: "Theme",
		id: "select-theme",
		icon: <Icon>palette</Icon>,
		items: availableThemes.map(t => {
			return {
				label: t,
				icon: selectedTheme === t ? <Icon>check</Icon> : <Icon />,
				onClick: () => selectTheme(t)
			};
		})
	} as const satisfies MenuItem;
}

function useLocaleMenuItem(activityId: string) {
	const dispatch = useDispatch();

	const localeCodes = useSelector(
		state => FormEngineSelectors.models(activityId)(state)?.formModel.header.locales
	);

	const currentLocale = useSelector(LocaleSelectors.locale());

	const localeItems = getLocales(localeCodes).map(locale => {
		return {
			label: `${locale.language} (${locale.country})`,
			icon:
				locale.language === currentLocale.language && locale.country === currentLocale.country ? (
					<Icon>check</Icon>
				) : (
					<Icon />
				),
			onClick: () => dispatch(LocaleActions.set(locale))
		};
	});

	return {
		label: "Locale",
		id: "locale",
		icon: <Icon>translate</Icon>,
		items: localeItems
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
		label: (emptyLabelsVisible ? "Hide" : "Show") + " Empty Labels",
		id: "show-empty-labels",
		icon: <Icon>{`visibility${emptyLabelsVisible ? "" : "_off"}`}</Icon>,
		onClick: () => {
			localStorage.setItem(LABELS_LS_KEY, "" + !emptyLabelsVisible);
			setEmptyLabelsVisible(v => !v);
		}
	} as const satisfies MenuItem;
}

function useDataMenuItem(props: Props) {
	const documentNames = useSelector(state => selectDocumentNames(state, props.activityId));
	const selectedDocument = useSelector(
		ActivitySelectors.activityPropById(props.activityId, a => a.descriptor.instance)
	);

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
				items: [NEW_INSTANCE_IDENTIFIER, ...documentNames].map(name => ({
					label: name === NEW_INSTANCE_IDENTIFIER ? "Empty" : name,
					icon: name === selectedDocument ? <Icon>check</Icon> : <Icon />,
					onClick: () => props.onLoadDocument(name)
				}))
			}
		]
	} as const satisfies MenuItem;
}

function useNowValueMenuItem(props: Props) {
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
