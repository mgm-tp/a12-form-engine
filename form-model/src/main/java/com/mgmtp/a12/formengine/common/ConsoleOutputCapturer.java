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
package com.mgmtp.a12.formengine.common;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

/**
 * Captures the output written to System.out
 */
public class ConsoleOutputCapturer {

	private ByteArrayOutputStream baos;
	private PrintStream previous;
	private boolean capturing;

	public void start() {
		if (capturing) {
			return;
		}

		capturing = true;
		previous = System.out;
		baos = new ByteArrayOutputStream();

		final OutputStream outputStreamCombiner = new OutputStreamCombiner(Arrays.asList(previous, baos));
		final PrintStream custom = new PrintStream(outputStreamCombiner, false, StandardCharsets.UTF_8);

		System.setOut(custom);
	}

	public String stop() throws IOException {
		if (!capturing) {
			return "";
		}

		System.setOut(previous);

		final String capturedValue = baos.toString(StandardCharsets.UTF_8);

		baos.close();
		baos = null;
		previous = null;
		capturing = false;

		return capturedValue;
	}

	private static class OutputStreamCombiner extends OutputStream {
		private final List<OutputStream> outputStreams;

		public OutputStreamCombiner(final List<OutputStream> outputStreams) {
			this.outputStreams = outputStreams;
		}

		public void write(final int b) throws IOException {
			for (final OutputStream os : outputStreams) {
				os.write(b);
			}
		}

		public void flush() throws IOException {
			for (final OutputStream os : outputStreams) {
				os.flush();
			}
		}

		public void close() throws IOException {
			for (final OutputStream os : outputStreams) {
				os.close();
			}
		}
	}
}
