// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
