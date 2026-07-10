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

import type { ReactNode } from "react";
import { Component, createContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Container } from "@com.mgmtp.a12.widgets/widgets-core";

import type { EngineStore, Models } from "../../../back-end/store/internal/store.js";
import { areFocusedComponentsEqual } from "../../../back-end/store/internal/store.js";
import { UiId } from "../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../models/index.js";
import { findElementByFormModelPath } from "../../../models/index.js";
import {
	isFormModelDetachedRepeat,
	isFormModelEmbeddedRepeat,
	isFormModelFieldBasedInputType,
	isFormModelFieldOverviewColumn,
	isFormModelRepeat
} from "../../../models/internal/FormModelGuards.js";

/**
 * Props for the scroll handler.
 */
export interface ScrollHandlerProps extends Container {
	/**
	 * The prefix for the HTML ids.
	 * It must be the same as the one used for the
	 * `FormEngineRenderer` and `FormEngineContentBoxRenderer`!
	 */
	readonly uiIdPrefix?: string;
	/* The current ui state */
	readonly uiState: EngineStore.UIState;
	/* The models. */
	readonly models: Models;

	/*
	 * If set to true the following focus commands for repeats
	 * will not be executed:
	 *  * focus repeat table
	 *  * focus a row (new or existing)
	 *  * focus edit button in a row
	 *  * focus add button
	 */
	readonly disableRepeatBehavior?: boolean;

	/*
	 * If set to true the scroll handler will not scroll
	 * if subElement in the focused component is "current-screen" and this screen
	 * is a top level screen
	 */
	readonly disableScrollToTopLevelScreen?: boolean;
}

/** @internal */
export const ScrollHandlerContext = createContext<ScrollHandlerContextProps | undefined>(undefined);

/** @internal */
export interface ScrollHandlerContextProps {
	focusNewRepeatRow(rowRef: HTMLElement): void;
}
ScrollHandlerContext.displayName = "ScrollHandlerContext";

const STYLE = { width: "100%", height: "100%" };

/*
 * Plain (non-connected) React component to render a scroll handler.
 *
 * The scroll handler takes care of focusing elements and scroll the view
 * to a focused element, when entering or leaving screens.
 *
 *  To be more precise:
 *  * Top-Level-Screen -> Detail-Screen
 *  * Top-Level-Screen -> Correction-Screen
 *  * Detail-Screen -> Top-Level-Screen
 *  * Detail-Screen -> Detail-Screen (Entering)
 *  * Detail-Screen -> Detail-Screen (Leaving)
 *  * Detail-Screen -> Correction-Screen
 *  * Correction-Screen -> Top-Level-Screen
 *  * Correction-Screen -> Detail-Screen
 *  * Correction-Screen -> Field
 */
export class ScrollHandler extends Component<ScrollHandlerProps> {
	private lastFocusedComponent: EngineStore.FocusedComponent | undefined;
	private lastFocusedComponentRequestCount: number | undefined;
	private scrollQueue: (() => boolean)[] = [];

	private readonly executeScrollQueue = (): void => {
		const length = this.scrollQueue.length;

		let scrolled = false;

		for (let i = 0; i < length; i++) {
			scrolled = this.scrollQueue[i]();
		}

		if (scrolled) {
			this.scrollQueue = this.scrollQueue.slice(length);
		}
	};

	private readonly domObserver = new MutationObserver(this.executeScrollQueue);
	private readonly ref: React.Ref<HTMLDivElement> = ref => {
		this.domObserver.disconnect();
		if (ref) {
			this.domObserver.observe(ref, { subtree: true, attributes: true, childList: true });
		}
	};

	componentWillUnmount(): void {
		this.domObserver.disconnect();
	}

	/**
	 * Called when props change
	 */
	componentDidUpdate(prevProps: ScrollHandlerProps): void {
		this.executeScroll(prevProps);
	}

	componentDidMount(): void {
		this.executeScroll(this.props);
	}

	render(): ReactNode {
		return (
			<ScrollHandlerContext.Provider value={{ focusNewRepeatRow: this.focusNewRepeatRow }}>
				<div style={STYLE} ref={this.ref}>
					{this.props.children}
				</div>
			</ScrollHandlerContext.Provider>
		);
	}

	private executeScroll(props: ScrollHandlerProps) {
		this.scrollQueue.push(this.createScrollAction(props));
		this.executeScrollQueue();
	}

