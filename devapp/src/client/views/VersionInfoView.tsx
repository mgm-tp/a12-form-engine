// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { JSX } from "react";

import type { ViewNGProps } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { ActionContentbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/template/contentbox.tpl.view.js";

import { DependencyTreeTable } from "../components/DependencyTreeTable.js";

declare const __VERSION__: string;

export default function VersionInfoView(props: ViewNGProps): JSX.Element {
	const { localizer } = useContext(LocalizerContext);

	return (
		<ActionContentbox
			headingElements={
				<ContentBoxElements.Title
					text={`${localizer({ key: "version.info.currentVersion.label" })}: ${__VERSION__}`}
					ariaLevel={props.ariaLevel}
				/>
			}
			padding={false}
		>
			<DependencyTreeTable />
		</ActionContentbox>
	);
}
