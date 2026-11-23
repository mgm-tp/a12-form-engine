// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { join } from "node:path";

const BUILD_PATH = join(import.meta.dirname, "..", "..", "..", "..", "exampleModels", "build");

export const MODEL_DIR_NAME = join(BUILD_PATH, "models");
export const DATA_DIR_NAME = join(BUILD_PATH, "data");
