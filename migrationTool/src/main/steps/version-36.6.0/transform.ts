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

import type { Logger } from "@com.mgmtp.a12.migrationtool/migrationtool-core/types";

import type { FormModel as OldFormModel } from "../version-36.5.0/FormModel.js";

import type { FormModel } from "./FormModel.js";

// copied from client typing
interface ModelDescriptor {
	/** The type of the model. */
	readonly modelType: string;

	/** The name for the descriptor. */
	readonly name: string;
}

// arbitrary name to "visualize" where the added references come from
const REFERENCED_BINDING_MODEL_PURPOSE = "bindingReference";

export default function (model: OldFormModel, logger: Logger): FormModel {
	const annotation = model.header.annotations?.find(
		annotation => annotation.name === "bindingConfiguration"
	);

	return annotation?.value
		? moveReferencedBindingsModelsToHeader(model, annotation?.value, logger)
		: model;
}

function moveReferencedBindingsModelsToHeader(
	oldModel: OldFormModel,
	bindingConfig: string,
	logger: Logger
): FormModel {
	const parsedBindingConfiguration = JSON.parse(bindingConfig);
	const bindingModels = parsedBindingConfiguration.models as ModelDescriptor[];

	const modelReferences = [...(oldModel.header.modelReferences ?? [])];

	bindingModels.forEach(({ modelType, name }) => {
		if (!modelReferences.find(mr => mr.modelType === modelType && mr.reference === name)) {
			modelReferences.push({
				alias: name,
				modelType,
				purpose: REFERENCED_BINDING_MODEL_PURPOSE,
				reference: name
			});
		} else {
			logger.info(
				`Referenced binding model "${name}" already exists in the modelReferences, skipping...`
			);
		}
	});

	return {
		header: {
			...oldModel.header,
			modelReferences
		},
		content: oldModel.content
	};
}
