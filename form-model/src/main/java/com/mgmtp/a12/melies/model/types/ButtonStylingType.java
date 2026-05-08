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
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class ButtonStylingType implements Serializable {

	private static final long serialVersionUID = -8340812105494526203L;

	protected LabelType label;
	protected MultilingualTextType description;
	protected IconType icon;
	protected ButtonPriorityEnumType priority;
	protected Boolean destructive;
	protected Boolean labelHidden;
	protected List<StyleType> style;

	public LabelType getLabel() {
		return label;
	}

	public void setLabel(final LabelType value) {
		this.label = value;
	}

	public boolean isLabelSet() {
		return (this.label != null);
	}

	public MultilingualTextType getDescription() {
		return description;
	}

	public void setDescription(final MultilingualTextType value) {
		this.description = value;
	}

	public boolean isDescriptionSet() {
		return (this.description != null);
	}

	public IconType getIcon() {
		return icon;
	}

	public void setIcon(IconType icon) {
		this.icon = icon;
	}

	public boolean isIconSet() {
		return (this.icon != null);
	}

	public ButtonPriorityEnumType getPriority() {
		return priority;
	}

	public void setPriority(final ButtonPriorityEnumType priority) {
		this.priority = priority;
	}

	public boolean isPrioritySet() {
		return (this.priority != null);
	}

	public Boolean isDestructive() {
		return this.destructive == null ? false : this.destructive;
	}

	public void setDestructive(final Boolean value) {
		this.destructive = value;
	}

	public boolean isDestructiveSet() {
		return (this.destructive != null);
	}

	public void setLabelHidden(final Boolean labelHidden) {
		this.labelHidden = labelHidden;
	}

	public void unsetLabelHidden() {
		this.labelHidden = null;
	}

	public Boolean isLabelHidden() {
		return this.labelHidden == null ? false : this.labelHidden;
	}

	public Boolean isLabelHiddenSet() {
		return this.labelHidden != null;
	}

	public List<StyleType> getStyle() {
		if (style == null) {
			style = new ArrayList<StyleType>();
		}
		return this.style;
	}

	public boolean isStyleSet() {
		return ((this.style != null) && (!this.style.isEmpty()));
	}

	public void unsetStyle() {
		this.style = null;
	}

	public ButtonStylingType withLabel(final LabelType value) {
		setLabel(value);
		return this;
	}

	public ButtonStylingType withDescription(final MultilingualTextType value) {
		setDescription(value);
		return this;
	}

	public ButtonStylingType withIcon(final IconType value) {
		setIcon(value);
		return this;
	}

	public ButtonStylingType withPriority(final ButtonPriorityEnumType value) {
		setPriority(value);
		return this;
	}

	public ButtonStylingType withDestructive(final boolean value) {
		setDestructive(value);
		return this;
	}

	public ButtonStylingType withLabelHidden(final Boolean value) {
		setLabelHidden(value);
		return this;
	}

	public ButtonStylingType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	public ButtonStylingType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}
}
