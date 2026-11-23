// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useCallback, useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

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
	const formModelPathStr = ModelPath.toString(props.formModelPath);
	const valuePathStr = DocumentPath.toString(value.path);
	const onValueSubmit = useCallback(
		(newValue: string) => {
			const result = newValue.trim();
			const change = result === "" ? null : result;
			options.eventHandlers.onValueChange(value.path, change, props.formModelPath);
		},
		// oxlint-disable-next-line react/exhaustive-deps
		[options.eventHandlers, formModelPathStr, valuePathStr]
	);

	return (
		<BufferedTextArea
			{...inputProps}
			autoExpand={props.modelElement.autoExpand}
			onValueSubmit={onValueSubmit}
			onValueChange={() => inputTouched(options)}
			inputProps={htmlInputProps}
			inputRef={(element: HTMLElement | null) => {
				if (props.inputRef) {
					props.inputRef.current = element;
				}
			}}
		/>
	);
}
