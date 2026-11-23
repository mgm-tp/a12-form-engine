// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/data-roles.js";
import type { HeadlineProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/typography/main/typography.api.js";

import type { WithDataTestId } from "../../../../back-end/utils/internal/types.js";
import { TYPOGRAPHY_HEADLINE } from "../../../rtl-utils/data-roles.js";

export function TypographyHeadline(props: WithDataTestId<HeadlineProps>): React.ReactNode {
	return (
		<div id={props.id} data-role={TYPOGRAPHY_HEADLINE} data-testid={props["data-testid"]}>
			<div data-role={DataRoles.Typography.Headline.Label}>{props.children}</div>
		</div>
	);
}
