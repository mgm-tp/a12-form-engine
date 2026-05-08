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
package com.mgmtp.a12.melies.model.id;

import com.mgmtp.a12.melies.common.IdGenerator;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.visitor.FormModelIdWalker;
import org.apache.commons.lang3.StringUtils;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * This class generates unique Ids for model elements. It pre-computes the set of available ids currently in the model to
 * check for collisions when generating a new id.
 * <p>
 * Important: Please note, that you must not add model elements with other mechanisms between calls to
 * IdGenerator.generate(). This is because these new ids are then not tracked and might result in duplicate ids.
 */
public class ModelIdGenerator implements IdGenerator {
	private Set<String> usedIds; // used to track all ids in the model to prevent duplicates; lazy init.

	public ModelIdGenerator(final MeliesModel model) {
		this.usedIds = gatherUsedIds(model);
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see com.mgmtp.a12.melies.app.state.id.IdGenerator#generate(java.lang.Class)
	 */
	@Override
	public <T> String generate(final Class<T> clazz) {
		String id = null;
		do {
			if (id != null) {
				System.out.println("GenerateUniqueId: collision found for Id " + id);
			}
			id = generateUniqueId(clazz);
		} while (usedIds.contains(id));
		usedIds.add(id);
		return id;
	}

	private Set<String> gatherUsedIds(final MeliesModel model) {
		final Set<String> idList = new HashSet<>();
		new FormModelIdWalker(elem -> idList.add(elem.getId())).accept(model);
		return idList;
	}

	private String generateUniqueId(final Class<?> typeClass) {
		return String.format(
			"%s-%s",
			StringUtils.lowerCase(baseName(typeClass)),
			UUID.randomUUID().toString().substring(0, 5)
		);
	}

	private String baseName(final Class<?> clazz) {
		String className = clazz.getSimpleName();
		if (className.endsWith("Type")) {
			className = className.substring(0, className.length() - 4);
		}
		if (className.endsWith("TypeExt")) {
			className = className.substring(0, className.length() - 7);
		}
		return className;
	}
}
