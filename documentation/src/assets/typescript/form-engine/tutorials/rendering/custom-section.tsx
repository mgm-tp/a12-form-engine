// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

// tag::content[]

import type { FormModel, FormModelMap } from "@com.mgmtp.a12.formengine/formengine-core";
import { DefaultFormModelMap } from "@com.mgmtp.a12.formengine/formengine-core";

export const CustomFormModelMap: FormModelMap = {
	...DefaultFormModelMap,
	Section: {
		component(props: FormModelMap.FormModelComponentProps<FormModel.Section>) {
			if (props.modelElement.annotations && props.modelElement.annotations[0].name === "image") {
				const value = props.modelElement.annotations[0].value;
				return <img src={`images/${value}`} height="200px" />;
			} else {
				return <DefaultFormModelMap.Section.component {...props} />;
			}
		}
	}
};
// end::content[]
