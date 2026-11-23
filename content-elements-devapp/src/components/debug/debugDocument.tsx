// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";

import {
	Activity,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { NotRelevantConfig } from "@com.mgmtp.a12.client/client-data";
import { filterDocumentByRelevance, isSetDgCl } from "@com.mgmtp.a12.client/client-data";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { ActionContentbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/template/contentbox.tpl.view.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import { Checkbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/checkbox/main/checkbox.view.js";
import { ModalOverlay } from "@com.mgmtp.a12.widgets/widgets-core/lib/modal-overlay/main/modal-overlay.view.js";

import { createResourceLocalizable } from "../../localization/index.js";
import { RESOURCE_KEYS } from "../../localization/keys.js";

export const DebugDocumentButton = (props: { activityId: string }): React.JSX.Element | null => {
	const localizer = useContext(LocalizerContext).localizer;

	const [showModal, setShowModal] = useState(false);
	const [includeNonRelevant, setIncludeNonRelevant] = useState(false);

	const dataHolder = useSelector(
		ActivitySelectors.activityPropById(props.activityId, a => Activity.findDefaultDataHolder(a))
	);

	if (isSetDgCl(dataHolder?.data) && dataHolder.data.entryPoint) {
		const rootDoc = dataHolder.data.documentGraph.documents.byDocRef[dataHolder.data.entryPoint];
		if (rootDoc?.loadingState === "loaded") {
			const displayDocument = includeNonRelevant
				? rootDoc.document
				: filterDocumentByRelevance(
						rootDoc.document,
						rootDoc.documentModel as DocumentModel,
						rootDoc.notRelevantConfigs as NotRelevantConfig[]
					);

			return (
				<>
					<Button
						secondary
						label={localizer(createResourceLocalizable(RESOURCE_KEYS.header.debugDocument.button))}
						icon={<Icon>bug_report</Icon>}
						onClick={() => setShowModal(true)}
					/>
					{showModal && (
						<ModalOverlay closeOnOutsideClick onClose={() => setShowModal(false)}>
							<ActionContentbox
								headingElements={
									<ContentBoxElements.Title
										ariaLevel={1}
										text={localizer(
											createResourceLocalizable(RESOURCE_KEYS.header.debugDocument.title)
										)}
									/>
								}
								headingButtons={
									<ContentBoxElements.CloseButton onClick={() => setShowModal(false)} />
								}
								subActionBar={
									<ContentBoxElements.SubActionBar>
										<Checkbox
											checked={includeNonRelevant}
											onChange={setIncludeNonRelevant}
											label={localizer(
												createResourceLocalizable(RESOURCE_KEYS.header.debugDocument.checkbox)
											)}
										/>
									</ContentBoxElements.SubActionBar>
								}
							>
								<pre>{JSON.stringify(displayDocument, null, 2)}</pre>
							</ActionContentbox>
						</ModalOverlay>
					)}
				</>
			);
		}
	}

	return null;
};
