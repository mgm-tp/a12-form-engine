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
package com.mgmtp.a12.formengine.model.types;

import java.io.Serializable;

public class RepeatButtonLabelsType implements Serializable {

	private final static long serialVersionUID = 5311716247496043636L;

	protected MultilingualTextType ADD;
	protected MultilingualTextType COMMIT_ADD;
	protected MultilingualTextType APPLY;
	protected MultilingualTextType EDIT;
	protected MultilingualTextType REMOVE;
	protected MultilingualTextType VIEW;
	protected MultilingualTextType CANCEL;
	protected MultilingualTextType CONFIRM;
	protected MultilingualTextType RETURN;
	protected MultilingualTextType UP;
	protected MultilingualTextType DOWN;
	protected MultilingualTextType COPY;
	protected MultilingualTextType CLOSE;
	protected MultilingualTextType DOWNLOAD;
	protected MultilingualTextType SKIP;
	protected MultilingualTextType REPLACE;
	protected MultilingualTextType UPLOAD_AS_COPY;

	public MultilingualTextType getADD() {
		return ADD;
	}

	public void setADD(final MultilingualTextType ADD) {
		this.ADD = ADD;
	}

	public MultilingualTextType getCOMMIT_ADD() {
		return COMMIT_ADD;
	}

	public void setCOMMIT_ADD(final MultilingualTextType COMMIT_ADD) {
		this.COMMIT_ADD = COMMIT_ADD;
	}

	public MultilingualTextType getAPPLY() {
		return APPLY;
	}

	public void setAPPLY(final MultilingualTextType APPLY) {
		this.APPLY = APPLY;
	}

	public MultilingualTextType getEDIT() {
		return EDIT;
	}

	public void setEDIT(final MultilingualTextType EDIT) {
		this.EDIT = EDIT;
	}

	public MultilingualTextType getREMOVE() {
		return REMOVE;
	}

	public void setREMOVE(final MultilingualTextType REMOVE) {
		this.REMOVE = REMOVE;
	}

	public MultilingualTextType getVIEW() {
		return VIEW;
	}

	public void setVIEW(final MultilingualTextType VIEW) {
		this.VIEW = VIEW;
	}

	public MultilingualTextType getCANCEL() {
		return CANCEL;
	}

	public void setCANCEL(final MultilingualTextType CANCEL) {
		this.CANCEL = CANCEL;
	}

	public MultilingualTextType getCONFIRM() {
		return CONFIRM;
	}

	public void setCONFIRM(final MultilingualTextType CONFIRM) {
		this.CONFIRM = CONFIRM;
	}

	public MultilingualTextType getRETURN() {
		return RETURN;
	}

	public void setRETURN(final MultilingualTextType RETURN) {
		this.RETURN = RETURN;
	}

	public MultilingualTextType getUP() {
		return UP;
	}

	public void setUP(final MultilingualTextType UP) {
		this.UP = UP;
	}

	public MultilingualTextType getDOWN() {
		return DOWN;
	}

	public void setDOWN(final MultilingualTextType DOWN) {
		this.DOWN = DOWN;
	}

	public MultilingualTextType getCOPY() {
		return COPY;
	}

	public void setCOPY(final MultilingualTextType COPY) {
		this.COPY = COPY;
	}

	public MultilingualTextType getCLOSE() {
		return CLOSE;
	}

	public void setCLOSE(final MultilingualTextType CLOSE) {
		this.CLOSE = CLOSE;
	}

	public MultilingualTextType getDOWNLOAD() {
		return DOWNLOAD;
	}

	public void setDOWNLOAD(final MultilingualTextType DOWNLOAD) {
		this.DOWNLOAD = DOWNLOAD;
	}

	public MultilingualTextType getSKIP() {
		return SKIP;
	}

	public void setSKIP(final MultilingualTextType SKIP) {
		this.SKIP = SKIP;
	}

	public MultilingualTextType getREPLACE() {
		return REPLACE;
	}

	public void setREPLACE(final MultilingualTextType REPLACE) {
		this.REPLACE = REPLACE;
	}

	public MultilingualTextType getUPLOAD_AS_COPY() {
		return UPLOAD_AS_COPY;
	}

	public void setUPLOAD_AS_COPY(final MultilingualTextType UPLOAD_AS_COPY) {
		this.UPLOAD_AS_COPY = UPLOAD_AS_COPY;
	}

