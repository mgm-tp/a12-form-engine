// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
