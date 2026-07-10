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
	AccessorDeclaration,
	BindingElement,
	ClassDeclaration,
	Identifier,
	NoSubstitutionTemplateLiteral,
	PropertyAssignment,
	PropertyDeclaration,
	StringLiteral,
	Type,
	TypeChecker
} from "ts-morph";
import { Node, SyntaxKind } from "ts-morph";

import type { Recipe } from "@com.mgmtp.a12.devtools/codemod";

const TARGET_TYPE_NAME = "Events.Attachments.UploadAttachmentsPayload";
const DEPRECATED_PROP_NAME = "formModelRepeatPath";
const NEW_PROP_NAME = "formModelElementPath";

export const replaceFormModelRepeatPath: Recipe = {
	metadata: {
		id: "replaceFormModelRepeatPath",
		description: "Replaces the formModelRepeatPath with the formModelElementPath on FormModel type",
		supportedVersions: "^38.4.0"
	},
	execute(project) {
		const typeChecker = project.getTypeChecker();

		project.getSourceFiles().forEach(sourceFile => {
			// Find all identifiers with the deprecated property name, e.g. obj.formModelRepeatPath
			const identifierCandidates = sourceFile
				.getDescendantsOfKind(SyntaxKind.Identifier)
				.filter(identifier => identifier.getText() === DEPRECATED_PROP_NAME);

			// Find all string literals with the deprecated property name, e.g. obj["formModelRepeatPath"]
			const stringLiteralCandidates = sourceFile
				.getDescendantsOfKind(SyntaxKind.StringLiteral)
				.filter(stringLiteral => isDeprecatedPropertyString(stringLiteral));

			// Find template literals with the deprecated property name, e.g. obj[`formModelRepeatPath`]
			const templateLiteralCandidates = sourceFile
				.getDescendantsOfKind(SyntaxKind.NoSubstitutionTemplateLiteral)
				.filter(templateLiteral => isDeprecatedPropertyString(templateLiteral));

			// Process all candidates
			[...identifierCandidates, ...stringLiteralCandidates, ...templateLiteralCandidates].forEach(
				candidate => {
					const context = determinePropertyContext(typeChecker, candidate);
					if (context) {
						replaceInContext(context, typeChecker);
					}
				}
			);
		});
	}
};

/**
 * Checks if the given type matches the target type
 */
function isTargetType(type: Type | undefined, typeChecker: TypeChecker): boolean {
	if (!type) {
		return false;
	}

	const typeText = type.getText();

	// Check: Exact Match
	// Handles: Direct type references with full namespace
	// Example: "Events.Attachments.UploadAttachmentsPayload"
	const isExactMatch = typeText === TARGET_TYPE_NAME;

	// Check: Contains Full Qualified Name (with word boundaries)
	// Handles: Complex composite types that include our target type
	// Examples:
	// - Union types: "Events.Attachments.UploadAttachmentsPayload | null"
	// - Intersection types: "Events.Attachments.UploadAttachmentsPayload & ExtraProps"
	// - Generic types: "Container<Events.Attachments.UploadAttachmentsPayload>"
	// - Array types: "Events.Attachments.UploadAttachmentsPayload[]"
	const fullNameRegex = new RegExp(`\\b${TARGET_TYPE_NAME.replace(/\./g, "\\.")}\\b`);
	const isPartialOfFullName = fullNameRegex.test(typeText);

	if (isExactMatch || isPartialOfFullName) {
		return true;
	}

	// Check if type extends/implements our target type by looking at base types
	// This handles cases like ComponentProps extends UploadAttachmentsPayload
	const baseTypes = type.getBaseTypes();
	for (const baseType of baseTypes) {
		if (isTargetType(baseType, typeChecker)) {
			return true;
		}
	}

	// Check if this is a type parameter with our target type as constraint
	// This handles cases like T extends UploadAttachmentsPayload
	if (type.isTypeParameter()) {
		const constraint = type.getConstraint();
		if (constraint && isTargetType(constraint, typeChecker)) {
			return true;
		}
	}

	return false;
}

/**
 * Checks if a class implements the target interface
 */
function classImplementsTargetType(classDeclaration: ClassDeclaration): boolean {
	const implementsExpressions = classDeclaration.getImplements();
	return implementsExpressions.some(impl => impl.getText() === TARGET_TYPE_NAME);
}

