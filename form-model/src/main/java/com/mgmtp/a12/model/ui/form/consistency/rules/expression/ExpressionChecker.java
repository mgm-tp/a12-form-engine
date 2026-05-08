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
