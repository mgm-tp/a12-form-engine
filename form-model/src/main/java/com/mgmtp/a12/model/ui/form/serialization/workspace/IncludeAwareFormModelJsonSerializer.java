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
package com.mgmtp.a12.model.ui.form.serialization.workspace;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mgmtp.a12.melies.model.MeliesModelJsonSerializer;
import com.mgmtp.a12.melies.model.MeliesModelUtil;
import com.mgmtp.a12.melies.model.include.FileSystemFormModelResolver;
import com.mgmtp.a12.melies.model.include.IncludeExpansion;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.model.serialization.ModelSerializationException;
import com.mgmtp.a12.model.ui.form.FormModel;
import com.mgmtp.a12.model.ui.form.serialization.DocumentModelLoader;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonSerializer;
import org.apache.commons.lang3.Validate;

import java.io.IOException;
import java.nio.file.Path;

/**
 * Provides JSON (de-)serialization for {@link FormModel}s.
 * This specific implementation deserializes form models and additionally expands their includes using a
 * {@link FileSystemWorkspaceLoader} to locate and load all form models within a given workspace.
 */
public class IncludeAwareFormModelJsonSerializer extends FormModelJsonSerializer {

	private final FileSystemWorkspaceLoader loader;

	public IncludeAwareFormModelJsonSerializer(final FileSystemWorkspaceLoader loader) {
		this.loader = loader;
	}

	@Override
	public FormModel deserialize(final String text) throws ModelSerializationException {
		Validate.notBlank(text);
		try {
			final var formModel = new MeliesModelJsonSerializer().fromJsonString(text);
			final var modelResolver = new WorkspaceFormModelResolver(loader);
			final var dmRef = MeliesModelUtil.getPicusFileReference(formModel);
			final var docModel = WorkspaceDocumentModelLoader.loadFile(loader, dmRef);
			IncludeExpansion.expandIncludes(formModel, new DocumentModelAccess(docModel), modelResolver);
			return formModel;
		} catch (final JsonProcessingException e) {
			throw new ModelSerializationException("Error trying to deserialize model.", e);
		} catch (final IOException ioe) {
			throw new ModelSerializationException("Error trying to deserialize referenced document model.", ioe);
		}
	}
}
