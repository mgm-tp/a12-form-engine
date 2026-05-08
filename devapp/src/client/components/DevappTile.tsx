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
