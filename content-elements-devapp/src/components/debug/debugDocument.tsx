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

import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";

import { Activity, ActivitySelectors } from "@com.mgmtp.a12.client/client-core";
import type { NotRelevantConfig } from "@com.mgmtp.a12.client/client-data";
import { filterDocumentByRelevance, isSetDgCl } from "@com.mgmtp.a12.client/client-data";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import {
	Button,
	ActionContentbox,
	ContentBoxElements,
	Icon,
	Checkbox,
	ModalOverlay
} from "@com.mgmtp.a12.widgets/widgets-core";

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
						rootDoc.documentModel as unknown as DocumentModel, // TODO: remove
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
