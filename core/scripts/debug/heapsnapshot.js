// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
import { closeSync, openSync, writeSync } from "node:fs";
import { Session } from "node:inspector/promises";


/**
 * Debugging function that takes a heap snapshot.
 *
 * Runs a GC before to minimize size/noise.
 */
export async function heapSnapshot() {
	if (global.gc) {
		console.log("running gc");
		global.gc();
	}
	const session = new Session();

	const fd = openSync(`profile.${Date.now()}.heapsnapshot`, "w");

	session.connect();

	session.on("HeapProfiler.addHeapSnapshotChunk", m => {
		writeSync(fd, m.params.chunk);
	});

	console.log("HeapProfiler.takeHeapSnapshot started");
	const result = await session.post("HeapProfiler.takeHeapSnapshot", null);
	console.log("HeapProfiler.takeHeapSnapshot done:", result);
	session.disconnect();
	closeSync(fd);
}
