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

import { useContext, type JSX } from "react";

import type { ViewNGProps } from "@com.mgmtp.a12.client/client-core/lib/core/view/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils.js";
import { ActionContentbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/template/contentbox.tpl.view.js";

export default function ContactView(props: ViewNGProps): JSX.Element {
	const { localizer } = useContext(LocalizerContext);
	return (
		<ActionContentbox
			padding="24px"
			headingElements={
				<ContentBoxElements.Title
					text={localizer({ key: "about.contact.title" })}
					ariaLevel={props.ariaLevel ?? 1}
				/>
			}
		>
			<div className={addPrefix("-u-flex")}>
				<img src="images/mgmBerlin.png" />
				<div className={addPrefix("-u-margin-l-md")}>
					<span>
						<strong>Berlin</strong>
						<br />
						mgm technology partners gmbh
						<br />
						Torstrasse 164
						<br />
						10115 Berlin
						<br />
						Phone +49 30 / 300 131 3-0
						<br />
						Fax +49 30 / 300 131 3-588
					</span>
					<p>{localizer({ key: "about.contact.locations.berlin" })}</p>
				</div>
			</div>
			<div className={addPrefix("-u-flex -u-margin-t-md")}>
				<img src="images/mgmHamburg.jpg" />
				<div className={addPrefix("-u-margin-l-md")}>
					<span>
						<strong>Hamburg</strong>
						<br />
						mgm technology partners gmbh
						<br />
						Hollaendischer Brook 2<br />
						20457 Hamburg
						<br />
						Phone +49 40 / 808 128 20-0
						<br />
						Fax +49 40 / 808 128 20-388
					</span>
					<p>{localizer({ key: "about.contact.locations.hamburg" })}</p>
				</div>
			</div>
		</ActionContentbox>
	);
}
