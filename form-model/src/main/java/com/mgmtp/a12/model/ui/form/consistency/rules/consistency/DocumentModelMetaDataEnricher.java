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
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.dataservices.model.metadata.DocumentModelMetadataInjectorFactory;
import com.mgmtp.a12.kernel.md.document.internal.service.DocumentFactoryImpl;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.a12internal.services.DocumentModelService;
import com.mgmtp.a12.kernel.md.model.a12internal.services.join.DocumentModelJoiningService;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.DocumentModelExpansionException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

/**
 * Internal adapter class to provide the document model metadata enrichment as a singleton instance with a simplified
 * API
 */
class DocumentModelMetaDataEnricher {

	private static DocumentModelMetaDataEnricher _instance;

	private final DocumentModelMetadataInjectorFactory _helper;
	private final IDocumentModel _metaDataDm;

	static DocumentModelMetaDataEnricher getInstance() {
		if(_instance == null) {
			_instance = new DocumentModelMetaDataEnricher();
		}
		return _instance;
	}

	private DocumentModelMetaDataEnricher() {
		var metaDataDmReader = new BufferedReader(
			new InputStreamReader(
				getClass().getResourceAsStream("/com/mgmtp/a12/platform/model/document-meta-data.json"),
				StandardCharsets.UTF_8
			)
		);
		try {
			_metaDataDm = new DocumentModelServiceFactory().createDocumentModelSerializer().deserialize(metaDataDmReader);

			_helper = new DocumentModelMetadataInjectorFactory(
				getDocumentModelJoiningService(),
				new DocumentFactoryImpl(),
				new DocumentModelService()
			);
		} catch (final DocumentModelExpansionException | IOException dme) {
			throw new RuntimeException("Failed to load default document meta data model from classpath.", dme);
		}
	}

	@SuppressWarnings("deprecation")
	private static DocumentModelJoiningService getDocumentModelJoiningService() {
		return DocumentModelJoiningService.INSTANCE;
	}

	IDocumentModel enrichDocumentModel(final IDocumentModel dm) {
		return _helper.getInstance(dm, Locale.US).getDocumentModelWithMetadata(_metaDataDm, null);
	}
}
