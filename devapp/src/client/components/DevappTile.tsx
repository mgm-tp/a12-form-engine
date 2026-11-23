// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useDispatch } from "react-redux";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core/lib/core/application/index.js";
import { Tile } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/tile/tile.view.js";
import { Link } from "@com.mgmtp.a12.widgets/widgets-core/lib/link/main/link/link.view.js";

export interface Group {
	name: string;
	forms: string[];
}

interface DevappTileProps {
	readonly title?: string;
	readonly ariaLevel?: number;
	readonly color?: string;
	readonly icon?: string;
	readonly list: Record<string, { name: string; group: Group[] }>;
	readonly index: number;
	readonly removeBaseName?: boolean;
}

export function DevappTile(props: DevappTileProps): JSX.Element {
	const dispatch = useDispatch();
	const { list, index, title, color } = props;
	const keys = Object.keys(list);

	const forms: { formName: string; form: string; group: string }[] = [];
	const groups = list[keys[index]].group;

	for (let i = 0; i < groups.length; i++) {
		const gName = props.removeBaseName
			? groups[i].name.split(".").slice(1).join(".")
			: groups[i].name;
		for (let j = 0; j < groups[i].forms.length; j++) {
			const form = groups[i].forms[j];
			const formName =
				(gName === "debug" ? form : `${gName}${gName !== "" && form !== "" ? "." : ""}${form}`) ||
				groups[i].name;
			forms.push({ formName, form, group: groups[i].name });
		}
	}

	forms.sort((f1, f2) => (f1.formName < f2.formName ? -1 : 1));

	return (
		<Tile title={title ?? list[keys[index]].name} color={color}>
			{forms.map((f, i) => {
				return (
					<div key={i}>
						<Link
							onClick={() =>
								dispatch(
									ActivityActions.create({
										activityDescriptor: {
											instance: NEW_INSTANCE_IDENTIFIER,
											formName: getFormModelId(f.group, f.form)
										}
									})
								)
							}
						>
							{f.formName}
						</Link>
						<br />
					</div>
				);
			})}
			<br />
		</Tile>
	);
}

function getFormModelId(group: string, form?: string): string {
	return group !== "debug" ? `${group}${form ? "." + form : ""}-form` : (form ?? "");
}
