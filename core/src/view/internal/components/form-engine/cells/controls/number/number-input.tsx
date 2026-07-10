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
import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { ModelSelectors } from "../../../../../../../back-end/store/index.js";
import * as DocumentModelUtils from "../../../../../../../models/internal/utils/document-model-utils.js";
import { ComponentMapContext } from "../../../../../configuration/componentMap/component-map-context.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";

import { useForceUpdate } from "../forceUpdate.js";
import { inputTouched } from "../input-touched.js";
import { useBasePropsForTextInputs } from "../use-input-props.js";

/** @internal */
export function NumberInput(
	props: Inputs.InputProps<DocumentModel.NumberType>
): ReactElement | null {
	const conversion = useContext(LocalizerContext).conversion;
	const { BufferedTextLine } = useContext(ComponentMapContext);

	const forceUpdate = useForceUpdate();

	const options = props.renderConfiguration.renderOptions;
	const value = props.value;
	const { inputRef } = props;
	const documentModel = ModelSelectors.documentModel()(options.state);
	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, value.path);

	const { htmlInputProps, ...inputProps } = useBasePropsForTextInputs(props);

	return (
		<BufferedTextLine
			{...inputProps}
			onValueSubmit={(newValue: string) => {
				// force re-render to update displayed value according to locale
				// formatting (when typed value didn't change)
				forceUpdate();

				const result = conversion.parseValue(newValue.trim(), conversionConfig);

				if (result.parseError) {
					options.eventHandlers.onParseError(value.path, newValue, result.parseError);
				} else {
					options.eventHandlers.onValueChange(value.path, result.value!, props.formModelPath);
				}
			}}
			onValueChange={() => inputTouched(options)}
			inputProps={htmlInputProps}
			inputRef={(element: HTMLElement | null) => {
				if (inputRef) {
					inputRef.current = element;
				}
			}}
		/>
	);
}
