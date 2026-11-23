// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

const Mocha = require("mocha");

const { EVENT_RUN_END } = Mocha.Runner.constants;

class MinimalReporter extends Mocha.reporters.Base {
	constructor(runner) {
		super(runner);
		runner.once(EVENT_RUN_END, this.epilogue.bind(this));
	}
}

module.exports = MinimalReporter;
