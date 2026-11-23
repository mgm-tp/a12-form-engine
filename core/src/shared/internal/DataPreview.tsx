// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";
import { ActionContentbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/template/contentbox.tpl.view.js";
import { Checkbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/checkbox/main/checkbox.view.js";

import { assertExists } from "../../back-end/utils/internal/assertions.js";
import { FormActivity, FormEngineSelectors } from "../../client-extensions/index.js";

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
