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

import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core";
import { FormActivity, FormEngineSelectors } from "@com.mgmtp.a12.formengine/formengine-core";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import {
	ActionContentbox,
	Checkbox,
	ContentBoxElements
} from "@com.mgmtp.a12.widgets/widgets-core";

import { assertExists } from "../utils/assertions.js";

const documentService = new DocumentServiceFactory().getDocumentService();

const STYLE = { height: "100%", overflowX: "auto" as const, margin: 0, padding: "18px" };

export function DataPreview(props: { activityId: string }): JSX.Element {
	const { activityId } = props;
	const [filterNotRelevant, setFilterNotRelevant] = useState(true);
	const document = useSelector(
		state =>
			(ActivitySelectors.data(activityId)(state) as FormActivity.Data.SingleDocumentData).document
	);
	const models = useSelector(FormEngineSelectors.models(activityId));
	assertExists(models, "Models should always exist!");
	const { id, modelId, ...documentToRender } = filterNotRelevant
		? FormActivity.Data.filterDataByRelevance(document, models)
		: document;

	return (
		<ActionContentbox
			headingElements={<ContentBoxElements.Title text="Data" />}
			subActionBar={
				<ContentBoxElements.ActionBar>
					<Checkbox
						checked={filterNotRelevant}
						onChange={setFilterNotRelevant}
						label="Hide not relevant"
					/>
				</ContentBoxElements.ActionBar>
			}
			padding={0}
		>
			<pre style={STYLE}>
				<code>
					{JSON.stringify(
						documentService.formatDates(documentToRender, models.documentModel),
						undefined,
						"  "
					)}
				</code>
			</pre>
		</ActionContentbox>
	);
}
