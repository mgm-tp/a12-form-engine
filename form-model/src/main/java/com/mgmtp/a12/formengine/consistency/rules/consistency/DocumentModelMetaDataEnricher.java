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
 * 1. Open-Source License - EUPL v1.2
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
package com.mgmtp.a12.formengine.consistency.rules.consistency;

import com.mgmtp.a12.model.header.Annotation;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.a12internal.services.DocumentModelService;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.DocumentModelExpansionException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;

import com.mgmtp.a12.rmc.metadata.DocumentModelMetadataInjectorFactory;

/**
 * Internal adapter class to provide the document model metadata enrichment as a singleton instance with a simplified
 * API
 */
public class DocumentModelMetaDataEnricher {

	private static DocumentModelMetaDataEnricher _instance;

	private final DocumentModelMetadataInjectorFactory _helper;
	private final IDocumentModel _metaDataDm;

	public static DocumentModelMetaDataEnricher getInstance() {
		if(_instance == null) {
			_instance = new DocumentModelMetaDataEnricher();
		}
		return _instance;
	}

	private DocumentModelMetaDataEnricher() {
		var metaDataDmReader = new BufferedReader(
			new InputStreamReader(
				getClass().getResourceAsStream("/com/mgmtp/a12/rmc/metadata/document-meta-data.json"),
				StandardCharsets.UTF_8
			)
		);
		try {
			_metaDataDm = new DocumentModelServiceFactory().createDocumentModelSerializer().deserialize(metaDataDmReader);

			_helper = new DocumentModelMetadataInjectorFactory(
				new DocumentModelService()
			);
		} catch (final DocumentModelExpansionException | IOException dme) {
			throw new RuntimeException("Failed to load default document meta data model from classpath.", dme);
		}
	}

	public IDocumentModel enrichDocumentModel(final IDocumentModel dm) {
		// Remove "roles" annotations before enrichment to avoid kernel combination warning
		// ("Roles will not be joined") which triggers RMC's strict NotificationConsumer validation.
		// The warning is harmless as the original header is restored after combination anyway.
		List<Annotation> originalAnnotations = dm.getHeader().getAnnotations();
		List<Annotation> rolesAnnotations = List.of();
		if (originalAnnotations != null) {
			rolesAnnotations = originalAnnotations.stream()
				.filter(a -> "roles".equals(a.getName()))
				.toList();
			originalAnnotations.removeAll(rolesAnnotations);
		}

		IDocumentModel enriched = _helper.getInstance(dm, Locale.US).getDocumentModelWithMetadata(_metaDataDm);

		// Restore "roles" annotations on both the original model and the enriched result
		if (!rolesAnnotations.isEmpty()) {
			originalAnnotations.addAll(rolesAnnotations);
			List<Annotation> enrichedAnnotations = enriched.getHeader().getAnnotations();
			if (enrichedAnnotations != null) {
				enrichedAnnotations.addAll(rolesAnnotations);
			}
		}

		return enriched;
	}
}
