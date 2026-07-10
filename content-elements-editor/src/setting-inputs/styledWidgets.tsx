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

import { css, styled } from "styled-components";

import {
	BufferedInput,
	CustomSelect,
	HTMLInputAdapter,
	StyledSelectTemplate,
	StyledSwitchControl,
	Switch,
	TextAreaStateless,
	TextField
} from "@com.mgmtp.a12.widgets/widgets-core";
import type { CustomSelectProps, DefaultThemeType } from "@com.mgmtp.a12.widgets/widgets-core";

const WidgetsBufferedInput = BufferedInput(HTMLInputAdapter(TextField));
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
			border: ${readonly &&
			`1px solid ${(theme as DefaultThemeType).colors.interaction.readonly.color}`};
			flex-grow: 0;
		}

		${StyledSelectTemplate.StyledSelectInput} {
			width: ${$width ?? 70}px;
		}
	`;
});
