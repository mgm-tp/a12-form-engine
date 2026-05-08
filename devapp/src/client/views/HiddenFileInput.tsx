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
 * 1. Open-Source License – EUPL v1.2
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
