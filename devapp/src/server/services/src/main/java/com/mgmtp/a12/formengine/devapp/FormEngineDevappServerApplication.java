// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.formengine.devapp;

import com.mgmtp.a12.dataservices.DataServicesApplication;
import com.mgmtp.a12.dataservices.configuration.DataServicesCoreProperties;
import com.mgmtp.a12.dataservices.server.app.ServerApplication;

@DataServicesApplication(scanBasePackages = {
	DataServicesCoreProperties.DS_PACKAGE_PREFIX,
	"com.mgmtp.a12.formengine.devapp"
})
public class FormEngineDevappServerApplication {
	public static void main(String[] args) {
		ServerApplication.start(args, FormEngineDevappServerApplication.class);
	}
}
