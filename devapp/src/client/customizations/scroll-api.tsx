// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { DefaultDispatchProps, ScrollApi } from "@com.mgmtp.a12.formengine/formengine-core";
import {
	FormEngineActions,
	FormEngineStateAdapter,
	FormEngineViews
} from "@com.mgmtp.a12.formengine/formengine-core";

export function ScrollApiEngine(props: FormEngineViews.FormEngineProps): JSX.Element {
	const state = useSelector(state => state);
	const dispatch = useDispatch();

	const stateProps = FormEngineStateAdapter.mapStateToProps(state, props);

	const scrollRef = useRef<ScrollApi>(null);

	const onEventButton = useCallback(() => {
		scrollRef.current?.scrollToTop();
	}, []);

	/**
	 * When using focus, there is an issue with the rendering cycle in React and the timing of the browser DOM update.
	 * If useEffect is used to focus an element during initial rendering, it may be that the DOM has not yet been fully
	 * updated or the particular UI element is not yet fully ready.
	 *
	 * Workaround:
	 * The setTimeout gives the browser a little time to process the pending updates before the focus is set.
	 */
	useEffect(() => {
		setTimeout(() => scrollRef.current?.focusElement());
	}, []);

	const defaultDispatchProps = FormEngineActions.mapDispatchToProps(dispatch, props);
	const dispatchProps: DefaultDispatchProps = {
		...defaultDispatchProps,
		eventHandlers: {
			...defaultDispatchProps.eventHandlers,
			onEventButton
		}
	};

	return (
		<FormEngineViews.FormEngineTpl
			{...props}
			{...stateProps}
			{...dispatchProps}
			scrollRef={scrollRef}
		/>
	);
}
