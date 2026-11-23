// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ComponentType } from "react";
import { useContext, useMemo } from "react";

import type {
	BufferedInputProps,
	ImmediateInputProps
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/buffered/main/buffered.api.js";
import {
	BufferedInput,
	HTMLInputAdapter
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/buffered/main/buffered.view.js";
import type { TextAreaStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-area/main/template/text-area.tpl.api.js";

import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

/**
 * @internal
 * @ignore
 */
export const BufferedTextArea: ComponentType<BufferedTextArea.PropsType> =
	function BufferedTextArea(props: BufferedTextArea.PropsType) {
		const TextAreaStatelessComponent = useContext(WidgetMapContext).TextAreaStateless;
		const WrappedTextAreaStateless: ComponentType<BufferedTextArea.PropsType> = useMemo(
			() => BufferedInput(HTMLInputAdapter(TextAreaStatelessComponent)),
			[TextAreaStatelessComponent]
		);

		return <WrappedTextAreaStateless {...props} />;
	};

/**
 * @internal
 * @ignore
 */
export namespace BufferedTextArea {
	export type PropsType = BufferedInputProps<string> &
		ImmediateInputProps<string> &
		TextAreaStatelessProps;
}
