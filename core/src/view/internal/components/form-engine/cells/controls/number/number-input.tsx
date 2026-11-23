// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { ModelSelectors } from "../../../../../../../back-end/store/index.js";
import { DocumentModelUtils } from "../../../../../../../models/internal/utils/document-model-utils.js";
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

	const { inputRef } = props;
	const options = props.renderConfiguration.renderOptions;
	const value = props.value;

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
