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

import type { JSX } from "react";
import { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { ViewViews } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import type { FormModelMap, WidgetMap } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	Events,
	FormEngineActions,
	FormEngineSelectors,
	FormModel,
	DefaultFormModelMap,
	DefaultWidgetMap,
	useDocumentPathForInput
} from "@com.mgmtp.a12.formengine/formengine-core";
import type {
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/template/contentbox.tpl.view.js";
import type { DatePickerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-picker.api.js";
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.api.js";
import type { HeadlineProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/typography/main/typography.api.js";

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
			return <TextLineWithHelperModal {...props} />;
		} else if (annotation.name === "showClearButton") {
			return <TextLineWithClearButton {...props} />;
		}

		return <DefaultWidgetMap.TextLineStateless {...props} />;
	},
	TypographyHeadline: (props: HeadlineProps) => {
		const customInputContext = useContext(CustomInputContext);
		const element = customInputContext.formModelElement;

		if (
			element === undefined ||
			!FormModel.ControlGrid.isInstance(element) ||
			element.annotations === undefined
		) {
			return <DefaultWidgetMap.TypographyHeadline {...props} />;
		}

		const annotation = element.annotations[0];
		if (annotation.name === "tooltip") {
			return (
				<DefaultWidgetMap.TypographyHeadline
					{...props}
					addons={
						<DefaultWidgetMap.HintTooltip
							text={annotation.value + " " + new Date().toLocaleDateString()}
						/>
					}
				/>
			);
		}

		return <DefaultWidgetMap.TypographyHeadline {...props} />;
	},
	DatePicker: (props: DatePickerProps) => {
		const customInputContext = useContext(CustomInputContext);
		const element = customInputContext.formModelElement;

		if (
			element === undefined ||
			!FormModel.Control.isInstance(element) ||
			element.annotations === undefined
		) {
			return <DefaultWidgetMap.DatePicker {...props} />;
		}

		const annotation = element.annotations[0];
		if (annotation.name === "restrictToNext14Days") {
			const startDate = new Date();
			const endDate = new Date(new Date().setDate(startDate.getDate() + 13));

			const extendedProps: DatePickerProps = {
				...props,
				disabled: {
					before: startDate,
					after: endDate
				}
			};

			return <DefaultWidgetMap.DatePicker {...extendedProps} />;
		}

		return <DefaultWidgetMap.DatePicker {...props} />;
	}
};

export const FormModelMapForWidgetMap: FormModelMap = {
	...DefaultFormModelMap,
	Control: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.Control>) => {
			return (
				<CustomInputContext.Provider value={{ formModelElement: props.modelElement }}>
					<DefaultFormModelMap.Control.component {...props} />
				</CustomInputContext.Provider>
			);
		}
	},
	ControlGrid: {
		component: (props: FormModelMap.FormModelComponentProps<FormModel.ControlGrid>) => {
			return (
				<CustomInputContext.Provider value={{ formModelElement: props.modelElement }}>
					<DefaultFormModelMap.ControlGrid.component {...props} />
				</CustomInputContext.Provider>
			);
		}
	}
};

function TextLineWithHelperModal(props: TextLineStatelessProps): JSX.Element {
	const [isOpen, setModalOpen] = useState(false);
	return (
		<>
			<DefaultWidgetMap.TextLineStateless
				{...props}
				addonAfter={
					<>
						{props.addonAfter}
						{
							<DefaultWidgetMap.Button
								icon={<DefaultWidgetMap.Icon size="big">emoji_objects</DefaultWidgetMap.Icon>}
								onClick={() => setModalOpen(true)}
							/>
						}
					</>
				}
			/>
			{isOpen && (
				<DefaultWidgetMap.ModalOverlay onClose={() => setModalOpen(false)}>
					<DefaultWidgetMap.ActionContentbox
						headingElements={
							<ContentBoxElements.Title
								ariaLevel={1}
								text={`Helper Text for field  ${props.label}`}
							/>
						}
						footer={
							<ContentBoxElements.Footer>
								<DefaultWidgetMap.Button onClick={() => setModalOpen(false)}>
									Close
								</DefaultWidgetMap.Button>
							</ContentBoxElements.Footer>
						}
						style={{ maxHeight: "500px" }}
					>
						<p>
							Some custom helper text which can be defined in the model or even be retrieved from
							another source in code.
						</p>
					</DefaultWidgetMap.ActionContentbox>
				</DefaultWidgetMap.ModalOverlay>
			)}
		</>
	);
}

function TextLineWithClearButton(props: TextLineStatelessProps): JSX.Element | null {
	const activityId = useContext(ViewViews.ActivityContext)?.activityId;

	// Assuming the layout correctly sets the ActivityContext and the TextLine would never be rendered without activity
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const documentModel = useSelector(FormEngineSelectors.models(activityId!))?.documentModel;

	return documentModel ? (
		<TextLineWithClearButtonInternal
			{...props}
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			activityId={activityId!}
			documentModel={documentModel}
		/>
	) : null;
}

function TextLineWithClearButtonInternal(
	props: TextLineStatelessProps & { activityId: string; documentModel: DocumentModel }
): JSX.Element {
	const { activityId, documentModel } = props;
	const dispatch = useDispatch();

	const customInputContext = useContext(CustomInputContext);
	const element = customInputContext.formModelElement;
	const modelPath = element && FormModel.Control.isInstance(element) ? element.elementPath : [];
	const documentPath = useDocumentPathForInput(modelPath, documentModel);

	const onClearButtonClicked = (path: EntityInstancePath, formModelElementPath: ModelPath) => {
		const engineEvent = Events.valueChange({ path, value: null, formModelElementPath });
		dispatch(FormEngineActions.event({ activityId, engineEvent }));
	};

	return (
		<DefaultWidgetMap.TextLineStateless
			{...props}
			suffixes={
				<DefaultWidgetMap.Button
					icon={<DefaultWidgetMap.Icon>close</DefaultWidgetMap.Icon>}
					destructive
					onClick={() => {
						onClearButtonClicked(documentPath, modelPath);
					}}
				/>
			}
		/>
	);
}
