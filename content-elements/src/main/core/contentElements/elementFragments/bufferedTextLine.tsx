// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext, useMemo } from "react";

import type {
	BufferedInputProps,
	ImmediateInputProps
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/buffered/main/buffered.api.js";
import {
	BufferedInput,
	HTMLInputAdapter
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/buffered/main/buffered.view.js";
import type { TextLineStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.api.js";

import { WidgetMapContext } from "../../widgetMap/widgetMap-context.js";

/**
 * @internal
 */
export type BufferedTextLineProps = BufferedInputProps<string> &
	ImmediateInputProps<string> &
	TextLineStatelessProps;

/**
 * @internal
 */
export function BufferedTextLine(props: BufferedTextLineProps): JSX.Element {
	const { TextLineStateless } = useContext(WidgetMapContext);

	const WrappedTextLine = useMemo(
		() => BufferedInput(HTMLInputAdapter(TextLineStateless)),
		[TextLineStateless]
	);

	return <WrappedTextLine {...props} />;
}
