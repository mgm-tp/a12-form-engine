// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.general;

import com.mgmtp.a12.model.consistency.ConsistencyStatus;
import com.mgmtp.a12.model.consistency.ConsistencyValidator;
import com.mgmtp.a12.model.ui.form.FormModel;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonStreamSerializer;
import org.apache.commons.lang3.Validate;

import java.io.IOException;
import java.io.InputStream;

/**
 * Abstract test class for consistency checker.
 */
public abstract class ConsistencyValidatorTest {

	protected ConsistencyValidator checker;

	protected ConsistencyStatus runValidation(final String modelName) throws IOException {
		final InputStream inputStream = getClass().getClassLoader().getResourceAsStream(modelName);
		Validate.notNull(inputStream, "InputStream may not be null");
		final FormModel model = new FormModelJsonStreamSerializer().deserialize(inputStream);

		return checker.validate(model);
	}

}
