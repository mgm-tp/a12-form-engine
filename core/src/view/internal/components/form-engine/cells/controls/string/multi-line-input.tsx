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
import { useCallback, useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { DocumentPath } from "../../../../../../../models/internal/utils/document-utils.js";
import { ComponentMapContext } from "../../../../../configuration/componentMap/component-map-context.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";

import { inputTouched } from "../input-touched.js";
import { useBasePropsForTextInputs } from "../use-input-props.js";

/** @internal */
export function MultilineInput(
	props: Inputs.InputProps<DocumentModel.StringType>
): ReactElement | null {
	const { BufferedTextArea } = useContext(ComponentMapContext);

	const options = props.renderConfiguration.renderOptions;
	const { inputRef } = props;
	const value = props.value;
	const { suffixes, truncateSuffix, htmlInputProps, ...inputProps } =
		useBasePropsForTextInputs(props);

	/**
	 * onValueSubmit cannot be memoized easily, because model/doc paths arrays
	 * are recreated on every render - this can be circumvented by using the
	 * string representation in the dependencies.
	 *
	 * Also note that no conversion is done, because a multi-line-input can only
	 * hold strings - which don't need conversion.
	 */
	const onValueSubmit = useCallback(
		(newValue: string) => {
			const result = newValue.trim();
			const change = result === "" ? null : result;
			options.eventHandlers.onValueChange(value.path, change, props.formModelPath);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			options.eventHandlers,
			// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
			ModelPath.toString(props.formModelPath),
			// eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
			DocumentPath.toString(value.path)
		]
	);

	return (
		<BufferedTextArea
			{...inputProps}
			autoExpand={props.modelElement.autoExpand}
			onValueSubmit={onValueSubmit}
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
