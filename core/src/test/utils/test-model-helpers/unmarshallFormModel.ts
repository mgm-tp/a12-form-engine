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

import { createModelPath } from "./dependent-enumeration.js";

export namespace DOCUMENT_MODEL {
	export const rootGroup = "rootGroup";
	export const repeatableGroup = "repeatableGroup";
	export const nestedGroup = "nestedGroup";

	export const groupForFieldConfiguration = "groupForFieldConfiguration";
	export const masterField1 = "MasterField1";
	export const masterField2 = "MasterField2";

	export const groupForIndexedControl = "groupForIndexedControl";
	export const indexedMasterControl = "MasterEnum";
}

export namespace FORM_MODEL {
	export const pathToF0 = createModelPath("screen1", "sec1", "cg0", "row-9b467", "control-21889");
	export const pathToF11 = createModelPath("screen1", "sec1", "cg0", "row-f0894", "control-a130e");
	export const pathToF12 = createModelPath("screen1", "sec1", "cg0", "row-f0894", "control-2ada9");
	export const pathToF2 = createModelPath("screen1", "sec1", "cg0", "row-65743", "control-12492");

	export const pathToDetachedRepeat = createModelPath(
		"screen1",
		"sec1",
		"detached-repeat-repeatableGroup"
	);

	export const pathToDrDetailScreen = createModelPath(
		"screen1",
		"sec1",
		"detached-repeat-repeatableGroup",
		"detached-repeat-repeatableGroup-detail-screen"
	);
	export const pathToF4InDr = [
		...pathToDrDetailScreen,
		...createModelPath("cg", "row-f6e5d", "control-628b4")
	];
	export const pathToF5InDr = [
		...pathToDrDetailScreen,
		...createModelPath("cg", "row-a2443", "control-861d7")
	];

	export const pathToErDetailCg = createModelPath(
		"screen1",
		"sec1",
		"embedded-repeat-repeatableGroup",
		"cg"
	);
	export const pathToF4InEr = [
		...pathToErDetailCg,
		...createModelPath("row-de68a", "control-6a942")
	];
	export const pathToF5InEr = [
		...pathToErDetailCg,
		...createModelPath("row-aa5dc", "control-403d6")
	];

	export const pathToIr = createModelPath("screen1", "sec1", "inline-repeat-repeatableGroup");
	export const pathToF4InIr = [
		...pathToIr,
		...createModelPath("fieldbasedrepeatoverviewcolumn-c775c")
	];
	export const pathToF5InIr = [
		...pathToIr,
		...createModelPath("fieldbasedrepeatoverviewcolumn-1fb84")
	];

	export const pathToExpressionCell = createModelPath(
		"screen1",
		"sec4",
		"cg2",
		"row-59707",
		"expression1"
	);
	export const pathToF0WithExpressionLabel = createModelPath(
		"screen1",
		"sec4",
		"cg2",
		"row-59707",
		"control-dd987"
	);
	export const pathToIndexedControlWithExpressionLabel = createModelPath(
		"screen1",
		"sec4",
		"cg2",
		"row_fb1a8",
		"control_0a130"
	);

	export const pathToIrWithFilterExpression = createModelPath(
		"screen1",
		"sec3",
		"inline-repeat-repeatableGroup"
	);
	export const pathToErWithFilterExpression = createModelPath(
		"screen1",
		"sec3",
		"embedded-repeat-repeatableGroup"
	);
	export const pathToDrWithFilterExpression = createModelPath(
		"screen1",
		"sec3",
		"detached-repeat-repeatableGroup"
	);

	export const idDependentControlGrid = "controlgrid-4f1c2";
	export const idDependentSection = "section-59946";
	export const idDependentMultiColunbSection = "multicolumnsection-4d2e1";
	export const idExpressionCell = "expressioncell-70cf2";

	export const idDependentControlGridIndexedControlMaster = "controlgrid-4f1c3";

	export const idDependentControlMaster = "control-e4668";
	export const idDependentControlMasterWithIndex = "control-e4669";
}
