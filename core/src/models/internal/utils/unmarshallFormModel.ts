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
import type { Expression } from "@com.mgmtp.a12.expression/expression-core";
import { ExpressionBuilder } from "@com.mgmtp.a12.expression/expression-core";
import type {
	DocumentModel,
	DocumentModelSearchService,
	FieldInstanceValue
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";
import { defaultValueConversion } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { DeepMutable, Mutable } from "../../../back-end/utils/internal/types.js";

import { FormModel } from "../form-model.js";
import * as RepeatExpressionFilter from "../jison/repeatfilter.cjs";

import { addConditionallyHiddenElementsMap } from "./addConditionallyHiddenElementsMap.js";
import { DocumentModelUtils } from "./document-model-utils.js";
import { IndexedControl } from "./document-utils.js";
import type { ModelVisitor } from "./form-model-walker.js";
import { ModelWalker, VisitProcess } from "./form-model-walker.js";
import type { ReadonlyObjectMap } from "./json.js";

/**
 * Parser for UI values, which receives a document model path and the value which should be parsed.
 */
export type ValueParser = (path: ModelPath, uiValue: string) => FieldInstanceValue;

/** Create a Kernel generated code based value parser for UI values. */
export const defaultValueParser: (documentModel: DocumentModel) => ValueParser = documentModel => {
	// note: this is the expected format for values inside of the form model, e.g. initial values & dependent field values
	// it must be consistent with the FMM validation for these values
	const defaultConversion = defaultValueConversion({
		decimalSeparator: ".",
		dateFragmentOrdering: "YEAR_MONTH_DAY",
		dateSeparator: "-",
		dateZeroOptional: false,
		dateTimeFormat: "yyyy-MM-dd'T'HH:mm:ss",
		dateRangeSeparator: "/",
		timeFormat: "HH:mm:ss",
		falseValue: "false",
		trueValue: "true",
		decimalPlacesOptional: false
	});

	return (path, uiValue) => {
		if (uiValue === "") {
			return null;
		}
		const field = DocumentModelUtils.findByPath(documentModel, path);
		if (field.type === "Field") {
			const conversionConfig = DocumentModelUtils.conversionConfig(documentModel, path);
			return defaultConversion.parseValue(uiValue, conversionConfig).value ?? null;
		}
		return uiValue;
	};
};

// Note: Keep this function free from Kernel validation code. Instead, use an abstraction like ValueParser
/**
 * Add runtime properties to the given formModelJson.
 *
 * Warning: This function changes the given Json object.
 *
 * @param formModelJson The JSON to unmarshall - warning: is changed in-place
 * @param documentModel The document model used by the form model
 * @param valueParser Function to parse field values stored inside the form model
 */
export function unmarshallFormModel(
	formModelJson: object,
	documentModel: DocumentModel,
	valueParser: ValueParser
): FormModel {
	if (!FormModel.isInstance(formModelJson, true)) {
		throw new Error("Json is no valid FormModel!");
	}

	const runTimeFormModel = formModelJson;

	const documentModelSearchService = new DocumentServiceFactory().getDocumentModelSearchService(
		documentModel
	);

	// This function has to be called before the others, because the paths are needed
	Path.add(runTimeFormModel, documentModelSearchService);

	Configuration.generateConfigurationMaps(runTimeFormModel, valueParser);
	DependentControls.getDependentScreenElementMap(runTimeFormModel, documentModel);
	addConditionallyHiddenElementsMap(runTimeFormModel, documentModel, documentModelSearchService);
	Occurrences.count(runTimeFormModel);
	A12Expressions.parse(runTimeFormModel, valueParser, documentModel);
	ControlsWithIndex.parse(runTimeFormModel, documentModel, valueParser);

	return runTimeFormModel;
}

/** @internal */
namespace Path {
	/** @internal */
	export function add(formModel: FormModel, dmSearchService: DocumentModelSearchService): void {
		addPathToContent(formModel, dmSearchService);
		addPathToControls(formModel, dmSearchService);
		addPathToFieldConfiguration(formModel, dmSearchService);
		addPathToGroupConfiguration(formModel, dmSearchService);
	}

	/** @internal */
	function addPathToContent(
		formModel: FormModel,
		dmSearchService: DocumentModelSearchService
	): void {
		const mutableModel = formModel as DeepMutable<FormModel>;
		if (mutableModel.content.amountSuffix?.type !== "dynamic") {
			return;
		}

		const elementPath = dmSearchService.getPathById(mutableModel.content.amountSuffix.fieldRef);
		if (elementPath) {
			mutableModel.content.amountSuffixFieldPath = elementPath;
		}
	}

	/** @internal */
	function addPathToControls(
		formModel: FormModel,
		dmSearchService: DocumentModelSearchService
	): void {
		const visitor: ModelVisitor = {
			visitControl(control: Mutable<FormModel.Control>): VisitProcess {
				const elementPath = dmSearchService.getPathById(control.elementRef);
				if (elementPath) {
					control.elementPath = elementPath;
				}
				return VisitProcess.ContinueTraversal;
			},
			visitRepeatOverviewColumn(
				repeatColumn: Mutable<FormModel.RepeatOverviewColumn>
			): VisitProcess {
				if (repeatColumn.type === "FieldBasedRepeatOverviewColumn") {
					const elementPath = dmSearchService.getPathById(repeatColumn.elementRef);

					if (elementPath) {
						repeatColumn.elementPath = elementPath;
					}
				}
				return VisitProcess.ContinueTraversal;
			},
			visitInlineRepeat(repeat: Mutable<FormModel.InlineRepeat>): VisitProcess {
				const elementPath = dmSearchService.getPathById(repeat.groupRef);
				if (elementPath) {
					repeat.groupPath = elementPath;
				}

				if (repeat.multiFileUploadOptions) {
					const attachmentPath = dmSearchService.getPathById(
						repeat.multiFileUploadOptions.elementRef
					);
					if (attachmentPath) {
						repeat.multiFileUploadOptions = {
							...repeat.multiFileUploadOptions,
							elementPath: attachmentPath
						};
					}
				}

				return VisitProcess.ContinueTraversal;
			},
			visitDetachedRepeat(repeat: Mutable<FormModel.DetachedRepeat>): VisitProcess {
				const elementPath = dmSearchService.getPathById(repeat.groupRef);
				if (elementPath) {
					repeat.groupPath = elementPath;
				}
				return VisitProcess.ContinueTraversal;
			},
			visitEmbeddedRepeat(repeat: Mutable<FormModel.EmbeddedRepeat>): VisitProcess {
				const elementPath = dmSearchService.getPathById(repeat.groupRef);
				if (elementPath) {
					repeat.groupPath = elementPath;
				}

				if (repeat.multiFileUploadOptions) {
					const attachmentPath = dmSearchService.getPathById(
						repeat.multiFileUploadOptions.elementRef
					);
					if (attachmentPath) {
						repeat.multiFileUploadOptions = {
							...repeat.multiFileUploadOptions,
							elementPath: attachmentPath
						};
					}
				}

				return VisitProcess.ContinueTraversal;
			}
		};
		new ModelWalker(visitor).acceptModel(formModel);
	}

	/** @internal */
	function addPathToFieldConfiguration(
		formModel: FormModel,
		dmSearchService: DocumentModelSearchService
	): void {
		const mutableModel = formModel as DeepMutable<FormModel>;
		if (mutableModel.content.fieldConfiguration.field === undefined) {
			return;
		}

		for (const fc of mutableModel.content.fieldConfiguration.field) {
			const elementPath = dmSearchService.getPathById(fc.elementRef);
			if (elementPath) {
				fc.elementPath = elementPath;
			}

			if (fc.dependentEnumeration) {
				const elementPath = dmSearchService.getPathById(fc.dependentEnumeration.masterField);

				if (elementPath) {
					fc.dependentEnumeration.masterFieldPath = elementPath;
				}
			}
			if (fc.dependentField) {
				const elementPath = dmSearchService.getPathById(fc.dependentField.masterField);

				if (elementPath) {
					fc.dependentField.masterFieldPath = elementPath;
				}

				for (const caze of fc.dependentField.case) {
					if (caze.fieldRef) {
						caze.fieldPath = dmSearchService.getPathById(caze.fieldRef);
					}
				}
			}
		}
	}

	/** @internal */
	function addPathToGroupConfiguration(
		formModel: FormModel,
		dmSearchService: DocumentModelSearchService
	): void {
		const mutableModel = formModel as DeepMutable<FormModel>;
		if (mutableModel.content.groupConfiguration.group === undefined) {
			return;
		}

		for (const gc of mutableModel.content.groupConfiguration.group) {
			const elementPath = dmSearchService.getPathById(gc.groupRef);
			if (elementPath) {
				gc.groupPath = elementPath;
			}
			if (gc.dependentGroup) {
				const masterFieldPath = dmSearchService.getPathById(gc.dependentGroup.masterField);
				if (masterFieldPath) {
					gc.dependentGroup.masterFieldPath = masterFieldPath;
				}
			}
		}
	}
}

/** @internal */
namespace Configuration {
	/** @internal */
	export function generateConfigurationMaps(formModel: FormModel, valueParser: ValueParser): void {
		const mutableFormModel = formModel as DeepMutable<FormModel>;
		generateFieldConfigurationMap(mutableFormModel);
		generateGroupConfigurationMap(mutableFormModel);
		parseInitialValues(mutableFormModel, valueParser);
		parseDependentFieldsValues(mutableFormModel, valueParser);
		parseDependentFieldsMasterValues(mutableFormModel, valueParser);
		parseDependentGroupsMasterValues(mutableFormModel, valueParser);
	}

	/** @internal */
	function parseInitialValues(formModel: DeepMutable<FormModel>, valueParser: ValueParser): void {
		for (const fce of formModel.content.fieldConfiguration.field || []) {
			if (fce.initialValue !== undefined) {
				fce.initialValueTyped = valueParser(fce.elementPath, fce.initialValue);
			}
		}
	}

	/** @internal */
	function generateFieldConfigurationMap(formModel: DeepMutable<FormModel>): void {
		const fieldConfiguration = formModel.content.fieldConfiguration;
		fieldConfiguration.fieldMap = {};
		if (fieldConfiguration.field === undefined) {
			return;
		}

		for (const entry of fieldConfiguration.field) {
			fieldConfiguration.fieldMap[ModelPath.toString(entry.elementPath)] = entry;
		}
	}

	/** @internal */
	function parseDependentFieldsValues(
		formModel: DeepMutable<FormModel>,
		valueParser: ValueParser
	): void {
		for (const fce of formModel.content.fieldConfiguration.field || []) {
			if (fce.dependentField) {
				parseDependentFieldValues(fce.elementPath, fce.dependentField, valueParser);
			}
		}
	}

	/** @internal */
	function parseDependentFieldValues(
		fieldRef: ModelPath,
		depField: DeepMutable<FormModel.DependentField>,
		valueParser: ValueParser
	): void {
		for (const caze of depField.case) {
			if (caze.value !== undefined) {
				caze.valueTyped = valueParser(fieldRef, caze.value);
			}
		}
	}

	/** @internal */
	function parseDependentFieldsMasterValues(
		formModel: DeepMutable<FormModel>,
		valueParser: ValueParser
	): void {
		for (const fce of formModel.content.fieldConfiguration.field || []) {
			if (fce.dependentField) {
				parseMasterFieldValue(fce.dependentField, valueParser);
			}
		}
	}

	/** @internal */
	function parseMasterFieldValue(
		depField: DeepMutable<FormModel.DependentField>,
		valueParser: ValueParser
	): void {
		for (const caze of depField.case) {
			if (caze.masterValue !== undefined) {
				caze.masterValueTyped =
					caze.masterValue !== null
						? valueParser(depField.masterFieldPath, caze.masterValue)
						: null;
			}
		}
	}

	/** @internal */
	function parseDependentGroupsMasterValues(
		formModel: DeepMutable<FormModel>,
		valueParser: ValueParser
	): void {
		for (const fce of formModel.content.groupConfiguration.group || []) {
			if (fce.dependentGroup) {
				parseMasterGroupValue(fce.dependentGroup, valueParser);
			}
		}
	}

	/** @internal */
	function parseMasterGroupValue(
		depField: DeepMutable<FormModel.DependentGroup>,
		valueParser: ValueParser
	): void {
		for (const caze of depField.case) {
			if (caze.masterValue !== undefined) {
				caze.masterValueTyped =
					caze.masterValue !== null
						? valueParser(depField.masterFieldPath, caze.masterValue)
						: null;
			}
		}
	}

	/** @internal */
	function generateGroupConfigurationMap(formModel: DeepMutable<FormModel>): void {
		const groupConfiguration = formModel.content.groupConfiguration;
		groupConfiguration.groupMap = {};
		if (groupConfiguration.group === undefined) {
			return;
		}

		for (const entry of groupConfiguration.group) {
			groupConfiguration.groupMap[ModelPath.toString(entry.groupPath)] = entry;
		}
	}
}

namespace DependentControls {
	export function getDependentScreenElementMap(
		formModel: FormModel,
		documentModel: DocumentModel
	): void {
		const dependentScreenElements: {
			[key: string]: Mutable<{
				controls: {
					[key: string]: Mutable<FormModel.DependentControlMaster>;
				};
			}>;
		} = {};

		const visitor: ModelVisitor = {
			visitControl(control: FormModel.Control): VisitProcess {
				if (control.dependentControls === undefined) {
					return VisitProcess.ContinueTraversal;
				}

				const element = DocumentModelUtils.findByPath(documentModel, control.elementPath);

				for (const screenElement of control.dependentControls.screenElement) {
					dependentScreenElements[screenElement.idref] ??= { controls: {} };

					const dependentScreenElement = dependentScreenElements[screenElement.idref];

					if (dependentScreenElement.controls[control.id] === undefined) {
						dependentScreenElements[screenElement.idref].controls[control.id] = {
							elementPath: control.elementPath,
							controlIndex: control.index,
							values: []
						};
					}

					const value =
						element.type === "Field" && element.fieldType.type === "BooleanType"
							? screenElement.masterValue === "true"
								? true
								: screenElement.masterValue === "false"
									? false
									: null
							: element.type === "Field" && element.fieldType.type === "ConfirmType"
								? screenElement.masterValue === "true" || null
								: screenElement.masterValue || null;

					dependentScreenElement.controls[control.id]?.values.push(value);
				}

				return VisitProcess.ContinueTraversal;
			}
		};
		new ModelWalker(visitor).acceptModel(formModel);

		const mutableFormModel = formModel as DeepMutable<FormModel>;
		mutableFormModel.content.dependentScreenElements = dependentScreenElements;
	}
}

namespace Occurrences {
	export function count(formModel: FormModel): void {
		const occurrences: { [elementRef: string]: number | undefined } = {};

		const visitor: ModelVisitor = {
			visitControl(control) {
				const mutableCtrl = control as Mutable<FormModel.Control>;
				const currentOccurrence = occurrences[control.elementRef] || 0;
				const newOccurrence = currentOccurrence + 1;
				occurrences[control.elementRef] = newOccurrence;
				mutableCtrl.occurrence = newOccurrence;
				return VisitProcess.ContinueTraversal;
			}
		};
		new ModelWalker(visitor).acceptModel(formModel);
	}
}

/** @internal */
namespace A12Expressions {
	class Visitor implements ModelVisitor {
		private elementStack: object[] = [];

		constructor(
			private readonly valueParser: ValueParser,
			private readonly documentModel: DocumentModel
		) {}

		getDetachedRepeatDataContext(): ModelPath {
			// the element stack is shortened by the last element since it can never be the DR that sets
			// the data context for an element
			// even for DR themselves, the data context is given by their last ancestor DR (or the root)
			return (
				[...this.elementStack.slice(0, -1)].reverse().find(FormModel.DetachedRepeat.isInstance)
					?.groupPath ?? []
			);
		}

		getDetachedOrEmbeddedRepeatDataContext(): ModelPath {
			return (
				[...this.elementStack]
					.reverse()
					.find(
						element =>
							FormModel.DetachedRepeat.isInstance(element) ||
							FormModel.EmbeddedRepeat.isInstance(element)
					)?.groupPath ?? []
			);
		}

		enter(path: object[]): void {
			this.elementStack = path;
		}

		visitContent(content: Mutable<FormModel.Content>): VisitProcess {
			if (content.subtitle?.type === "Expression") {
				content.subtitle = this.parseLabel(content.subtitle);
			}
			return VisitProcess.ContinueTraversal;
		}

		visitControlGrid(grid: Mutable<FormModel.ControlGrid>): VisitProcess {
			if (grid.title?.type === "Expression") {
				const dataContext = this.getDetachedOrEmbeddedRepeatDataContext();
				grid.title = this.parseLabel(grid.title, dataContext);
			}
			return VisitProcess.ContinueTraversal;
		}

		visitButton(button: Mutable<FormModel.ButtonType>): VisitProcess {
			if (button.buttonStyling?.label?.type === "Expression") {
				const dataContext = this.getDetachedRepeatDataContext();
				const newButtonStyling = button.buttonStyling as Mutable<FormModel.ButtonStyling>;
				newButtonStyling.label = this.parseLabel(button.buttonStyling.label, dataContext);
				button.buttonStyling = newButtonStyling;
			}
			return VisitProcess.ContinueTraversal;
		}

		visitButtonPanel(panel: Mutable<FormModel.ButtonPanel>): VisitProcess {
			if (panel.title?.type === "Expression") {
				const dataContext = this.getDetachedRepeatDataContext();
				panel.title = this.parseLabel(panel.title, dataContext);
			}
			return VisitProcess.ContinueTraversal;
		}

		visitControl(control: Mutable<FormModel.Control>): VisitProcess {
			if (control.label?.type === "Expression") {
				const dataContext = DocumentModelUtils.computeGranularity(
					this.documentModel,
					control.elementPath
				);
				control.label = this.parseLabel(control.label, dataContext);
			}
			return VisitProcess.ContinueTraversal;
		}

		visitMultiColumnSection(section: Mutable<FormModel.MultiColumnSection>): VisitProcess {
			if (section.title?.type === "Expression") {
				const dataContext = this.getDetachedRepeatDataContext();
				section.title = this.parseLabel(section.title, dataContext);
			}
			return VisitProcess.ContinueTraversal;
		}

		visitSection(section: Mutable<FormModel.Section>): VisitProcess {
			if (section.title?.type === "Expression") {
				const dataContext = this.getDetachedRepeatDataContext();
				section.title = this.parseLabel(section.title, dataContext);
			}
			return VisitProcess.ContinueTraversal;
		}

		visitCustomScreenElement(
			customScreenElement: Mutable<FormModel.CustomScreenElement>
		): VisitProcess {
			if (customScreenElement.title?.type === "Expression") {
				const dataContext = this.getDetachedRepeatDataContext();
				customScreenElement.title = this.parseLabel(customScreenElement.title, dataContext);
			}
			return VisitProcess.ContinueTraversal;
		}

		visitRow(row: Mutable<FormModel.Row>): VisitProcess {
			if (row.title?.type === "Expression") {
				const dataContext = this.getDetachedOrEmbeddedRepeatDataContext();
				row.title = this.parseLabel(row.title, dataContext);
			}
			return VisitProcess.ContinueTraversal;
		}

		visitScreen(screen: Mutable<FormModel.Screen>): VisitProcess {
			if (screen.title?.type === "Expression") {
				const dataContext = this.getDetachedRepeatDataContext();
				screen.title = this.parseLabel(screen.title, dataContext);
			}
			return VisitProcess.ContinueTraversal;
		}

		visitFieldConfigurationEntry(fce: Mutable<FormModel.FieldConfigurationEntry>): VisitProcess {
			if (fce.label?.type === "Expression") {
				const groupPath = DocumentModelUtils.computeGranularity(
					this.documentModel,
					fce.elementPath
				);
				fce.label = this.parseLabel(fce.label, groupPath);
			}
			return VisitProcess.ContinueButDoNotGoDeeper;
		}

		visitRowAction(action: Mutable<FormModel.RowAction>): VisitProcess {
			if (
				action.buttonStyling?.label?.type === "Expression" &&
				action.buttonStyling?.label?.expressionText
			) {
				const repeat = this.elementStack[this.elementStack.length - 1];
				if (!FormModel.Repeat.isInstance(repeat)) {
					throw new Error("Missing parent repeat of overview column");
				}

				const expressionTree = this.parseExpression(
					action.buttonStyling.label.expressionText,
					repeat.groupPath
				);
				const newLabel = {
					...action.buttonStyling.label,
					expressionTree
				};
				const newButtonStyling = action.buttonStyling as Mutable<FormModel.ButtonStyling>;
				newButtonStyling.label = newLabel;
				action.buttonStyling = newButtonStyling;
			}
			return VisitProcess.ContinueTraversal;
		}

		visitRepeatOverviewColumn(
			overviewColumn: Mutable<FormModel.RepeatOverviewColumn>
		): VisitProcess {
			if (overviewColumn.type === "ExpressionRepeatOverviewColumn") {
				const repeat = this.elementStack[this.elementStack.length - 2];
				if (!FormModel.Repeat.isInstance(repeat)) {
					throw new Error("Missing parent repeat of overview column");
				}

				const expressionTree = this.parseExpression(overviewColumn.expression, repeat.groupPath);
				overviewColumn.expressionTree = expressionTree;
			}

			if (overviewColumn.label?.type === "Expression" && overviewColumn.label?.expressionText) {
				// here we slice the stack in order to skip the repeat that contains this column in the search for the data context
				const dataContext =
					[...this.elementStack.slice(0, -2)].reverse().find(FormModel.DetachedRepeat.isInstance)
						?.groupPath ?? [];

				const expressionTree = this.parseExpression(
					overviewColumn.label.expressionText,
					dataContext
				);
				overviewColumn.label = {
					...overviewColumn.label,
					expressionTree
				};
			}

			return VisitProcess.ContinueTraversal;
		}

		visitExpressionCell(expressionCell: Mutable<FormModel.ExpressionCell>): VisitProcess {
			const dataContext = this.getDetachedOrEmbeddedRepeatDataContext();

			expressionCell.expressionTree = this.parseExpression(expressionCell.expression, dataContext);

			if (expressionCell.label?.type === "Expression") {
				expressionCell.label = this.parseLabel(expressionCell.label, dataContext);
			}

			return VisitProcess.ContinueTraversal;
		}

		visitDetachedRepeat(repeat: Mutable<FormModel.DetachedRepeat>): VisitProcess {
			repeat.filterExpressionTree = this.parseFilterExpression(repeat);

			if (repeat.title?.type === "Expression" && repeat.title?.expressionText) {
				const dataContext = this.getDetachedRepeatDataContext();
				repeat.title = {
					...repeat.title,
					expressionTree: this.parseExpression(repeat.title.expressionText, dataContext)
				};
			}

			return VisitProcess.ContinueTraversal;
		}

		visitInlineRepeat(repeat: Mutable<FormModel.InlineRepeat>): VisitProcess {
			repeat.filterExpressionTree = this.parseFilterExpression(repeat);

			if (repeat.title?.type === "Expression" && repeat.title?.expressionText) {
				const dataContext = this.getDetachedRepeatDataContext();
				repeat.title = {
					...repeat.title,
					expressionTree: this.parseExpression(repeat.title.expressionText, dataContext)
				};
			}

			return VisitProcess.ContinueTraversal;
		}

		visitEmbeddedRepeat(repeat: Mutable<FormModel.EmbeddedRepeat>): VisitProcess {
			repeat.filterExpressionTree = this.parseFilterExpression(repeat);

			if (repeat.title?.type === "Expression" && repeat.title?.expressionText) {
				const dataContext = this.getDetachedRepeatDataContext();
				repeat.title = {
					...repeat.title,
					expressionTree: this.parseExpression(repeat.title.expressionText, dataContext)
				};
			}

			return VisitProcess.ContinueTraversal;
		}

		private parseLabel(
			label: FormModel.ExpressionLabel,
			groupPath?: ModelPath
		): FormModel.ExpressionLabel {
			if (label.expressionText) {
				return {
					...label,
					expressionTree: this.parseExpression(label.expressionText, groupPath)
				};
			}
			return label;
		}

		private parseFilterExpression(
			repeat: FormModel.Repeat
		): RepeatExpressionFilter.ParsedFilterNode | undefined {
			if (repeat.filterExpression === undefined) {
				return undefined;
			}
			try {
				const expression = RepeatExpressionFilter.parse(repeat.filterExpression);
				const fieldPath = repeat.groupPath.concat(
					this.findFilterExpressionPath(expression.context, [])
				);
				return {
					...expression,
					content: this.valueParser(fieldPath, expression.content)
				};
			} catch (e) {
				const errorMessage = e instanceof Error ? `\n${e.message}` : "";
				throw new Error(
					`Filter expression is not parsable:\n${repeat.filterExpression}${errorMessage}`
				);
			}
		}

		private findFilterExpressionPath(
			node: RepeatExpressionFilter.Node,
			parentPath: ModelPath
		): ModelPath {
			if (node.type === "field" || node.type === "group") {
				const elementPath = [...parentPath, { elementName: node.name }];
				return node.type === "field"
					? elementPath
					: this.findFilterExpressionPath(node.context, elementPath);
			} else {
				throw new Error("unknown node type " + node.type);
			}
		}

		private parseExpression(
			expressionText: string,
			rootPath: ModelPath | undefined
		): Expression.RootNode {
			return ExpressionBuilder.build(expressionText, {
				rootPath: rootPath ?? [],
				valueParser: this.valueParser
			});
		}
	}

	export function parse(
		formModel: FormModel,
		valueParser: ValueParser,
		documentModel: DocumentModel
	): void {
		new ModelWalker(new Visitor(valueParser, documentModel)).acceptModel(formModel);
	}
}

namespace ControlsWithIndex {
	class Visitor implements ModelVisitor {
		private readonly contextWithInitialValues: ReadonlyObjectMap<true>;

		constructor(
			private readonly formModel: DeepMutable<FormModel>,
			private readonly documentModel: DocumentModel,
			private readonly valueParser: ValueParser
		) {
			this.contextWithInitialValues = this.buildContextWithInitialValues();
		}

		visitControl(control: Mutable<FormModel.Control>): VisitProcess {
			const context: Mutable<FormModel.ControlIndex> | undefined = control.index;
			if (context === undefined) {
				return VisitProcess.ContinueTraversal;
			}

			const contextElementPath = DocumentModelUtils.computeGranularity(
				this.documentModel,
				control.elementPath
			);

			this.setTypedValue(context, contextElementPath);
			this.setGroupConfigurationContextInformation(context, contextElementPath);

			return VisitProcess.ContinueTraversal;
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

			const contextContext = DocumentModelUtils.computeGranularity(
				this.documentModel,
				contextElementPath.slice(0, contextElementPath.length - 1)
			);

			const identifier = ModelPath.toString(contextContext);
			let config = this.formModel.content.groupConfiguration.groupMap[identifier];

			if (config === undefined) {
				const contextContextGroup = DocumentModelUtils.findByPath(
					this.documentModel,
					contextContext
				);

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
					.map(({ elementPath }) =>
						DocumentModelUtils.computeGranularity(this.documentModel, elementPath)
					)
					.reduce((acc, cur) => ({ ...acc, [ModelPath.toString(cur)]: true }), {}) || {}
			);
		}
	}

	export function parse(
		formModel: FormModel,
		documentModel: DocumentModel,
		valueParser: ValueParser
	): void {
		new ModelWalker(
			new Visitor(formModel as DeepMutable<FormModel>, documentModel, valueParser)
		).acceptModel(formModel);
	}
}
