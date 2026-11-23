// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { css, styled } from "styled-components";

import {
	BufferedInput,
	HTMLInputAdapter
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/buffered/main/buffered.view.js";
import { CustomSelect } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/custom-select.view.js";
import type { CustomSelectProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/select.api.js";
import { StyledSelectTemplate } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/select.styled.js";
import { StyledSwitchControl } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/switch/main/switch.styled.js";
import { Switch } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/switch/main/switch.view.js";
import { TextAreaStateless } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-area/main/template/text-area.tpl.view.js";
import { TextLineStateless } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.view.js";

const WidgetsBufferedInput = BufferedInput(HTMLInputAdapter(TextLineStateless));
const WidgetsBufferedArea = BufferedInput(HTMLInputAdapter(TextAreaStateless));

// FIXME: Copied from Content Engine internal
/** @internal */
export const StyledBufferedInput = styled(WidgetsBufferedInput)<{ $width: string }>(({
	$width
}) => {
	return css`
		width: ${$width};
	`;
});

/** @internal */
export const StyledBufferedArea = styled(WidgetsBufferedArea)<{ $width: string }>(({ $width }) => {
	return css`
		width: ${$width};
	`;
});

// FIXME: Copied from Content Engine internal
/** @internal */
export const StyledSwitch = styled(Switch)`
	width: unset;

	${StyledSwitchControl} {
		justify-content: end;
	}
`;

// FIXME: Copied from Content Engine internal
/** @internal */
export const StyledSelect = styled(CustomSelect)<CustomSelectProps & { $width?: number }>(({
	$width,
	theme,
	readonly
}) => {
	return css`
		width: unset;
		flex-grow: 0;

		${StyledSelectTemplate.StyledFieldSelectWrapper} {
			border: ${readonly && `1px solid ${theme.colors.interaction.readonly.color}`};
			flex-grow: 0;
		}

		${StyledSelectTemplate.StyledSelectInput} {
			width: ${$width ?? 70}px;
		}
	`;
});
