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

import type { ReactNode } from "react";
import { Fragment } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { Expression } from "@com.mgmtp.a12.expression/expression-core";
import type { FormModel, FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core";
import { DefaultFormModelMap, ModelSelectors } from "@com.mgmtp.a12.formengine/formengine-core";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { TreeContainer, TreeNode } from "@com.mgmtp.a12.widgets/widgets-core";

export const CustomFormModelMapForUnmarshallFormModelExample = {
	...DefaultFormModelMap,
	Control: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.Control>) => {
			const formModel = ModelSelectors.formModel()(props.config.renderOptions.state);
			const documentModel = ModelSelectors.documentModel()(props.config.renderOptions.state);
			const modelElement = props.modelElement;

			const fceWithPath =
				formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(modelElement.elementPath)];

			const groupPath = modelElement.elementPath.slice(0, modelElement.elementPath.length - 1);
			const group = findByPath(documentModel, groupPath);

			const gce =
				group.type === "Group"
					? formModel.content.groupConfiguration.groupMap[ModelPath.toString(groupPath)]
					: undefined;

			const occurrence = modelElement.occurrence;

			return (
				<Fragment>
					<DefaultFormModelMap.Control.component {...props} />
					<ul>
						<li>
							{"Element Path on control: " + ModelPath.toString(props.modelElement.elementPath)}
						</li>
						{fceWithPath ? (
							<li>
								{"Element path from field config:" + ModelPath.toString(fceWithPath.elementPath)}
							</li>
						) : null}
						{fceWithPath?.dependentField ? (
							<li>
								{"Dependent on field with path" +
									ModelPath.toString(fceWithPath.dependentField.masterFieldPath)}
							</li>
						) : null}
						{gce ? (
							<li>{"Element path from group config:" + ModelPath.toString(gce.groupPath)}</li>
						) : null}
						{gce?.dependentGroup ? (
							<li>
								{"Dependent on field with path" +
									ModelPath.toString(gce.dependentGroup.masterFieldPath)}
							</li>
						) : null}
						<li>{"Occurrence: " + occurrence}</li>
					</ul>
				</Fragment>
			);
		}
	},
	FieldOverviewColumn: {
		component: (props: {
			readonly modelElement: FormModel.FieldOverviewColumn;
			readonly config: FormModelMap.RenderConfiguration;
			readonly repeat: FormModel.Repeat;
		}) => {
			const formModel = ModelSelectors.formModel()(props.config.renderOptions.state);
			const documentModel = ModelSelectors.documentModel()(props.config.renderOptions.state);
			const modelElement = props.modelElement;

			const fceWithPath =
				formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(modelElement.elementPath)];

			const groupPath = modelElement.elementPath.slice(0, modelElement.elementPath.length - 1);
			const group = findByPath(documentModel, groupPath);

			const gce =
				group.type === "Group"
					? formModel.content.groupConfiguration.groupMap[ModelPath.toString(groupPath)]
					: undefined;

			return (
				<Fragment>
					<DefaultFormModelMap.FieldOverviewColumn.component {...props} />
					<ul>
						<li>
							{"Element Path on control: " + ModelPath.toString(props.modelElement.elementPath)}
						</li>
						{fceWithPath ? (
							<li>
								{"Element path from field config:" + ModelPath.toString(fceWithPath.elementPath)}
							</li>
						) : null}
						{fceWithPath?.dependentField ? (
							<li>
								{"Dependent on field with path" +
									ModelPath.toString(fceWithPath.dependentField.masterFieldPath)}
							</li>
						) : null}
						{gce ? (
							<li>{"Element path from group config:" + ModelPath.toString(gce.groupPath)}</li>
						) : null}
						{gce?.dependentGroup ? (
							<li>
								{"Dependent on field with path" +
									ModelPath.toString(gce.dependentGroup.masterFieldPath)}
							</li>
						) : null}
					</ul>
				</Fragment>
			);
		}
	},
	Section: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.Section>) => {
			return (
				<Fragment>
					<DefaultFormModelMap.Section.component {...props} />
					{renderDependentControlInfo(props)}
				</Fragment>
			);
		}
	},
	MultiColumnSection: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.MultiColumnSection>) => {
			return (
				<Fragment>
					<DefaultFormModelMap.MultiColumnSection.component {...props} />
					{renderDependentControlInfo(props)}
				</Fragment>
			);
		}
	},
	ControlGrid: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.ControlGrid>) => {
			return (
				<Fragment>
					<DefaultFormModelMap.ControlGrid.component {...props} />
					{renderDependentControlInfo(props)}
				</Fragment>
			);
		}
	},
	InlineRepeat: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.InlineRepeat>) => {
			return (
				<Fragment>
					<DefaultFormModelMap.InlineRepeat.component {...props} />
					{renderFilterExpressionInfo(props)}
				</Fragment>
			);
		}
	},
	DetachedRepeat: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.DetachedRepeat>) => {
			return (
				<Fragment>
					<DefaultFormModelMap.DetachedRepeat.component {...props} />
					{renderFilterExpressionInfo(props)}
				</Fragment>
			);
		}
	},
	EmbeddedRepeat: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.EmbeddedRepeat>) => {
			return (
				<Fragment>
					<DefaultFormModelMap.EmbeddedRepeat.component {...props} />
					{renderFilterExpressionInfo(props)}
				</Fragment>
			);
		}
	},
	ExpressionCell: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.ExpressionCell>) => {
			return (
				<Fragment>
					<DefaultFormModelMap.ExpressionCell.component {...props} />
					{"Expression Tree:"}
					{renderExpressionInfo(props)}
				</Fragment>
			);
		}
	},
	ExpressionOverviewColumn: {
		component: (
			props: FormModelMap.FormModelComponentProps<FormModel.ExpressionOverviewColumn>
		) => {
			return (
				<Fragment>
					<DefaultFormModelMap.ExpressionOverviewColumn.component {...props} />
					{"Expression Tree:"}
					{renderExpressionInfo(props)}
				</Fragment>
			);
		}
	}
};

