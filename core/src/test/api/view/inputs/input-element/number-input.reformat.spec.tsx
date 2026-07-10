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

import { fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { act } from "react";

import { screen } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { DefaultWidgetMap } from "../../../../../view/index.js";
import { NumberInput } from "../../../../../view/internal/components/form-engine/cells/controls/number/number-input.js";
import { DefaultComponentMap } from "../../../../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DocumentModelHelpers } from "../../../../utils/DocumentModelHelpers.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";

import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("NumberInput", () => {
		const models = setupModelsFixture("controls.dmtypes");

		const documentElementDataType: DocumentModel.NumberType = {
			type: "NumberType"
		};

		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			formModelPath: createModelPath("foo", "bar")
		};

		describe("onValueSubmit", () => {
			const numberPath = createDocumentPath(["A12T_DmTypes"], ["Number"], ["Number01"]);

			async function setup(): Promise<void> {
				const props = createProps({
					...baseProps,
					models,
					path: numberPath,
					modelElement: {},
					value: { path: numberPath, data: 20000, ui: "20.000" }
				});
				await rtlRenderWrapperAsync(<NumberInput {...props} />, {
					componentMap: DefaultComponentMap,
					widgetMap: DefaultWidgetMap,
					withWidgets: true
				});
			}

			it("formats identical repeated large number input with thousands separator", async () => {
				await setup();
				const input = screen.getByRole("textbox") as HTMLInputElement;

				await userEvent.clear(input);
				await userEvent.type(input, "20000");
				await act(() => fireEvent.blur(input));
				screen.getByDisplayValue("20.000");
			});
		});
	});
});
