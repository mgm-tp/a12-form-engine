// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
export { Enablements } from "./internal/utilities/enablements/index.js";
export { EnumerableHelper } from "./internal/utilities/enumerable/enumerableHelper.js";
export type { EnumerationValue } from "./internal/utilities/enumerable/enumValue.js";
export type { Value } from "./internal/utilities/value.js";
