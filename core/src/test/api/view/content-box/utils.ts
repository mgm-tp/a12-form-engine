// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
