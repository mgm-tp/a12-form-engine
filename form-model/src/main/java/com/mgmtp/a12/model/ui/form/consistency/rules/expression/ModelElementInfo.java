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
package com.mgmtp.a12.model.ui.form.consistency.rules.expression;

import org.apache.commons.lang3.StringUtils;

import com.mgmtp.a12.kernel.md.model.api.IIdNamed;
import com.mgmtp.a12.melies.model.types.Id;
import com.mgmtp.a12.melies.model.types.Named;

public class ModelElementInfo {
	private String id;
	private String name;
	private String type;

	public ModelElementInfo(String id, String name, String type) {
		this.id = id;
		this.name = name;
		this.type = type;
	}
	
	public String getId() {
		return this.id;
	}
	
	public String getName() {
		return this.name;
	}
	
	public String getType() {
		return this.type;
	}
	
	public static ModelElementInfo getElementInfo(final Object modelElement) {
		String id = modelElement instanceof Id
			? ((Id) modelElement).getId()
			: modelElement instanceof IIdNamed
			? ((IIdNamed) modelElement).getId()
			: "";
		String name = modelElement instanceof Named
			? ((Named) modelElement).getName()
			: modelElement instanceof IIdNamed
			? ((IIdNamed) modelElement).getName()
			: "";
		String type = StringUtils.substringBeforeLast(modelElement.getClass().getSimpleName(), "Type");

		if("FieldBasedRepeatOverviewColumn".equals(type)) {
			type = "FieldOverviewColumn";
		} else if("ExpressionRepeatOverviewColumn".equals(type)) {
			type = "ExpressionColumn";
		} else if ("FieldWrapper".equals(type)) {
			type = "Field";
		} else if ("GroupWrapper".equals(type)) {
			type = "Group";
		}

		return new ModelElementInfo(id, name, type);
	}
}