/**
 * Checks if a string literal contains the deprecated property name
 */
function isDeprecatedPropertyString(node: Node): boolean {
	if (Node.isStringLiteral(node)) {
		const text = node.getText();
		return text === `"${DEPRECATED_PROP_NAME}"` || text === `'${DEPRECATED_PROP_NAME}'`;
	}
	if (Node.isNoSubstitutionTemplateLiteral(node)) {
		const text = node.getText();
		return text === `\`${DEPRECATED_PROP_NAME}\``;
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
			type: "in-operator";
			replaceNode: StringLiteral | NoSubstitutionTemplateLiteral;
	  })
	| (TypeBasedContext & { type: "jsx-attribute"; replaceNode: Identifier })
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
	| (StructuralContext & { type: "interface-property" })
	| (StructuralContext & { type: "intersection-property" })
	| (StructuralContext & {
			type: "class-property";
			propDecl?: PropertyDeclaration;
	  })
	| (StructuralContext & {
			type: "class-accessor";
			accessor?: AccessorDeclaration;
	  });

/**
 * Determines the context of a property reference and returns type information
 */
function determinePropertyContext(
	typeChecker: TypeChecker,
	node: Identifier | StringLiteral | NoSubstitutionTemplateLiteral
): PropertyContext | null {
	const parent = node.getParent();
	if (!parent) {
		return null;
	}

	// Property access: obj.formModelRepeatPath
	if (Node.isPropertyAccessExpression(parent) && Node.isIdentifier(node)) {
		const expressionType = typeChecker.getTypeAtLocation(parent.getExpression());
		return {
			type: "property-access" as const,
			targetType: expressionType,
			replaceNode: node
		};
	}

	// Element access: obj["formModelRepeatPath"]
	if (
		Node.isElementAccessExpression(parent) &&
		(Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node))
	) {
		const expressionType = typeChecker.getTypeAtLocation(parent.getExpression());
		return {
			type: "element-access" as const,
			targetType: expressionType,
			replaceNode: node
		};
	}

	// Binding element (destructuring): { formModelRepeatPath } or { formModelRepeatPath: alias }
	if (Node.isBindingElement(parent) && Node.isIdentifier(node)) {
		const objectBindingPattern = parent.getParent();

		if (Node.isObjectBindingPattern(objectBindingPattern)) {
			const objectBindingType = typeChecker.getTypeAtLocation(objectBindingPattern);
			const propertyNameNode = parent.getPropertyNameNode();

			return {
				type: "destructuring" as const,
				targetType: objectBindingType,
				replaceNode: node,
				bindingElement: parent,
				isPropertyName: propertyNameNode === node
			};
		}
	}

	// Property assignment: { formModelRepeatPath: "value" }
	if (Node.isPropertyAssignment(parent) && Node.isIdentifier(node)) {
		const objectLiteralExpression = parent.getParent();
		const objectLiteralParent = objectLiteralExpression.getParent();

		if (Node.isVariableDeclaration(objectLiteralParent)) {
			const objectType = objectLiteralParent.getType();

			if (objectType.isUnion()) {
				const typeFromUnion = objectType.getUnionTypes().find(unionType => {
					return isTargetType(unionType, typeChecker);
				});

				return {
					type: "property-assignment" as const,
					targetType: typeFromUnion,
					replaceNode: node,
					propAssignment: parent
				};
			}

			if (objectType.isIntersection()) {
				const typeFromIntersection = objectType.getIntersectionTypes().find(unionType => {
					return isTargetType(unionType, typeChecker);
				});

				return {
					type: "property-assignment" as const,
					targetType: typeFromIntersection,
					replaceNode: node,
					propAssignment: parent
				};
			}

			return {
				type: "property-assignment" as const,
				targetType: objectType,
				replaceNode: node,
				propAssignment: parent
			};
		}

		// Handle array literals: [{ formModelRepeatPath: "value" }]
		if (Node.isArrayLiteralExpression(objectLiteralParent)) {
			const variableDeclaration = objectLiteralParent.getParent();
			if (Node.isVariableDeclaration(variableDeclaration)) {
				const typeNode = variableDeclaration.getFirstDescendantByKind(SyntaxKind.TypeReference);
				const type = typeNode?.getType();

				return {
					type: "property-assignment" as const,
					targetType: type,
					replaceNode: node,
					propAssignment: parent
				};
			}
		}

		// Handle ...return { formModelRepeathPath: "value" }
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

	// Shorthand property assignment: { formModelRepeatPath }
	if (Node.isShorthandPropertyAssignment(parent) && Node.isIdentifier(node)) {
		const objectLiteralExpression = parent.getParent();
		const objectLiteralParent = objectLiteralExpression.getParent();

		if (Node.isVariableDeclaration(objectLiteralParent)) {
			const objectType = objectLiteralParent.getType();

			return {
				type: "shorthand-property" as const,
				targetType: objectType,
				replaceNode: node
			};
		}

		// Handle array literals: [{ formModelRepeatPath }]
		if (Node.isArrayLiteralExpression(objectLiteralParent)) {
			const variableDeclaration = objectLiteralParent.getParent();
			if (Node.isVariableDeclaration(variableDeclaration)) {
				const typeNode = variableDeclaration.getFirstDescendantByKind(SyntaxKind.TypeReference);
				const type = typeNode?.getType();

				return {
					type: "shorthand-property" as const,
					targetType: type,
					replaceNode: node
				};
			}
		}

		// Handle ...return { formModelRepeatPath }
		if (Node.isReturnStatement(objectLiteralParent)) {
			const functionDeclaration = objectLiteralParent.getFirstAncestorByKind(
				SyntaxKind.FunctionDeclaration
			);
			const functionType = Node.isFunctionDeclaration(functionDeclaration)
				? functionDeclaration.getReturnType()
				: undefined;
			return {
				type: "shorthand-property" as const,
				targetType: functionType,
				replaceNode: node
			};
		}
	}

	// Computed property: { ["formModelRepeatPath"]: value }
	if (
		Node.isComputedPropertyName(parent) &&
		(Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node))
	) {
		const variableDeclaration = parent.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
		const objectType = variableDeclaration
			? typeChecker.getTypeAtLocation(variableDeclaration)
			: undefined;
		return {
			type: "computed-property" as const,
			targetType: objectType,
			replaceNode: node
		};
	}

	// Binary expression ('in' operator): "formModelRepeatPath" in obj
	if (
		Node.isBinaryExpression(parent) &&
		(Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node))
	) {
		const operatorToken = parent.getOperatorToken();
		if (operatorToken.getKind() === SyntaxKind.InKeyword && parent.getLeft() === node) {
			const right = parent.getRight();
			const rightType = typeChecker.getTypeAtLocation(right);
			return {
				type: "in-operator" as const,
				targetType: rightType,
				replaceNode: node
			};
		}
	}

	// Property signature (interface/type): formModelRepeatPath: string
	if (Node.isPropertySignature(parent)) {
		// Check if the containing interface/type extends/implements target
		const container = parent.getParent();

		if (Node.isInterfaceDeclaration(container)) {
			const extendsExpressions = container.getExtends();
			const extendsTarget = extendsExpressions.some(ext => ext.getText() === TARGET_TYPE_NAME);
			if (extendsTarget) {
				return {
					type: "interface-property" as const,
					replaceNode: node,
					isTargetInterface: true
				};
			}
		}

		if (Node.isTypeLiteral(container)) {
			const intersectionType = container.getParent();
			if (Node.isIntersectionTypeNode(intersectionType)) {
				const typeNodes = intersectionType.getTypeNodes();
				const hasTarget = typeNodes.some(t => t.getText() === TARGET_TYPE_NAME);
				if (hasTarget) {
					return {
						type: "intersection-property" as const,
						replaceNode: node,
						isTargetInterface: true
					};
				}
			}
		}
	}

	// Class property: class implements TargetInterface { formModelRepeatPath: string; }
	if (Node.isPropertyDeclaration(parent)) {
		if (parent.getNameNode() === node) {
			const classDecl = parent.getParent();
			if (Node.isClassDeclaration(classDecl)) {
				const implementsTarget = classImplementsTargetType(classDecl);
				if (implementsTarget) {
					return {
						type: "class-property" as const,
						replaceNode: node,
						isTargetInterface: true,
						propDecl: parent
					};
				}
			}
		}
	}

	// Getter/Setter accessors
	if (Node.isGetAccessorDeclaration(parent) || Node.isSetAccessorDeclaration(parent)) {
		const classDecl = parent.getParent();
		if (Node.isClassDeclaration(classDecl)) {
			const implementsTarget = classImplementsTargetType(classDecl);
			if (implementsTarget) {
				return {
					type: "class-accessor" as const,
					replaceNode: node,
					isTargetInterface: true,
					accessor: parent
				};
			}
		}
	}

	// JSX attribute: <Component formModelRepeatPath="value" />
	if (Node.isJsxAttribute(parent) && Node.isIdentifier(node)) {
		const jsxAttributes = parent.getParent(); // JsxAttributes
		const jsxElement = jsxAttributes?.getParent(); // JsxOpeningElement or JsxSelfClosingElement

		if (Node.isJsxOpeningElement(jsxElement) || Node.isJsxSelfClosingElement(jsxElement)) {
			// Get the tag name (component name)
			const tagName = jsxElement.getTagNameNode();
			const componentPropsType = typeChecker.getTypeAtLocation(tagName);

			// For function components, we need to get the props type from the first parameter
			// Example of call signature: (props: ComponentProps) => JSX.Element
			const callSignatures = componentPropsType.getCallSignatures();
			if (callSignatures.length > 0) {
				const firstParam = callSignatures[0].getParameters()[0];
				if (firstParam) {
					const propsType = typeChecker.getTypeOfSymbolAtLocation(firstParam, tagName);
					return {
						type: "jsx-attribute" as const,
						targetType: propsType,
						replaceNode: node
					};
				}
			}

			// Fallback: try to get props type from the component type's type arguments
			const typeArgs = componentPropsType.getTypeArguments();
			if (typeArgs.length > 0) {
				return {
					type: "jsx-attribute" as const,
					targetType: typeArgs[0],
					replaceNode: node
				};
			}

			// Simple fallback: check if this is a known component type that extends our target
			// This handles cases where TypeScript type resolution is complex
			return {
				type: "jsx-attribute" as const,
				targetType: componentPropsType,
				replaceNode: node
			};
		}
	}

	return null;
}

