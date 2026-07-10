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

/**
 * This module contains all view related Form-Engine functionality.
 *
 * @packageDocumentation
 */ /** */
export { DefaultWidgetMap } from "./internal/configuration/DefaultWidgetMap.js";
export type { WidgetMap } from "./internal/configuration/widget-map.js";

export { DefaultSelectorMap, type SelectorMap } from "./internal/configuration/selectorContext.js";

export { AriaLevelContext } from "./internal/components/content-box/AriaLevelContext.js";
export type { AriaLevelContextType } from "./internal/components/content-box/AriaLevelContext.js";
export type { FormEngineRendererPropsType } from "./internal/components/form-engine/form-engine-props.js";
export { FormEngineRenderer } from "./internal/components/form-engine/form-engine-renderer.js";
export type { ScrollApi } from "./internal/components/scroll-api.js";
export { ScrollHandler } from "./internal/components/scroll-handler.js";
export type { ScrollHandlerProps } from "./internal/components/scroll-handler.js";
export { Suffix } from "./internal/components/widgets/form-engine/suffix.js";
export type { SuffixProps } from "./internal/components/widgets/form-engine/suffix.js";
export { Tooltips } from "./internal/components/widgets/tooltips.js";
export type { TooltipsProps } from "./internal/components/widgets/tooltips.js";
export { ValidationMessages } from "./internal/components/widgets/validationMessages.js";
export type { ValidationMessagesProps } from "./internal/components/widgets/validationMessages.js";
export {
	DefaultFormModelMap,
	defaultMapDispatchToProps,
	defaultMapStateToProps
} from "./internal/configuration/Defaults.js";
export type {
	DefaultDispatchProps,
	DefaultOwnProps,
	DefaultStateProps
} from "./internal/configuration/Defaults.js";
export type { DispatchConfiguration } from "./internal/configuration/dispatch-configuration.js";
export { DefaultRepeatButtonNames } from "./internal/configuration/engine-configuration.js";
export type {
	ClockMode,
	Config,
	EnablementByButtonName,
	EnablementByRow,
	EnablementEntry,
	FormModelMap
} from "./internal/configuration/engine-configuration.js";
export { useDocumentPathForInput } from "./internal/utilities/document-path.js";
export {
	Enablements,
	isDisabled,
	isHidden,
	isReadonly
} from "./internal/utilities/enablements/index.js";
export { EnumerableHelper } from "./internal/utilities/enumerable/enumerableHelper.js";
export type { EnumerationValue } from "./internal/utilities/enumerable/enumValue.js";
export type { Value } from "./internal/utilities/value.js";
