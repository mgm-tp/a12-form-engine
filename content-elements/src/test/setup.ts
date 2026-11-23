// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

// import { mock } from "node:test";

import * as React from "react";

// TODO: do we need this?

// if (typeof global.window !== "undefined") {
// 	window.ResizeObserver = mock.fn(() => ({
// 		observe: mock.fn(),
// 		unobserve: mock.fn(),
// 		disconnect: mock.fn()
// 	}));
// 	Element.prototype.scrollIntoView = mock.fn();
// }

global.React = React;
