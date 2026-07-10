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

import type { ReactElement } from "react";
import { createContext, useContext } from "react";

import type { FormModel, FormModelMap, WidgetMap } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	DefaultFormModelMap,
	DefaultWidgetMap,
	FormModelPath,
	useDocumentPathForInput
} from "@com.mgmtp.a12.formengine/formengine-core";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { TextFieldProps } from "@com.mgmtp.a12.widgets/widgets-core";

/**
 * This example demonstrates how to customize a StringInput
 * via the `FormModelMap` and the `WidgetMap`.
 *
 * Each string input will render an input field, where the content is aligned
 * to the right and is changed to (and stored as) uppercase. Also there is no buffering
 * for input changes, so each change to the input field will directly trigger a store update.
 *
 * The `WidgetMap` is used to render a customized text input widget, which contains the
 * custom functionality needed for the StringInput.
 *
 * To be able to access the necessary control context from inside the custom widget,
 * the `FormModelMap` is used as well to render a customized Control component, which
 * wraps a Provider with the control props around it. That way, components below in the
 * render tree (like the custom text input widget) can then access these control props.
 *
 *
 */
export const CustomWidgetMapForCustomInput: WidgetMap = {
	...DefaultWidgetMap,
	TextField: StringInput
};

export const CustomFormModelMapForCustomInput: FormModelMap = {
	...DefaultFormModelMap,
	Control: {
		component: props => {
			return (
				<ControlContext.Provider value={props}>
					<DefaultFormModelMap.Control.component {...props} />
				</ControlContext.Provider>
			);
		}
	}
};

export const ControlContext = createContext<
	FormModelMap.FormModelComponentProps<FormModel.Control> | undefined
>(undefined);

function StringInput(props: TextFieldProps): ReactElement | null {
	const controlContext = useContext(ControlContext);
	if (controlContext === undefined) {
		throw new Error(`Context for control is missing!`);
	}

	const control = controlContext.modelElement;
	const state = controlContext.config.renderOptions.state;
	const documentModel = state.models.documentModel;

	const documentPath = useDocumentPathForInput(control.elementPath, documentModel);
	const formModelPath = FormModelPath.extend(controlContext.config.parentPath, control);

	const field = new DocumentServiceFactory()
		.getDocumentModelSearchService(documentModel)
		.getByPath(control.elementPath);

	// text input does not belong to a StringInput control,
	// just render the normal widget
	if (field?.type !== "Field" || field.fieldType.type !== "StringType") {
		return <DefaultWidgetMap.TextField {...props} />;
	}

	return (
		<DefaultWidgetMap.TextField
			{...props}
			textAlignment={"right"}
			onChange={ev => {
				controlContext.config.renderOptions.eventHandlers.onValueChange(
					documentPath,
					ev.target.value.toUpperCase(),
					formModelPath
				);
			}}
		/>
	);
}
