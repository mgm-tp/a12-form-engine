// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

public interface MultiFileUploadRepeat {
	public Boolean getMultiFileUpload();

	public void setMultiFileUpload(final Boolean multiFileUpload);

	public void unsetMultiFileUpload();

	public boolean isMultiFileUploadSet();
	
	public MultiFileUploadOptionType getMultiFileUploadOptions();

	public void setMultiFileUploadOptions(final MultiFileUploadOptionType multiFileUploadOptions);

	public void unsetMultiFileUploadOptions();

	public boolean isMultiFileUploadOptionsSet();
	
	public RepeatType withMultiFileUpload(Boolean value);
	
	public RepeatType withMultiFileUploadOptions(MultiFileUploadOptionType value);
}
