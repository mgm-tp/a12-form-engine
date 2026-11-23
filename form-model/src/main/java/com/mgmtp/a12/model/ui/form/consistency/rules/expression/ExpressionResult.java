// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.expression;

import java.util.HashSet;
import java.util.Set;

public class ExpressionResult {

	private ExpressionNode node;
	private String errorMessage;

	public ExpressionNode getNode() {
		return node;
	}

	public void setNode(final ExpressionNode node) {
		this.node = node;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(final String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public boolean hasError() {
		return this.errorMessage != null;
	}

	public Set<String> allFieldNames() {
		return allFieldNames(this.node);
	}

	public Set<String> allGroupNames() {
		return allGroupNames(this.node);
	}

	private Set<String> allFieldNames(final ExpressionNode node) {
		final Set<String> result = new HashSet<>();
		if ("field".equals(node.getType())) {
			result.add(node.getName());
		}
		for (final ExpressionNode expressionNode : node.getChildren()) {
			result.addAll(allFieldNames(expressionNode));
		}
		return result;
	}

	private Set<String> allGroupNames(final ExpressionNode node) {
		final Set<String> result = new HashSet<>();
		if ("group".equals(node.getType())) {
			result.add(node.getName());
		}
		for (final ExpressionNode expressionNode : node.getChildren()) {
			result.addAll(allGroupNames(expressionNode));
		}
		return result;
	}
}
