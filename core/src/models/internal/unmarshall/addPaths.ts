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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DocumentModelSearchService } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { DeepMutable, Mutable } from "../../../back-end/utils/internal/types.js";

import type { FormModel } from "../form-model.js";
import { getModelPathElementName } from "../utils/form-model-path.js";
import type { VisitProcess } from "../utils/form-model-walker.js";
import { ModelWalker } from "../utils/form-model-walker.js";
import type { ModelVisitor } from "../utils/form-model-walker.js";

/** @internal */
export function addPaths(formModel: FormModel, dmSearchService: DocumentModelSearchService): void {
	addPathToContent(formModel, dmSearchService);
	addPathToControls(formModel, dmSearchService);
	addPathToFieldConfiguration(formModel, dmSearchService, buildRepeatPathsById(formModel));
	addPathToGroupConfiguration(formModel, dmSearchService);
}

/**
 * `markdownAttachmentRepeat` on a `FieldConfigurationEntry` refers to a `Repeat`, by its own form
 * model id - unlike everything else this module resolves, which are all document model ids,
 * resolvable via `dmSearchService`. This builds the form-model-side equivalent: every
 * `InlineRepeat`/`EmbeddedRepeat`/`DetachedRepeat`'s own id mapped to its own form model path,
 * by walking the form model once and tracking the path as it goes (mirroring how
 * `FormModelPath.extend` builds a path at render time, one ancestor at a time).
 */
function buildRepeatPathsById(formModel: FormModel): Map<string, ModelPath> {
	const pathsById = new Map<string, ModelPath>();
	let currentPath: ModelPath = [];

	function recordRepeat(repeat: { id: string }): VisitProcess {
		pathsById.set(repeat.id, currentPath);
		return "ContinueTraversal";
	}

	const visitor: ModelVisitor = {
		enter(elementStack) {
			currentPath = elementStack.map(element => ({
				elementName: getModelPathElementName(element as { name?: string; id?: string })
			}));
		},
		visitInlineRepeat: recordRepeat,
		visitEmbeddedRepeat: recordRepeat,
		visitDetachedRepeat: recordRepeat
	};
	new ModelWalker(visitor).acceptModel(formModel);
	return pathsById;
}

function addPathToContent(formModel: FormModel, dmSearchService: DocumentModelSearchService): void {
	const mutableModel = formModel as DeepMutable<FormModel>;
	if (mutableModel.content.amountSuffix?.type !== "dynamic") {
		return;
	}

	const elementPath = dmSearchService.getPathById(mutableModel.content.amountSuffix.fieldRef);
	if (elementPath) {
		mutableModel.content.amountSuffixFieldPath = elementPath;
	}
}

function addPathToControls(
	formModel: FormModel,
	dmSearchService: DocumentModelSearchService
): void {
	const visitor: ModelVisitor = {
		visitControl(control: Mutable<FormModel.Control>): VisitProcess {
			const elementPath = dmSearchService.getPathById(control.elementRef);
			if (elementPath) {
				control.elementPath = elementPath;
			}
			return "ContinueTraversal";
		},
		visitRepeatOverviewColumn(repeatColumn: Mutable<FormModel.RepeatOverviewColumn>): VisitProcess {
			if (repeatColumn.type === "FieldBasedRepeatOverviewColumn") {
				const elementPath = dmSearchService.getPathById(repeatColumn.elementRef);

				if (elementPath) {
					repeatColumn.elementPath = elementPath;
				}
			}
			return "ContinueTraversal";
		},
		visitInlineRepeat(repeat: Mutable<FormModel.InlineRepeat>): VisitProcess {
			const elementPath = dmSearchService.getPathById(repeat.groupRef);
			if (elementPath) {
				repeat.groupPath = elementPath;
			}

			if (repeat.multiFileUploadOptions) {
				const attachmentPath = dmSearchService.getPathById(
					repeat.multiFileUploadOptions.elementRef
				);
				if (attachmentPath) {
					repeat.multiFileUploadOptions = {
						...repeat.multiFileUploadOptions,
						elementPath: attachmentPath
					};
				}
			}

			return "ContinueTraversal";
		},
		visitDetachedRepeat(repeat: Mutable<FormModel.DetachedRepeat>): VisitProcess {
			const elementPath = dmSearchService.getPathById(repeat.groupRef);
			if (elementPath) {
				repeat.groupPath = elementPath;
			}
			return "ContinueTraversal";
		},
		visitEmbeddedRepeat(repeat: Mutable<FormModel.EmbeddedRepeat>): VisitProcess {
			const elementPath = dmSearchService.getPathById(repeat.groupRef);
			if (elementPath) {
				repeat.groupPath = elementPath;
			}

			if (repeat.multiFileUploadOptions) {
				const attachmentPath = dmSearchService.getPathById(
					repeat.multiFileUploadOptions.elementRef
				);
				if (attachmentPath) {
					repeat.multiFileUploadOptions = {
						...repeat.multiFileUploadOptions,
						elementPath: attachmentPath
					};
				}
			}

			return "ContinueTraversal";
		}
	};
	new ModelWalker(visitor).acceptModel(formModel);
}

function addPathToFieldConfiguration(
	formModel: FormModel,
	dmSearchService: DocumentModelSearchService,
	repeatPathsById: Map<string, ModelPath>
): void {
	const mutableModel = formModel as DeepMutable<FormModel>;
	if (mutableModel.content.fieldConfiguration.field === undefined) {
		return;
	}

	for (const fc of mutableModel.content.fieldConfiguration.field) {
		const elementPath = dmSearchService.getPathById(fc.elementRef);
		if (elementPath) {
			fc.elementPath = elementPath;
		}

		if (fc.dependentEnumeration) {
			const elementPath = dmSearchService.getPathById(fc.dependentEnumeration.masterField);

			if (elementPath) {
				fc.dependentEnumeration.masterFieldPath = elementPath;
			}
		}
		if (fc.dependentField) {
			const elementPath = dmSearchService.getPathById(fc.dependentField.masterField);

			if (elementPath) {
				fc.dependentField.masterFieldPath = elementPath;
			}

			for (const caze of fc.dependentField.case) {
				if (caze.fieldRef) {
					caze.fieldPath = dmSearchService.getPathById(caze.fieldRef);
				}
			}
		}
		if (fc.markdownAttachmentRepeat) {
			const markdownAttachmentRepeatPath = repeatPathsById.get(fc.markdownAttachmentRepeat);

			if (markdownAttachmentRepeatPath) {
				fc.markdownAttachmentRepeatPath = markdownAttachmentRepeatPath;
			}
		}
	}
}

function addPathToGroupConfiguration(
	formModel: FormModel,
	dmSearchService: DocumentModelSearchService
): void {
	const mutableModel = formModel as DeepMutable<FormModel>;
	if (mutableModel.content.groupConfiguration.group === undefined) {
		return;
	}

	for (const gc of mutableModel.content.groupConfiguration.group) {
		const elementPath = dmSearchService.getPathById(gc.groupRef);
		if (elementPath) {
			gc.groupPath = elementPath;
		}
		if (gc.dependentGroup) {
			const masterFieldPath = dmSearchService.getPathById(gc.dependentGroup.masterField);
			if (masterFieldPath) {
				gc.dependentGroup.masterFieldPath = masterFieldPath;
			}
		}
	}
}
