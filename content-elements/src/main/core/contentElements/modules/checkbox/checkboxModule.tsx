// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { HTMLProps, JSX } from "react";
import { useContext, useRef } from "react";

import {
	useDocumentContext,
	useTableScreenReaderContext
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import type { BaseControlProps } from "../../../types/controlProps.js";
import { WidgetMapContext } from "../../../widgetMap/widgetMap-context.js";
import { createElementModule } from "../../createElementModule.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonWidgetSettings.js";
import { useFocus } from "../../focus.js";
import { nmTokensToString } from "../../nmtokens.js";

import type { CheckboxNode } from "./checkboxNode.js";
import { CHECKBOX_TYPE } from "./checkboxNode.js";
import { checkboxValidator } from "./checkboxValidator.js";

/** @internal */
export const CheckboxModule = createElementModule<CheckboxNode>({
	type: CHECKBOX_TYPE,
	renderer: CheckboxRenderer,
	validator: checkboxValidator
});

function CheckboxRenderer(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element | null {
	const { Checkbox } = useContext(WidgetMapContext);
	const inputRef = useRef<HTMLInputElement>(null);
	const { onValueChanged } = useDocumentContext(c => c.event);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const { uiId, dataReference, notRelevant, conversionConfig, ungroupedValidationMessages } =
		commonControlSettings;

	useFocus({
		uiId,
		dataReference,
		ref: inputRef,
		messages: ungroupedValidationMessages
	});

	const {
		value,
		label,
		hideLabel,
		helperText,
		readonly,
		error,
		warning,
		info,
		errors,
		warnings,
		infos,
		tooltips,
		tooltipsOnTop,
		inputProps,
		ariaDescribedBy
	} = USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(commonControlSettings);

	const cellId = useTableScreenReaderContext(c => c.screenReaderCellId);

	const finalInputProps = cellId
		? ({
				...inputProps,
				"aria-labelledby": `${uiId} ${cellId}`
			} satisfies HTMLProps<HTMLInputElement>)
		: inputProps;

	const handleValueChange = (newValue: boolean) => {
		if (conversionConfig?.type === "ConfirmType" && newValue === false) {
			onValueChanged({ path: dataReference, value: null });
		} else {
			onValueChanged({ path: dataReference, value: newValue });
		}
	};

	if (notRelevant) {
		return null;
	}

	return (
		<Checkbox
			id={uiId}
			checked={value === true}
			label={label}
			readonly={readonly}
			hideLabel={hideLabel}
			tooltips={tooltips}
			breakTooltipsToNewLine={tooltipsOnTop}
			helperText={helperText}
			error={error}
			errorMessage={errors}
			warning={warning}
			warningMessage={warnings}
			info={info}
			infoMessage={infos}
			inputProps={finalInputProps}
			inputRef={(ref: HTMLInputElement) => {
				inputRef.current = ref;
			}}
			ariaDescribedby={ariaDescribedBy.length ? nmTokensToString(ariaDescribedBy) : undefined}
			onChange={handleValueChange}
		/>
	);
}
