// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";

import { KernelMessage } from "@com.mgmtp.a12.client/client-data";
import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils.js";
import type { MessageBoxVariant } from "@com.mgmtp.a12.widgets/widgets-core/lib/message-box/main/message-box.api.js";

import { WidgetMapContext } from "../../../widgetMap/widgetMap-context.js";
import { FunctionMapContext } from "../../functionMap/functionMapContext.js";

/** @internal */
export interface MessageListItemProps {
	readonly message: Message;
	readonly prefixFormalErrors?: true;
}

/** @internal */
export function MessageListItem(props: MessageListItemProps): JSX.Element {
	const { message, prefixFormalErrors } = props;

	const { List, MessageBox } = useContext(WidgetMapContext);
	const { publishFocusInputEvent, useLinkData } = useContext(FunctionMapContext);
	const localizer = useContext(LocalizerContext).localizer;
	const { getFieldDisplayLabel } = useDocumentContext(c => c.model);

	const linkDataList = useLinkData(message);

	const links = linkDataList.map(({ nodeId, label }, idx) => (
		<Link
			key={nodeId}
			label={label}
			onClick={() => {
				publishFocusInputEvent(nodeId);
			}}
			// do not show the divider for the last item in the list
			divider={idx !== linkDataList.length - 1}
		/>
	));

	const fieldLabel =
		useSelector(state => getFieldDisplayLabel(state, message.entityInstance)) ?? "";

	let errorText = localizer(...message.errorText) ?? "";
	if (
		prefixFormalErrors &&
		fieldLabel &&
		(message.rulePath === KernelMessage.FORMAL_VALIDATION || !message.rulePath)
	) {
		errorText = `${fieldLabel}: ${errorText}`;
	}

	return (
		<MessageBox
			label={errorText}
			variant={message.severity.toLocaleLowerCase() as MessageBoxVariant}
			focusOnMessage={false}
			className={addPrefix("-u-margin-y-xs")}
		>
			{links.length > 0 && <List>{...links}</List>}
		</MessageBox>
	);
}

function Link(props: { onClick: () => void; label: string | undefined; divider: boolean }) {
	const { Icon, ListItem } = useContext(WidgetMapContext);

	return (
		<ListItem
			divider={props.divider}
			graphic={<Icon variant={"info"}>arrow_forward</Icon>}
			text={props.label}
			onClick={props.onClick}
		/>
	);
}
