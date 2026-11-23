// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.serialization;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.MeliesModelJsonSerializer;
import com.mgmtp.a12.melies.model.MeliesModelUtil;
import com.mgmtp.a12.melies.model.include.FileSystemFormModelResolver;
import com.mgmtp.a12.melies.model.include.FormModelResolver;
import com.mgmtp.a12.melies.model.include.IncludeExpansion;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.model.serialization.ModelSerializationException;
import com.mgmtp.a12.model.ui.form.FormModel;
import org.apache.commons.lang3.Validate;

import java.io.IOException;
import java.nio.file.Path;

/**
 * Provides JSON (de-)serialization for {@link FormModel}s.
 */
public class IncludeAwareFormModelJsonSerializer extends FormModelJsonSerializer {

	private final Path baseDirectory;

	public IncludeAwareFormModelJsonSerializer(final Path baseDirectory) {
		this.baseDirectory = baseDirectory;
	}

	@Override
	public FormModel deserialize(final String text) throws ModelSerializationException {
		Validate.notBlank(text);
		try {
			final var originalModel = new MeliesModelJsonSerializer().fromJsonString(text);
			final var modelResolver = new FileSystemFormModelResolver(baseDirectory);
			final var dmRef = MeliesModelUtil.getPicusFileReference(originalModel);
			final var pathToDocModel = baseDirectory.resolve(dmRef);
			final var docModel = new DocumentModelLoader().loadFile(pathToDocModel);
			IncludeExpansion.expandIncludes(originalModel, new DocumentModelAccess(docModel), modelResolver);
			return originalModel;
		} catch (final JsonProcessingException e) {
			throw new ModelSerializationException("Error trying to deserialize model.", e);
		} catch (final IOException ioe) {
			throw new ModelSerializationException("Error trying to deserialize referenced document model.", ioe);
		}
	}
}
