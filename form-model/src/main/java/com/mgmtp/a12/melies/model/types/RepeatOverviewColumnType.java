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

import com.mgmtp.a12.model.header.Annotation;

import org.apache.commons.lang3.SerializationUtils;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public abstract class RepeatOverviewColumnType implements TreeNode, Serializable, Annotated, Id, ConditionallyHidden {

	@Serial
	private static final long serialVersionUID = 4946910316282101254L;

	protected String id;
	protected LabelType label;
	protected List<Annotation> annotations;
	protected HideConditionType hideCondition;
	protected Float width;
	protected Boolean sortable;
	protected Boolean filterable;
	protected PinDirectionType pinDirection;
	protected PreferredSortingType preferredSorting;
	protected IconType icon;
	protected Boolean labelHidden;
	protected SpecificHorizontalAlignmentType specificHorizontalAlignment;
	protected SpecificVerticalAlignmentType specificVerticalAlignment;
	protected List<StyleType> headerStyle;
	protected Boolean fixedWidth;

	private RepeatType parent;

	public List<StyleType> getHeaderStyle() {
		if (headerStyle == null) {
			headerStyle = new ArrayList<StyleType>();
		}
		return this.headerStyle;
	}

	public boolean isHeaderStyleSet() {
		return ((this.headerStyle != null) && (!this.headerStyle.isEmpty()));
	}

	public void unsetHeaderStyle() {
		this.headerStyle = null;
	}

	public RepeatOverviewColumnType withHeaderStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getHeaderStyle().add(value);
			}
		}
		return this;
	}

	public RepeatOverviewColumnType withHeaderStyle(final Collection<StyleType> values) {
		if (values != null) {
			getHeaderStyle().addAll(values);
		}
		return this;
	}

	public RepeatType getParent() {
		return parent;
	}

	/**
	 * Not part of the API. Do not use.
	 */
	public void setParent(final RepeatType parent) {
		this.parent = parent;
	}

	@Override
	public TreeNode getParentNode() {
		return parent;
	}

	@Override
	public TreeNode copy() {
		final RepeatOverviewColumnType clone = SerializationUtils.clone(this);
		clone.setParent(null);
		return clone;
	}

	public LabelType getLabel() {
		return label;
	}

	public void setLabel(final LabelType value) {
		this.label = value;
	}

	public boolean isLabelSet() {
		return (this.label != null);
	}

	@Override
	public List<Annotation> getAnnotations() {
		if (annotations == null) {
			annotations = new ArrayList<Annotation>();
		}
		return this.annotations;
	}

	public boolean isAnnotationSet() {
		return ((this.annotations != null) && (!this.annotations.isEmpty()));
	}

	public void unsetAnnotation() {
		this.annotations = null;
	}

	@Override
	public HideConditionType getHideCondition() {
		return hideCondition;
	}

	@Override
	public void setHideCondition(final HideConditionType value) {
		this.hideCondition = value;
	}

	@Override
	public boolean isHideConditionSet() {
		return (this.hideCondition != null);
	}

	@Override
	public String getId() {
		return id;
	}

	@Override
	public void setId(final String value) {
		this.id = value;
	}

	@Override
	public boolean isIdSet() {
		return (this.id != null);
	}

	public float getWidth() {
		if (width == null) {
			return 1.0F;
		} else {
			return width;
		}
	}

	public void setWidth(final float value) {
		this.width = value;
	}

	public boolean isWidthSet() {
		return (this.width != null);
	}

	public void unsetWidth() {
		this.width = null;
	}

	public boolean isSortable() {
		if (sortable == null) {
			return false;
		} else {
			return sortable;
		}
	}

	public void setSortable(final boolean value) {
		this.sortable = value;
	}

	public boolean isSortableSet() {
		return (this.sortable != null);
	}

	public void unsetSortable() {
		this.sortable = null;
	}

	public boolean isFilterable() {
		if (filterable == null) {
			return false;
		} else {
			return filterable;
		}
	}

	public void setFilterable(final boolean value) {
		this.filterable = value;
	}

	public boolean isFilterableSet() {
		return (this.filterable != null);
	}

	public void unsetFilterable() {
		this.filterable = null;
	}

	public PinDirectionType getPinDirection() {
		return pinDirection;
	}

	public void setPinDirection(final PinDirectionType value) {
		this.pinDirection = value;
	}

	public boolean isPinDirectionSet() {
		return (this.pinDirection != null);
	}

	public PreferredSortingType getPreferredSorting() {
		if (preferredSorting == null) {
			return PreferredSortingType.ASC;
		} else {
			return preferredSorting;
		}
	}

	public void setPreferredSorting(final PreferredSortingType value) {
		this.preferredSorting = value;
	}

	public boolean isPreferredSortingSet() {
		return (this.preferredSorting != null);
	}

	public IconType getIcon() {
		return icon;
	}

	public void setIcon(IconType value) {
		this.icon = value;
	}

	public void unsetIcon() {
		this.icon = null;
	}

	public boolean isIconSet() {
		return icon != null;
	}

	public boolean isLabelHidden() {
		if (labelHidden == null) {
			return false;
		}
		return labelHidden;
	}

	public void setLabelHidden(final Boolean labelHidden) {
		this.labelHidden = labelHidden;
	}

	public void unsetLabelHidden() {
		this.labelHidden = null;
	}

	public boolean isLabelHiddenSet() {
		return labelHidden != null;
	}

	public SpecificHorizontalAlignmentType getSpecificHorizontalAlignment() {
		return specificHorizontalAlignment;
	}

	public void setSpecificHorizontalAlignment(final SpecificHorizontalAlignmentType specificHorizontalAlignment) {
		this.specificHorizontalAlignment = specificHorizontalAlignment;
	}

	public void unsetSpecificHorizontalAlignment() {
		this.specificHorizontalAlignment = null;
	}

	public boolean isSpecificHorizontalAlignmentSet() {
		return specificHorizontalAlignment != null;
	}

	public SpecificVerticalAlignmentType getSpecificVerticalAlignment() {
		return specificVerticalAlignment;
	}

	public void setSpecificVerticalAlignment(final SpecificVerticalAlignmentType specificVerticalAlignment) {
		this.specificVerticalAlignment = specificVerticalAlignment;
	}

	public void unsetSpecificVerticalAlignment() {
		this.specificVerticalAlignment = null;
	}

	public boolean isSpecificVerticalAlignmentSet() {
		return specificVerticalAlignment != null;
	}

	public boolean isFixedWidth() {
		if (fixedWidth == null) {
			return false;
		} else {
			return fixedWidth;
		}
	}

	public void setFixedWidth(final boolean value) {
		this.fixedWidth = value;
	}

	public boolean isFixedWidthSet() {
		return (this.fixedWidth != null);
	}

	public void unsetFixedWidth() {
		this.fixedWidth = null;
	}

	public RepeatOverviewColumnType withLabel(final LabelType value) {
		setLabel(value);
		return this;
	}

	public RepeatOverviewColumnType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	public RepeatOverviewColumnType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	public RepeatOverviewColumnType withId(final String value) {
		setId(value);
		return this;
	}

	public RepeatOverviewColumnType withWidth(final float value) {
		setWidth(value);
		return this;
	}

	public RepeatOverviewColumnType withSortable(final boolean value) {
		setSortable(value);
		return this;
	}

	public RepeatOverviewColumnType withFilterable(final boolean value) {
		setFilterable(value);
		return this;
	}

	public RepeatOverviewColumnType withPinDirection(final PinDirectionType value) {
		setPinDirection(value);
		return this;
	}

	public RepeatOverviewColumnType withPreferredSorting(final PreferredSortingType value) {
		setPreferredSorting(value);
		return this;
	}

	public RepeatOverviewColumnType withIcon(final IconType value) {
		setIcon(value);
		return this;
	}

	public RepeatOverviewColumnType withLabelHidden(final Boolean labelHidden) {
		setLabelHidden(labelHidden);
		return this;
	}

	public RepeatOverviewColumnType
		withSpecificHorizontalAlignment(final SpecificHorizontalAlignmentType specificHorizontalAlignment) {
		setSpecificHorizontalAlignment(specificHorizontalAlignment);
		return this;
	}

	public RepeatOverviewColumnType
		withSpecificVerticalAlignment(final SpecificVerticalAlignmentType specificVerticalAlignment) {
		setSpecificVerticalAlignment(specificVerticalAlignment);
		return this;
	}

	public RepeatOverviewColumnType withFixedWidth(final boolean value) {
		setFixedWidth(value);
		return this;
	}

	public RepeatOverviewColumnType withHideCondition(final HideConditionType value) {
		setHideCondition(value);
		return this;
	}
}
