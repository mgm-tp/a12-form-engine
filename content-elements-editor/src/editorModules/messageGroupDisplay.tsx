// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

import { KernelMessage } from "@com.mgmtp.a12.client/client-data/lib/data-mutation/validation-computation/message.js";
import {
	DocumentContext,
	useDocumentContext
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { NodeRendererProps } from "@com.mgmtp.a12.contentengine/contentengine-core";
import {
	EditorElementModule,
	SettingTemplate
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { MessageGroupDisplayNode } from "@com.mgmtp.a12.formengine/formengine-content-elements";
import {
	FormElementsModules,
	MessageGroupContext
} from "@com.mgmtp.a12.formengine/formengine-content-elements";

import { createTrueController } from "../controllers/trueController.js";
import { SwitchSetting } from "../setting-inputs/switchSetting.js";

import { createEditingRenderer } from "./createEditingRenderer.js";
import MessageGroupDisplayIcon from "./icons/messageGroupDisplay.icon.svg";

/** @internal */
export const MessageGroupDisplayModule: EditorElementModule<MessageGroupDisplayNode> =
	EditorElementModule.createFactory()(FormElementsModules.MessageGroupDisplay, {
		label: "Message Group Display",
		icon: <img src={MessageGroupDisplayIcon} alt="Message Group Display Icon" />,
		category: "Form Elements",
		controllers: {
			prefixFormalErrors: createTrueController(false)
		},
		propertiesCreator: () => ({ props: {} }),
		settingsRenderer: MessageGroupDisplaySettingsRenderer,
		editingRenderer: createEditingRenderer(MessageGroupDisplayEditingRenderer)
	});

function MessageGroupDisplaySettingsRenderer(): JSX.Element {
	return (
		<SettingTemplate.Section label={"General"}>
			<SwitchSetting label={"Prefix formal errors"} settingPath={["prefixFormalErrors"]} />
		</SettingTemplate.Section>
	);
}

function MessageGroupDisplayEditingRenderer(
	props: NodeRendererProps<MessageGroupDisplayNode>
): JSX.Element {
	const documentContext = useDocumentContext(c => c);
	// FIXME: replace this part below with the actual runtime component once the CE preview is set up properly

	/**
	 * Set a slightly adapted document context to provide the sample field
	 * for a sample error.
	 *
	 * Enforce a message group context in order to provide an error that can be
	 * displayed by the display element.
	 */
	return (
		<DocumentContext.Provider
			value={{
				...documentContext,
				model: {
					...documentContext.model,
					getElementByPath: () => ({
						id: "sampleField",
						name: "sampleField",
						type: "Field",
						fieldType: { type: "StringType" },
						label: [{ locale: "en", text: "SampleField Label" }]
					}),
					getFieldDisplayLabel: () => "SampleField Label"
				}
			}}
		>
			<MessageGroupContext.Provider
				value={{
					id: "foo",
					getGroupedValidationMessages: () => [
						{
							type: "FieldConstraintError",
							errorCode: "invalidFieldValue",
							entityInstance: [
								{ elementName: "root", index: 1 },
								{ elementName: "sampleField", index: 1 }
							],
							errorText: [
								{
									key: "dummy.error",
									defaults: {
										en: "Sample error!"
									}
								}
							],
							messageType: "VALUE_ERROR",
							referencedFields: [
								[
									{ elementName: "root", index: 1 },
									{ elementName: "sampleField", index: 1 }
								]
							],
							refOmissionErrorResponsible: [],
							rulePath: KernelMessage.FORMAL_VALIDATION,
							severity: "ERROR"
						}
					],
					getUngroupedValidationMessages: () => []
				}}
			>
				<FormElementsModules.MessageGroupDisplay.renderer node={props.node} />
			</MessageGroupContext.Provider>
		</DocumentContext.Provider>
	);
}
