// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext } from "react";

import { DefaultWidgetMap } from "./DefaultWidgetMap.js";
import type { WidgetMap } from "./widget-map.js";

/** @internal */
export const WidgetMapContext = createContext<WidgetMap>(DefaultWidgetMap);
