// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

import type {
	EditorElementModule,
	NodeSettingProps
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { SettingTemplate } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { DatePickerNode } from "@com.mgmtp.a12.formengine/formengine-content-elements";
import { FormElementsModules } from "@com.mgmtp.a12.formengine/formengine-content-elements";

import { markingOfRequiredFieldsItems } from "../dropdownItems.js";
import { extendModule } from "../extendModule.js";
import { AnnotationsSetting } from "../setting-inputs/annotationsSetting.js";
import { DatePickerConfigSetting } from "../setting-inputs/datePickerConfigSetting.js";
import { ElementIdSetting } from "../setting-inputs/elementIdSetting.js";
import { LocalizedTextSetting } from "../setting-inputs/localizedTextSetting.js";
import { MessageExpositionSetting } from "../setting-inputs/messageExpositionSetting.js";
import { SelectSetting } from "../setting-inputs/selectSetting.js";
import { SwitchSetting } from "../setting-inputs/switchSetting.js";
import { TextSetting } from "../setting-inputs/textSetting.js";

import { createEditingRenderer } from "./createEditingRenderer.js";
import DatePickerIcon from "./icons/datePicker.icon.svg";

/** @internal */
export const DatePickerEditorModule: EditorElementModule<DatePickerNode> = extendModule({
	module: FormElementsModules.DatePicker,
	label: "Date Picker",
	icon: <img src={DatePickerIcon} alt="Date Picker Icon" />,
	settingsRenderer: DatePickerSettingsRenderer,
	editingRenderer: createEditingRenderer(FormElementsModules.DatePicker.renderer)
});

function DatePickerSettingsRenderer(props: NodeSettingProps<DatePickerNode>): JSX.Element {
	return (
		<>
			<SettingTemplate.Section label="General">
				<ElementIdSetting
					nodeId={props.nodeId}
					elementFilter={{
						fieldTypes: [
							"DateType",
							"DateTimeType",
							"TimeType",
							"DateFragmentType",
							"DateRangeType"
						]
					}}
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
				<TextSetting label={"Auto Complete"} settingPath={["autoComplete"]} />
				<SelectSetting
					label={"Show asterisk"}
					settingPath={["markingOfRequiredFields"]}
					items={markingOfRequiredFieldsItems}
					width={120}
				/>
			</SettingTemplate.Section>
			<DatePickerConfigSetting />
			<AnnotationsSetting />
		</>
	);
}
