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

import type { AttachmentLoader } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	DocumentPath,
	platformAttachmentLoader,
	RESOURCE_KEYS
} from "@com.mgmtp.a12.formengine/formengine-core";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizable, LocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization";

import { DEVAPP_MODE, sleep } from "../config/mode.js";

import { embeddedAttachmentLoader } from "./embeddedAttachmentLoader.js";

const defaultLoader = ((): AttachmentLoader => {
	switch (DEVAPP_MODE) {
		case "mock":
			return embeddedAttachmentLoader;
		case "services":
			return platformAttachmentLoader;
	}
})();

const ERROR_ATTACHMENT_PATHS = [
	DocumentPath.fromString("root[1]/attachmentError[1]"),
	DocumentPath.fromString("root[1]/attachmentErrorGroup[1]/attachment[0]")
];
const DELAYED_ATTACHMENT_PATHS = [
	DocumentPath.fromString("root[1]/attachmentDelayed[1]"),
	DocumentPath.fromString("root[1]/attachmentDelayedGroup[1]/attachment[0]")
];

/**
 * Custom implementation of an {@link AttachmentLoader} that showcases how to customize it and
 * allows testing the attachment UI.
 *
 * ### Testing errors
 * When trying to upload attachments with a path specified in `ERROR_ATTACHMENT_PATHS`, the upload will always
 * fail with one of the default error keys.
 *
 * ### Testing cancelling
 * When uploading attachments with a path specified in `DELAYED_ATTACHMENT_PATHS`, the upload will always
 * by delayed by five seconds, allowing to test the cancel behavior.
 */
export const devappAttachmentLoader: AttachmentLoader = {
	...defaultLoader,
	async uploadFiles(files, documentDescriptor, signal) {
		// 1. Create an error localizable if needed
		const errorLocalizable = determineError(files[0].attachmentPath);

		// 2. Simulate the "upload"
		const results = errorLocalizable
			? files.map(() => errorLocalizable)
			: await defaultLoader.uploadFiles(files, documentDescriptor, signal);

		// 3. Add some delay if needed
		await handleDelay(files[0].attachmentPath);

		return results;
	}
};

function determineError(attachmentPath: EntityInstancePath): Localizable | undefined {
	const shouldFail = ERROR_ATTACHMENT_PATHS.find(p => DocumentPath.matches(p, attachmentPath));

	return shouldFail
		? localizableFromLocalizationTreeMap(RESOURCE_KEYS.attachment.error.unknown, DEFAULTS, {
				ERROR: { type: "plain", value: "" }
			})
		: undefined;
}

async function handleDelay(attachmentPath: EntityInstancePath): Promise<void> {
	const shouldDelay = DELAYED_ATTACHMENT_PATHS.find(p => DocumentPath.matches(p, attachmentPath));

	if (shouldDelay) {
		await sleep(5000);
	}
}

const DEFAULTS: LocalizationTreeMap = {
	en: {
		attachment: {
			error: {
				unknown: "An unknown error occurred.$ERROR$"
			}
		}
	},
	de: {
		attachment: {
			error: {
				unknown: "Ein unbekannter Fehler ist aufgetreten.$ERROR$"
			}
		}
	}
};
