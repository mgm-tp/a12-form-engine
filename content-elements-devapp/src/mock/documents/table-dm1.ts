// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

export const TABLE_DM1 = {
	id: "table-dm/1",
	modelId: "table-dm",
	table: {
		weatherData: [
			{
				date: new Date("2024-10-01T00:00:00"),
				temperatureLow: 5,
				temperatureHigh: 17,
				precipitation: [
					{
						value: "rain"
					}
				]
			},
			{
				date: new Date("2024-10-02T00:00:00"),
				temperatureLow: 9,
				temperatureHigh: 16,
				precipitation: [
					{
						value: "fog"
					},
					{
						value: "rain"
					}
				]
			},
			{
				date: new Date("2024-12-24T00:00:00"),
				temperatureLow: -4,
				temperatureHigh: 2,
				precipitation: [
					{
						value: "snow"
					}
				]
			}
		]
	}
};
