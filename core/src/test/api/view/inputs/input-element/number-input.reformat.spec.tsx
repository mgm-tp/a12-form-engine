// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { fireEvent } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { act } from "react";

import { screen } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DefaultWidgetMap } from "../../../../../view/index.js";
import { NumberInput } from "../../../../../view/internal/components/form-engine/cells/controls/number/number-input.js";
import { DefaultComponentMap } from "../../../../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { DocumentModelHelpers } from "../../../../utils/model-helpers.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createModelPath } from "../../../../utils/test-model-helpers/dependent-enumeration.js";

import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("NumberInput", () => {
		const models = setupModelsFixture("controls.picustypes");

		const documentElementDataType: DocumentModel.NumberType = {
			type: "NumberType"
		};

		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			formModelPath: createModelPath("foo", "bar")
		};

		describe("onValueSubmit", () => {
			const numberPath = DocumentHelpers.createDocumentPath(
				["A12T_PicusTypes"],
				["Number"],
				["Number01"]
			);

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
