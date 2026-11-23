// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

export const FIELD_TYPES_DM1 = {
	id: "fieldTypes-dm/1",
	modelId: "fieldTypes-dm",
	fieldTypes: {
		stringField: "abc",
		numberField: 123,
		textField: "line 1\nline 2\n...\nline n",
		stringFieldHintList: ["ABC"],
		booleanField: true,
		confirmField: true,
		dateField: new Date("2024-10-31T00:00:00"),
		dateTimeField: new Date("2024-11-11T11:11:00"),
		timeField: new Date("2000-01-01T05:05:00"),
		dateFragmentField: null,
		enumField: "green",
		multiSelectField: [
			{
				value: "a"
			},
			{
				value: "c"
			}
		]
	}
};
