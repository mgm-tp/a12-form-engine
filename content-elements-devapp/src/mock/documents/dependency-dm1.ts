// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

export const DEPENDENCY_DM1 = {
	id: "dependency-dm/1",
	modelId: "dependency-dm",
	dependency: {
		field: {
			dependentField: "initial value",
			dependentField2: "initial value 2"
		},
		group: {
			depGroup: [
				{
					sampleField: "one one",
					sampleField2: "one two"
				},
				{
					sampleField: "two one",
					sampleField2: "two two"
				},
				{
					sampleField: "three one",
					sampleField2: "three two"
				}
			]
		},
		enum: {
			food: "shrimp"
		}
	}
};
