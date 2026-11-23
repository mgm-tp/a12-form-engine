// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

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
