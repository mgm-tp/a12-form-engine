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
