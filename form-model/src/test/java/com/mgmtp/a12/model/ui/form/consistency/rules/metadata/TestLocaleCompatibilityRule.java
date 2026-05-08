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
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.header.Annotation;
import com.mgmtp.a12.model.header.Header;
import com.mgmtp.a12.model.header.Label;
import com.mgmtp.a12.model.header.ModelReference;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

public class TestLocaleCompatibilityRule {
	private final LocaleCompatibilityRule rule = new LocaleCompatibilityRule();

	@Test(dataProvider = "testData")
	public void testRuleFiring(final Object[] testData) {
		final String[] dmLangs = (String[]) testData[0];
		final IDocumentModel dm = createDocumentModel(dmLangs);

		rule.setModelResolver(modelName -> Optional.of(dm));

		final String[] mmLangs = (String[]) testData[1];
		final MeliesModel mm = createMeliesModel(dm, mmLangs);

		final List<Problem> problems = rule.executeRule(mm);

		final String expectedMessage = ((String[]) testData[2])[0];

		Assert.assertEquals(problems.isEmpty(), expectedMessage.isEmpty());

		if (!problems.isEmpty()) {
			Assert.assertEquals(problems.get(0).getLocalizedMessage(Locale.ENGLISH), expectedMessage);
		}
	}

	@DataProvider(name = "testData")
	public Object[] testData() {
		return new String[][][]{
			new String[][]{
				new String[]{"en"},
				new String[]{},
				new String[]{""}
			},
			new String[][]{
				new String[]{"en"},
				new String[]{"de"},
				new String[]{
					"The following locales cannot be used as they are missing in the underlying document model: de."
				}
			},
			new String[][]{
				new String[]{"en", "de"},
				new String[]{"de"},
				new String[]{""}
			},
			new String[][]{
				new String[]{"en"},
				new String[]{"en", "de"},
				new String[]{
					"The following locales cannot be used as they are missing in the underlying document model: de."
				}
			},
			new String[][]{
				new String[]{"en", "de", "fr"}, new String[]{"fr", "de", "en"}, new String[]{""}
			},
			new String[][]{
				new String[]{"en", "de", "fr", "it", "at", "ch", "nl"},
				new String[]{"fr", "de", "en", "be", "it", "cd", "nz"},
				new String[]{
					"The following locales cannot be used as they are missing in the underlying document model: be,cd,nz."
				}
			}
		};
	}

	private IDocumentModel createDocumentModel(final String... languages) {
		final var serializer = new DocumentModelServiceFactory().createDocumentModelSerializer();
		final IDocumentModel dm;
		try {
			dm = serializer.deserialize(
				new BufferedReader(
					new InputStreamReader(getClass().getResourceAsStream("localeCompatibility-document.json"), StandardCharsets.UTF_8)
				)
			);
		} catch (final IOException e) {
			throw new RuntimeException(e);
		}
		TestModelHeaderWriter.setLocales(dm.getHeader(), Arrays.stream(languages).map(Locale::forLanguageTag).toList());
		return dm;
	}

	private MeliesModel createMeliesModel(final IDocumentModel documentModel, final String... languages) {
		return new MeliesModel().withHeader(new Header() {
			@Override
			public String getId() {
				return "test";
			}

			@Override
			public String getModelType() {
				return MeliesModel.MODEL_TYPE;
			}

			@Override
			public String getModelVersion() {
				return MeliesModel.MODEL_VERSION;
			}

			@Override
			public List<Locale> getLocales() {
				if (languages.length > 0) {
					return Arrays.stream(languages).map(Locale::forLanguageTag).collect(Collectors.toList());
				}
				return null;
			}

			@Override
			public List<Label> getLabels() {
				return Collections.emptyList();
			}

			@Override
			public String getDescription() { return null; }

			@Override
			public List<Annotation> getAnnotations() {
				return Collections.emptyList();
			}

			@Override
			public List<ModelReference> getModelReferences() {
				return Collections.singletonList(new ModelReference() {
					@Override
					public String getPurpose() {
						return "data binding";
					}

					@Override
					public String getModelType() {
						return "document";
					}

					@Override
					public String getAlias() {
						return "DM";
					}

					@Override
					public String getReference() {
						return documentModel.getHeader().getId();
					}
				});
			}
		});
	}
}
