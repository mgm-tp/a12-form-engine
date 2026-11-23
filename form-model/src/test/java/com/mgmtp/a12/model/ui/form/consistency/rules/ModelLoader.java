// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonStreamSerializer;
import org.apache.commons.lang3.Validate;

import java.io.InputStream;

public class ModelLoader {

	public static MeliesModel loadModel(final String modelName) {
		final InputStream inputStream =Thread.currentThread().getContextClassLoader().getResourceAsStream(modelName);
		Validate.notNull(inputStream, "InputStream may not be null");
		return (MeliesModel) new FormModelJsonStreamSerializer().deserialize(inputStream);
	}

}
