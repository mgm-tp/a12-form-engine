// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * @typedef {Object} LockfilePackage
 * @property {{ tarball?: string }} [resolution]
 */

/**
 * @typedef {Object} Lockfile
 * @property {Record<string, LockfilePackage>} [packages]
 */

/**
 * see https://pnpm.io/pnpmfile
 */
export const hooks = {
	/**
	 * @param {Lockfile} lockfile
	 */
	afterAllResolved(lockfile) {
		// There is a pnpm setting for this, but it does not apply for our registry
		// see https://github.com/pnpm/pnpm/pull/11509
		for (const key in lockfile.packages) {
			if (lockfile.packages[key].resolution?.tarball) {
				delete lockfile.packages[key].resolution.tarball;
			}
		}

		return lockfile;
	}
};
