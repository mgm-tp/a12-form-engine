// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { CustomFieldTypeService } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/lib/main/js/custom/impl/CustomFieldTypeService.js";
import { DocumentRtCustomExtensionService } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { DevappCustomization } from "../modules/customizationModule.js";
import { registerCustomization } from "../modules/customizationModule.js";

import { onValueSelected } from "./configurable_externalenumeration.js";
import { CustomButtonEnablementEngine } from "./custom-button-enablement.js";
import { customConditionsFactory } from "./custom-conditions.js";
import { CustomFormModelMapForCustomControl } from "./custom-control.js";
import { customFieldTypeFactory } from "./custom-field-type.js";
import {
	CustomFormModelMapForCustomInput,
	CustomWidgetMapForCustomInput
} from "./custom-input-as-widget.js";
import { CustomWidgetMap, FormModelMapForWidgetMap } from "./custom-widgets.js";
import { alertInvalidAddRowMiddleware } from "./middlewares/alertInvalidAddRowMiddleware.js";
import { navigationByEventButtonExampleMiddleware } from "./middlewares/navigationByEventButtonExampleMiddleware.js";
import { uncollapseAllSectionsMiddleware } from "./middlewares/uncollapseAllSectionsMiddleware.js";
import { writeDirtyStatesInDocumentMiddleware } from "./middlewares/writeDirtyStatesInDocumentMiddleware.js";
import { ScrollApiEngine } from "./scroll-api.js";
import { TestCustomButtonEnablementEngine } from "./test-button-enablement.js";
import { CustomFormModelMapForUnmarshallFormModelExample } from "./unmarshall-form-model-example.js";

export function registerDevappCustomizations(): void {
	const CUSTOMIZATIONS: DevappCustomization[] = [
		{
			formModelName: "buttons.customMiddleware-form",
			middlewares() {
				return [
					uncollapseAllSectionsMiddleware,
					alertInvalidAddRowMiddleware // swallows event
				];
			}
		},
		{
			formModelName: "controls.externalenumeration-form",
			middlewares() {
				return [onValueSelected];
			}
		},
		{
			formModelName: "buttons.navigation-form",
			middlewares() {
				return [navigationByEventButtonExampleMiddleware];
			}
		},
		{
			formModelName: "controls.dirty-states-form",
			middlewares() {
				return [writeDirtyStatesInDocumentMiddleware];
			}
		},
		{
			formModelName: "controls.dirty-states.earlyDetectDirtyControl-form",
			config: {
				earlyDetectDirtyControl: true
			},
			middlewares() {
				return [writeDirtyStatesInDocumentMiddleware];
			}
		},
		{
			formModelName: "customization.custom-button-enablements-form",
			FormEngineView: CustomButtonEnablementEngine
		},
		{
			formModelName: "test.custom-button-enablements-form",
			FormEngineView: TestCustomButtonEnablementEngine
		},
		{ formModelName: "customization.scroll-api-form", FormEngineView: ScrollApiEngine },
		{
			formModelName: "test.unmarshallFormModel-form",
			config: { formModelMap: CustomFormModelMapForUnmarshallFormModelExample }
		},
		{
			formModelName: "customization.custom-control-form",
			config: {
				formModelMap: CustomFormModelMapForCustomControl
			}
		},
		{
			formModelName: "customization.custom-widget-form",
			config: {
				formModelMap: FormModelMapForWidgetMap,
				widgetMap: CustomWidgetMap
			}
		},
		{
			formModelName: "customization.custom-input-form",
			config: {
				formModelMap: CustomFormModelMapForCustomInput,
				widgetMap: CustomWidgetMapForCustomInput
			}
		}
	];

	CUSTOMIZATIONS.forEach(registerCustomization);

	// There is no way to unregister. Should be no issue for other forms.
	// TODO: will be fixed with A12-16990
	// oxlint-disable-next-line typescript/no-deprecated
	DocumentRtCustomExtensionService.registerCustomConditions(customConditionsFactory);
	// TODO: will be fixed with A12-16990
	// oxlint-disable-next-line typescript/no-deprecated
	CustomFieldTypeService.getInstance().register(customFieldTypeFactory);
}
