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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Expression } from "@com.mgmtp.a12.expression/expression-core";
import { ExpressionInterpreter } from "@com.mgmtp.a12.expression/expression-core";
import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizer, ValueConversion } from "@com.mgmtp.a12.utils/utils-localization";

import type { IExternalEnumerationProvider } from "../../back-end/services/external-enumeration-provider.js";
import { DataSelectors } from "../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../back-end/store/internal/selectors/models.js";
import type { EngineState } from "../../back-end/store/internal/store.js";
import * as DocumentModelUtils from "../../models/internal/utils/document-model-utils.js";
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
	externalEnumerationProvider?: IExternalEnumerationProvider;
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
