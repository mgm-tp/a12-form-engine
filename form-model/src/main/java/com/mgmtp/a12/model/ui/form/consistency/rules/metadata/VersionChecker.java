// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
