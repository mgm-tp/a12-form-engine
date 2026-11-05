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

import type { ModelIndex } from "../modelIndex.js";

import { DevappTile } from "./DevappTile.js";
import { DocumentationTile, documentationAvailable } from "./DocumentationTile.js";

interface ModelsOverviewProps {
	readonly devAppModelsList?: ModelIndex;
}

/** four tile columns fill the twelve-column grid, halving down to one below lg */
const TILE_COLUMN_SIZE = { sm: 12, md: 6, lg: 3 } as const;
const FULL_WIDTH = { lg: 12 } as const;
const TILE_COLOR = "#056294";

const { Grid, Row, Column } = LayoutGrid;

export default function ModelsOverview(props: ViewNGProps): JSX.Element {
	const { devAppModelsList } = useSelector(
		ActivitySelectors.data(props.activityId)
	) as ModelsOverviewProps;

	return (
		<Grid disableNegativeMargin>
			<Row>
				{(devAppModelsList?.columns ?? []).map((column, columnIndex) => (
					<Column key={columnIndex} size={TILE_COLUMN_SIZE}>
						<Grid>
							{columnIndex === 0 && documentationAvailable && (
								<Row>
									<Column size={FULL_WIDTH}>
										<DocumentationTile ariaLevel={props.ariaLevel} />
									</Column>
								</Row>
							)}
							{column.tiles.map(tile => (
								<Row key={tile.name}>
									<Column size={FULL_WIDTH}>
										<DevappTile tile={tile} color={TILE_COLOR} ariaLevel={props.ariaLevel} />
									</Column>
								</Row>
							))}
						</Grid>
					</Column>
				))}
			</Row>
		</Grid>
	);
}
