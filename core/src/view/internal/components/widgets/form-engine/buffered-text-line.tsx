// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";

import type {
	BufferedInputProps,
	ImmediateInputProps
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/buffered/main/buffered.api.js";
import {
	BufferedInput,
	HTMLInputAdapter
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/buffered/main/buffered.view.js";
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.api.js";

import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

/**
 * @internal
 * @ignore
 */
export const BufferedTextLineInternal = BufferedInput(
	HTMLInputAdapter(function (props: TextLineStatelessProps) {
		const TextLineStateless = useContext(WidgetMapContext).TextLineStateless;

		return <TextLineStateless {...props} />;
	})
);

/**
 * @internal
 * @ignore
 */
export function BufferedTextLine(props: BufferedTextLine.PropsType) {
	return <BufferedTextLineInternal {...props} submitOnEnter />;
}

/**
 * @internal
 * @ignore
 */
export namespace BufferedTextLine {
	export type PropsType = BufferedInputProps<string> &
		ImmediateInputProps<string> &
		TextLineStatelessProps;
}
