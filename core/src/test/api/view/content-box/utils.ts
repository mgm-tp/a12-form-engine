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

import type { EngineStore, Models } from "../../../../back-end/store/index.js";
import { getNullMock } from "../../../rtl-utils/mock-utils.js";
import { DocumentHelpers } from "../../../utils/document-helpers.js";
import { FormModelHelpers, ModelHelpers } from "../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../utils/setup.js";

const { setupContentBoxRendererWithRtl } = SetupHelpers;

type SetupProps = {
	readonly models: Models;
	readonly buttons?: {
		readonly subHeader?: FormModelHelpers.ButtonsDef;
		readonly footer?: FormModelHelpers.ButtonsDef;
		readonly screenSubHeader?: FormModelHelpers.ButtonsDef;
		readonly screenFooter?: FormModelHelpers.ButtonsDef;
	};
	readonly isReadonly?: boolean;
	readonly isDisabled?: boolean;
	readonly locationStack?: EngineStore.UIState["screenLocation"];
	readonly screenName?: string;
};

type AllButtonSetup = Omit<SetupProps, "buttons"> & {
	readonly buttons?: ReadonlyArray<FormModelHelpers.ButtonDef>;
};

export function setupFooterButtonTests({ buttons, ...rest }: AllButtonSetup) {
	return setupForButtonTests({
		buttons: {
			footer: { major: buttons, minor: buttons },
			screenFooter: { major: buttons, minor: buttons }
		},
		...rest
	});
}

export function setupSubheaderButtonTests({ buttons, ...rest }: AllButtonSetup) {
	return setupForButtonTests({
		buttons: {
			subHeader: { major: buttons, minor: buttons },
			screenSubHeader: { major: buttons, minor: buttons }
		},
		...rest
	});
}

export function setupForButtonTests({
	models,
	buttons,
	isReadonly,
	isDisabled,
	locationStack,
	screenName
}: SetupProps) {
	return setupContentBoxRendererWithRtl({
		models: {
			...models,
			formModel: FormModelHelpers.createFormModel(models.formModel, buttons ?? {})
		},
		ui: {
			readonly: isReadonly,
			disabled: isDisabled,
			screenLocation: locationStack ?? [
				{
					path: DocumentHelpers.createDocumentPath(),
					locationPath: ModelHelpers.createModelPath(screenName ?? "Screen1")
				}
			]
		},
		componentMap: {
			ContentBoxNavigationBar: getNullMock()
		}
	});
}
