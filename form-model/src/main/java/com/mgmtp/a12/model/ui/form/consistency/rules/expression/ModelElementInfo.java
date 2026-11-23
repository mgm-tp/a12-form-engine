// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
