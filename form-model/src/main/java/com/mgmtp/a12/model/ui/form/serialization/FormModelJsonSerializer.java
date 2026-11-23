// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.serialization;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.MeliesModelJsonSerializer;
import com.mgmtp.a12.model.serialization.JsonSerializer;
import com.mgmtp.a12.model.serialization.ModelSerializationException;
import com.mgmtp.a12.model.ui.form.FormModel;

/**
 * Provides JSON (de-)serialization for {@link FormModel}s.
 */
public class FormModelJsonSerializer implements JsonSerializer<FormModel> {

	@Override
	public String serialize(final FormModel model) throws ModelSerializationException {
		try {
			return new MeliesModelJsonSerializer().toJsonString((MeliesModel) model);
		} catch (final JsonProcessingException e) {
			throw new ModelSerializationException(
				"Error trying to serialize model '" + model.getHeader().getId() + "'.", e);
		}
	}

	@Override
	public FormModel deserialize(final String text) throws ModelSerializationException {
		try {
			return new MeliesModelJsonSerializer().fromJsonString(text);
		} catch (final JsonProcessingException e) {
			throw new ModelSerializationException("Error trying to deserialize model.", e);
		}
	}
}
