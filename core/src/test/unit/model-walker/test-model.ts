// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import {
	createButton,
	createButtonPanel,
	createControl,
	createControlGrid,
	createDetachedRepeat,
	createEmbeddedRepeat,
	createFieldColumn,
	createFormModel,
	createHeaderFooter,
	createInlineRepeat,
	createMultiColumnSection,
	createRow,
	createScreen,
	createSection
} from "../../utils/form-model-factory.js";

export const largeTestModel = createFormModel({
	screens: [
		createScreen({
			id: "screen-1",
			subHeaderBox: createHeaderFooter({ type: "header", withButton: true }),
			footerBox: createHeaderFooter({ type: "footer", withButton: true }),
			screenElements: [
				createSection({
					id: "s1-sec-1",
					screenElements: [
						createControlGrid({
							id: "s1-sec-1-cg-1",
							rows: [
								createRow({
									id: "row-1",
									cells: [createControl("control-1"), createControl("control-2")]
								}),
								createRow({
									id: "row-2",
									cells: [createControl("control-3"), createControl("control-4")]
								})
							]
						}),
						createDetachedRepeat({
							id: "dr-1",
							columns: [createFieldColumn({ id: "fc-1" }), createFieldColumn({ id: "fc-2" })],
							detailScreen: createScreen({
								id: "dr-1-ds",
								screenElements: [
									createControlGrid({
										id: "ds-cg-1",
										rows: [
											createRow({
												id: "ds-row-1",
												cells: [createControl("ds-control-1")]
											})
										]
									})
								]
							})
						}),
						createEmbeddedRepeat({
							id: "er-1",
							columns: [createFieldColumn({ id: "fc-4" })],
							controlGrid: createControlGrid({
								id: "er-cg-1",
								rows: [
									createRow({
										id: "er-row-1",
										cells: [createControl("er-control-1")]
									})
								]
							})
						}),
						createInlineRepeat({
							id: "ir-1",
							columns: [createFieldColumn({ id: "fc-5" })]
						})
					]
				}),
				createButtonPanel({
					id: "bp-1",
					buttons: [createButton("button-1")]
				}),
				createMultiColumnSection({
					id: "mcs-1",
					screenElements: [
						createControlGrid({
							id: "mcs-cg-1",
							rows: [
								createRow({
									id: "mcs-row-1",
									cells: [createControl("mcs-control-1"), createControl("mcs-control-2")]
								})
							]
						})
					]
				})
			]
		})
	],
	subHeaderBox: createHeaderFooter({ type: "header", withButton: true }),
	footerBox: createHeaderFooter({ type: "footer", withButton: true })
});

export const expectedVisitingOrder = [
	"/screen-screen-1",
	"/screen-screen-1/header",
	"/screen-screen-1/header/button",
	"/screen-screen-1/header/button",
	"/screen-screen-1/section-s1-sec-1",
	"/screen-screen-1/section-s1-sec-1/cg",
	"/screen-screen-1/section-s1-sec-1/cg/row-1",
	"/screen-screen-1/section-s1-sec-1/cg/row-1/control-1",
	"/screen-screen-1/section-s1-sec-1/cg/row-1/control-2",
	"/screen-screen-1/section-s1-sec-1/cg/row-2",
	"/screen-screen-1/section-s1-sec-1/cg/row-2/control-3",
	"/screen-screen-1/section-s1-sec-1/cg/row-2/control-4",
	"/screen-screen-1/section-s1-sec-1/dr-dr-1",
	"/screen-screen-1/section-s1-sec-1/dr-dr-1/fc-1",
	"/screen-screen-1/section-s1-sec-1/dr-dr-1/fc-2",
	"/screen-screen-1/section-s1-sec-1/dr-dr-1/screen-dr-1-ds",
	"/screen-screen-1/section-s1-sec-1/dr-dr-1/screen-dr-1-ds/cg",
	"/screen-screen-1/section-s1-sec-1/dr-dr-1/screen-dr-1-ds/cg/ds-row-1",
	"/screen-screen-1/section-s1-sec-1/dr-dr-1/screen-dr-1-ds/cg/ds-row-1/ds-control-1",
	"/screen-screen-1/section-s1-sec-1/er-er-1",
	"/screen-screen-1/section-s1-sec-1/er-er-1/fc-4",
	"/screen-screen-1/section-s1-sec-1/er-er-1/cg",
	"/screen-screen-1/section-s1-sec-1/er-er-1/cg/er-row-1",
	"/screen-screen-1/section-s1-sec-1/er-er-1/cg/er-row-1/er-control-1",
	"/screen-screen-1/section-s1-sec-1/ir-ir-1",
	"/screen-screen-1/section-s1-sec-1/ir-ir-1/fc-5",
	"/screen-screen-1/button-panel",
	"/screen-screen-1/button-panel/button",
	"/screen-screen-1/section-mcs-1",
	"/screen-screen-1/section-mcs-1/cg",
	"/screen-screen-1/section-mcs-1/cg/mcs-row-1",
	"/screen-screen-1/section-mcs-1/cg/mcs-row-1/mcs-control-1",
	"/screen-screen-1/section-mcs-1/cg/mcs-row-1/mcs-control-2",
	"/screen-screen-1/footer",
	"/screen-screen-1/footer/button",
	"/screen-screen-1/footer/button",
	"/header",
	"/header/button",
	"/header/button",
	"/footer",
	"/footer/button",
	"/footer/button"
];

export function enterLeaveOrder(visitingOrder: string[]): ("enter" | "leave")[] {
	const resultList: ("enter" | "leave")[] = [];
	let lastPathElements: string[] = [];
	visitingOrder.forEach(path => {
		const pathElements = path.slice(1).split("/");
		const pathLengthDifference = lastPathElements.length - pathElements.length;
		if (pathLengthDifference > 0) {
			for (let i = 0; i <= pathLengthDifference; i++) {
				resultList.push("leave");
			}
			resultList.push("enter");
		} else if (pathLengthDifference < 0) {
			resultList.push("enter");
		} else {
			resultList.push("leave");
			resultList.push("enter");
		}
		lastPathElements = pathElements;
	});

	for (let i = 0; i < lastPathElements.length; i++) {
		resultList.push("leave");
	}
	return resultList;
}
