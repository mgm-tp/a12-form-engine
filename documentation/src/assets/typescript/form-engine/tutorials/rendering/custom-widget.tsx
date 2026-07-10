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

// tag::content[]

import type { JSX } from "react";
import { createContext, useContext } from "react";

import {
	DefaultFormModelMap,
	DefaultWidgetMap,
	isFormModelControl
} from "@com.mgmtp.a12.formengine/formengine-core";
import type { FormModel, FormModelMap, WidgetMap } from "@com.mgmtp.a12.formengine/formengine-core";
import { Button, Icon } from "@com.mgmtp.a12.widgets/widgets-core";
import type { TextFieldProps } from "@com.mgmtp.a12.widgets/widgets-core";

const CustomInputContext = createContext<{
	formModelElement?: FormModel.Control | FormModel.BasicScreenElement;
}>({});

export const CustomWidgetMap: WidgetMap = {
	...DefaultWidgetMap,
	TextField: (props: TextFieldProps) => {
		const customInputContext = useContext(CustomInputContext);
		const element = customInputContext.formModelElement;
		if (
			element === undefined ||
			!isFormModelControl(element) ||
			element.annotations === undefined
		) {
			return <DefaultWidgetMap.TextField {...props} />;
		}

		const annotation = element.annotations[0];
		if (annotation.name === "showHelpText") {
			return <TextLineWithButton {...props} />;
		}

		return <DefaultWidgetMap.TextField {...props} />;
	}
};

export const FormModelMapForWidgetMap: FormModelMap = {
	...DefaultFormModelMap,
	Control: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.Control>) => {
			return (
				/**
				 * Wrapping the context around the Control component is
				 * necessary, because we want to access the annotations in
				 * the CustomWidgetMap. Therefore we need access to the current
				 * formModelElement, that is provided by this context.
				 */
				<CustomInputContext.Provider value={{ formModelElement: props.modelElement }}>
					<DefaultFormModelMap.Control.component {...props} />
				</CustomInputContext.Provider>
			);
		}
	}
};

function TextLineWithButton(props: TextFieldProps): JSX.Element {
	return (
		<DefaultWidgetMap.TextField
			{...props}
			addonAfter={
				<>
					{props.addonAfter}
					{
						<Button
							icon={<Icon>help</Icon>}
							onClick={() => {
								/* do something */
							}}
						/>
					}
				</>
			}
		/>
	);
}
// end::content[]