function renderFilterExpressionInfo(
	props: FormModelMap.FormModelComponentProps<
		FormModel.InlineRepeat | FormModel.DetachedRepeat | FormModel.EmbeddedRepeat
	>
): ReactNode {
	const filterExpressionTree = props.modelElement.filterExpressionTree;
	const context = filterExpressionTree?.context.name;
	const operation = filterExpressionTree?.operation;
	return filterExpressionTree
		? `Filter expression: ${context} ${operation} ${filterExpressionTree.content}`
		: null;
}

function renderExpressionInfo(
	props: FormModelMap.FormModelComponentProps<
		FormModel.ExpressionOverviewColumn | FormModel.ExpressionCell
	>
): ReactNode {
	const expressionTree = props.modelElement.expressionTree;
	return (
		<TreeContainer style={{ width: "200px" }}>
			<TreeNode label={expressionTree.type} level={0}>
				{expressionTree.children.map((e, i) => {
					return renderTreeNode(1, e, i);
				})}
			</TreeNode>
		</TreeContainer>
	);
}

function renderTreeNode(level: number, node: Expression.ChildNode, index: number): ReactNode {
	return (
		<TreeNode
			key={index}
			level={level}
			label={
				node.type === Expression.NodeType.FIELD ||
				node.type === Expression.NodeType.TOKEN ||
				node.type === Expression.NodeType.GROUP
					? node.name + " ( type: " + node.type + ")"
					: node.type === "string"
						? node.content + " ( type: " + node.type + ")"
						: ""
			}
		>
			{node.type === Expression.NodeType.GROUP
				? node.children.map((e, i) => {
						return renderTreeNode(level + 1, e, i);
					})
				: null}
		</TreeNode>
	);
}

function renderDependentControlInfo(
	props: FormModelMap.FormModelComponentProps<
		FormModel.Section | FormModel.ControlGrid | FormModel.MultiColumnSection
	>
): ReactNode {
	const formModel = ModelSelectors.formModel()(props.config.renderOptions.state);
	const dependentScreenElementEntry =
		formModel.content.dependentScreenElements[props.modelElement.id];

	const entries =
		dependentScreenElementEntry && Object.entries(dependentScreenElementEntry.controls);

	return entries ? (
		<ul>
			{entries.map(([, master], idx) => {
				return (
					<li key={idx}>
						{"Dependent on field with path: " + ModelPath.toString(master?.elementPath ?? [])}
					</li>
				);
			})}
		</ul>
	) : null;
}

function findByPath(documentModel: DocumentModel, targetPath: ModelPath): DocumentModel.Element {
	if (targetPath.length === 0) {
		return documentModel.content.modelRoot;
	}

	const element = new DocumentServiceFactory()
		.getDocumentModelSearchService(documentModel)
		.getByPath(targetPath);

	if (element === undefined) {
		throw new Error(`Invalid path: ${ModelPath.toString(targetPath)}`);
	}

	return element;
}
