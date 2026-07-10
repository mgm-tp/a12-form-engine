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
package com.mgmtp.a12.formengine.consistency.rules.metadata;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.header.Header;
import com.mgmtp.a12.model.header.Label;

import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.common.metadata.UnknownLocaleChecker;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.consistency.rules.language.FormLocalizationAdapter;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.locale.LocaleConverter;
import com.mgmtp.a12.formengine.model.types.ConfirmationTextType;
import com.mgmtp.a12.formengine.model.types.ConfirmationTextsType;
import com.mgmtp.a12.formengine.model.types.DefaultsType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationType;
import com.mgmtp.a12.formengine.model.types.RepeatButtonLabelsType;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;

/**
 * Check locale usage in the rules definition. Locales are defined in model settings section.
 */
public class FormLocalesRule implements ConsistencyRule {

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) {

		final List<String> locales = LocaleConverter.convert(model.getHeader().getLocales());
		final UnknownLocaleChecker unknownLocaleChecker = new UnknownLocaleChecker(
			model.getHeaderId(),
			locales,
			FormModelCategory.FORM_MODEL_WRONG_LOCALE
		);
		final LocaleModelVisitor visitor = new LocaleModelVisitor(unknownLocaleChecker);
		new ModelWalker(visitor).acceptScreenGroupRootElement(model.getContent().getScreens());
		checkHeader(model, unknownLocaleChecker);
		checkDefaults(model.getContent().getDefaults(), unknownLocaleChecker);
		checkFieldConfiguration(model.getContent().getFieldConfiguration(), unknownLocaleChecker);

		return unknownLocaleChecker.getLocaleProblems();
	}

	private void checkHeader(final FormModel model, final UnknownLocaleChecker unknownLocaleChecker) {
		if (model.getHeader().getLabels() != null) {
			for (final Label label : model.getHeader().getLabels()) {
				checkLabel(label, model.getHeader()).ifPresent(p -> unknownLocaleChecker.getLocaleProblems()
					.add(p));
			}
		}
	}

	private Optional<Problem> checkLabel(final Label label, final Header header) {
		final Locale locale = label.getLocale();
		if (!CollectionUtils.emptyIfNull(header.getLocales()).contains(locale)) {
			return Optional.of(new ConsistencyProblem(
				header.getId(),
				FormModelCategory.FORM_MODEL_WRONG_LOCALE,
				new FormModelProblemSource(header.getId()),
				"header",
				label.getText(),
				LocaleConverter.convert(label.getLocale()),
				header.getLocales()
					.stream()
					.map(Locale::toLanguageTag)
					.collect(Collectors.joining(","))));
		}
		return Optional.empty();
	}

	private void checkDefaults(final DefaultsType defaults, final UnknownLocaleChecker checker) {
		final RepeatButtonLabelsType buttonLabels = defaults.getButtonLabels();
		if (buttonLabels != null) {
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getADD()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getCOMMIT_ADD()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getAPPLY()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getEDIT()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getREMOVE()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getVIEW()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getCANCEL()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getCONFIRM()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getRETURN()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getUP()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getDOWN()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getCOPY()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getCLOSE()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getDOWNLOAD()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getSKIP()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getREPLACE()), "default-button-label");
			checker.check(FormLocalizationAdapter.adapterFor(buttonLabels.getUPLOAD_AS_COPY()), "default-button-label");
		}

		final ConfirmationTextsType confirmationTexts = defaults.getConfirmationTexts();
		if (confirmationTexts != null) {

			if (confirmationTexts.isREMOVESet()) {
				final ConfirmationTextType removeConfirmation = confirmationTexts.getREMOVE();
				checker.check(
					FormLocalizationAdapter.adapterFor(removeConfirmation.getMessage()),
					"default-confirmation-message");
				checker.check(
					FormLocalizationAdapter.adapterFor(removeConfirmation.getTitle()),
					"default-confirmation-title");
			}
		}
	}

	private void checkFieldConfiguration(
		final FieldConfigurationType fieldConfiguration, final UnknownLocaleChecker checker) {

		final List<FieldConfigurationEntryType> fieldConfigurations = fieldConfiguration.getField();
		for (final FieldConfigurationEntryType fieldConfig : fieldConfigurations) {
			checker.check(FormLocalizationAdapter.adapterFor(fieldConfig.getHint()), fieldConfig.getElementRef());
			checker
				.check(
					FormLocalizationAdapter.adapterFor(
						fieldConfig.getLabel() != null
							? fieldConfig.getLabel().getMultilingualText()
							: null),
					fieldConfig.getElementRef());
			checker.check(
				FormLocalizationAdapter.adapterFor(fieldConfig.getPlaceholder()),
				fieldConfig.getElementRef());
		}
	}
}
