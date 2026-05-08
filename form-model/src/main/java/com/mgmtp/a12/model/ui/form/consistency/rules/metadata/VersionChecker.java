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
 * 1. Open-Source License – EUPL v1.2
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
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import com.mgmtp.a12.melies.model.MeliesModel;

import org.apache.commons.lang3.Validate;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class VersionChecker {
	private static final Pattern VERSION_PATTERN = Pattern.compile("(?<major>[0-9]+)\\.(?<minor>[0-9]+)\\.(?<patch>[0-9]+)(?<tag>-(?:pre|rc)\\.[0-9]+)?");

	private final VersionFragments modelVersionFragments;

	public VersionChecker() {
		this(MeliesModel.MODEL_VERSION);
	}

	VersionChecker(final CharSequence modelVersion) {
		Validate.notBlank(modelVersion);
		this.modelVersionFragments = new VersionFragments(modelVersion);
	}

	static boolean matchesVersionPattern(final CharSequence version) {
		return VERSION_PATTERN.matcher(version).matches();
	}

	public boolean isModelSchemaVersionCompatible(final CharSequence version) {
		final VersionFragments vf = new VersionFragments(version);
		if (!vf.isValid || !modelVersionFragments.isValid) {
			return false;
		}
		// pre-release tags have to be equal. E.g. a version 1.0.0-pre.3 is not compatible to 1.0.0-pre.7
		if (vf.preReleaseTag != null) {
			return modelVersionFragments.major == vf.major &&
				modelVersionFragments.minor == vf.minor &&
				modelVersionFragments.patch == vf.patch &&
				modelVersionFragments.preReleaseTag.equals(vf.preReleaseTag);
		}
		return modelVersionFragments.major == vf.major &&
			(modelVersionFragments.minor > vf.minor ||
				modelVersionFragments.minor == vf.minor && modelVersionFragments.patch >= vf.patch) &&
			modelVersionFragments.preReleaseTag == null;
	}

	boolean hasPreReleaseTag() {
		return this.modelVersionFragments.preReleaseTag != null;
	}

	private static final class VersionFragments {
		private final int major;
		private final int minor;
		private final int patch;
		private final String preReleaseTag;
		private final boolean isValid;

		private VersionFragments(final CharSequence version) {
			final Matcher m = VERSION_PATTERN.matcher(version);
			if (m.matches()) {
				isValid = true;
				major = Integer.parseInt(m.group("major"));
				minor = Integer.parseInt(m.group("minor"));
				patch = Integer.parseInt(m.group("patch"));
				preReleaseTag = m.group("tag");
			} else {
				isValid = false;
				major = 0;
				minor = 0;
				patch = 0;
				preReleaseTag = null;
			}
		}
	}
}
