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
 * 1. Open-Source License – EUPL v1.2
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
