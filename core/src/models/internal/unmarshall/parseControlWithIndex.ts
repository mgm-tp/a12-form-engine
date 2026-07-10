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
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { DeepMutable, Mutable } from "../../../back-end/utils/internal/types.js";

import type { FormModel } from "../form-model.js";
import { computeGranularity, findByPath } from "../utils/document-model-utils.js";
import { IndexedControl } from "../utils/document-utils.js";
import { ModelWalker } from "../utils/form-model-walker.js";
import type { ModelVisitor, VisitProcess } from "../utils/form-model-walker.js";
import type { ReadonlyObjectMap } from "../utils/json.js";

import type { ValueParser } from "./unmarshallFormModel.js";

class Visitor implements ModelVisitor {
	private readonly contextWithInitialValues: ReadonlyObjectMap<true>;
	private readonly formModel: DeepMutable<FormModel>;
	private readonly documentModel: DocumentModel;
	private readonly valueParser: ValueParser;

	constructor(
		formModel: DeepMutable<FormModel>,
		documentModel: DocumentModel,
		valueParser: ValueParser
	) {
		this.formModel = formModel;
		this.documentModel = documentModel;
		this.valueParser = valueParser;
		this.contextWithInitialValues = this.buildContextWithInitialValues();
	}

	visitControl(control: Mutable<FormModel.Control>): VisitProcess {
		const context: Mutable<FormModel.ControlIndex> | undefined = control.index;
		if (context === undefined) {
			return "ContinueTraversal";
		}

		const contextElementPath = computeGranularity(this.documentModel, control.elementPath);

		this.setTypedValue(context, contextElementPath);
		this.setGroupConfigurationContextInformation(context, contextElementPath);

		return "ContinueTraversal";
	}

	private setTypedValue(
		context: Mutable<FormModel.ControlIndex>,
		contextElementPath: ModelPath
	): void {
		if (context.type === "NUMERIC") {
			context.typedValue = Number(context.value);
		} else {
			const indexField = IndexedControl.getSemanticIndexField(
				this.documentModel,
				contextElementPath
			);
			if (indexField === undefined) {
				throw Error(`Cannot find index field of ${ModelPath.toString(contextElementPath)}.`);
			}

			context.typedValue = this.valueParser(
				[...contextElementPath, { elementName: indexField.name }],
				context.value
			);
		}
	}

	private setGroupConfigurationContextInformation(
		context: Mutable<FormModel.ControlIndex>,
		contextElementPath: ModelPath
	): void {
		if (!this.contextWithInitialValues[ModelPath.toString(contextElementPath)]) {
			return;
		}

		const contextContext = computeGranularity(
			this.documentModel,
			contextElementPath.slice(0, contextElementPath.length - 1)
		);

		const identifier = ModelPath.toString(contextContext);
		let config = this.formModel.content.groupConfiguration.groupMap[identifier];

		if (config === undefined) {
			const contextContextGroup = findByPath(this.documentModel, contextContext);

			config = {
				groupPath: contextContext,
				groupRef: contextContextGroup.id,
				indicesOfControlsOfNestedGroups: []
			};

			this.formModel.content.groupConfiguration.groupMap[identifier] = config;
		}

		config.indicesOfControlsOfNestedGroups ??= [];

		let entry = config.indicesOfControlsOfNestedGroups.find(({ groupPath }) =>
			ModelPath.equal(groupPath, contextElementPath)
		);

		if (entry === undefined) {
			entry = {
				groupPath: contextElementPath,
				semantic: [],
				numeric: []
			};
			config.indicesOfControlsOfNestedGroups.push(entry);
		}

		if (context.type === "NUMERIC" && !entry.numeric.includes(context.typedValue)) {
			entry.numeric.push(context.typedValue);
		} else if (context.type === "SEMANTIC" && !entry.semantic.includes(context.typedValue)) {
			entry.semantic.push(context.typedValue);
		}
	}

	private buildContextWithInitialValues(): ReadonlyObjectMap<true> {
		return (
			this.formModel.content.fieldConfiguration.field
				?.filter(({ initialValue }) => initialValue !== undefined)
				.map(({ elementPath }) => computeGranularity(this.documentModel, elementPath))
				.reduce((acc, cur) => ({ ...acc, [ModelPath.toString(cur)]: true }), {}) || {}
		);
	}
}

export function parseControlWithIndex(
	formModel: FormModel,
	documentModel: DocumentModel,
	valueParser: ValueParser
): void {
	new ModelWalker(
		new Visitor(formModel as DeepMutable<FormModel>, documentModel, valueParser)
	).acceptModel(formModel);
}
