// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { DndProvider } from "react-dnd";

import type { ViewNGProps } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import {
	ContentEditorClientFactories,
	DefaultComponentMap,
	MenuTemplate
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { DragAndDropUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/drag-and-drop-utils.js";

import { EditorSettingsButton } from "../../components/editorSettings/editorSettingsButton.js";

export function ContentEditorView(props: ViewNGProps): JSX.Element | null {
	return (
		<DndProvider
			backend={DragAndDropUtils.DefaultDndBackend}
			options={DragAndDropUtils.DefaultDndBackendOptions}
		>
			<ContentEditorClientFactories.ViewComponent
				{...props}
				name={""}
				enabledInlineEditing={true}
				componentMap={{
					...DefaultComponentMap,
					Menu: () => <Menu activityId={props.activityId} />
				}}
			/>
		</DndProvider>
	);
}

function Menu(props: { activityId: string }): JSX.Element {
	return (
		<MenuTemplate.Menu
			rightSlots={[<DefaultComponentMap.ToggleSettingPanelButton key="toggle-setting" />]}
			leftSlots={[
				<DefaultComponentMap.ToggleComponentPanelButton key="toggle-component" />,
				<EditorSettingsButton key="editor-settings-button" activityId={props.activityId} />
			]}
		/>
	);
}
