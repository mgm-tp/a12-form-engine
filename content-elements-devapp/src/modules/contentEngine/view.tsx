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

import type { JSX } from "react";
import { useSelector } from "react-redux";

import { ModelSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import type { ViewNGProps } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import {
	ContentEngineClientContainer,
	ElementLibraryRegistry,
	isContentModel
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { CONTENT_ENGINE_NAMESPACE } from "@com.mgmtp.a12.contentengine/contentengine-default-element-library";
import { withFormElementContexts } from "@com.mgmtp.a12.formengine/formengine-content-elements";
import { ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core/lib/button-group/main/button-group.view.js";
import { ActionContentbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.view.js";

import { DebugDocumentButton } from "../../components/debug/debugDocument.js";
import { FocusFirstErrorButton } from "../../components/focus/focusFirstErrorButton.js";
import { ValidateButton } from "../../components/validation/validateButton.js";

export function ContentEngineView(props: Readonly<ViewNGProps>): JSX.Element | null {
	const contentModelName = useSelector(state => selectContentModelName(state, props.activityId));

	const contentModel = useSelector(
		ModelSelectors.modelByName(contentModelName || "", isContentModel)
	);

	const libraryId = ElementLibraryRegistry.get().getEntry(CONTENT_ENGINE_NAMESPACE).id;
	return (
		<ActionContentbox
			headingButtons={
				<ButtonGroup>
					<DebugDocumentButton activityId={props.activityId} />
					<FocusFirstErrorButton />
					<ValidateButton activityId={props.activityId} />
				</ButtonGroup>
			}
		>
			<ContentEngineClientContainer
				{...props}
				name={"DummyViewName"}
				contentModel={contentModel}
				libraryId={libraryId}
				enabledErrorBoundary={"development"}
			/>
		</ActionContentbox>
	);
}

export const WrappedContentEngineView = withFormElementContexts({
	ViewComponent: ContentEngineView
});

function selectContentModelName(state: object, activityId: string): string {
	const modelDescriptors = ModelSelectors.modelDescriptorsByActivityId(activityId)(state);
	return modelDescriptors?.find(d => d.modelType === "content")?.name ?? "";
}
