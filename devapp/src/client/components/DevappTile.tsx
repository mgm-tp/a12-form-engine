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
import { useDispatch } from "react-redux";
import { styled } from "styled-components";

import { ActivityActions, NEW_INSTANCE_IDENTIFIER } from "@com.mgmtp.a12.client/client-core";
import { Link, Tile } from "@com.mgmtp.a12.widgets/widgets-core";

import type { FormEntry, ModelTile } from "../modelIndex.js";

interface DevappTileProps {
	readonly tile: ModelTile;
	readonly color?: string;
	readonly ariaLevel?: number;
}

export function DevappTile({ tile, color, ariaLevel }: DevappTileProps): JSX.Element {
	return (
		<Tile title={tile.name} color={color} ariaLevel={ariaLevel}>
			{tile.forms.map(form => (
				<FormEntryLink key={form.modelId} form={form} />
			))}
			<br />
		</Tile>
	);
}

interface FormEntryLinkProps {
	readonly form: FormEntry;
}

function FormEntryLink({ form }: FormEntryLinkProps): JSX.Element {
	const dispatch = useDispatch();

	return (
		<BlockLink
			onClick={() =>
				dispatch(
					ActivityActions.create({
						activityDescriptor: {
							instance: NEW_INSTANCE_IDENTIFIER,
							formName: form.modelId
						}
					})
				)
			}
		>
			{form.label}
		</BlockLink>
	);
}

/** widgets renders Link inline; block stacks the entries, fit-content keeps the hit area on the text */
const BlockLink = styled(Link)`
	display: block;
	width: fit-content;
`;
