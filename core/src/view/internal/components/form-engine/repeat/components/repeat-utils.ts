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

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { ModelSelectors } from "../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineState } from "../../../../../../back-end/store/internal/store.js";
import { isObjectEmpty } from "../../../../../../back-end/utils/internal/guards.js";
import type { FormModel } from "../../../../../../models/index.js";
import * as DocumentModelUtils from "../../../../../../models/internal/utils/document-model-utils.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";

/**
 * @internal
 * @ignore
 */
export const RepeatUtils = {
	/** @internal */
	isFilterRowOpen(config: FormModelMap.RenderConfiguration): boolean {
		const { parentPath: repeatFormModelPath } = config;
		const repeatStaticStateEntry = UiStateSelectors.repeatStaticStateEntry(repeatFormModelPath)(
			config.renderOptions.state
		);

		return repeatStaticStateEntry !== undefined && repeatStaticStateEntry.filterRowOpen === true;
	},

	/** @internal */
	hasActiveFilters(config: FormModelMap.RenderConfiguration): boolean {
		const { parentPath: repeatFormModelPath } = config;
		const repeatStaticStateEntry = UiStateSelectors.repeatStaticStateEntry(repeatFormModelPath)(
			config.renderOptions.state
		);

		return repeatStaticStateEntry && repeatStaticStateEntry.filters
			? !isObjectEmpty(repeatStaticStateEntry.filters)
			: false;
	},

	isTableEmptyByFiltering(
		totalNumberOfRows: number,
		totalNumberOfProcessedDataRows: number,
		isRepeatWithFilterExpression: boolean,
		config: FormModelMap.RenderConfiguration
	): boolean {
		const isTableWithoutEntries = totalNumberOfRows === 0;
		const isTableFiltered = totalNumberOfProcessedDataRows === 0;

		if (isTableWithoutEntries || !isTableFiltered) {
			return false;
		}

		return isRepeatWithFilterExpression || RepeatUtils.hasActiveFilters(config);
	},

	/** @internal */
	mayAdd(repeat: FormModel.Repeat, rowCount: number, state: EngineState): boolean {
		const documentElement = DocumentModelUtils.findByPath(
			ModelSelectors.documentModel()(state),
			repeat.groupPath
		);

		if (documentElement && documentElement.type === "Group") {
			const maxRows = documentElement.repeatability;
			return repeat.enableAdd === true && rowCount < maxRows;
		}

		return true;
	},

	/** @internal */
	maxRepeatabilityReached(repeat: FormModel.Repeat, rowCount: number, state: EngineState): boolean {
		const documentElement = DocumentModelUtils.findByPath(
			ModelSelectors.documentModel()(state),
			repeat.groupPath
		);

		if (documentElement && documentElement.type === "Group") {
			const maxRows = documentElement.repeatability;
			return rowCount >= maxRows;
		}

		return false;
	},

	/** @internal */
	getRepeatability(repeat: FormModel.Repeat, documentModel: DocumentModel): number {
		const documentElement = DocumentModelUtils.findByPath(documentModel, repeat.groupPath);

		return documentElement?.type === "Group" ? documentElement.repeatability : 0;
	}
};
