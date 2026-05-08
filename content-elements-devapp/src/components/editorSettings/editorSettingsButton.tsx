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

import { useCallback, useContext, useMemo, useRef, useState, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { css, styled } from "styled-components";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { Model, ModelSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import type { ContentEditorState } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	ModelStateSelector,
	useContentEditorContext,
	useContentEditorState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { AttachedPortal } from "@com.mgmtp.a12.widgets/widgets-core/lib/attached-portal/main/attached-portal.view.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { ActionContentbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.view.js";
import { StyledContentBoxContent } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/template/contentbox.tpl.styled.js";
import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/dropdown/main/template/dropdown.tpl.api.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import { Autocomplete } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/autocomplete/main/autocomplete.view.js";
import { Select } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/select.view.js";

import { createResourceLocalizable } from "../../localization/index.js";
import { RESOURCE_KEYS } from "../../localization/keys.js";
import { dmReferenceChanged } from "../../modules/contentEditor/actions.js";

export function EditorSettingsButton(props: { activityId: string }): JSX.Element {
	const localizer = useContext(LocalizerContext).localizer;
	const [show, setShow] = useState(false);

	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const getButtonRefElement = useCallback((ref: HTMLButtonElement | null) => {
		buttonRef.current = ref;
	}, []);

	const { selectedDm, candidateDms, onDmReferenceChanged } = useDmReference(props.activityId);
	const { selectedBaseGroup, candidateBaseGroups, onBaseGroupChange } = useBaseGroup();

	return (
		<>
			<Button
				label={localizer(createResourceLocalizable(RESOURCE_KEYS.header.editorSettings.button))}
				icon={<Icon>settings</Icon>}
				buttonRef={getButtonRefElement}
				onClick={() => setShow(prevState => !prevState)}
			/>
			{buttonRef.current && show && (
				<AttachedPortal
					closeOnOutsideClick
					onVisibilityChange={setShow}
					referenceElement={buttonRef.current}
				>
					<StyledActionContentBox boxShadow={"always"}>
						<Select
							label={localizer(
								createResourceLocalizable(
									RESOURCE_KEYS.header.editorSettings.input.dmReference.label
								)
							)}
							items={candidateDms}
							value={selectedDm?.header.id}
							onValueChanged={onDmReferenceChanged}
						/>
						<Autocomplete
							value={selectedBaseGroup}
							label={localizer(
								createResourceLocalizable(RESOURCE_KEYS.header.editorSettings.input.baseGroup.label)
							)}
							items={candidateBaseGroups}
							hintTemplate={
								localizer(
									createResourceLocalizable(
										RESOURCE_KEYS.header.editorSettings.input.baseGroup.hintTemplate
									)
								) ?? ""
							}
							inputPlaceHolder={localizer(
								createResourceLocalizable(
									RESOURCE_KEYS.header.editorSettings.input.baseGroup.placeholder
								)
							)}
							onValueChange={onBaseGroupChange}
						/>
					</StyledActionContentBox>
				</AttachedPortal>
			)}
		</>
	);
}

const EDITOR_DM_REFERENCE = "editor-dm";

function useDmReference(activityId: string) {
	const dispatch = useDispatch();

	const editorDm = useSelector(
		ModelSelectors.modelByName(EDITOR_DM_REFERENCE, Model.isDocumentModel)
	);
	const selectedDm = useContentEditorState(ModelStateSelector.documentModel());

	const onDmReferenceChanged = (value: string) => {
		dispatch(
			dmReferenceChanged({
				activityId,
				documentModel: value === EDITOR_DM_REFERENCE ? editorDm : undefined
			})
		);
	};

	return {
		selectedDm,
		candidateDms: [
			{ value: "", label: "No Document Model" },
			{ value: EDITOR_DM_REFERENCE, label: EDITOR_DM_REFERENCE }
		],
		onDmReferenceChanged
	};
}

function useBaseGroup() {
	const baseGroupIdSelector = useCallback(
		(state: ContentEditorState) =>
			ModelStateSelector.contentModel()(state).content.configuration?.baseGroupId,
		[]
	);
	const baseGroupId = useContentEditorState(baseGroupIdSelector);
	const candidateBaseGroups = useContentEditorState(ModelStateSelector.candidateBaseGroups());

	const selectedBaseGroup: DropDownItem | undefined = useMemo(() => {
		const baseGroup = candidateBaseGroups.find(group => group.element.id === baseGroupId);

		if (!baseGroup) {
			return undefined;
		}

		return { value: baseGroup.element.id, label: ModelPath.toString(baseGroup.path) };
	}, [baseGroupId, candidateBaseGroups]);

	const candidateGroupItems: DropDownItem[] = useMemo(
		() =>
			candidateBaseGroups.map(group => ({
				value: group.element.id,
				label: ModelPath.toString(group.path)
			})),
		[candidateBaseGroups]
	);

	const onChangeConfiguration = useContentEditorContext(
		context => context.eventHandlers.onChangeConfiguration
	);

	const onBaseGroupChange = useCallback(
		(value: DropDownItem | string | undefined) => {
			if (typeof value === "string") {
				return;
			}

			onChangeConfiguration({ configuration: { baseGroupId: value?.value } });
		},
		[onChangeConfiguration]
	);

	return useMemo(
		() => ({ onBaseGroupChange, candidateBaseGroups: candidateGroupItems, selectedBaseGroup }),
		[onBaseGroupChange, candidateGroupItems, selectedBaseGroup]
	);
}

const StyledActionContentBox = styled(ActionContentbox)(({ theme }) => {
	const { verticalSpacing } = theme.spacing;

	return css`
		${StyledContentBoxContent} {
			padding-top: ${verticalSpacing.vertWhiteSpacingxs}px;

			> :not(:first-child) {
				margin-top: ${verticalSpacing.vertWhiteSpacingmd}px;
			}
		}
	`;
});
