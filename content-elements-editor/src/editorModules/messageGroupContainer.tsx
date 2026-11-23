// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { Model } from "@com.mgmtp.a12.client/client-core";
import type {
	GeneralValidationContext,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import {
	createBooleanController,
	createDocumentModelService,
	EditorElementModule,
	GlobalSearch,
	SettingTemplate
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type {
	DocumentModelService,
	NodeSettingProps
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { MessageGroupContainerNode } from "@com.mgmtp.a12.formengine/formengine-content-elements";
import { FormElementsModules } from "@com.mgmtp.a12.formengine/formengine-content-elements";
import { MessageBox } from "@com.mgmtp.a12.widgets/widgets-core/lib/message-box/main/message-box.view.js";
import { TextOutput } from "@com.mgmtp.a12.widgets/widgets-core/lib/text-output/main/text-output.view.js";

import { createStringListController } from "../controllers/stringListController.js";
import { AutoCollectNodesSetting } from "../setting-inputs/autoCollectNodesSetting.js";
import { ElementIdListSettings } from "../setting-inputs/elementIdListSettings.js";
import { RuleListSetting } from "../setting-inputs/ruleListSetting.js";
import { SwitchSetting } from "../setting-inputs/switchSetting.js";

import MessageGroupContainerIcon from "./icons/messageGroupContainer.icon.svg";

/** @internal */
export const MessageGroupContainerModule: EditorElementModule<MessageGroupContainerNode> =
	EditorElementModule.createFactory()(FormElementsModules.MessageGroupContainer, {
		label: "Message Group Container",
		icon: <img src={MessageGroupContainerIcon} alt="Message Group Container Icon" />,
		category: "Form Elements",
		controllers: {
			fields: createStringListController(),
			groups: createStringListController(),
			rules: createStringListController(),
			ignoreFormalErrors: createBooleanController(false),
			autoCollectNodes: createBooleanController(false)
		},
		childRules: { type: "anyOf", rules: [{ type: "module", id: "*" }] },
		propertiesCreator: () => ({
			props: {
				fields: [],
				groups: [],
				rules: []
			}
		}),
		settingsRenderer: MessageGroupContainerSettingsRenderer,
		editingRenderer: MessageGroupContainerEditingRenderer,
		getSearchMatches: createGetSearchMatches({ findMatches: GlobalSearch.findMatches })
	});

function MessageGroupContainerSettingsRenderer(
	props: NodeSettingProps<MessageGroupContainerNode>
): JSX.Element {
	return (
		<SettingTemplate.Section label={"General"}>
			<TextOutput>
				{"Validation messages relating to the Fields, Groups and Rules listed here will " +
					"be shown in Message Group Display elements, that are nested inside of this container."}
			</TextOutput>
			<MessageBox
				variant="info"
				label={
					"This configuration does not affect the current validation scope. It only " +
					"affects the display of validation messages."
				}
			/>
			<SwitchSetting label={"Ignore formal errors"} settingPath={["ignoreFormalErrors"]} />
			<AutoCollectNodesSetting />
			<ElementIdListSettings
				label={"Fields"}
				path={["fields"]}
				nodeId={props.nodeId}
				elementFilter={element => element.type === "Field"}
				invalidElementError={"Unexpected document model element. Only fields are allowed."}
			/>
			<ElementIdListSettings
				label={"Groups"}
				path={["groups"]}
				nodeId={props.nodeId}
				elementFilter={element => element.type === "Group"}
				invalidElementError={"Unexpected document model element. Only groups are allowed."}
			/>
			<RuleListSetting />
		</SettingTemplate.Section>
	);
}

function MessageGroupContainerEditingRenderer(
	props: NodeRendererProps<MessageGroupContainerNode>
): JSX.Element {
	return <>{props.children}</>;
}

/** @internal */
export interface GetSearchMatchesDependencies {
	findMatches: typeof GlobalSearch.findMatches;
}

/** @internal */
export function createGetSearchMatches(dependencies: GetSearchMatchesDependencies) {
	return function getSearchMatches(
		query: string,
		context: { node: MessageGroupContainerNode } & GeneralValidationContext,
		options: GlobalSearch.SearchOptions
	): GlobalSearch.SearchMatch[] {
		const { node, referencedModels } = context;
		const documentModel = referencedModels?.find(Model.isDocumentModel);
		const documentModelService = documentModel
			? createDocumentModelService(documentModel)
			: undefined;

		if (documentModelService) {
			const matches: GlobalSearch.SearchMatch[] = [
				...findMatchesInList(dependencies)({
					elementIds: node.props.fields ?? [],
					dmService: documentModelService,
					property: "fields",
					query,
					options
				}),
				...findMatchesInList(dependencies)({
					elementIds: node.props.groups ?? [],
					dmService: documentModelService,
					property: "groups",
					query,
					options
				})
			];

			return matches;
		}

		return [];
	};
}

function findMatchesInList(dependencies: GetSearchMatchesDependencies) {
	return function (params: {
		elementIds: string[];
		dmService: DocumentModelService;
		property: string;
		query: string;
		options: GlobalSearch.SearchOptions;
	}): GlobalSearch.SearchMatch[] {
		const { elementIds, dmService, property, query, options } = params;

		const matches: GlobalSearch.SearchMatch[] = [];

		elementIds.forEach((elementId, index) => {
			const elementPath = ModelPath.toString(dmService.getModelPathById(elementId));

			if (elementPath) {
				const highlights = dependencies.findMatches(elementPath, query, options);

				if (highlights.length > 0) {
					matches.push({
						propertyName: property,
						propertyPath: `/${property}[${index + 1}]`,
						matchedValue: elementPath,
						highlightRanges: highlights
					});
				}
			}
		});

		return matches;
	};
}
