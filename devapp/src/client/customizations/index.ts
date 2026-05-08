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
	// eslint-disable-next-line @typescript-eslint/no-deprecated
	DocumentRtCustomExtensionService.registerCustomConditions(customConditionsFactory);
	// TODO: will be fixed with A12-16990
	// eslint-disable-next-line @typescript-eslint/no-deprecated
	CustomFieldTypeService.getInstance().register(customFieldTypeFactory);
}
