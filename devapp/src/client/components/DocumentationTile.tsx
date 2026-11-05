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

import { Tile, ExternalLink } from "@com.mgmtp.a12.widgets/widgets-core";

declare const __DOCS_AVAILABLE__: boolean;

/**
 * The manual and the typedoc are placed next to the app by the docker image and
 * are absent from a plain devapp build. Callers check this before laying the
 * tile out, so an unavailable one leaves no empty space behind.
 */
export const documentationAvailable = typeof __DOCS_AVAILABLE__ === "boolean" && __DOCS_AVAILABLE__;

interface DocumentationTileProps {
	readonly ariaLevel?: number;
}

/** Links to the manual and the typedoc. Only render this if {@link documentationAvailable}. */
export function DocumentationTile({ ariaLevel }: DocumentationTileProps): JSX.Element {
	return (
		<Tile title="Documentation" icon="menu_book" ariaLevel={ariaLevel}>
			<div>
				<ExternalLink href="./doc/manual/index.html">User Manual</ExternalLink>
			</div>
			<div>
				<ExternalLink href="./doc/manual/assets/typedoc/index.html">Typedoc</ExternalLink>
			</div>
			<br />
		</Tile>
	);
}
