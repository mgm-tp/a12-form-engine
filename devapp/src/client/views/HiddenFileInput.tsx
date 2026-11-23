// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactNode } from "react";
import { useDispatch } from "react-redux";

import { NotificationActions } from "@com.mgmtp.a12.client/client-core/lib/core/notification/index.js";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/localization/LocalizableFactory.js";
import { LoggerFactory } from "@com.mgmtp.a12.utils/utils-logging/lib/factory.js";
import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils.js";

import { devappTranslationSource } from "../config/devappTranslationSource.js";

const logger = LoggerFactory.getLogger("devapp");

type HiddenFileInputProps = {
	readonly activityId: string;
	readonly inputRef: React.Ref<HTMLInputElement>;
	readonly onDataUploaded: (data: object) => void;
};

export function HiddenFileInput(props: HiddenFileInputProps): ReactNode {
	const dispatch = useDispatch();
	return (
		<input
			type="file"
			accept=".json"
			ref={props.inputRef}
			multiple={false}
			onChange={event => {
				const fileList = event.currentTarget.files;
				if (fileList && fileList.length > 0) {
					const fileReader = new FileReader();
					fileReader.addEventListener("load", () => {
						if (typeof fileReader.result === "string") {
							try {
								const data = JSON.parse(fileReader.result);
								props.onDataUploaded(data);

								dispatch(
									NotificationActions.add({
										activityId: props.activityId,
										title: localizableFromLocalizationTreeMap(
											"data.import.success",
											devappTranslationSource
										),
										severity: "success",
										duration: 5000
									})
								);
							} catch (error) {
								dispatch(
									NotificationActions.add({
										activityId: props.activityId,
										title: localizableFromLocalizationTreeMap(
											"data.import.error.title",
											devappTranslationSource
										),
										message: localizableFromLocalizationTreeMap(
											"data.import.error.message",
											devappTranslationSource
										),
										severity: "error"
									})
								);

								logger.error(error);
							}
						} else {
							dispatch(
								NotificationActions.add({
									activityId: props.activityId,
									title: localizableFromLocalizationTreeMap(
										"data.import.emptyData",
										devappTranslationSource
									),
									duration: 5000
								})
							);
						}
					});
					fileReader.readAsText(fileList[0]);
				}
				event.currentTarget.value = "";
			}}
			hidden
			className={addPrefix("-u-hidden")}
		/>
	);
}
