// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { AttachmentLoader } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	DocumentPath,
	platformAttachmentLoader,
	RESOURCE_KEYS
} from "@com.mgmtp.a12.formengine/formengine-core";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Localizable,
	LocalizationTreeMap
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

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
