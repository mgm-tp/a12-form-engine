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

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";

import { isRecord } from "../../../utils/internal/guards.js";

import type { EngineState, EngineStore, Models } from "../store.js";

/**
 * Function to type-check if a given state is of type
 * {@link EngineState}
 * @param state The object to check
 * @returns the object typed as {@link EngineState}
 * @throws If the object is not a valid EngineState
 */
export function engineState(state: object): EngineState {
	if (isEngineState(state)) {
		return state;
	} else {
		throw new Error("Not a valid EngineState");
	}
}

/**
 * Function to type-check if a given object is of type
 * {@link EngineStore.UIState}.
 * @param state The object to check
 * @returns the object typed as {@link EngineStore.UIState}
 * @throws If the object is not a valid UIState
 */
export function uiSlice(state: object): EngineStore.UIState {
	if (isUiState(state)) {
		return state;
	} else {
		throw new Error("Not a valid UI EngineState Slice");
	}
}

/**
 * Function to type-check if a given object is of type
 * {@link EngineStore.DataState}.
 * @param state The object to check
 * @returns the object typed as {@link EngineStore.DataState}
 * @throws If the object is not a valid DataState
 */
export function dataSlice(state: object): EngineStore.DataState {
	if (isDataState(state)) {
		return state;
	} else {
		throw new Error("Not a valid Data EngineState Slice");
	}
}

/**
 * Function to type-check if a given object is of type
 * {@link Models}.
 * @param state The object to check
 * @returns the object typed as {@link Models}
 * @throws If the object is not of type {@link Models}
 */
export function modelsSlice(state: object): Models {
	if (isModels(state)) {
		return state;
	} else {
		throw new Error("Not a valid Models Slice");
	}
}

/**
 * Function to type-check if a given object is of type
 * `Locale`.
 * @param state The object to check
 * @returns the object typed as `Locale`
 * @throws If the object is not of type `Locale`
 */
export function localeSlice(state: object): Locale {
	if (isLocale(state)) {
		return state;
	} else {
		throw new Error("Not a valid Locale Slice");
	}
}

export function isEngineState(value: unknown): value is EngineState {
	return (
		isRecord(value) &&
		isUiState(value.ui) &&
		isDataState(value.data) &&
		isModels(value.models) &&
		isLocale(value.locale)
	);
}

export function isUiState(value: unknown): value is EngineStore.UIState {
	return (
		isRecord(value) &&
		"dirty" in value &&
		"disabled" in value &&
		"readonly" in value &&
		isBackup(value.backup) &&
		isSectionState(value.sectionState) &&
		isScreenLocation(value.screenLocation) &&
		isCorrectionScreenState(value.correctionScreen) &&
		isValidationBarState(value.validationBar) &&
		isCorrectionModeBackup(value.correctionModeBackup)
	);
}

export function isDataState(value: unknown): value is EngineStore.DataState {
	return isRecord(value) && isRecord(value.document);
}

export function isModels(value: unknown): value is Models {
	return isRecord(value) && isRecord(value.documentModel) && isRecord(value.formModel);
}

function isBackup(slice: unknown): boolean {
	return Array.isArray(slice);
}

function isLocale(value: unknown): value is Locale {
	return isRecord(value) && typeof value.language === "string" && typeof value.country === "string";
}

function isScreenLocation(screenLocation: unknown): boolean {
	return Array.isArray(screenLocation);
}

function isSectionState(sectionState: unknown): boolean {
	return isRecord(sectionState);
}

function isValidationBarState(validationBar: unknown): boolean {
	return (
		isRecord(validationBar) &&
		typeof validationBar.expanded === "boolean" &&
		typeof validationBar.visible === "boolean"
	);
}

function isCorrectionScreenState(correctionScreen: unknown): boolean {
	return isRecord(correctionScreen) && typeof correctionScreen.visible === "boolean";
}

function isCorrectionModeBackup(backup: unknown): boolean {
	return (
		backup === undefined ||
		(isRecord(backup) && isRecord(backup.sections) && Array.isArray(backup.location))
	);
}