/**
 * Performs the replacement based on context
 */
function replaceInContext(context: PropertyContext, typeChecker: TypeChecker) {
	const isNotTargetType =
		"targetType" in context
			? !isTargetType(context.targetType, typeChecker)
			: "isTargetInterface" in context
				? !context.isTargetInterface
				: true;

	if (isNotTargetType) {
		return;
	}

	switch (context.type) {
		case "property-access":
		case "jsx-attribute":
			context.replaceNode.replaceWithText(NEW_PROP_NAME);
			break;

		case "element-access":
		case "computed-property":
		case "in-operator":
			context.replaceNode.replaceWithText(`"${NEW_PROP_NAME}"`);
			break;
		case "property-assignment":
		case "shorthand-property":
			context.replaceNode.rename(NEW_PROP_NAME);
			break;

		case "destructuring":
			if (!context.isPropertyName) {
				// Simple destructuring: { formModelRepeatPath }
				const nameText = context.replaceNode.getText();
				if (context.bindingElement) {
					// Use original as alias to not break usages of the prop
					context.bindingElement.replaceWithText(`${NEW_PROP_NAME}: ${nameText}`);
				}
			} else {
				// Property name in destructuring: { formModelRepeatPath: alias }
				context.replaceNode.replaceWithText(NEW_PROP_NAME);
			}
			break;

		case "interface-property":
		case "intersection-property": {
			const text = context.replaceNode.getParent()?.getText();
			if (text) {
				const newText = text.replace(DEPRECATED_PROP_NAME, NEW_PROP_NAME);
				context.replaceNode.getParent()?.replaceWithText(newText);
			}
			break;
		}
		case "class-property": {
			if (context.propDecl) {
				context.propDecl.rename(NEW_PROP_NAME);
			}
			break;
		}

		case "class-accessor": {
			if (context.accessor) {
				context.accessor.rename(NEW_PROP_NAME);
			}
			break;
		}
	}
}
