// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.expression;

import java.util.List;

public class ExpressionNode {

	private String type;
	private String name;
	private String content;
	private List<ExpressionNode> children;

	public ExpressionNode() {
	}

	public ExpressionNode(
		final Object type,
		final Object name,
		final Object content,
		final List<ExpressionNode> children
	) {

		setType(type);
		setName(name);
		setContent(content);
		setChildren(children);
	}

	public String getType() {
		return type;
	}

	public void setType(final Object type) {
		if (type instanceof String) {
			this.type = (String) type;
		}
	}

	public String getName() {
		return name;
	}

	public void setName(final Object name) {
		if (name instanceof String) {
			this.name = (String) name;
		}
	}

	public String getContent() {
		return content;
	}

	public void setContent(final Object content) {
		if (content instanceof String) {
			this.content = (String) content;
		}
	}

	public List<ExpressionNode> getChildren() {
		return children;
	}

	public void setChildren(final List<ExpressionNode> children) {
		this.children = children;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((children == null) ? 0 : children.hashCode());
		result = prime * result + ((content == null) ? 0 : content.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
		return result;
	}

	@Override
	public boolean equals(final Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null) {
			return false;
		}
		if (getClass() != obj.getClass()) {
			return false;
		}
		final ExpressionNode other = (ExpressionNode) obj;
		if (children == null) {
			if (other.children != null) {
				return false;
			}
		} else if (!children.equals(other.children)) {
			return false;
		}
		if (content == null) {
			if (other.content != null) {
				return false;
			}
		} else if (!content.equals(other.content)) {
			return false;
		}
		if (name == null) {
			if (other.name != null) {
				return false;
			}
		} else if (!name.equals(other.name)) {
			return false;
		}
		if (type == null) {
			return other.type == null;
		} else {
			return type.equals(other.type);
		}
	}

	@Override
	public String toString() {
		return "ExpressionNode ["
			   + "type="
			   + type
			   + ", "
			   + "name="
			   + name
			   + ", "
			   + "content="
			   + content
			   + ", "
			   + "children="
			   + children
			   + "]";
	}

}
