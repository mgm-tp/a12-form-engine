// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

import type {
	EditorElementModule,
	NodeSettingProps
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { SettingTemplate } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { TextLineNode } from "@com.mgmtp.a12.formengine/formengine-content-elements";
import { FormElementsModules } from "@com.mgmtp.a12.formengine/formengine-content-elements";

import { markingOfRequiredFieldsItems } from "../dropdownItems.js";
import { extendModule } from "../extendModule.js";
import { AnnotationsSetting } from "../setting-inputs/annotationsSetting.js";
import { ElementIdSetting } from "../setting-inputs/elementIdSetting.js";
import { LocalizedTextSetting } from "../setting-inputs/localizedTextSetting.js";
import { MessageExpositionSetting } from "../setting-inputs/messageExpositionSetting.js";
import { SelectSetting } from "../setting-inputs/selectSetting.js";
import { SwitchSetting } from "../setting-inputs/switchSetting.js";
import { TextSetting } from "../setting-inputs/textSetting.js";

import { createEditingRenderer } from "./createEditingRenderer.js";
import TextLineIcon from "./icons/textLine.icon.svg";

/** @internal */
export const TextLineEditorModule: EditorElementModule<TextLineNode> = extendModule({
	module: FormElementsModules.TextLine,
	label: "Text Line",
	icon: <img src={TextLineIcon} alt="Text Line Icon" />,
	settingsRenderer: TextLineSettingsRenderer,
	editingRenderer: createEditingRenderer(FormElementsModules.TextLine.renderer)
});

function TextLineSettingsRenderer(props: NodeSettingProps<TextLineNode>): JSX.Element {
	return (
		<>
			<SettingTemplate.Section label="General">
				<ElementIdSetting
					nodeId={props.nodeId}
					elementFilter={{ fieldTypes: ["StringType", "NumberType", "CustomFieldType"] }}
				/>
			</SettingTemplate.Section>
			<SettingTemplate.Section label="Localization">
				<LocalizedTextSetting
					label={"Label"}
					settingPath={["label"]}
					suffix={<SwitchSetting label={"Hide Label"} settingPath={["hideLabel"]} />}
				/>
				<LocalizedTextSetting label={"Hint"} settingPath={["hint"]} initiallyCollapsed={true} />
				<LocalizedTextSetting
					label={"Placeholder"}
					settingPath={["placeholder"]}
					initiallyCollapsed={true}
				/>
				<LocalizedTextSetting
					label={"Suffix"}
					settingPath={["suffix"]}
					initiallyCollapsed={true}
					suffix={<SwitchSetting label={"Truncate Suffix"} settingPath={["truncateSuffix"]} />}
				/>
			</SettingTemplate.Section>
			<SettingTemplate.Section label="Additional Settings">
				<SwitchSetting label={"Readonly"} settingPath={["readonly"]} />
				<MessageExpositionSetting />
				<TextSetting label={"Auto Complete"} settingPath={["autoComplete"]} />
				<SelectSetting
					label={"Show asterisk"}
					settingPath={["markingOfRequiredFields"]}
					items={markingOfRequiredFieldsItems}
					width={120}
				/>
				<SwitchSetting label={"Secret"} settingPath={["secret"]} />
			</SettingTemplate.Section>
			<AnnotationsSetting />
		</>
	);
}
