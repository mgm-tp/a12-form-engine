// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model;

import com.mgmtp.a12.melies.model.types.FormModelContent;
import com.mgmtp.a12.model.header.Header;
import com.mgmtp.a12.model.ui.form.FormModel;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class MeliesModel implements FormModel {

	// read version from file, which is also used by the TS form model generator
	static String loadModelVersion() {
		try(InputStream input = MeliesModel.class.getClassLoader().getResourceAsStream("version.properties")) {
			Properties prop = new Properties();
			prop.load(input);
			return prop.getProperty("MODEL_VERSION");
		} catch(IOException ex) {
			return "???";
		}
	}

	public static final String MODEL_TYPE = "form";
	public static final String MODEL_VERSION = MeliesModel.loadModelVersion();
	private static final long serialVersionUID = 7792798032996008458L;
	protected Header header;
	protected FormModelContent content;

	public boolean isHeaderSet() {
		return (this.header != null);
	}

	public boolean isContentSet() {
		return (this.content != null);
	}

	public MeliesModel withHeader(final Header value) {
		setHeader(value);
		return this;
	}

	public MeliesModel withContent(final FormModelContent value) {
		setContent(value);
		return this;
	}

	@Override
	public Header getHeader() {
		return header;
	}

	public void setHeader(final Header value) {
		this.header = value;
	}

	@Override
	public FormModelContent getContent() {
		return content;
	}

	public void setContent(final FormModelContent value) {
		this.content = value;
	}

	public String getHeaderId() {
		return getHeader().getId();
	}
}