	private createScrollAction(prevProps: ScrollHandlerProps): () => boolean {
		return () => {
			const screenLocationStack = this.props.uiState.screenLocation;
			const { focusedComponent, focusedComponentRequestCount } =
				screenLocationStack[screenLocationStack.length - 1];

			const scrollingSuccessful = this.scroll(prevProps);
			if (scrollingSuccessful) {
				this.lastFocusedComponent = focusedComponent;
				this.lastFocusedComponentRequestCount = focusedComponentRequestCount;
			}
			return scrollingSuccessful;
		};
	}

	private scroll(prevProps: ScrollHandlerProps): boolean {
		const screenLocationStack = this.props.uiState.screenLocation;
		const screen = screenLocationStack[screenLocationStack.length - 1];
		const focusedComponent = screen.focusedComponent;

		/**
		 * Scroll to component if a focusedComponent is given and
		 * if this component is different than the last one or if
		 * the request count changed
		 */
		if (
			focusedComponent !== undefined &&
			(this.lastFocusedComponent === undefined ||
				this.lastFocusedComponentRequestCount !== screen.focusedComponentRequestCount ||
				!areFocusedComponentsEqual(focusedComponent, this.lastFocusedComponent))
		) {
			return this.scrollToFocusedComponent(focusedComponent);
		}

		// Scroll on top of correction screen if correctionScreen is entered
		if (
			this.props.uiState.correctionScreen.visible &&
			!prevProps.uiState.correctionScreen.visible
		) {
			return this.scrollToTopOfCorrectionScreen();
		}

		// Scroll on top of form if correction screen is left
		if (
			prevProps.uiState.correctionScreen.visible &&
			!this.props.uiState.correctionScreen.visible
		) {
			return this.scrollToTopOfForm();
		}

		// No scrolling is necessary, which will be handled as successful
		return true;
	}

	/**
	 * Scrolls to the beginning of the correction screen
	 * Typically this is happening in the following cases:
	 * * Top-Level-Screen -> Correction-Screen
	 * * Detail-Screen -> Correction-Screen
	 */
	private scrollToTopOfCorrectionScreen(): boolean {
		const uiId = UiId.generateForCorrectionModeDetailScreen({ uiIdPrefix: this.props.uiIdPrefix });
		// allowSuccessWithoutFocus set to true since the correction screen
		// cannot be focussed. The correction screen bar gets focused instead.
		return this.scrollToElementAndFocus({
			uiId,
			verticalPosition: "start",
			allowSuccessWithoutFocus: true
		});
	}

	/**
	 * Scrolls to the beginning of the form
	 *
	 * Typically this is happening in the following cases:
	 * * Top-Level-Screen -> Detail-Screen
	 * * Detail-Screen -> Detail-Screen (Entering)
	 * * Correction-Screen -> Top-Level-Screen
	 * * Correction-Screen -> Detail-Screen
	 */
	private scrollToTopOfForm(): boolean {
		const uiId = UiId.generate({
			element: this.props.models.formModel,
			uiIdPrefix: this.props.uiIdPrefix
		});
		return this.scrollToElementAndFocus({ uiId, verticalPosition: "start" });
	}

	/**
	 * Scrolls to an element with a certain form element.
	 *
	 * @returns true if the scrolling is applied.
	 */
	private scrollToFocusedComponent(focusedComponent: EngineStore.FocusedComponent): boolean {
		if (focusedComponent.subElement === "validation-bar") {
			return this.scrollToValidationBar();
		} else if (focusedComponent.subElement === "current-screen") {
			if (
				this.props.disableScrollToTopLevelScreen &&
				this.props.uiState.screenLocation.length === 1
			) {
				return true;
			}

			return this.scrollToTopOfForm();
		}

		const element = findElementByFormModelPath(
			this.props.models.formModel,
			focusedComponent.formModelPath
		);
		if (element === undefined) {
			return false;
		}

		if (this.props.disableRepeatBehavior !== true && isFormModelRepeat(element)) {
			const tableUiId = UiId.generateForRepeatTable({
				id: element.id,
				uiIdPrefix: this.props.uiIdPrefix
			});
			// we shouldn't continue with a detailed look-up if the table doesn't exist
			if (!document.getElementById(tableUiId)) {
				return false;
			}

			if (focusedComponent.subElement === "repeat-add") {
				return this.scrollToRepeatAddButton(element);
			}

			if (focusedComponent.index !== undefined) {
				if (focusedComponent.subElement === "repeat-edit") {
					/** Only return if the scrolling was successful. */
					if (this.scrollToRepeatEditButton(element, focusedComponent.index)) {
						return true;
					}
				} else if (focusedComponent.subElement === "expanded-row") {
					/** Only return if the scrolling was successful. */
					if (this.scrollToExpandedRow(element, focusedComponent.index)) {
						return true;
					}
				} else {
					/** Only return if the scrolling was successful. */
					if (this.scrollToTableRow(element, focusedComponent.index)) {
						return true;
					}
				}

				/**
				 * If the row is not shown when coming from a detached repeat
				 * detail screen then focus the table
				 */
				if (isFormModelDetachedRepeat(element)) {
					return this.scrollToElementAndFocus({ uiId: tableUiId, verticalPosition: "center" });
				} else {
					return false;
				}
			}

			return this.scrollToElementAndFocus({ uiId: tableUiId, verticalPosition: "center" });
		} else if (isFormModelFieldBasedInputType(element)) {
			return this.scrollToInputElement(
				focusedComponent.formModelPath,
				element,
				focusedComponent.index
			);
		}

		return false;
	}

