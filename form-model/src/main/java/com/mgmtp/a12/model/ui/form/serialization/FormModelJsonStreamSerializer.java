// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.serialization;

import com.mgmtp.a12.model.serialization.StreamSerializer;
import com.mgmtp.a12.model.serialization.StringSerializer;
import com.mgmtp.a12.model.ui.form.FormModel;

/**
 * Supports serialization with i/o streams.
 */
public class FormModelJsonStreamSerializer extends StreamSerializer<FormModel> {

	private final FormModelJsonSerializer internalSerializer = new FormModelJsonSerializer();

	@Override
	public StringSerializer getStringSerializer() {
		return internalSerializer;
	}
}
