// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.serialization;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.serialization.JsonSerializer;
import com.mgmtp.a12.model.serialization.ModelSerializationProvider;
import com.mgmtp.a12.model.serialization.XmlSerializer;
import com.mgmtp.a12.model.ui.form.FormModel;
import com.mgmtp.a12.model.header.DefaultHeaderParser;
import com.mgmtp.a12.model.header.HeaderParseException;
import java.util.Objects;
import org.kohsuke.MetaInfServices;

@MetaInfServices
public class FormModelSerializationProvider implements ModelSerializationProvider {

	@Override
	public Class<? extends Model> modelType() {
		return FormModel.class;
	}

	@Override
	public boolean supports(final Class<? extends Model> clazz) {
		Objects.requireNonNull(clazz);
		return FormModel.class.isAssignableFrom(clazz);
	}

	@Override
	public boolean isModelXml(final String text) {
		throw new UnsupportedOperationException("not implemented any longer");
	}

	@Override
	public boolean isModelJson(final String text) {
		try {
			return MeliesModel.MODEL_TYPE.equals(new DefaultHeaderParser().parseJson(text).getModelType());
		} catch (final HeaderParseException hpe) {
			return false;
		}
	}

	@Override
	public XmlSerializer<FormModel> createXmlSerializer() {
		throw new UnsupportedOperationException("not implemented any longer");
	}

	@Override
	public JsonSerializer<FormModel> createJsonSerializer() {
		return new FormModelJsonSerializer();
	}

}