	/**
	 * Scrolls to an element with a certain HTML id and tries to focus.
	 *
	 * @returns true if the scrolling is applied and the element was
	 * successfully focused. Also returns true if the successful focus can be
	 * ignored after a successful scrolling.
	 */
	private scrollToElementAndFocus({
		uiId,
		verticalPosition,
		allowSuccessWithoutFocus
	}: {
		uiId: string;
		verticalPosition: "start" | "center";
		allowSuccessWithoutFocus?: boolean;
	}): boolean {
		const scrollToElement = document.getElementById(uiId);
		if (scrollToElement !== null) {
			scrollToElement.scrollIntoView({ block: verticalPosition });
			scrollToElement.focus();

			// Return true only when the element was successfully focused or
			// when the successful focus can be ignored. It could be currently
			// not focusable, e.g. because it is disabled. In this case it is
			// kept in the scroll queue as it should become focusable with a
			// future dom update.
			return allowSuccessWithoutFocus ? true : document.activeElement === scrollToElement;
		}

		return false;
	}

	/**
	 * Scrolls to an input element with a certain form element.
	 *
	 * @returns true if the scrolling is applied.
	 */
	private scrollToInputElement(
		formModelPath: ModelPath,
		fieldBasedInput: FormModel.FieldBasedInputType,
		index?: number
	): boolean {
		let scrollingSuccessful = false;
		const uiId = isFormModelFieldOverviewColumn(fieldBasedInput)
			? UiId.generate({
					element: fieldBasedInput,
					uiIdPrefix: this.props.uiIdPrefix,
					rowIndex: index ?? 0
				})
			: UiId.generate({
					element: fieldBasedInput,
					uiIdPrefix: this.props.uiIdPrefix
				});

		const potentialInputElements = Array.from(document.querySelectorAll(`*[id^=${uiId}]`));
		const inputElement = potentialInputElements.find<HTMLElement>(this.isValidInputElement);
		if (inputElement !== undefined) {
			const embeddedRepeat = this.findParentEmbeddedRepeat(
				this.props.models.formModel,
				formModelPath
			);

			if (
				embeddedRepeat !== undefined &&
				isFormModelEmbeddedRepeat(embeddedRepeat.element) &&
				!this.isExpandedRowOpen(embeddedRepeat.element, embeddedRepeat.formModelPath)
			) {
				return false;
			}

			const scrollToElement = this.findScrollToElementOfInput(fieldBasedInput, index);
			if (scrollToElement !== null) {
				scrollToElement.scrollIntoView({ block: "center" });
				inputElement.focus();

				// Is only true, if the focusing was possible.
				scrollingSuccessful = document.activeElement === inputElement;
			}
		}

		return scrollingSuccessful;
	}

	/** Scroll to validation-bar and focus it
	 *  @returns true if the scrolling is applied.
	 */
	private scrollToValidationBar(): boolean {
		const idOfValidationBar = UiId.generateForValidationBar({ uiIdPrefix: this.props.uiIdPrefix });
		const element = document.getElementById(idOfValidationBar);
		if (element !== null) {
			element.scrollIntoView(true);
			element.tabIndex = -1;
			element.focus();

			// Only return true, if the focusing was possible.
			return document.activeElement === element;
		}

		return false;
	}

	/** Scroll to expanded row and focus it
	 *  @returns true if the scrolling is applied.
	 */
	private scrollToExpandedRow(repeat: FormModel.Repeat, index: number): boolean {
		const idOfExpandedRow = UiId.generateForEmbeddedRepeatExpandedRow({
			repeat,
			uiIdPrefix: this.props.uiIdPrefix,
			rowIndex: index
		});
		const element = document.getElementById(idOfExpandedRow);
		if (element !== null) {
			element.scrollIntoView({ block: "center" });
			element.tabIndex = -1;
			element.focus();

			// Only return true, if the focusing was possible.
			return document.activeElement === element;
		}

		return false;
	}

