// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

import type {
	EditorElementModule,
	NodeSettingProps
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { SettingTemplate } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { MultiSelectNode } from "@com.mgmtp.a12.formengine/formengine-content-elements";
import { FormElementsModules } from "@com.mgmtp.a12.formengine/formengine-content-elements";

import { markingOfRequiredFieldsItems } from "../dropdownItems.js";
import { extendModule } from "../extendModule.js";
import { AnnotationsSetting } from "../setting-inputs/annotationsSetting.js";
import { ElementIdSetting } from "../setting-inputs/elementIdSetting.js";
import { LocalizedTextSetting } from "../setting-inputs/localizedTextSetting.js";
import { MessageExpositionSetting } from "../setting-inputs/messageExpositionSetting.js";
import { SelectSetting } from "../setting-inputs/selectSetting.js";
import { SwitchSetting } from "../setting-inputs/switchSetting.js";

import { createEditingRenderer } from "./createEditingRenderer.js";
import MultiSelectIcon from "./icons/multiSelect.icon.svg";

/** @internal */
export const MultiSelectEditorModule: EditorElementModule<MultiSelectNode> = extendModule({
	module: FormElementsModules.MultiSelect,
	label: "Multi Select",
	icon: <img src={MultiSelectIcon} alt="Multi Select Icon" />,
	settingsRenderer: MultiSelectSettingsRenderer,
	editingRenderer: createEditingRenderer(FormElementsModules.MultiSelect.renderer)
});

function MultiSelectSettingsRenderer(props: NodeSettingProps<MultiSelectNode>): JSX.Element {
	return (
		<>
			<SettingTemplate.Section label="General">
				<ElementIdSetting
					nodeId={props.nodeId}
					elementFilter={{ groupUsageTypes: ["multi-select"] }}
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
			</SettingTemplate.Section>
			<SettingTemplate.Section label="Additional Settings">
				<SwitchSetting label={"Readonly"} settingPath={["readonly"]} />
				<MessageExpositionSetting />
				<SelectSetting
					label={"Show asterisk"}
					settingPath={["markingOfRequiredFields"]}
					items={markingOfRequiredFieldsItems}
					width={120}
				/>
			</SettingTemplate.Section>
			<AnnotationsSetting />
		</>
	);
}
