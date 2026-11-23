// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { NodeControllerMap } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { createStringController, Length } from "@com.mgmtp.a12.contentengine/contentengine-editor";

import { markingOfRequiredFieldsItems, messageExpositionItems } from "../dropdownItems.js";

import { createAnnotationController } from "./annotationController.js";
import { createDatePickerConfigController } from "./datePickerConfigController.js";
import { createLocalizedTextController } from "./localizedTextController.js";
import { createOptionalEnumController } from "./optionalEnumController.js";
import { createOptionalStringController } from "./optionalStringController.js";
import { createTrueController } from "./trueController.js";

/** @internal */
export const FormElementControllers: NodeControllerMap = {
	elementId: createStringController(true),
	label: createLocalizedTextController(),
	hideLabel: createTrueController(false),
	hint: createLocalizedTextController(),
	readonly: createTrueController(false),
	messageExposition: createOptionalEnumController({
		keywords: messageExpositionItems,
		numericConfigs: [],
		initialValue: { type: Length.ValueType.KEYWORD, unit: "DEFAULT" },
		defaultValue: "DEFAULT"
	}),
	tooltipsOnTop: createTrueController(false),
	markingOfRequiredFields: createOptionalEnumController({
		keywords: markingOfRequiredFieldsItems,
		numericConfigs: [],
		initialValue: { type: Length.ValueType.KEYWORD, unit: "REQUIRED" },
		defaultValue: "REQUIRED"
	}),
	annotations: createAnnotationController(),
	placeholder: createLocalizedTextController(),
	autoComplete: createOptionalStringController(),
	autoExpand: createTrueController(false),
	secret: createTrueController(false),
	suffix: createLocalizedTextController(),
	truncateSuffix: createTrueController(false),
	uncheckedLabel: createLocalizedTextController(),
	checkedLabel: createLocalizedTextController(),
	datePickerConfig: createDatePickerConfigController(),
	enableSelectAll: createTrueController(false),
	inline: createTrueController(false)
};
