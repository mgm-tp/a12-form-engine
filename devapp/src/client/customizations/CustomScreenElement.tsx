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

import { styled } from "styled-components";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import {
	DefaultFormModelMap,
	DocumentPath,
	FormModelPath,
	UiStateSelectors,
	ValidationMessages
} from "@com.mgmtp.a12.formengine/formengine-core";
import type { FormModel, FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core";
import { TextOutput } from "@com.mgmtp.a12.widgets/widgets-core";

export const CustomFormModelMapForCustomScreenElement: FormModelMap = {
	...DefaultFormModelMap,
	CustomScreenElement: {
		component: CustomScreenElement
	}
};

function CustomScreenElement(
	props: FormModelMap.FormModelComponentProps<FormModel.CustomScreenElement> &
		FormModelMap.CustomScreenElementProps
) {
	const formModelPath = FormModelPath.extend(props.config.parentPath, props.modelElement);

	const dataContext =
		UiStateSelectors.screenLocationStack()(props.config.renderOptions.state).at(-1)?.path ?? [];

	const errorForCustom = UiStateSelectors.customMessagesByPath(
		formModelPath,
		dataContext,
		"error"
	)(props.config.renderOptions.state);
	const warnForCustom = UiStateSelectors.customMessagesByPath(
		formModelPath,
		dataContext,
		"warning"
	)(props.config.renderOptions.state);
	const infoForCustom = UiStateSelectors.customMessagesByPath(
		formModelPath,
		dataContext,
		"info"
	)(props.config.renderOptions.state);

	return (
		<StyledContainer
			id={props.uiId} // required to make focusHandler work
			tabIndex={0}
		>
			<TextOutput
				errorMessage={
					errorForCustom.length ? (
						<ValidationMessages messages={errorForCustom.map(e => e.errorText)} />
					) : null
				}
				warningMessage={
					warnForCustom.length ? (
						<ValidationMessages messages={warnForCustom.map(e => e.errorText)} />
					) : null
				}
				infoMessage={
					infoForCustom.length ? (
						<ValidationMessages messages={infoForCustom.map(e => e.errorText)} />
					) : null
				}
			>
				id: <code>{props.modelElement.id}</code>
				<br />
				path: <code>{ModelPath.toString(formModelPath)}</code>
				<br />
				{dataContext.length > 0 && (
					<>
						<span>
							datacontext: <code>{DocumentPath.toString(dataContext)}</code>
						</span>
						<br />
					</>
				)}
				When focussed, I change color.
			</TextOutput>
		</StyledContainer>
	);
}

const StyledContainer = styled.div`
	outline: none;
	padding: 4px;
	border: 1px solid #000;
	border-radius: 4px;
	transition: background-color 0.5s;

	&:focus {
		background-color: #c2ffc2;
	}
`;
