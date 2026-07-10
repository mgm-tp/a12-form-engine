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
import { useSelector } from "react-redux";

import type { ViewNGProps } from "@com.mgmtp.a12.client/client-core";
import { ActivitySelectors } from "@com.mgmtp.a12.client/client-core";
import { LayoutGrid } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Group } from "./DevappTile.js";
import { DevappTile } from "./DevappTile.js";

interface FormsList {
	readonly groups: { name: string; forms: string[] }[];
}

interface ModelsOverviewProps {
	readonly devAppModelsList?: FormsList;
}

interface WorkingList {
	readonly name: string;
	readonly group: Group[];
	numberOfForms: number;
}

export default function ModelsOverview(props: ViewNGProps): JSX.Element {
	const { devAppModelsList } = useSelector(
		ActivitySelectors.data(props.activityId)
	) as ModelsOverviewProps;

	const list: { [key: string]: WorkingList } = {};

	for (const entry of devAppModelsList?.groups ?? []) {
		const baseName = entry.name.split(".")[0];
		if (!(baseName in list)) {
			list[baseName] = {
				name: baseName,
				group: [],
				numberOfForms: 0
			};
		}

		list[baseName].group.push({
			name: entry.name,
			forms: entry.forms
		});

		list[baseName].numberOfForms += entry.forms.length;
	}

	const keys = Object.keys(list);
	let currentModels = 0;

	const columns: number[][] = [[], [], [], []];
	let currentTileArray = 0;
	for (let i = 0; i < keys.length; i++) {
		currentModels += list[keys[i]].numberOfForms;
		if (currentModels > 29 && currentTileArray < columns.length - 1) {
			currentModels = list[keys[i]].numberOfForms;
			currentTileArray++;
		}

		columns[currentTileArray].push(i);
	}

	return (
		<>
			<LayoutGrid.Grid disableNegativeMargin>
				<LayoutGrid.Row>
					{columns.map((rows, index) => {
						return (
							<LayoutGrid.Column key={index} size={{ sm: 9, md: 8, lg: 2 }}>
								<LayoutGrid.Grid>
									{rows.map((row, index) => {
										return (
											<LayoutGrid.Row key={index}>
												<LayoutGrid.Column size={{ sm: 9, md: 8, lg: 12 }}>
													<DevappTile
														color="#056294"
														removeBaseName
														index={row}
														list={list}
														key={row}
													/>
												</LayoutGrid.Column>
											</LayoutGrid.Row>
										);
									})}
								</LayoutGrid.Grid>
							</LayoutGrid.Column>
						);
					})}
				</LayoutGrid.Row>
			</LayoutGrid.Grid>
		</>
	);
}
