// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ComponentType } from "react";
import { memo } from "react";
import { DndProvider } from "react-dnd";

import { DragAndDropUtils } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/drag-and-drop-utils.js";

import { ModelSelectors } from "../../../../back-end/store/index.js";
import type { FormModelMap } from "../../configuration/engine-configuration.js";

import { FormEngineContentBoxRenderer } from "../content-box/content-box-renderer.js";

import type { FormEngineRendererPropsType } from "./form-engine-props.js";

/**
 * Plain (non-connected) React component to render a form model.
 */
export const FormEngineRenderer: ComponentType<FormEngineRendererPropsType> = memo(
	function FormEngineRenderer(props) {
		const engineProps: FormModelMap.RenderConfiguration = {
			renderOptions: {
				...props,
				state: props.state
			},
			parentPath: []
		};

		const FormModelComponent = engineProps.renderOptions.config.formModelMap.Form.component;

		return (
			<DndProvider
				backend={DragAndDropUtils.DefaultDndBackend}
				options={DragAndDropUtils.DefaultDndBackendOptions}
			>
				<FormEngineContentBoxRenderer {...props}>
					<FormModelComponent
						config={engineProps}
						modelElement={ModelSelectors.formModel()(engineProps.renderOptions.state)}
						scrollRef={props.scrollRef}
					/>
				</FormEngineContentBoxRenderer>
			</DndProvider>
		);
	},
	/*
	 * Only the disable prop is compared here for rendering optimization.
	 * The idea is that the form engine should not re-render while it is disabled since the user cannot interact with it
	 * anyway.
	 */
	(prevProps, nextProps) => {
		return prevProps.state.ui.disabled && nextProps.state.ui.disabled;
	}
);
