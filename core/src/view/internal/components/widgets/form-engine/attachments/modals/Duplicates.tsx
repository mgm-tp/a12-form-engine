// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { LocalizableArgs } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { createResourceLocalizable } from "../../../../../../../back-end/localization/internal/factory.js";
import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/internal/languages/keys.js";
import type { LocalizableFactory } from "../../../../../../../back-end/localization/internal/localization.js";
import type { FormModel } from "../../../../../../../models/internal/form-model.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

interface DuplicatesModalProps {
	readonly repeat: FormModel.Repeat;
	readonly repeatFormModelPath: ModelPath;
	readonly duplicates: string[];
	readonly localizableFactory: LocalizableFactory;
	onSkip: () => void;
	onReplace: () => void;
	onUploadAsCopy: () => void;
}

/**@internal */
export function DuplicatesModal(props: DuplicatesModalProps): JSX.Element {
	const {
		repeat,
		repeatFormModelPath,
		duplicates,
		localizableFactory,
		onSkip,
		onReplace,
		onUploadAsCopy
	} = props;

	const { ModalNotification, ButtonGroup, Button } = useContext(WidgetMapContext);
	const { localizer } = useContext(LocalizerContext);

	const args: LocalizableArgs = {
		DUPLICATE_COUNT: { type: "plain", value: duplicates.length },
		FILE_NAME: { type: "plain", value: duplicates[0] }
	};

	return (
		<ModalNotification
			closeOnEsc
			closeOnOutsideClick
			onClose={onSkip}
			title={
				duplicates.length === 1
					? localizer(
							createResourceLocalizable(RESOURCE_KEYS.repeat.multiFileUpload.dialog.duplicate.title)
						)
					: localizer(
							createResourceLocalizable(
								RESOURCE_KEYS.repeat.multiFileUpload.dialog.multipleDuplicates.title,
								args
							)
						)
			}
			footer={
				<ButtonGroup alignment="right">
					<Button
						key={"duplicates-skip"}
						label={localizer(
							...localizableFactory.componentButtonLabels(repeat, repeatFormModelPath, "SKIP")
						)}
						onClick={onSkip}
					/>
					<Button
						key={"duplicates-replace"}
						label={localizer(
							...localizableFactory.componentButtonLabels(repeat, repeatFormModelPath, "REPLACE")
						)}
						onClick={onReplace}
					/>
					<Button
						key={"duplicates-copy"}
						label={localizer(
							...localizableFactory.componentButtonLabels(
								repeat,
								repeatFormModelPath,
								"UPLOAD_AS_COPY"
							)
						)}
						onClick={onUploadAsCopy}
					></Button>
				</ButtonGroup>
			}
			variant="warning"
			key="dialog"
		>
			<p>
				{duplicates.length === 1
					? localizer(
							createResourceLocalizable(
								RESOURCE_KEYS.repeat.multiFileUpload.dialog.duplicate.text,
								args
							)
						)
					: localizer(
							createResourceLocalizable(
								RESOURCE_KEYS.repeat.multiFileUpload.dialog.multipleDuplicates.text,
								args
							)
						)}
			</p>
		</ModalNotification>
	);
}
