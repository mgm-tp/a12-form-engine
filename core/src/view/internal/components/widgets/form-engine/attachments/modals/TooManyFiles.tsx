// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { LocalizableArgs } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { createResourceLocalizable } from "../../../../../../../back-end/localization/internal/factory.js";
import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/internal/languages/keys.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

interface TooManyFilesModalProps {
	readonly args?: LocalizableArgs;
	onClose: () => void;
}

/**@internal */
export function TooManyFilesModal(props: TooManyFilesModalProps): JSX.Element {
	const { args, onClose } = props;
	const { ModalNotification } = useContext(WidgetMapContext);
	const { localizer } = useContext(LocalizerContext);

	return (
		<ModalNotification
			title={localizer(
				createResourceLocalizable(RESOURCE_KEYS.repeat.multiFileUpload.dialog.tooManyFiles.title)
			)}
			variant="error"
			enableCloseButton
			closeOnEsc
			closeOnOutsideClick
			onClose={onClose}
		>
			<p>
				{localizer(
					createResourceLocalizable(
						RESOURCE_KEYS.repeat.multiFileUpload.dialog.tooManyFiles.text,
						args
					)
				)}
			</p>
		</ModalNotification>
	);
}
