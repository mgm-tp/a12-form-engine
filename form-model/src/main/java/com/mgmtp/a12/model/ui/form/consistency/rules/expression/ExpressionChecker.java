// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.expression;

import org.apache.commons.io.IOUtils;
import org.openjdk.nashorn.api.scripting.NashornScriptEngine;
import org.openjdk.nashorn.api.scripting.NashornScriptEngineFactory;
import org.openjdk.nashorn.api.scripting.ScriptObjectMirror;

import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import javax.script.SimpleScriptContext;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class ExpressionChecker {
	private static final ScriptEngine engine = new NashornScriptEngineFactory().getScriptEngine();

	private final ScriptContext scriptContext;

	public ExpressionChecker() {
		scriptContext = new SimpleScriptContext();

		try (final InputStream is = getClass().getClassLoader().getResourceAsStream("resources/parser.js")) {
			assert is != null : "Could not create input stream for expression parser library.";

			final String expressionsLib = IOUtils.toString(is, StandardCharsets.UTF_8);

			engine.eval("var console = {log: print, error: print};" + expressionsLib, scriptContext);

		} catch (final IOException | ScriptException e) {
			throw new RuntimeException("Error when evaluating JavaScript Expressions Library: " + e);
		}
	}

	public ExpressionResult parse(final String input) {
		final ExpressionResult result = new ExpressionResult();
		try {
			final String varInitialization = """
				var input = undefined;
				var result = undefined;
				var error = undefined;
				""";
			engine.eval(varInitialization, scriptContext);

			getContextObject(scriptContext).put("input", input);

			final String tryCatchBlock = """
				try {
					result = Parser.parse(input);
				} catch (e) {
					error = e.message;
				}
				""";
			engine.eval(tryCatchBlock, scriptContext);

			if (getContextObject(scriptContext).get("error") != null) {

				result.setErrorMessage((String) getContextObject(scriptContext).get("error"));
			} else {
				result.setNode(ExpressionUtil.convertToNode(getContextObject(scriptContext).get("result")));
			}
		} catch (final ScriptException e) {
			result.setErrorMessage(e.getMessage());
		}
		return result;
	}

	/**
	 * Returns the object from the script context into which the nashorn engine writes its
	 * evaluation results
	 */
	private ScriptObjectMirror getContextObject(final ScriptContext scriptContext) {
		return ((ScriptObjectMirror) scriptContext
			.getBindings(ScriptContext.ENGINE_SCOPE)
			.get(NashornScriptEngine.NASHORN_GLOBAL));
	}

}
