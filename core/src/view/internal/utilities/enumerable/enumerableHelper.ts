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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type IExternalEnumerationProvider from "../../../../back-end/services/external-enumeration-provider.js";
import { DataSelectors } from "../../../../back-end/store/internal/selectors/data.js";
import { ModelSelectors } from "../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineState } from "../../../../back-end/store/internal/store.js";
import { getExternalEnumerationSource } from "../../../../models/internal/enumeration/getExternalEnumerationSource.js";
import type { FormModel } from "../../../../models/internal/form-model.js";
import { DocumentUtils } from "../../../../models/internal/utils/document-utils.js";
import { FormModelUtils } from "../../../../models/internal/utils/form-model-utils.js";
import { DocumentModelUtils } from "../../../../shared/internal/document-model-utils.js";
import type { FormModelMap } from "../../configuration/engine-configuration.js";

import type { EnumerationValue } from "./enumValue.js";
import { ExternalEnumHelper } from "./externalEnumHelper.js";
import { localizeAndFilterEnumerationValues } from "./localizeAndFilterEnumerationValues.js";
import { localizeEnumerationValue } from "./localizeEnumerationValue.js";

export namespace EnumerableHelper {
	/**
	 * Returns all enumeration values with their localized label that satisfy the current master value.
	 */
	export function getLocalizedDependentEnumerationValues(
		renderOptions: FormModelMap.RenderOptions,
		documentPath: EntityInstancePath,
		localizer: Localizer
	): EnumerationValue[] {
		const enumValues = getEnumerationValues(renderOptions, documentPath);
		const formModel = ModelSelectors.formModel()(renderOptions.state);
		const fce = formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(documentPath)];
		const context = documentPath.slice(0, documentPath.length - 1);
		return localizeAndFilterEnumerationValues({
			renderOptions,
			enumValues,
			modelPath: documentPath,
			context,
			localizer,
			fieldConfigurationEntry: fce
		});
	}

	/**
	 * Returns all enumeration values, with their localized label.
	 * This does not respect any dependencies restrictions.
	 */
	export function getLocalizedEnumerationValues(
		renderOptions: FormModelMap.RenderOptions,
		modelPath: ModelPath,
		localizer: Localizer
	): EnumerationValue[] {
		const enumValues = getEnumerationValues(renderOptions, modelPath);
		const context = UiStateSelectors.currentScreenLocation()(renderOptions.state).path;
		return localizeAndFilterEnumerationValues({
			renderOptions,
			enumValues,
			modelPath,
			context,
			localizer
		});
	}

	/** @internal */
	export function getEnumerationValue(options: {
		state: EngineState;
		localizer: Localizer;
		externalEnumerationProvider?: IExternalEnumerationProvider;
		model: DocumentModel;
		path: EntityInstancePath;
		fce?: FormModel.FieldConfigurationEntry;
	}): string {
		const { model, path, fce } = options;
		const field = DocumentModelUtils.findByPath(model, path);

		const documentModel = ModelSelectors.documentModel()(options.state);
		const formModel = ModelSelectors.formModel()(options.state);
		const document = DataSelectors.document()(options.state) as GroupInstance;

		if (field.type === "Field") {
			const value = DocumentUtils.getValue({ document, path });
			if (field.fieldType.type === "EnumerationType") {
				const enumerationValue = localizeEnumerationValue({
					...options,
					value: value as string,
					enumValues: field.fieldType.values,
					path,
					documentModel,
					formModel
				});
				return enumerationValue.label;
			} else if (
				fce &&
				FormModelUtils.isExternalEnum(field.fieldType, fce) &&
				fce.externalEnumeration
			) {
				return ExternalEnumHelper.getValue({
					externalEnumeration: fce?.externalEnumeration,
					localizer: options.localizer,
					path,
					value: value as string,
					externalEnumerationProvider: options.externalEnumerationProvider,
					documentModel,
					formModel
				});
			}
		}

		throw new Error("Can not resolve enumerationValue of non enumerable type!");
	}

	/** @internal */
	export function getEnumerationValues(
		options: FormModelMap.RenderOptions,
		modelPath: ModelPath
	): readonly DocumentModel.EnumValue[] {
		const documentModel = ModelSelectors.documentModel()(options.state);
		const field = DocumentModelUtils.findByPath(documentModel, modelPath);

		if (field.type === "Field" && field.fieldType.type === "EnumerationType") {
			return field.fieldType.values;
		} else {
			const map = options.config.externalEnumerationProvider(
				getExternalEnumerationSource(ModelSelectors.formModel()(options.state), modelPath) ?? ""
			);

			return ExternalEnumHelper.convertValues(map);
		}
	}

	/** @internal */
	export function isCustomValuesAllowed(
		fce?: FormModel.FieldConfigurationEntry
	): boolean | undefined {
		return fce?.externalEnumeration?.customValuesAllowed;
	}

	/** @internal */
	export function isCaseSensitive(fce?: FormModel.FieldConfigurationEntry): boolean | undefined {
		return fce?.externalEnumeration?.caseSensitive;
	}
}
