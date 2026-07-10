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

import type { ComponentType, JSX, ReactNode } from "react";
import { useContext, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FormEngineSelectors } from "@com.mgmtp.a12.formengine/formengine-core";
import { IMetaKeys } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/a12internal";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import {
	ActionContentbox,
	Button,
	ButtonGroup,
	ContentBoxElements as CBE,
	DateTimePicker,
	DateTimePickerInput,
	DateTimeUtils,
	ModalNotification,
	ModalOverlay,
	Switch,
	Table
} from "@com.mgmtp.a12.widgets/widgets-core";
import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core";

import { DEFAULT_PREVIEW_TRANSLATIONS } from "../resources/defaultTranslations.js";
import {
	selectActiveConditions,
	selectNow,
	setActiveConditions,
	setNow
} from "../store/previewSlice.js";

/** @internal */
export type ModalType = "CUSTOM_CONDITION" | "NOW" | "RESET_STATE";

export interface ModalProps {
	onClose(): void;
	onConfirm?(): void;
	readonly activityId: string;
}

interface PreviewSettingsModalProps {
	onClose(): void;
	onApply(): void;
	readonly title: string;
	readonly children: ReactNode;
}

export interface PreviewDataModalProps extends ModalProps {
	readonly title: Localizable;
	readonly message: Localizable;
	readonly confirmLabel: Localizable;
}

const columns: BaseColumnType[] = [
	{ label: "Name", specificVerticalAlignment: { body: "middle" } },
	{ label: "Enabled?" }
];

/** @internal */
export function getModal(type?: ModalType): ComponentType<ModalProps> | undefined {
	if (!type) {
		return undefined;
	}
	switch (type) {
		case "CUSTOM_CONDITION":
			return CustomConditionsModal;
		case "NOW":
			return NowValueModal;
		case "RESET_STATE":
			return ResetStateModal;
	}
}

function PreviewSettingsModal(props: PreviewSettingsModalProps): JSX.Element {
	return (
		<ModalOverlay onClose={props.onClose} closeOnEsc closeOnOutsideClick>
			<ActionContentbox
				headingElements={<CBE.Title text={props.title} />}
				footer={
					<CBE.Footer>
						<ButtonGroup alignment="right">
							<Button secondary onClick={props.onClose}>
								Close
							</Button>
							<Button destructive onClick={props.onApply}>
								Apply
							</Button>
						</ButtonGroup>
					</CBE.Footer>
				}
			>
				{props.children}
			</ActionContentbox>
		</ModalOverlay>
	);
}

/** @internal */
export function CustomConditionsModal(props: ModalProps): JSX.Element {
	const validationCode = useSelector(
		state => FormEngineSelectors.models(props.activityId)(state)?.validatorProvider
	);

	const activeConditions = useSelector(state => selectActiveConditions(state, props.activityId));
	const [active, setActive] = useState(activeConditions);

	const dispatch = useDispatch();

	const allConditions = useMemo(
		() =>
			validationCode
				? [
						...(validationCode
							.getMetaModel()
							.getValue(IMetaKeys.MODEL_APPLICATION_CONDITION) as Set<string>)
					]
				: [],
		[validationCode]
	);

	const data = allConditions.map((condition, idx) => [
		condition,
		<Switch
			key={condition + idx}
			onChange={enabled => {
				setActive(previous =>
					enabled ? previous.concat(condition) : previous.filter(name => name !== condition)
				);
			}}
			checked={active.includes(condition)}
		/>
	]);

	return (
		<PreviewSettingsModal
			title="Enable custom conditions"
			onClose={props.onClose}
			onApply={() => {
				dispatch(
					setActiveConditions({
						conditions: active,
						activityId: props.activityId
					})
				);
				props.onClose();
			}}
		>
			<p>Specify whether any custom condition should report errors</p>
			<Table data={data} columns={columns} />
		</PreviewSettingsModal>
	);
}

const PickerWithTimeInput = DateTimePickerInput(DateTimePicker);

/** @internal */
export function NowValueModal(props: ModalProps): JSX.Element {
	const now = useSelector(state => selectNow(state, props.activityId));
	const [date, setDate] = useState(now);

	const timezone = useSelector(
		state =>
			FormEngineSelectors.models(props.activityId)(state)?.documentModel.content.modelConfig
				.timeZone
	);

	const dispatch = useDispatch();

	return (
		<PreviewSettingsModal
			title={`Current NOW: ${DateTimeUtils.toISOString(date, timezone)}`}
			onClose={props.onClose}
			onApply={() => {
				dispatch(setNow({ now: date, activityId: props.activityId }));
				props.onClose();
			}}
		>
			<p>Set the NOW value that is used for kernel validations and computations</p>
			<PickerWithTimeInput
				pickerProps={{
					value: date,
					onAccept: setDate,
					timezone
				}}
				onInputChange={value => {
					// when clearing the input field directly (not using the picker UI),
					// also reset the date
					if (value === "") {
						setDate(undefined);
					}
				}}
			/>
		</PreviewSettingsModal>
	);
}

export function PreviewDataModal(props: PreviewDataModalProps): JSX.Element {
	const { localizer } = useContext(LocalizerContext);
	return (
		<ModalNotification
			closeOnEsc
			closeOnOutsideClick
			onClose={props.onClose}
			title={localizer(props.title)}
			footer={
				<ButtonGroup alignment="right">
					<Button secondary onClick={props.onClose}>
						Cancel
					</Button>
					<Button
						primary
						destructive
						onClick={() => {
							props.onConfirm?.();
							props.onClose();
						}}
					>
						{localizer(props.confirmLabel)}
					</Button>
				</ButtonGroup>
			}
			variant="warning"
			key="dialog"
		>
			<p>{localizer(props.message)}</p>
		</ModalNotification>
	);
}

/** @internal */
export function ResetStateModal(props: ModalProps): JSX.Element {
	return (
		<PreviewDataModal
			activityId={props.activityId}
			title={localizableFromLocalizationTreeMap(
				"preview.modal.reset.title",
				DEFAULT_PREVIEW_TRANSLATIONS
			)}
			message={localizableFromLocalizationTreeMap(
				"preview.modal.reset.message",
				DEFAULT_PREVIEW_TRANSLATIONS
			)}
			confirmLabel={localizableFromLocalizationTreeMap(
				"preview.modal.reset.confirmLabel",
				DEFAULT_PREVIEW_TRANSLATIONS
			)}
			onClose={props.onClose}
			onConfirm={props.onConfirm}
		/>
	);
}
