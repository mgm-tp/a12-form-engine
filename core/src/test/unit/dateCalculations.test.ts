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

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { DateUtils } from "../../view/internal/components/form-engine/cells/controls/date/date-utilities.js";

describe("unit.view.date", () => {
	const CURRENT_MONTH = 10;
	const CURRENT_YEAR = 2010;
	const CURRENT_DAY = 24;

	beforeEach(() => {
		mock.timers.enable({
			apis: ["Date"],
			now: new Date(`${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DAY}T08:10:00Z`).getTime()
		});
	});

	describe("calculateYearRange", () => {
		describe("given no datePickerConfig", () => {
			it("returns undefined", () => {
				const yearRange = DateUtils.calculateYearRange(undefined);
				strictEqual(yearRange, undefined);
			});
		});

		describe("given a datePickerConfig", () => {
			describe("with no maxYear", () => {
				it("returns undefined", () => {
					const yearRange = DateUtils.calculateYearRange({
						maxYear: undefined,
						minYear: 2020
					});
					strictEqual(yearRange, undefined);
				});
			});

			describe("with no minYear", () => {
				it("returns undefined", () => {
					const yearRange = DateUtils.calculateYearRange({
						minYear: undefined,
						maxYear: 2020
					});
					strictEqual(yearRange, undefined);
				});
			});

			describe("with a minYear and maxYear", () => {
				describe("with absolute=true", () => {
					it("returns a year range with start=minYear and end=maxYear", () => {
						const yearRange = DateUtils.calculateYearRange({
							minYear: 2010,
							maxYear: 2020,
							absolute: true
						});
						deepStrictEqual(yearRange, { start: 2010, end: 2020 });
					});
				});

				describe("with absolute=false", () => {
					it("returns a year range with start=currentYear + minYear and end=currentYear+maxYear", () => {
						const yearRange = DateUtils.calculateYearRange({
							minYear: -5,
							maxYear: 5,
							absolute: false
						});
						deepStrictEqual(yearRange, { start: CURRENT_YEAR + -5, end: CURRENT_YEAR + 5 });
					});
				});
			});
		});
	});

	describe("calculateInitialDate", () => {
		describe("given no datePickerConfig", () => {
			it("returns the current date", () => {
				const currentDate = new Date();
				const date = DateUtils.calculateInitialDate(undefined);
				deepStrictEqual(date.toISOString(), currentDate.toISOString());
			});
		});

		describe("given a datePickerConfig", () => {
			describe("with absolute=true", () => {
				describe("with preselection not undefined", () => {
					it("returns a new date object which gets calculated using the preselection year, the current month and the current date", () => {
						const date = DateUtils.calculateInitialDate({
							preselectionYear: 2018,
							absolute: true
						});

						const currentDate = new Date();
						currentDate.setFullYear(2018);

						deepStrictEqual(date.toISOString(), currentDate.toISOString());
					});
				});

				describe("with an undefined preselection", () => {
					it("returns a new date object which gets calculated using current year, the current month and the current date", () => {
						const date = DateUtils.calculateInitialDate({ absolute: true });

						const currentDate = new Date();
						deepStrictEqual(date.toISOString(), currentDate.toISOString());
					});
				});
			});

			describe("with absolute=false", () => {
				describe("with preselection not undefined", () => {
					it("returns a new date object which gets calculated using the current year + preselection year, the current month and the current date", () => {
						const date = DateUtils.calculateInitialDate({
							preselectionYear: 5,
							absolute: false
						});

						const currentDate = new Date();
						currentDate.setFullYear(CURRENT_YEAR + 5);

						deepStrictEqual(date.toISOString(), currentDate.toISOString());
					});
				});

				describe("with an undefined preselection", () => {
					it("returns a new date object which gets calculated using current year, the current month and the current date", () => {
						const date = DateUtils.calculateInitialDate({ absolute: false });

						const currentDate = new Date();
						deepStrictEqual(date.toISOString(), currentDate.toISOString());
					});
				});
			});
		});
	});
});