	private findScrollToElementOfInput(
		fieldBasedInput: FormModel.FieldBasedInputType,
		index?: number
	): Element | null {
		const uiId = isFormModelFieldOverviewColumn(fieldBasedInput)
			? UiId.generateForRepeatTableBodyCell({
					id: fieldBasedInput.id,
					uiIdPrefix: this.props.uiIdPrefix,
					rowIndex: index
				})
			: UiId.generate({
					element: fieldBasedInput,
					uiIdPrefix: this.props.uiIdPrefix,
					suffix: "-group"
				});

		return document.getElementById(uiId);
	}

	/**
	 * Type guard to verify that an `Element` is a valid `HTMLElement`.
	 *
	 * For readonly inputs with readonlyPresentation "TEXT" a div element
	 * with the correct data role is valid.
	 * For other inputs the types `HTMLInputElement`, `HTMLSelectElement`,
	 * and `HTMLTextAreaElement` are considered valid.
	 */
	private isValidInputElement(element: Element): element is HTMLElement {
		if (element instanceof HTMLDivElement) {
			return element.getAttribute("data-role") === "text-output";
		}

		return [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement].some(
			clazz => element instanceof clazz
		);
	}

	private scrollToRepeatEditButton(repeat: FormModel.Repeat, repeatRowIndex: number): boolean {
		const editButtonUiId = UiId.generateForRowActionButton({
			repeat,
			/**
			 * The given index has to be increased by one, because
			 * the index of the repeat row and the edit button differ
			 * by one, due to the fact that the repeat row uses
			 * the position in the row array as index (0-based) while the edit
			 * button uses the index from the kernel document path (1-based)
			 */
			rowIndex: repeatRowIndex + 1,
			uiIdPrefix: this.props.uiIdPrefix,
			eventType: "edit",
			buttonType: "button"
		});

		return this.scrollToElementAndFocus({ uiId: editButtonUiId, verticalPosition: "center" });
	}

	private scrollToTableRow(repeat: FormModel.Repeat, index: number): boolean {
		const rowUiId = UiId.generateForRepeatTableBodyRow({
			id: repeat.id,
			uiIdPrefix: this.props.uiIdPrefix,
			rowIndex: index
		});

		return this.scrollToElementAndFocus({ uiId: rowUiId, verticalPosition: "center" });
	}

	private scrollToRepeatAddButton(repeat: FormModel.Repeat): boolean {
		const addButtonUiId = UiId.generateForAddButton({
			repeat,
			uiIdPrefix: this.props.uiIdPrefix
		});
		return this.scrollToElementAndFocus({ uiId: addButtonUiId, verticalPosition: "center" });
	}

	private focusNewRepeatRow(rowRef: HTMLElement): boolean {
		if (this.props.disableRepeatBehavior !== true) {
			rowRef.focus();
		}

		return true;
	}

	/**
	 * Checks if a row in an embedded repeat is already open or
	 * if the scroll-handler still needs to wait
	 */
	private isExpandedRowOpen(
		embeddedRepeat: FormModel.EmbeddedRepeat,
		embeddedRepeatPath: ModelPath
	): boolean {
		const repeatInstanceState =
			this.props.uiState.screenLocation[this.props.uiState.screenLocation.length - 1]
				.repeatInstanceState;

		if (repeatInstanceState === undefined) {
			return false;
		}

		const repeatStateEntry = repeatInstanceState[ModelPath.toString(embeddedRepeatPath)];

		if (repeatStateEntry?.expandedRowPath === undefined) {
			return false;
		}

		const embeddedRepeatId = UiId.generateForEmbeddedRepeatExpandedRow({
			repeat: embeddedRepeat,
			rowIndex:
				repeatStateEntry.expandedRowPath[repeatStateEntry.expandedRowPath.length - 1].index - 1,
			uiIdPrefix: this.props.uiIdPrefix
		});

		const expandedRow = document.getElementById(embeddedRepeatId);
		return expandedRow !== null;
	}

	private findParentEmbeddedRepeat(
		formModel: FormModel,
		formModelPath: ModelPath
	): { element: FormModel.EmbeddedRepeat; formModelPath: ModelPath } | undefined {
		const workingPath = [...formModelPath];

		while (workingPath.length > 0) {
			const element = findElementByFormModelPath(formModel, workingPath);
			if (element === undefined) {
				return undefined;
			}

			if (isFormModelEmbeddedRepeat(element)) {
				return { element: element, formModelPath: workingPath };
			}

			workingPath.pop();
		}
		return undefined;
	}
}
