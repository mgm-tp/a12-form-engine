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

import { createModelPath } from "../createModelPath.js";

export const DOCUMENT_MODEL = {
	rootGroup: "rootGroup",
	repeatableGroup: "repeatableGroup",
	nestedGroup: "nestedGroup",
	groupForFieldConfiguration: "groupForFieldConfiguration",
	masterField1: "MasterField1",
	masterField2: "MasterField2",
	groupForIndexedControl: "groupForIndexedControl",
	indexedMasterControl: "MasterEnum"
} as const;

const pathToDrDetailScreen = createModelPath(
	"screen1",
	"sec1",
	"detached-repeat-repeatableGroup",
	"detached-repeat-repeatableGroup-detail-screen"
);

const pathToErDetailCg = createModelPath(
	"screen1",
	"sec1",
	"embedded-repeat-repeatableGroup",
	"cg"
);

const pathToIr = createModelPath("screen1", "sec1", "inline-repeat-repeatableGroup");

export const FORM_MODEL = {
	pathToF0: createModelPath("screen1", "sec1", "cg0", "row-9b467", "control-21889"),
	pathToF11: createModelPath("screen1", "sec1", "cg0", "row-f0894", "control-a130e"),
	pathToF12: createModelPath("screen1", "sec1", "cg0", "row-f0894", "control-2ada9"),
	pathToF2: createModelPath("screen1", "sec1", "cg0", "row-65743", "control-12492"),
	pathToDetachedRepeat: createModelPath("screen1", "sec1", "detached-repeat-repeatableGroup"),
	pathToDrDetailScreen,
	pathToF4InDr: [...pathToDrDetailScreen, ...createModelPath("cg", "row-f6e5d", "control-628b4")],
	pathToF5InDr: [...pathToDrDetailScreen, ...createModelPath("cg", "row-a2443", "control-861d7")],
	pathToErDetailCg,
	pathToF4InEr: [...pathToErDetailCg, ...createModelPath("row-de68a", "control-6a942")],
	pathToF5InEr: [...pathToErDetailCg, ...createModelPath("row-aa5dc", "control-403d6")],
	pathToIr,
	pathToF4InIr: [...pathToIr, ...createModelPath("fieldbasedrepeatoverviewcolumn-c775c")],
	pathToF5InIr: [...pathToIr, ...createModelPath("fieldbasedrepeatoverviewcolumn-1fb84")],
	pathToExpressionCell: createModelPath("screen1", "sec4", "cg2", "row-59707", "expression1"),
	pathToF0WithExpressionLabel: createModelPath(
		"screen1",
		"sec4",
		"cg2",
		"row-59707",
		"control-dd987"
	),
	pathToIndexedControlWithExpressionLabel: createModelPath(
		"screen1",
		"sec4",
		"cg2",
		"row_fb1a8",
		"control_0a130"
	),
	pathToIrWithFilterExpression: createModelPath("screen1", "sec3", "inline-repeat-repeatableGroup"),
	pathToErWithFilterExpression: createModelPath(
		"screen1",
		"sec3",
		"embedded-repeat-repeatableGroup"
	),
	pathToDrWithFilterExpression: createModelPath(
		"screen1",
		"sec3",
		"detached-repeat-repeatableGroup"
	),
	idDependentControlGrid: "controlgrid-4f1c2",
	idDependentSection: "section-59946",
	idDependentMultiColunbSection: "multicolumnsection-4d2e1",
	idExpressionCell: "expressioncell-70cf2",
	idDependentControlGridIndexedControlMaster: "controlgrid-4f1c3",
	idDependentControlMaster: "control-e4668",
	idDependentControlMasterWithIndex: "control-e4669"
};
