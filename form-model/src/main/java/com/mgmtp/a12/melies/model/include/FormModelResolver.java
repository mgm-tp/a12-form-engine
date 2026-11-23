// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.include;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;

public interface FormModelResolver {

	FormModelResult resolveFormModel(final String modelReference);

	class FormModelResult {
		public MeliesModel formModel;
		public DocumentModelAccess documentModelAccess;

		public FormModelResult(final MeliesModel formModel, final DocumentModelAccess modelAccess) {
			this.formModel = formModel;
			this.documentModelAccess = modelAccess;
		}
	}
}
