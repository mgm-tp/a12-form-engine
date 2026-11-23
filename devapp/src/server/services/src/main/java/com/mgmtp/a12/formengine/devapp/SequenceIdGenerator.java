// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.formengine.devapp;

import com.mgmtp.a12.dataservices.document.IDocumentIdGenerator;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * A custom id generator that creates easy (sequential) docRefs like "dmName/1"
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
@Component public class SequenceIdGenerator implements IDocumentIdGenerator {

	@PersistenceContext private EntityManager entityManager;

	@Override public Optional<String> generateId(DocumentV2 document) {
		return document == null || document.getId().isEmpty() ?
			Optional.of(String.valueOf(entityManager.createNativeQuery("SELECT NEXTVAL('document_seq')").getSingleResult())) :
			document.getId();
	}

}
