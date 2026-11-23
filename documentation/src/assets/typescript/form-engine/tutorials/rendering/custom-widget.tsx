// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

// tag::content[]

import type { JSX } from "react";
import { createContext, useContext } from "react";

import type { FormModelMap, WidgetMap } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	FormModel,
	DefaultFormModelMap,
	DefaultWidgetMap
} from "@com.mgmtp.a12.formengine/formengine-core";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.api.js";

const CustomInputContext = createContext<{
	formModelElement?: FormModel.Control | FormModel.BasicScreenElement;
}>({});

export const CustomWidgetMap: WidgetMap = {
	...DefaultWidgetMap,
	TextLineStateless: (props: TextLineStatelessProps) => {
		const customInputContext = useContext(CustomInputContext);
		const element = customInputContext.formModelElement;
		if (
			element === undefined ||
			!FormModel.Control.isInstance(element) ||
			element.annotations === undefined
		) {
			return <DefaultWidgetMap.TextLineStateless {...props} />;
		}

		const annotation = element.annotations[0];
		if (annotation.name === "showHelpText") {
			return <TextLineWithButton {...props} />;
		}

		return <DefaultWidgetMap.TextLineStateless {...props} />;
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

function TextLineWithButton(props: TextLineStatelessProps): JSX.Element {
	return (
		<DefaultWidgetMap.TextLineStateless
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