	public boolean isADDSet() {
		return (this.ADD != null);
	}

	public RepeatButtonLabelsType withADD(final MultilingualTextType value) {
		setADD(value);
		return this;
	}

	public boolean isCOMMIT_ADDSet() {
		return (this.COMMIT_ADD != null);
	}

	public RepeatButtonLabelsType withCOMMIT_ADD(final MultilingualTextType value) {
		setCOMMIT_ADD(value);
		return this;
	}

	public boolean isAPPLYSet() {
		return (this.APPLY != null);
	}

	public RepeatButtonLabelsType withAPPLY(final MultilingualTextType value) {
		setAPPLY(value);
		return this;
	}

	public boolean isEDITSet() {
		return (this.EDIT != null);
	}

	public RepeatButtonLabelsType withEDIT(final MultilingualTextType value) {
		setEDIT(value);
		return this;
	}

	public boolean isREMOVESet() {
		return (this.REMOVE != null);
	}

	public RepeatButtonLabelsType withREMOVE(final MultilingualTextType value) {
		setREMOVE(value);
		return this;
	}

	public boolean isVIEWSet() {
		return (this.VIEW != null);
	}

	public RepeatButtonLabelsType withVIEW(final MultilingualTextType value) {
		setVIEW(value);
		return this;
	}

	public boolean isCANCELSet() {
		return (this.CANCEL != null);
	}

	public RepeatButtonLabelsType withCANCEL(final MultilingualTextType value) {
		setCANCEL(value);
		return this;
	}

	public boolean isCONFIRMSet() {
		return (this.CONFIRM != null);
	}

	public RepeatButtonLabelsType withCONFIRM(final MultilingualTextType value) {
		setCONFIRM(value);
		return this;
	}

	public boolean isRETURNSet() {
		return (this.RETURN != null);
	}

	public RepeatButtonLabelsType withRETURN(final MultilingualTextType value) {
		setRETURN(value);
		return this;
	}

	public boolean isUPSet() {
		return (this.UP != null);
	}

	public RepeatButtonLabelsType withUP(final MultilingualTextType value) {
		setUP(value);
		return this;
	}

	public boolean isDOWNSet() {
		return (this.DOWN != null);
	}

	public RepeatButtonLabelsType withDOWN(final MultilingualTextType value) {
		setDOWN(value);
		return this;
	}

	public boolean isCOPYSet() {
		return (this.COPY != null);
	}

	public RepeatButtonLabelsType withCOPY(final MultilingualTextType value) {
		setCOPY(value);
		return this;
	}

	public boolean isCLOSESet() {
		return (this.CLOSE != null);
	}

	public RepeatButtonLabelsType withCLOSE(final MultilingualTextType value) {
		setCLOSE(value);
		return this;
	}

	public boolean isDOWNLOADSet() {
		return (this.DOWNLOAD != null);
	}

	public RepeatButtonLabelsType withDOWNLOAD(final MultilingualTextType value) {
		setDOWNLOAD(value);
		return this;
	}

	public boolean isSKIPSet() {
		return (this.SKIP != null);
	}

	public RepeatButtonLabelsType withSKIP(final MultilingualTextType value) {
		setSKIP(value);
		return this;
	}

	public boolean isREPLACESet() {
		return (this.REPLACE != null);
	}

	public RepeatButtonLabelsType withREPLACE(final MultilingualTextType value) {
		setREPLACE(value);
		return this;
	}

	public boolean isUPLOAD_AS_COPYSet() {
		return (this.UPLOAD_AS_COPY != null);
	}

	public RepeatButtonLabelsType withUPLOAD_AS_COPY(final MultilingualTextType value) {
		setUPLOAD_AS_COPY(value);
		return this;
	}

	public boolean isEmpty() {
		return !isADDSet()
			&& !isCOMMIT_ADDSet()
			&& !isAPPLYSet()
			&& !isEDITSet()
			&& !isREMOVESet()
			&& !isVIEWSet()
			&& !isCANCELSet()
			&& !isCONFIRMSet()
			&& !isRETURNSet()
			&& !isUPSet()
			&& !isDOWNSet()
			&& !isCOPYSet()
			&& !isCLOSESet()
			&& !isDOWNLOADSet()
			&& !isSKIPSet()
			&& !isREPLACESet()
			&& !isUPLOAD_AS_COPYSet();
	}
}
