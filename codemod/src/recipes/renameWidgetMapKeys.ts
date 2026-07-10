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

import type {
	BindingElement,
	Identifier,
	NoSubstitutionTemplateLiteral,
	PropertyAssignment,
	StringLiteral,
	Type,
	TypeChecker
} from "ts-morph";
import { Node, SyntaxKind } from "ts-morph";

import type { Recipe } from "@com.mgmtp.a12.devtools/codemod";

const TARGET_TYPE_NAME = "WidgetMap";

const RENAMES: Readonly<Record<string, string>> = {
	Header: "DateTimePickerHeader",
	TextLineStateless: "TextField",
	MultiSelect: "Multiselect",
	SizeContainer: "LayoutGrid",
	SizeContainerRow: "LayoutGridRow",
	SizeContainerColumn: "LayoutGridColumn",
	NotificationArea: "ContentBoxNotificationArea",
	MobileValidationBar: "MobileValidation",
	MobileValidationBarOverview: "MobileValidationOverview",
	MobileValidationBarGraphic: "MobileValidationGraphic",
	MobilePreviewList: "MobileValidationPreviewList",
	MobilePreviewListIem: "MobileValidationPreviewListItem",
	MobileAction: "MobileValidationActions",
	MobileActionItem: "MobileValidationActionItem"
};

const DEPRECATED_NAMES = Object.keys(RENAMES);

export const renameWidgetMapKeys: Recipe = {
	metadata: {
		id: "renameWidgetMapKeys",
		description:
			"Renames the WidgetMap keys to match the naming of the underlying Widgets from @com.mgmtp.a12.widgets/widgets-core",
		supportedVersions: "^39.0.0"
	},
	execute(project) {
		const typeChecker = project.getTypeChecker();

		project.getSourceFiles().forEach(sourceFile => {
			const identifierCandidates = sourceFile
				.getDescendantsOfKind(SyntaxKind.Identifier)
				.filter(identifier => DEPRECATED_NAMES.includes(identifier.getText()));

			const stringLiteralCandidates = sourceFile
				.getDescendantsOfKind(SyntaxKind.StringLiteral)
				.filter(stringLiteral => getDeprecatedNameFromLiteral(stringLiteral) !== undefined);

			const templateLiteralCandidates = sourceFile
				.getDescendantsOfKind(SyntaxKind.NoSubstitutionTemplateLiteral)
				.filter(templateLiteral => getDeprecatedNameFromLiteral(templateLiteral) !== undefined);

			const candidates = [
				...identifierCandidates,
				...stringLiteralCandidates,
				...templateLiteralCandidates
			];

			// Two-pass processing: destructuring bindings first, then everything else.
			// Why: the property-assignment handler uses ts-morph's language-service
			// rename() which cascades through references — including shorthand
			// destructurings like `{ Header }`, rewriting them in place and losing
			// the original local binding name. Converting shorthand destructurings
			// to aliased form (`{ DateTimePickerHeader: Header }`) first keeps local
			// bindings (and their JSX usages) intact.
			const isDestructuring = (node: Node): boolean => {
				const parent = node.getParent();
				return parent !== undefined && Node.isBindingElement(parent);
			};

			const destructuringFirst = [
				...candidates.filter(isDestructuring),
				...candidates.filter(c => !isDestructuring(c))
			];

			destructuringFirst.forEach(candidate => {
				const deprecatedName = deprecatedNameOf(candidate);
				if (deprecatedName === undefined) {
					return;
				}

				const context = determinePropertyContext(typeChecker, candidate);
				if (context) {
					replaceInContext(context, typeChecker, deprecatedName, RENAMES[deprecatedName]);
				}
			});
		});
	}
};

function deprecatedNameOf(
	node: Identifier | StringLiteral | NoSubstitutionTemplateLiteral
): string | undefined {
	if (Node.isIdentifier(node)) {
		return DEPRECATED_NAMES.includes(node.getText()) ? node.getText() : undefined;
	}

	return getDeprecatedNameFromLiteral(node);
}

function getDeprecatedNameFromLiteral(node: Node): string | undefined {
	if (Node.isStringLiteral(node)) {
		return DEPRECATED_NAMES.find(
			name => node.getText() === `"${name}"` || node.getText() === `'${name}'`
		);
	}
	if (Node.isNoSubstitutionTemplateLiteral(node)) {
		return DEPRECATED_NAMES.find(name => node.getText() === `\`${name}\``);
	}
	return undefined;
}

function isTargetType(type: Type | undefined): boolean {
	if (!type) {
		return false;
	}

	const typeText = type.getText();

	const fullNameRegex = new RegExp(`\\b${TARGET_TYPE_NAME}\\b`);
	if (fullNameRegex.test(typeText)) {
		return true;
	}

	const baseTypes = type.getBaseTypes();
	for (const baseType of baseTypes) {
		if (isTargetType(baseType)) {
			return true;
		}
	}

	if (type.isTypeParameter()) {
		const constraint = type.getConstraint();
		if (constraint && isTargetType(constraint)) {
			return true;
		}
	}

	return false;
}

interface BaseContext {
	replaceNode: Node;
}

interface TypeBasedContext extends BaseContext {
	targetType?: Type;
}

interface StructuralContext extends BaseContext {
	isTargetInterface: true;
}

