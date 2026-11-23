// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Expression } from "@com.mgmtp.a12.expression/expression-core";
import { ExpressionInterpreter } from "@com.mgmtp.a12.expression/expression-core";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type ExternalEnumerationProvider from "../../back-end/services/external-enumeration-provider.js";
import { DataSelectors } from "../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../back-end/store/internal/selectors/models.js";
import type { EngineState } from "../../back-end/store/internal/store.js";
import { DocumentModelUtils } from "../../models/internal/utils/document-model-utils.js";
import { DocumentUtils } from "../../models/internal/utils/document-utils.js";
import { getValueForUI } from "../../view/internal/components/form-engine/cells/controls/getValueForUI.js";

import { getFieldTextValue } from "./field-text-value.js";

/** @internal */
export function getExpressionValue(options: {
	state: EngineState;
	document?: GroupInstance;
	converter: ValueConversion;
	localizer: Localizer;
	expressionTree: Expression.RootNode;
	dataContext?: EntityInstancePath;
	externalEnumerationProvider?: ExternalEnumerationProvider;
	noMarkup?: boolean;
}): string {
	const { dataContext, expressionTree, localizer } = options;
	const document = options.document ?? (DataSelectors.document()(options.state) as GroupInstance);
	const documentModel = ModelSelectors.documentModel()(options.state);

	return ExpressionInterpreter.format({
		rootPath: dataContext ?? [],
		documentModel,
		expressionTree,
		fieldFormatter: path => {
			const field = DocumentModelUtils.findByPath(documentModel, path);
			if (field.type === "Field") {
				const value = getValueForUI(
					options.converter,
					path,
					options.localizer,
					options.externalEnumerationProvider
				)(options.state);
				return getFieldTextValue({
					...options,
					path,
					field,
					externalEnumerationProvider: options.externalEnumerationProvider,
					value
				});
			} else {
				throw new Error("Invalid field reference in expression: " + ModelPath.toString(path));
			}
		},
		valueGetter: (path: EntityInstancePath) => {
			return DocumentUtils.getValue({ document, path });
		},
		localizer,
		noMarkup: options.noMarkup
	});
}
