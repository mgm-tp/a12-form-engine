// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.common;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.UnsupportedEncodingException;
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