type PropertyContext =
	| (TypeBasedContext & { type: "property-access"; replaceNode: Identifier })
	| (TypeBasedContext & {
			type: "element-access";
			replaceNode: StringLiteral | NoSubstitutionTemplateLiteral;
	  })
	| (TypeBasedContext & {
			type: "computed-property";
			replaceNode: StringLiteral | NoSubstitutionTemplateLiteral;
	  })
	| (TypeBasedContext & {
			type: "destructuring";
			isPropertyName?: boolean;
			replaceNode: Identifier;
			bindingElement?: BindingElement;
	  })
	| (TypeBasedContext & {
			type: "property-assignment";
			replaceNode: Identifier;
			propAssignment?: PropertyAssignment;
	  })
	| (TypeBasedContext & {
			type: "shorthand-property";
			replaceNode: Identifier;
	  })
	| (StructuralContext & { type: "interface-property" });

function determinePropertyContext(
	typeChecker: TypeChecker,
	node: Identifier | StringLiteral | NoSubstitutionTemplateLiteral
): PropertyContext | null {
	const parent = node.getParent();
	if (!parent) {
		return null;
	}

	if (Node.isPropertyAccessExpression(parent) && Node.isIdentifier(node)) {
		const expressionType = typeChecker.getTypeAtLocation(parent.getExpression());
		return {
			type: "property-access",
			targetType: expressionType,
			replaceNode: node
		};
	}

	if (
		Node.isElementAccessExpression(parent) &&
		(Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node))
	) {
		const expressionType = typeChecker.getTypeAtLocation(parent.getExpression());
		return {
			type: "element-access",
			targetType: expressionType,
			replaceNode: node
		};
	}

	if (Node.isBindingElement(parent) && Node.isIdentifier(node)) {
		const objectBindingPattern = parent.getParent();

		if (Node.isObjectBindingPattern(objectBindingPattern)) {
			const objectBindingType = typeChecker.getTypeAtLocation(objectBindingPattern);
			const propertyNameNode = parent.getPropertyNameNode();

			return {
				type: "destructuring",
				targetType: objectBindingType,
				replaceNode: node,
				bindingElement: parent,
				isPropertyName: propertyNameNode === node
			};
		}
	}

	if (Node.isPropertyAssignment(parent) && Node.isIdentifier(node)) {
		const objectLiteralExpression = parent.getParent();
		const objectLiteralParent = objectLiteralExpression.getParent();

		if (Node.isVariableDeclaration(objectLiteralParent)) {
			const objectType = objectLiteralParent.getType();

			if (objectType.isUnion()) {
				const unionType = objectType.getUnionTypes().find(t => isTargetType(t));
				return {
					type: "property-assignment",
					targetType: unionType,
					replaceNode: node,
					propAssignment: parent
				};
			}

			if (objectType.isIntersection()) {
				const intersectionType = objectType.getIntersectionTypes().find(t => isTargetType(t));
				return {
					type: "property-assignment",
					targetType: intersectionType,
					replaceNode: node,
					propAssignment: parent
				};
			}

			return {
				type: "property-assignment",
				targetType: objectType,
				replaceNode: node,
				propAssignment: parent
			};
		}

		if (Node.isReturnStatement(objectLiteralParent)) {
			const functionDeclaration = objectLiteralParent.getFirstAncestorByKind(
				SyntaxKind.FunctionDeclaration
			);
			const functionType = Node.isFunctionDeclaration(functionDeclaration)
				? functionDeclaration.getReturnType()
				: undefined;
			return {
				type: "property-assignment",
				targetType: functionType,
				replaceNode: node,
				propAssignment: parent
			};
		}
	}

	if (Node.isShorthandPropertyAssignment(parent) && Node.isIdentifier(node)) {
		const objectLiteralExpression = parent.getParent();
		const objectLiteralParent = objectLiteralExpression.getParent();

		if (Node.isVariableDeclaration(objectLiteralParent)) {
			const objectType = objectLiteralParent.getType();
			return {
				type: "shorthand-property",
				targetType: objectType,
				replaceNode: node
			};
		}
	}

	if (
		Node.isComputedPropertyName(parent) &&
		(Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node))
	) {
		const variableDeclaration = parent.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
		const objectType = variableDeclaration
			? typeChecker.getTypeAtLocation(variableDeclaration)
			: undefined;
		return {
			type: "computed-property",
			targetType: objectType,
			replaceNode: node
		};
	}

	if (Node.isPropertySignature(parent)) {
		const container = parent.getParent();

		if (Node.isInterfaceDeclaration(container)) {
			const extendsTarget = container
				.getExtends()
				.some(ext => new RegExp(`\\b${TARGET_TYPE_NAME}\\b`).test(ext.getText()));
			if (extendsTarget) {
				return {
					type: "interface-property",
					replaceNode: node,
					isTargetInterface: true
				};
			}
		}
	}

	return null;
}

function replaceInContext(
	context: PropertyContext,
	_typeChecker: TypeChecker,
	deprecatedName: string,
	newName: string
) {
	const isNotTargetType =
		"targetType" in context
			? !isTargetType(context.targetType)
			: "isTargetInterface" in context
				? !context.isTargetInterface
				: true;

	if (isNotTargetType) {
		return;
	}

	switch (context.type) {
		case "property-access":
			context.replaceNode.replaceWithText(newName);
			break;

		case "element-access":
		case "computed-property":
			context.replaceNode.replaceWithText(`"${newName}"`);
			break;

		case "property-assignment":
		case "shorthand-property":
			context.replaceNode.rename(newName);
			break;

		case "destructuring":
			// Use rename() so the language service cascades through references
			// transitively connected to this binding — including JSX usages of
			// the local binding created by shorthand destructuring. The two-pass
			// ordering above guarantees shorthand bindings are renamed here
			// before any property-assignment rename cascades over them.
			context.replaceNode.rename(newName);
			break;

		case "interface-property": {
			const text = context.replaceNode.getParent()?.getText();
			if (text) {
				const newText = text.replace(deprecatedName, newName);
				context.replaceNode.getParent()?.replaceWithText(newText);
			}
			break;
		}
	}
}
