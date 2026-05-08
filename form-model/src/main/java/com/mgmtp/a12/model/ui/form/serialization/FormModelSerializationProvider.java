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
