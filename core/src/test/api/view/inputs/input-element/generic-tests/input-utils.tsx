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

import { equal, notEqual } from "node:assert/strict";

import type { ReactElement } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import { query, within } from "@com.mgmtp.a12.devtools/react";
import type {
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Locale,
	Localizable
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/data-roles.js";

import type { EngineStore } from "../../../../../../back-end/store/index.js";
import type { Models } from "../../../../../../back-end/store/internal/store.js";
import type { MultiSelectData } from "../../../../../../models/index.js";
import { DocumentPath } from "../../../../../../models/internal/utils/document-utils.js";
import type {
	Config,
	DispatchConfiguration,
	Value,
	WidgetMap
} from "../../../../../../view/index.js";
import type { ComponentMap } from "../../../../../../view/internal/configuration/componentMap/component-map.js";
import { DefaultComponentMap } from "../../../../../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import type { Inputs } from "../../../../../../view/internal/configuration/engine-configuration.js";
import { mockFunctions } from "../../../../../rtl-utils/mock-map.js";
import type { RtlRenderWrapper } from "../../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapper } from "../../../../../rtl-utils/render-wrapper.js";
import { DisableMockComponents } from "../../../../../utils/disable-mocks.js";
import { SetupHelpers } from "../../../../../utils/setup.js";

import { widgetMocksForInputTests } from "../inputTestWidgetMocks.js";

const { setupRenderConfiguration } = SetupHelpers;

export type TestComponentName = keyof (WidgetMap & ComponentMap);

export interface BaseProps {
	readonly path: EntityInstancePath;
	readonly component: TestComponentName;
	readonly componentToolTip?: keyof WidgetMap;
	readonly componentErrorProp?: keyof WidgetMap;

	/**
	 * Whether tooltips, which should be put under the label are defined by the prop
	 * `breakTooltipsToNewLine` or if they are put in the `tooltips` prop
	 */
	readonly breakTooltipsToNewLine?: boolean;
	readonly label?: boolean;
	readonly labelHiddenButRead?: boolean;
	readonly suffix?: boolean;
	readonly truncateSuffix?: boolean;

	readonly placeholder?: boolean;
	readonly placeholderPropName?: string;
}

export interface FieldBasedProps<T extends DocumentModel.FieldType> extends BaseProps {
	readonly documentElement: DocumentModel.Element;
	readonly documentElementDataType: T;
	renderFunction(props: Inputs.InputProps<T>): ReactElement | null;
}

export interface GroupBasedProps extends BaseProps {
	readonly documentElement: DocumentModel.Group;
	readonly documentElementDataType: DocumentModel.Group;
	renderFunction(props: Inputs.InputProps<DocumentModel.Group>): ReactElement | null;
}

// common render function
async function render<T extends DocumentModel.FieldType | DocumentModel.Group>(options: {
	props: Inputs.InputProps<T>;
	component: TestComponentName;
	renderFunction(props: Inputs.InputProps<T>): ReactElement | null;
}): Promise<RtlRenderWrapper & { input: any }> {
	const { props, renderFunction, component } = options;

	const Component = renderFunction;
	const widgetMap = widgetMocksForInputTests();
	const componentMap = mockFunctions(DefaultComponentMap);

	const render = DisableMockComponents.render(opts =>
		rtlRenderWrapper(<Component {...props} />, { ...opts, widgetMap, componentMap })
	);
	const wrapper = await render({});

	const c =
		((widgetMap as any)[component as any] as any) ??
		(wrapper.componentMap as any)[component as any];
	const input = query(c).props();

	return {
		...wrapper,
		input
	};
}

export async function primitivePropsTest<T extends DocumentModel.FieldType>(options: {
	models: Models;
	formModelPath: ModelPath;
	baseProps: FieldBasedProps<T> | GroupBasedProps;
	modelElement: Partial<Inputs.ModelElement>;
	propName: string;
	propValue?: boolean | string;
	component?: TestComponentName;
	ui?: Partial<EngineStore.UIState>;
	path?: EntityInstancePath;
	value?: Value;
}) {
	const {
		modelElement,
		propName,
		propValue,
		component,
		ui,
		path,
		baseProps,
		models,
		formModelPath,
		value
	} = options;

	const props = createProps({
		documentElement: baseProps.documentElement,
		documentElementDataType: baseProps.documentElementDataType,
		ui,
		path,
		models,
		formModelPath,
		modelElement,
		value
	});

	const { input } = await render({
		props,
		component: component || baseProps.component,
		renderFunction: baseProps.renderFunction
	});

	const actualValue = (input as any)[propName];
	equal(
		actualValue,
		propValue,
		`Prop ${propName} on component ${
			component
		} has wrong value. Expected: ${propValue}, Actual: ${actualValue}`
	);
}

export interface PropType<T extends DocumentModel.FieldType | DocumentModel.Group> {
	readonly documentElement: DocumentModel.Element;
	readonly documentElementDataType: T;
	readonly models: Models;
	readonly modelElement: Partial<Inputs.ModelElement>;
	readonly ui?: Partial<EngineStore.UIState>;
	readonly path?: EntityInstancePath;
	readonly dispatchConfig?: DispatchConfiguration;
	readonly value?: {
		data: string | number | boolean | Date | null | object | undefined | MultiSelectData;
		ui: string;
		path: EntityInstancePath;
	};
	readonly locale?: Locale;
	readonly config?: Partial<Config>;
	readonly validationMessages?: {
		readonly errors?: Localizable[][];
		readonly warnings?: Localizable[][];
		readonly infos?: Localizable[][];
	};
}

export function createProps<T extends DocumentModel.FieldType | DocumentModel.Group>(
	options: PropType<T> & {
		readonly uiId?: string;
		readonly formModelPath?: ModelPath;
	}
): Inputs.InputProps<T> {
	const { documentElement, documentElementDataType, models } = options;
	const renderConfiguration = setupRenderConfiguration({
		models,
		ui: options.ui,
		dispatchConfig: options.dispatchConfig,
		locale: options.locale,
		config: options.config,
		data: { document: {} }
	});

	const data = options.value ? options.value.data : generateTestValue(documentElement);

	return {
		documentElement: documentElement,
		documentElementDataType,
		modelElement: {
			elementPath: [],
			elementRef: "F18",
			exposition: options.modelElement.exposition || "AUTOCOMPLETE",
			...options.modelElement
		},
		validationMessages: {
			errors: options.validationMessages?.errors || [],
			warnings: options.validationMessages?.warnings || [],
			infos: options.validationMessages?.infos || []
		},
		renderConfiguration,
		uiId: options.uiId || "1",
		value: {
			data,
			ui: options.value ? options.value.ui : "42",
			path: options.path ?? options.value?.path ?? []
		},
		formModelPath: options.formModelPath || []
	};
}

function generateTestValue(
	documentElement: DocumentModel.Element
): string | number | boolean | Date | null | object {
	if (
		documentElement.type === "Group" &&
		(documentElement as DocumentModel.Group).usageType === "attachment"
	) {
		return generateAttachment();
	} else {
		return "test";
	}
}

export function generateAttachment(value?: Partial<Attachment>): object {
	return {
		original_filename: "test.png",
		internal_filename: "test.png",
		attachment_id: "test",
		size: 123,
		mime_type: "image/png",
		category: undefined,
		description: undefined,
		...value
	};
}

/**
 * Tool-tips
 */
export async function mountAndAssertTooltipPositionForTextLines<
	T extends DocumentModel.FieldType | DocumentModel.Group
>(options: {
	readonly path: EntityInstancePath;
	readonly documentElement: DocumentModel.Element;
	readonly documentElementDataType: T;
	readonly models: Models;
	readonly formModelPath: ModelPath;
	readonly tooltipsOnTop?: boolean;
	readonly breakTooltipsToNewLine?: boolean;
	readonly component: TestComponentName;
	renderFunction(props: Inputs.InputProps<T>): ReactElement | null;
}): Promise<void> {
	const {
		path,
		documentElementDataType,
		models,
		formModelPath,
		tooltipsOnTop,
		breakTooltipsToNewLine,
		renderFunction,
		component
	} = options;

	const message: EngineStore.Validation.Message = {
		element: path,
		errorCode: "MessageCode",
		errorKey: "MessageKey",
		errorText: [{ key: "foo", defaults: { en: "MessageText" } }],
		severity: "ERROR",
		referencedFields: [path]
	};

	const props = createProps({
		documentElementDataType,
		documentElement: options.documentElement,
		path,
		modelElement: { messageExposition: "TOOLTIP", tooltipsOnTop },
		models,
		formModelPath,
		ui: {
			messages: {
				[DocumentPath.toString(path)]: {
					validationMessages: [message]
				}
			}
		},
		validationMessages: {
			errors: [[{ key: "foo", defaults: { en: "MessageText" } }]]
		}
	});

	const { input } = await render({
		props,
		component,
		renderFunction
	});

	if (breakTooltipsToNewLine !== true) {
		if (tooltipsOnTop === true) {
			equal(input.addonAfter, undefined, "Expected that prop addonAfter is undefined");
			notEqual(input.tooltips, undefined, "Expected that prop tooltips is not undefined");
		} else {
			notEqual(input.addonAfter, undefined, "Expected that prop addonAfter is not undefined");
			equal(input.tooltips, undefined, "Expected that prop tooltips is undefined");
		}
	} else {
		if (tooltipsOnTop === true) {
			equal(
				input.breakTooltipsToNewLine,
				true,
				"Expected that prop breakTooltipsToNewLine is true"
			);
			notEqual(input.tooltips, undefined, "Expected that prop tooltips is not undefined");
		} else {
			equal(
				!!input.breakTooltipsToNewLine,
				false,
				"Expected that prop breakTooltipsToNewLine is falsy"
			);
			notEqual(input.tooltips, undefined, "Expected that prop tooltips is not undefined");
		}
	}
}

/** Suffixes */
export async function mountAndAssertSuffixesForTextLines<
	T extends DocumentModel.FieldType | DocumentModel.Group
>(options: {
	readonly path: EntityInstancePath;
	readonly documentElement: DocumentModel.Element;
	readonly documentElementDataType: T;
	readonly models: Models;
	readonly formModelPath: ModelPath;
	readonly suffix?: string;
	readonly component: TestComponentName;
	renderFunction(props: Inputs.InputProps<T>): ReactElement | null;
}): Promise<void> {
	const {
		path,
		documentElementDataType,
		models,
		formModelPath,
		suffix,
		component,
		renderFunction
	} = options;

	const props = createProps({
		documentElementDataType,
		documentElement: options.documentElement,
		path,
		modelElement: { suffix },
		models,
		formModelPath
	});

	const wrapper = await render({
		props,
		component,
		renderFunction
	});

	const textAffix = within(wrapper.baseElement).queryByDataRole(DataRoles.Textline.TextAffix);
	equal(textAffix?.textContent, suffix, "Expected that text-affix equals given suffix.");
}

/** truncateSuffix */
export async function mountAndAssertTruncateSuffixForTextLines<
	T extends DocumentModel.FieldType | DocumentModel.Group
>(options: {
	readonly path: EntityInstancePath;
	readonly documentElement: DocumentModel.Element;
	readonly documentElementDataType: T;
	readonly models: Models;
	readonly formModelPath: ModelPath;
	readonly truncateSuffix?: boolean;
	readonly suffix?: string;
	readonly component: TestComponentName;
	renderFunction(props: Inputs.InputProps<T>): ReactElement | null;
}): Promise<void> {
	const {
		path,
		documentElementDataType,
		models,
		formModelPath,
		suffix,
		truncateSuffix,
		component,
		renderFunction
	} = options;

	const props = createProps({
		documentElementDataType,
		documentElement: options.documentElement,
		path,
		modelElement: { suffix, truncateSuffix },
		models,
		formModelPath
	});

	const { widgetMap } = await render({
		props,
		component,
		renderFunction
	});

	const textAffix = query(widgetMap.TextAffix).maybeProps();
	equal(
		textAffix?.truncate,
		truncateSuffix,
		"Expected that prop 'truncate' of TextAffix form prop 'suffixes' equals 'truncateSuffix'."
	);
}

/** messageBox */
export async function mountComponent<
	T extends DocumentModel.FieldType | DocumentModel.Group
>(options: {
	readonly path: EntityInstancePath;
	readonly documentElement: DocumentModel.Element;
	readonly documentElementDataType: T;
	readonly models: Models;
	readonly formModelPath?: ModelPath;
	readonly validationMessages?: {
		readonly errors?: Localizable[][];
		readonly warnings?: Localizable[][];
		readonly infos?: Localizable[][];
	};
	readonly component: TestComponentName;
	readonly modelElement?: Partial<Inputs.ModelElement>;
	readonly uiId?: string;
	renderFunction(props: Inputs.InputProps<T>): ReactElement | null;
}) {
	const {
		renderFunction,
		component,
		path,
		documentElementDataType,
		models,
		formModelPath,
		validationMessages,
		modelElement,
		uiId
	} = options;

	const props = createProps({
		documentElementDataType,
		documentElement: options.documentElement,
		path,
		models,
		formModelPath,
		modelElement: modelElement || {},
		validationMessages,
		uiId
	});

	return await render({
		props,
		component,
		renderFunction
	});
}
