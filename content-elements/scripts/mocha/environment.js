// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import "global-jsdom/register";
import { install } from "source-map-support";

// default behavior is "auto", which would detect a browser (due to JSDOM)
install({ environment: "node" });

import { LogLevel } from "@com.mgmtp.a12.utils/utils-logging/api.js";
import { ConsoleLoggingStrategy, Settings } from "@com.mgmtp.a12.utils/utils-logging/index.js";

Settings.LogStrategy = new ConsoleLoggingStrategy(console, LogLevel.LOG);

// stub missing DOM functions missing in JSDOM
global.window.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => {
	clearTimeout(id);
};
global.window.Element.prototype.scrollIntoView = () => {};

// prevent jsdom being detected as touch device
delete global.window.ontouchstart;

// Due to newer version of react-resize-detector using native ResizeObserver that is not available in jsdom
window.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

global.IntersectionObserver = class IntersectionObserver {
	disconnect() {}
	observe() {}
	takeRecords() {}
	unobserve() {}
};

global.IS_REACT_ACT_ENVIRONMENT = true;
