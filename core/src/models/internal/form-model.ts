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

import type { Annotation } from "@com.mgmtp.a12.base/base-model-api/lib/main/header/index.js";
import type { Model, ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { isModelInstance } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Expression } from "@com.mgmtp.a12.expression/expression-core";
import type { FieldInstanceValue } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { LocalizedModelText } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { IconTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.api.js";

import { isRecord } from "../../back-end/utils/internal/guards.js";
import { nmTokensToString } from "../../view/internal/utilities/nmtokens.js";

import type * as RepeatExpressionFilter from "./jison/repeatfilter.cjs";
import type { ReadonlyObjectMap } from "./utils/json.js";

/**
 * This set of interfaces provides typings for form models.
 *
 * The typings are mostly based on the JSON structure created by the
 * Form Model Marshaller. This means that you can for most properties just
 * apply the typing to the JSON and use it.
 *
 * Some properties are only available after unmarshalling. These properties
 * have a comment marking them as "runtime only".
 */
export interface FormModel extends Model {
	readonly content: FormModel.Content;
}

export namespace FormModel {
	/**
	 * Function to check if a given object is an instance of {@link FormModel}.
	 * @param model the object to check
	 * @param ignoreRuntimeProperties This needs to be set to true, if you only want to check
	 * the persistence properties and not the added run-time properties (e.g. fieldPath).
	 */
	export function isInstance(model: object, ignoreRuntimeProperties?: boolean): model is FormModel {
		return (
			isModelInstance(model) && FormModel.Content.isInstance(model.content, ignoreRuntimeProperties)
		);
	}

	/** Adds Id and Naming functionality to model elements */
	export interface IdNamed {
		readonly id: string;
		readonly name: string;
	}

	/** Add annotations to model elements. */
	export interface Annotated {
		readonly annotations?: Annotation[];
	}

	/** Add styles to model elements. */
	export interface Stylable {
		readonly style?: ReadonlyArray<Style>;
	}

	/** if the given element has styles, concat them to an HTML class string */
	export function stylableToClassName(stylable?: Stylable): string | undefined {
		return styleToClassName(stylable?.style);
	}

	/** if styles given, concat them to an HTML class string */
	export function styleToClassName(style?: readonly Style[]): string | undefined {
		return nmTokensToString(style?.map(s => s.name));
	}

	/** Data structure to define a style */
	export interface Style {
		readonly name: string;
	}

	/** Add hide condition to model elements. */
	export interface ConditionallyHidden {
		readonly hideCondition?: HideCondition;
	}

	/** Data structure to define a static amount suffix */
	export interface StaticAmountSuffix {
		readonly type: "static";
		readonly value: string;
	}

	/** Data structure to define a dynamic amount suffix */
	export interface DynamicAmountSuffix {
		readonly type: "dynamic";
		readonly fieldRef: string;
	}

	/**
	 * Data structure to define the model content
	 */
	export interface Content {
		/**
		 * The suffix used for number inputs based on fields with unit 'amount',
		 * which is used when no suffix is present for the field in the
		 * {@link FormModel.FieldConfiguration}
		 *
		 * In case of "dynamic", the localized value of the
		 * given field reference is used.
		 */
		readonly amountSuffix?: FormModel.StaticAmountSuffix | FormModel.DynamicAmountSuffix;

		/**
		 * Runtime-only path to the referenced field in the document model
		 * Only set when amountSuffix is of type {@link FormModel.DynamicAmountSuffix}
		 */
		readonly amountSuffixFieldPath?: ModelPath;

		/** The styles which can be applied to all components which extend {@link Stylable} */
		readonly styles?: ReadonlyArray<FormModel.Style>;

		/** The localizable subtitle of the form */
		readonly subtitle?: FormModel.Label;

		/** Element which is shown between the title and the form. */
		readonly subHeaderBox: FormModel.HeaderFooterType;

		/** Element which is shown below the form. */
		readonly footerBox: FormModel.HeaderFooterType;
		/** The screens of the form. */
		readonly screens: ReadonlyArray<FormModel.Screen>;

		/**
		 * Configuration for document model elements.
		 * The configuration applies for each
		 * {@link Control} and {@link FieldOverviewColumn} which
		 * references this element.
		 */
		readonly fieldConfiguration: FormModel.FieldConfiguration;

		/**
		 * Configuration for document model groups.
		 * The configuration applies for each
		 * {@link Repeat} which references this element.
		 */
		readonly groupConfiguration: FormModel.GroupConfiguration;

		/**
		 * Set of defaults which are used if certain parts
		 * are not given (e.g. the label for repeat buttons).
		 */
		readonly defaults: FormModel.Defaults;

		/** Runtime-only lookup map of Dependent Controls */
		readonly dependentScreenElements: ReadonlyObjectMap<FormModel.DependentScreenElement>;

		/** Runtime-only lookup map of conditionally hidden elements */
		readonly conditionallyHiddenElements?: ReadonlyObjectMap<FormModel.ConditionallyHiddenElementMaster>;

		/**
		 * Whether a TextOutput or a readonly Input should be shown for Controls
		 * which are readonly
		 */
		readonly readonlyPresentation?: FormModel.ReadonlyPresentation;

		/**
		 * Whether fields should be marked with an asterisk or not.
		 * If nothing is given, the asterisk will be shown on the label of required fields.
		 */
		readonly markingOfRequiredFields?: FormModel.MarkingOfRequiredFields;

		/**
		 * Defines the enablement of the commit button
		 * in a detached repeat detail screen if no
		 * data as been entered/changed yet on the screen.
		 * If the property is not set the button will
		 * by default be shown and be enabled.
		 */
		readonly detachedRepeatCommitButtonEnablement?: FormModel.ButtonEnablementEnum;

		/**
		 * Whether a TextOutput or a readonly Input should be shown for columns
		 * in inline repeats, which are readonly.
		 *
		 * This setting only affects Inline Repeats.
		 */
		readonly inlineRepeatReadonlyPresentation?: FormModel.ReadonlyPresentation;

		/**
		 * Whether to disable confirmation of rules.
		 *
		 * Possible values:
		 * - "INFO": disable confirmation for INFO only
		 * - "WARNING": disable confirmation for WARNING and INFO
		 *
		 * If not set, confirmation will be shown for all levels
		 */
		readonly disableRuleConfirmation?: FormModel.DisableRuleConfirmation;

		/**
		 * Whether the summary counters inside the confirmation modal should be hidden.
		 *
		 * If not set, the summary will be shown.
		 */
		readonly hideConfirmationSummary?: boolean;

		/**
		 * @experimental
		 *
		 * Which pre-processing of the document should happen after setting the initial values
		 * in a client data provider, that creates a new document for the form engine.
		 *
		 * Possible values:
		 * - "NONE": Neither the computations nor the dependencies are evaluated.
		 * - "COMPUTATIONS": Only initial computations are evaluated without triggering dependencies (default).
		 * - "COMPUTATIONS_AND_DEPENDENCIES": Initial computations and dependencies are evaluated.
		 */
		readonly openNewDocumentPreProcessing?: FormModel.OpenDocumentPreProcessing;

		/**
		 * @experimental
		 *
		 * Which pre-processing of the document should happen after an existing document
		 * for the form engine has been loaded in a client data provider.
		 *
		 * Possible values:
		 * - "NONE": Neither the computations nor the dependencies are evaluated (default)
		 * - "COMPUTATIONS": Only computations are evaluated without triggering dependencies.
		 * - "COMPUTATIONS_AND_DEPENDENCIES": Computations and dependencies are evaluated.
		 *
		 * Mind that anything else than "NONE" might result in a "dirty" document on open.
		 */
		readonly openExistingDocumentPreProcessing?: FormModel.OpenDocumentPreProcessing;
	}

	export namespace Content {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.Content}.
		 * @param element the object to check
		 * @param ignoreRuntimeProperties This needs to be set to true, if you only want to check
		 * the persistence properties and not the added run-time properties (e.g. fieldPath).
		 */
		export function isInstance(
			element: object | FormModel.Content,
			ignoreRuntimeProperties?: boolean
		): element is FormModel.Content {
			return (
				"subHeaderBox" in element &&
				"footerBox" in element &&
				"screens" in element &&
				"fieldConfiguration" in element &&
				"groupConfiguration" in element &&
				"defaults" in element &&
				(ignoreRuntimeProperties || "dependentScreenElements" in element)
			);
		}
	}

	/** Data structure to define header and footers. */
	export interface HeaderFooterType {
		/** The unique id. */
		readonly id: string;
		/**
		 * A list of minor buttons.
		 * Minor buttons, which are in the footer
		 * will be put together to a pop-up
		 * menu if the space gets to small to show them all.
		 */
		readonly minorButtons?: ButtonList;

		/**
		 * A list of major buttons.
		 * Major buttons will never be collapsed to a pop-up menu.
		 */
		readonly majorButtons?: ButtonList;
	}

	/**
	 * @internal
	 *
	 * Data structure to represent a header or footer.
	 */
	export namespace HeaderFooterType {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.HeaderFooterType}.
		 * @param element the object to check
		 */

		export function isInstance(
			element: object | FormModel.HeaderFooterType
		): element is FormModel.HeaderFooterType {
			return "minorButtons" in element || "majorButtons" in element;
		}
	}

	/**
	 * A list of buttons.
	 */
	export interface ButtonList {
		readonly button?: ReadonlyArray<ButtonType>;
	}

	/**
	 * Configuration for a document model group.
	 */
	export interface GroupConfiguration {
		/** The configuration for a group */
		readonly group?: ReadonlyArray<GroupConfigurationEntry>;

		/**
		 * Runtime-only lookup map of group configurations.
		 * The group path is used as the key for the map.
		 */
		readonly groupMap: ReadonlyObjectMap<GroupConfigurationEntry>;
	}

	/**
	 * Configuration entry for a document model group.
	 */
	export interface GroupConfigurationEntry extends Annotated {
		/** Sets a dependency for a document model group */
		readonly dependentGroup?: DependentGroup;

		/** The reference to the document model group. */
		readonly groupRef: string;

		/** Runtime-only path to document model group. */
		readonly groupPath: ModelPath;

		/** The number of initial rows, that will be created for an inline repeat */
		readonly numberOfInitialRows?: number;

		/**
		 * Runtime-only index information of controls that are in a child repeatable group.
		 *
		 * This information is computed once and then used if a document or a row in
		 * a document should be created, because rows with initial values are created
		 * as soon as a control with index makes them accessible.
		 */
		readonly indicesOfControlsOfNestedGroups?: {
			/** Path to child repeatable group. */
			readonly groupPath: ModelPath;

			/** Numeric index values used by a control */
			readonly numeric: readonly number[];

			/** Semantic index values used by a control */
			readonly semantic: readonly FieldInstanceValue[];
		}[];
	}

	/**
	 * Configuration for a document model field.
	 */
	export interface FieldConfiguration {
		/** Configuration for a field. */
		readonly field?: ReadonlyArray<FieldConfigurationEntry>;

		/**
		 * Runtime-only lookup map of field configurations
		 * The field path is used as the key for the map.
		 */
		readonly fieldMap: ReadonlyObjectMap<FieldConfigurationEntry>;
	}

	/**
	 * Configuration entry for a document model field.
	 */
	export interface FieldConfigurationEntry extends Annotated {
		/** A localizable label. */
		readonly label?: Label;

		/** A localizable hint. */
		readonly hint?: MultilingualText;

		/**
		 * A value which should be shown,
		 * if no value is present in the document for this field
		 */
		readonly initialValue?: string;

		/** Runtime-only JS typed version of initial value */
		readonly initialValueTyped?: FieldInstanceValue;

		/* Exposition for the field (e.g. full, inline) */
		readonly exposition?: ExpositionPresentation;

		/**
		 * Whether the select all option for a MultiSelect with exposition
		 * inline or full should be shown
		 */
		readonly enableSelectAll?: boolean;

		/**
		 * Whether the controls referencing this field should be readonly
		 */
		readonly readonly?: boolean;

		/**
		 * Whether the controls referencing this field should be
		 * shown as a secret
		 */
		readonly secret?: boolean;

		/**
		 * Sets a dependency for enumeration values.
		 */
		readonly dependentEnumeration?: DependentEnumeration;

		/** External enumeration configuration. */
		readonly externalEnumeration?: ExternalEnumeration;

		/** Sets a dependency for a field value */
		readonly dependentField?: DependentField;

		/** Reference to the document model element. */
		readonly elementRef: string;

		/** Runtime-only path to Field */
		readonly elementPath: ModelPath;

		/** Suffix for ui elements referencing the field */
		readonly suffix?: MultilingualText;

		/**
		 * A localizable placeholder which is shown if an input is empty.
		 * Will not be shown for fields with datatype confirm, attachment, boolean
		 * with non BOOLEAN_SELECT exposition, enumeration with non AUTOCOMPLETE or COMPACT
		 * exposition and multi-select with non AUTOCOMPLETE exposition.
		 */
		readonly placeholder?: MultilingualText;

		/** Configuration for an attachment */
		readonly attachmentConfig?: AttachmentConfig;
	}

	export interface AttachmentConfig {
		/** The name of the placeholder icon that should be used for this attachment */
		readonly placeholderIcon?: PlaceholderIconType;

		/**
		 * Describes which mime types should be accepted by this attachment.
		 *
		 * Note that this will not restrict the file types that can be uploaded.
		 * It only affects which file types are initially shown to the user in the file upload dialog.
		 */
		readonly accept?: string;

		/**
		 * The default action, that will be triggered when clicking on an
		 * (editable) attachment input after a file has been uploaded.
		 *
		 * If no defaultAction is given, replace will be triggered by default.
		 */
		readonly defaultAction?: AttachmentDefaultActionType;
	}

	export type PlaceholderIconType =
		| "default"
		| "image"
		| "text"
		| "spreadsheet"
		| "pdf"
		| "video"
		| "sound"
		| "none";

	export type AttachmentDefaultActionType = "replace" | "download";

	/**
	 * Data structure to represent a screen.
	 */
	export interface Screen extends IdNamed, Annotated {
		readonly title?: Label;

		/** Screen sub header buttons */
		readonly subHeaderBox?: HeaderFooterType;
		/** Screen footer buttons. */
		readonly footerBox?: HeaderFooterType;
		/** Children of the screen */
		readonly screenElements: ReadonlyArray<ScreenElement>;
		/** Focusable element of the screen  */
		readonly initiallyFocusedElementId?: string;
	}

	export namespace Screen {
		/**
		 * Function to check if a given object is an instance of {@link Screen}.
		 * @param value the object to check
		 */

		export function isInstance(value: unknown): value is FormModel.Screen {
			return (
				isRecord(value) &&
				value.screenElements !== undefined &&
				!Section.isInstance(value) &&
				!MultiColumnSection.isInstance(value)
			);
		}
	}

	export type ScreenElement =
		| Section
		| ControlGrid
		| MultiColumnSection
		| ButtonPanel
		| DetachedRepeat
		| InlineRepeat
		| EmbeddedRepeat
		| CustomScreenElement;

	export namespace ScreenElement {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.ScreenElement}.
		 * @param element the object to check
		 */

		export function isInstance(element: object): element is ScreenElement {
			return (
				FormModel.Section.isInstance(element) ||
				FormModel.ControlGrid.isInstance(element) ||
				FormModel.MultiColumnSection.isInstance(element) ||
				FormModel.ButtonPanel.isInstance(element) ||
				FormModel.Repeat.isInstance(element) ||
				FormModel.CustomScreenElement.isInstance(element)
			);
		}
	}

	/**
	 * Data structure for a basic screen elements from which the actual
	 * screen elements extend.
	 */
	export interface BasicScreenElement extends IdNamed, Annotated, Stylable, ConditionallyHidden {
		/** A localizable text which is used as the title of the element */
		readonly title?: Label;
		/** Determines if the element is shown as readonly or not. */
		readonly readonly?: boolean;

		/** @internal  */
		readonly includeId?: string;
		/** @internal  */
		readonly formModelRef?: string;
		/** @internal  */
		readonly hostDocumentModelPath?: string;
	}

	/**
	 * Data structure for a custom screen element.
	 * A custom screen element is a placeholder.
	 */
	export interface CustomScreenElement extends BasicScreenElement {
		readonly type: "CustomScreenElement";
		readonly height?: number;
	}

	export namespace CustomScreenElement {
		/**
		 * Function to check if a given object is an instance of {@link CustomScreenElement}.
		 * @param element the object to check
		 */
		export function isInstance(
			element: object | FormModel.ScreenElement
		): element is FormModel.CustomScreenElement {
			const target: Partial<FormModel.ScreenElement> = element;
			return target.type === "CustomScreenElement";
		}
	}

	/**
	 * Data structure for a section.
	 * A section is a container for other screen elements.
	 */
	export interface Section extends BasicScreenElement {
		readonly type: "Section";

		/**
		 * Defines if the section is collapsible.
		 * If the section is collapsible the initial state
		 * can be opened or closed.
		 * @default: false
		 */
		readonly collapsible?: boolean;
		/** @default false */
		readonly initiallyCollapsed?: boolean;
		/** The children of the section. */
		readonly screenElements?: ReadonlyArray<ScreenElement>;
	}

	export namespace Section {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.Section}.
		 * @param value the object to check
		 */

		export function isInstance(value: unknown): value is FormModel.Section {
			return isRecord(value) && value.type === "Section";
		}
	}

	/**
	 * Data structure to define a MultiColumnSection.
	 * A MultiColumnSection is a layoutable container for other screen elements.
	 */
	export interface MultiColumnSection extends BasicScreenElement {
		readonly type: "MultiColumnSection";

		/**
		 * Layout information of the section for the different size classes.
		 * For each size class a layout is defined as a string of the form n_1 - n_2 -...- n_m.
		 * For the size class lg it must hold n_1 + n_2 + ... + n_m <= 12.
		 * For the size classes md and sm the sum can also be larger than 12.
		 */
		readonly layout: SizedString;

		/**
		 * Defines if the section is collapsible.
		 * If the section is collapsible the initial state
		 * can be opened or closed.
		 * @default: false
		 */
		readonly collapsible?: boolean;
		/** @default false */
		readonly initiallyCollapsed?: boolean;

		/** The children of the multi column section. */
		readonly screenElements?: ReadonlyArray<ScreenElement>;
	}

	export namespace MultiColumnSection {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.MultiColumnSection}.
		 * @param value the object to check
		 */

		export function isInstance(value: unknown): value is FormModel.MultiColumnSection {
			return isRecord(value) && value.type === "MultiColumnSection";
		}
	}

	/**
	 * Data structure to hold a string for the different size classes lg, md and sm used in responsive layout grids.
	 */
	export interface SizedString {
		readonly lg: string;
		readonly md?: string;
		readonly sm?: string;
	}

	/**
	 * Data structure to represent an array
	 * of custom row actions for repeats.
	 */
	export interface RowActionGroup {
		readonly action?: ReadonlyArray<RowAction>;
	}

	/**
	 * Data structure to represent a row action.
	 */
	export interface RowAction extends Annotated {
		/** Defines the row action button's visual appearance */
		readonly buttonStyling?: ButtonStyling;

		/** The name of the event. */
		readonly event: string;

		/**
		 * If defined the engine will show a confirmation
		 * dialog with the given text, when the user
		 * clicks the row action button.
		 */
		readonly confirmation?: MultilingualText;

		/** The title of the confirmation dialog. */
		readonly confirmationDialogTitle?: MultilingualText;

		/** The enablement scope for the row action */
		readonly scope: ScopeEnum;
	}

	export namespace RowAction {
		export function isInstance(element: object): element is RowAction {
			const target: Partial<FormModel.RowAction> = element;
			return !("type" in target) && typeof target.event === "string" && "scope" in target;
		}
	}

	/**
	 * Data structure for repeat.
	 * A repeat belongs to a repeatable document model group
	 * and will be represented as table.
	 */
	export interface Repeat extends BasicScreenElement {
		/** Expression with which the entries of the group can be filtered */
		readonly filterExpression?: string;

		/** Runtime-only filter expression */
		readonly filterExpressionTree?: RepeatExpressionFilter.ParsedFilterNode;

		/** Defines the labels for the repeat buttons (e.g. add, edit etc.) */
		readonly buttonLabels?: RepeatButtonLabels;

		/** Defines the confirmation texts for the repeat buttons (e.g. remove) */
		readonly confirmationTexts?: ConfirmationTexts;

		/** The columns of the table. */
		readonly repeatOverviewColumn?: ReadonlyArray<RepeatOverviewColumn>;

		/**
		 * The id of the field overview column by which the table should initially be sorted.
		 */
		readonly initialSorting?: string;

		/**
		 * The id of the column for which the cell value will be read by screen readers to provide context for row actions
		 */
		readonly screenReaderColumnRef?: string;

		/** Custom row actions which will display next to the standard enabled row actions. */
		readonly rowActionGroup?: RowActionGroup; // custom row actions

		/** Reference to the document model group. */
		readonly groupRef: string;

		/** Runtime-only path to repeatable group. */
		readonly groupPath: ModelPath;

		/**
		 * Determines if the add button should be shown.
		 * If not given, the button is hidden.
		 */
		readonly enableAdd?: boolean;

		/**
		 * Whether the remove button for a row should be shown.
		 * If not given, the button is hidden.
		 */
		readonly enableRemove?: boolean;

		/**
		 * Whether the reorder buttons for a row should be shown.
		 * If not given, the button is hidden.
		 */
		readonly enableReorder?: boolean;

		/**
		 * Whether the copy buttons for a row should be shown.
		 * If not given, the button is hidden.
		 */
		readonly enableCopy?: boolean;

		/** Defines how many entries should be shown on one page */
		readonly pageSize?: number;

		/**
		 * Whether the given title should be hidden.
		 * If not given, the title will not be hidden.
		 */
		readonly titleHidden?: boolean;

		/** Whether the columns in the repeat should be resizable or not */
		readonly enableColumnsResize?: boolean;

		/**
		 * Defines the style of the repeat table
		 */
		readonly tableStyle?: TableStyle;
	}

	export namespace Repeat {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.DetachedRepeat} or {@link FormModel.InlineRepeat}
		 * or {@link FormModel.EmbeddedRepeat}.
		 * @param element the object to check
		 */

		export function isInstance(
			element: unknown
		): element is FormModel.InlineRepeat | FormModel.DetachedRepeat | FormModel.EmbeddedRepeat {
			return (
				DetachedRepeat.isInstance(element) ||
				InlineRepeat.isInstance(element) ||
				EmbeddedRepeat.isInstance(element)
			);
		}
	}

	/**
	 * Data structure for a detached repeat.
	 * A detached repeat only shows a readonly table of the data.
	 * To edit/view the data a detached repeat detail screen
	 * is shown.
	 */
	export interface DetachedRepeat extends Repeat {
		readonly type: "DetachedRepeat";
		/** The detail screen which is shown for the data. */
		readonly detailScreen: Screen;
		/** The row action that is triggered on row click */
		readonly defaultRowAction?: DefaultRowAction;

		/**
		 * Whether infinite scrolling should be used.
		 */
		readonly infiniteScrolling?: boolean;
	}

	export namespace DetachedRepeat {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.DetachedRepeat}.
		 * @param element the object to check
		 */

		export function isInstance(element: unknown): element is FormModel.DetachedRepeat {
			return isRecord(element) && element.type === "DetachedRepeat";
		}
	}

	export interface TableStyle {
		/**
		 * The size of the row in pixels, if infinite scrolling is enabled.
		 * Must always be used in conjunction with infinite scrolling.
		 */
		readonly rowHeight?: number;

		/**
		 * The width of the action column, if infinite scrolling is enabled.
		 * If non is given, the width is calculated.
		 */
		readonly actionColumnWidth?: number;

		/**
		 * The size of the table in pixels, if infinite scrolling is enabled.
		 * Must always be used in conjunction with infinite scrolling.
		 */
		readonly tableHeight?: number;

		/**
		 * The height of each card in pixels, if infinite scrolling is enabled.
		 * Only applied if cardView is used.
		 */
		readonly cardHeight?: number;
	}

	export interface DefaultRowAction {
		/**
		 * Event name of the corresponding row action.
		 * This can be the event name of a custom row action or
		 * the name of a built in row action (i.e. edit/download).
		 */
		readonly event: string;

		/** Whether the given event name is a custom event */
		readonly custom?: boolean;

		/** Whether the corresponding row action button should be hidden */
		readonly hideButton?: true;
	}

	export interface Icon {
		/** Name of the icon in the icon font */
		readonly name: string;
		/**
		 * Theme of the icon font
		 * @default filled
		 */
		readonly theme?: IconTheme;
	}

	/**
	 * Data structure for the repeat overview column
	 */
	export interface RepeatOverviewColumnBase extends Annotated, ConditionallyHidden {
		readonly type: "FieldBasedRepeatOverviewColumn" | "ExpressionRepeatOverviewColumn";
		readonly label?: Label;
		readonly id: string;

		/** default 1.0 */
		readonly width?: number;

		/** default false */
		readonly sortable?: boolean;

		/** default false */
		readonly filterable?: boolean;

		/** Defines if the column should be pinned to the left or right. */
		readonly pinDirection?: PinDirection;

		/** default "ASC" */
		readonly preferredSorting?: PreferredSorting;

		/** Defines the optional icon that should be displayed in the table head row */
		readonly icon?: Icon;

		/** default false */
		readonly labelHidden?: boolean;

		/** Defines the horizontal alignment for this column */
		readonly specificHorizontalAlignment?: SpecificHorizontalAlignment;

		/** Defines the vertical alignment for this column */
		readonly specificVerticalAlignment?: SpecificVerticalAlignment;

		/** Defines header styles */
		readonly headerStyle?: ReadonlyArray<Style>;

		/**
		 * If set to true then the column will not stretch to
		 * the remaining space
		 */
		readonly fixedWidth?: boolean;
	}

	export namespace RepeatOverviewColumn {
		/**
		 * Function to check if a given value is an instance of {@link FormModel.RepeatOverviewColumn}.
		 * @param value the value to check
		 */

		export function isInstance(value: unknown): value is RepeatOverviewColumn {
			return FieldOverviewColumn.isInstance(value) || ExpressionOverviewColumn.isInstance(value);
		}
	}

	export type PreferredSorting = "ASC" | "DESC";
	export type PinDirection = "LEFT" | "RIGHT";
	export type HorizontalAlignment = "left" | "center" | "right";
	export type VerticalAlignment = "top" | "middle" | "bottom";

	export interface SpecificHorizontalAlignment {
		readonly head?: HorizontalAlignment;
		readonly body?: HorizontalAlignment;
	}
	export interface SpecificVerticalAlignment {
		readonly head?: VerticalAlignment;
		readonly body?: VerticalAlignment;
	}

	export type FilterExposition = "FULL" | "STRING";

	/**
	 * Model element to show input elements in a {@link InlineRepeat}
	 * to edit field values.
	 */
	export interface FieldOverviewColumn extends RepeatOverviewColumnBase, Stylable, FieldBasedInput {
		readonly type: "FieldBasedRepeatOverviewColumn";

		/**
		 * Whether a TextOutput or a readonly Input should be shown for this
		 * column, when it is readonly
		 *
		 * Default: Input
		 */
		readonly readonlyPresentation?: ReadonlyPresentation;

		/**
		 * If true, a multi-select value is shown as comma separated string.
		 */
		readonly showCommaSeparated?: boolean;

		/**
		 * Whether a summary row is shown for this column.
		 * Only valid for number columns.
		 */
		readonly showSummary?: boolean;

		/* Exposition for the field (e.g. full, inline) */
		readonly exposition?: ExpositionPresentation;

		/**
		 * Defines the filter exposition for enumerations and external enumerations.
		 * Default value for enumerations is FULL.
		 * Default value for external enumerations is STRING.
		 */
		readonly filterExposition?: FilterExposition;
	}

	export namespace FieldOverviewColumn {
		/**
		 * Function to check if a given value is an instance of {@link FormModel.FieldOverviewColumn}.
		 * @param value the value to check
		 */

		export function isInstance(value: unknown): value is FormModel.FieldOverviewColumn {
			return isRecord(value) && value.type === "FieldBasedRepeatOverviewColumn";
		}
	}

	/**
	 * Data structure for a cell in a {@link InlineRepeat} to show
	 * an evaluated expression.
	 */
	export interface ExpressionOverviewColumn extends RepeatOverviewColumnBase, Stylable {
		readonly type: "ExpressionRepeatOverviewColumn";
		/**
		 * The expression which is evaluated by an interpreter taking the current
		 * document into account.
		 */
		readonly expression: string;

		/** Runtime-only parsed expression */
		readonly expressionTree: Expression.RootNode;

		readonly name: string;
	}

	export namespace ExpressionOverviewColumn {
		/**
		 * Function to check if a given value is an instance of {@link FormModel.ExpressionOverviewColumn}.
		 * @param value the value to check
		 */

		export function isInstance(value: unknown): value is FormModel.ExpressionOverviewColumn {
			return isRecord(value) && value.type === "ExpressionRepeatOverviewColumn";
		}
	}

	export type RepeatOverviewColumn = FieldOverviewColumn | ExpressionOverviewColumn;

	/**
	 * Data structure for an inline repeat.
	 * An inline repeat shows a table of input elements.
	 */
	export interface InlineRepeat extends Repeat {
		readonly type: "InlineRepeat";

		/**
		 * Whether infinite scrolling should be used.
		 */
		readonly infiniteScrolling?: boolean;

		/**
		 * Whether a TextOutput or a readonly Input should be shown for columns
		 * of the repeat which are readonly
		 *
		 * Default: Input
		 */
		readonly readonlyPresentation?: ReadonlyPresentation;

		/** Whether an upload area should be rendered above the repeat table */
		readonly multiFileUpload?: boolean;

		/** Defines the options that will be used for the multi file upload area */
		readonly multiFileUploadOptions?: MultiFileUploadOptions;
	}

	export namespace InlineRepeat {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.InlineRepeat}.
		 * @param element the object to check
		 */

		export function isInstance(element: unknown): element is FormModel.InlineRepeat {
			return isRecord(element) && element.type === "InlineRepeat";
		}
	}

	/**
	 * Data structure for an embedded repeat.
	 * An embedded repeat only shows a readonly table of the data.
	 * To edit/view the data an embedded repeat detail control grid
	 * is shown in an expanded row inside the table.
	 */
	export interface EmbeddedRepeat extends Repeat {
		readonly type: "EmbeddedRepeat";

		/** The detail control grid which is shown for the data. */
		readonly controlGrid: ControlGrid;

		/** The row action that is triggered on row click */
		readonly defaultRowAction?: DefaultRowAction;

		/** Whether an upload area should be rendered above the repeat table */
		readonly multiFileUpload?: boolean;

		/** Defines the options that will be used for the multi file upload area */
		readonly multiFileUploadOptions?: MultiFileUploadOptions;
	}

	export namespace EmbeddedRepeat {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.EmbeddedRepeat}.
		 * @param element the object to check
		 */

		export function isInstance(element: unknown): element is FormModel.EmbeddedRepeat {
			return isRecord(element) && element.type === "EmbeddedRepeat";
		}
	}

	export interface MultiFileUploadOptions {
		/** Reference to the document model group */
		readonly elementRef: string;

		/** Runtime-only path to the attachment group */
		readonly elementPath: ModelPath;

		/**
		 * Determines if the download button should be shown.
		 * If not given, the button is hidden.
		 */
		readonly enableDownload?: boolean;

		/** Description, that will be rendered inside of the upload area */
		readonly fileUploadDescription?: MultilingualText;

		/** Whether the description should be hidden */
		readonly hideFileUploadDescription?: boolean;

		/** Label of the upload button */
		readonly fileUploadButtonText?: MultilingualText;

		/** Whether the button label should be hidden */
		readonly hideFileUploadButtonText?: boolean;

		/** Helper text, that will be rendered below the upload area */
		readonly fileUploadHelperText?: MultilingualText;
	}

	export type RepeatButtonLabels = {
		readonly [key in RepeatButtonLabelEnum]?: MultilingualText;
	};

	export type RepeatButtonLabelEnum =
		| "ADD"
		| "COMMIT_ADD"
		| "APPLY"
		| "EDIT"
		| "REMOVE"
		| "VIEW"
		| "CANCEL"
		| "CONFIRM"
		| "RETURN"
		| "UP"
		| "DOWN"
		| "COPY"
		| "CLOSE"
		| "DOWNLOAD"
		| "SKIP"
		| "REPLACE"
		| "UPLOAD_AS_COPY";

	export type ConfirmationTexts = { readonly [key in ConfirmationTextEnum]?: ConfirmationText };

	export type ConfirmationTextEnum = "REMOVE";

	export interface ConfirmationText {
		readonly title?: MultilingualText;
		readonly message?: MultilingualText;
	}

	/**
	 * Layoutable container for cells, which consists of columns and rows.
	 */
	export interface ControlGrid extends BasicScreenElement {
		readonly type: "ControlGrid";

		/**
		 * Layout information of the control grid for the different size classes.
		 * For each size class a layout is defined as a string of the form n_1 - n_2 -...- n_m.
		 * For the size class lg it must hold n_1 + n_2 + ... + n_m <= 12.
		 * For the size classes md and sm the sum can also be larger than 12.
		 */
		readonly layout?: SizedString;

		/** An array of rows */
		readonly row?: ReadonlyArray<Row>;

		/**
		 * Whether a TextOutput or a readonly Input should be shown for children
		 * Controls which are readonly
		 *
		 * Default: Input
		 */
		readonly readonlyPresentation?: ReadonlyPresentation;

		/**
		 * Whether the Controls inside the grid should be top, middle
		 * or bottom aligned.
		 *
		 * Default: TOP
		 */
		readonly verticalAlignment?: ControlGridVerticalAlignment;
	}

	export namespace ControlGrid {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.ControlGrid}.
		 * @param element the object to check
		 */

		export function isInstance(element: unknown): element is FormModel.ControlGrid {
			return isRecord(element) && element.type === "ControlGrid";
		}
	}

	/** Container for cells. */
	export interface Row extends Annotated, Stylable, ConditionallyHidden {
		readonly type: "Row";

		readonly title?: Label;
		/** Cells inside the row */
		readonly cell?: ReadonlyArray<CellType>;

		/** Unique id of the row. */
		readonly id: string;

		/** Name of the row. */
		readonly name?: string;
	}

	export namespace Row {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.Row}.
		 * @param element the object to check
		 */

		export function isInstance(element: object): element is FormModel.Row {
			const { type }: { readonly type?: unknown } = element;
			return type === "Row";
		}
	}

	export type CellType = Control | ExpressionCell | TextCell | CustomCell;

	/**
	 * Data structure for a cell. A cell is a wrapper
	 * component for a {@link Control}, {@link TextCell}, or
	 * {@link ExpressionCell}.
	 * Cells can have a span and offset to position them inside their parent control grid.
	 */
	export interface Cell extends Annotated, ConditionallyHidden {
		readonly id: string;
		readonly type: "TextCell" | "ExpressionCell" | "Control" | "CustomCell";

		/**
		 * Offset of columns to the last sibling, given for the different size classes.
		 * Defaults to 0 for each size class.
		 */
		readonly offset?: SizedNumber;

		/**
		 * Defines how many columns the cell should span in each size class.
		 * Defaults to 1 for each size class.
		 */
		readonly span?: SizedNumber;
	}

	/**
	 * Custom Cell to display a placeholder
	 */
	export interface CustomCell extends Cell, IdNamed {
		readonly type: "CustomCell";
	}

	export namespace CustomCell {
		/**
		 * Function to check if a given object is an instance of {@link CustomCell}.
		 * @param element the object to check
		 */
		export function isInstance(element: object | FormModel.Cell): element is FormModel.CustomCell {
			const target: Partial<FormModel.Cell> = element;
			return target.type === "CustomCell";
		}
	}

	/**
	 * Data structure to hold a number for the different size classes lg, md and sm used in responsive layout grids.
	 */
	export interface SizedNumber {
		readonly lg: number;
		readonly md?: number;
		readonly sm?: number;
	}

	/**
	 * Cell to display plain html text.
	 */
	export interface TextCell extends Cell {
		readonly type: "TextCell";
		/** The localizable content. */
		readonly content: MultilingualText;
		readonly name?: string;
		readonly decoration?: TextCellDecoration;
	}

	export namespace TextCell {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.TextCell}.
		 * @param element the object to check
		 */

		export function isInstance(element: object | FormModel.Cell): element is FormModel.TextCell {
			const target: Partial<FormModel.Cell> = element;
			return target.type === "TextCell";
		}
	}

	/**
	 * Cell which content and appearance is derived from the defined
	 * expression.
	 */
	export interface ExpressionCell extends Cell {
		readonly type: "ExpressionCell";

		/**
		 * Expression which defines the content and appearance of the cell.
		 * The definition of the expression language can be found in the respective documentation.
		 */
		readonly expression: string;

		/** Runtime-only parsed expression */
		readonly expressionTree: Expression.RootNode;

		readonly label?: Label;
		readonly name: string;
	}

	export namespace ExpressionCell {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.ExpressionCell}.
		 * @param element the object to check
		 */

		export function isInstance(element: unknown): element is FormModel.ExpressionCell {
			return (
				isRecord(element) &&
				(element.type === "ExpressionCell" || element.type === "ExpressionRepeatOverviewColumn")
			);
		}
	}

	export type Label = MultilingualLabel | ExpressionLabel;

	export interface MultilingualLabel {
		readonly type: "Multilingual";
		readonly multilingualText: MultilingualText;
	}

	export interface ExpressionLabel {
		readonly type: "Expression";
		readonly expressionText: string;
		/** Runtime-only parsed expression */
		readonly expressionTree: Expression.RootNode;
	}

	export interface FieldBasedInput {
		readonly type: "Control" | "FieldBasedRepeatOverviewColumn";

		/** A localizable text */
		readonly label?: Label;

		/** A localizable hint */
		readonly hint?: MultilingualText;

		/**
		 * Whether the controls referencing this field should be readonly
		 */
		readonly readonly?: boolean;

		/**
		 * Whether the controls referencing this field should be
		 * shown as a secret
		 */
		readonly secret?: boolean;

		/** Configurations for the rendered React component. */
		readonly datePickerConfig?: DatePickerConfig;

		// Can not be deleted, because Control uiId is generated using elementRef
		/** Id of the document model element. */
		readonly elementRef: string;

		/**
		 * Runtime-only path to Document Model element
		 */
		readonly elementPath: ModelPath;

		/**
		 * Defines how validation messages should be rendered.
		 * Validation messages can be rendered in a message box above the control
		 * or as tooltips.
		 */
		readonly messageExposition?: MessageExpositionPresentation;

		/** Defines if a text-area should be auto expandable */
		readonly autoExpand?: boolean;

		/** Defines if the suffix of the control should be truncated */
		readonly truncateSuffix?: boolean;

		/** Defines the autoComplete behavior */
		readonly autoComplete?: string;

		/**
		 * Whether the field should be marked with an asterisk or not.
		 * If nothing is given, the asterisk will be shown on the label, if the field is required.
		 */
		readonly markingOfRequiredFields?: FormModel.MarkingOfRequiredFields;
	}

	/**
	 * Union type of {@link Control} and {@link FieldOverviewColumn}
	 */
	export type FieldBasedInputType = Control | FieldOverviewColumn;

	export namespace FieldBasedInputType {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.FieldBasedInputType}.
		 * @param element the object to check
		 */

		export function isInstance(
			element: object | FormModel.Cell
		): element is FormModel.FieldBasedInputType {
			return Control.isInstance(element) || FieldOverviewColumn.isInstance(element);
		}
	}

	/**
	 * Model element to show input elements which are used to
	 * change field data of the document.
	 */
	export interface Control extends Cell, Stylable, FieldBasedInput {
		readonly type: "Control";

		/* Exposition for the field (e.g. full, inline) */
		readonly exposition?: ExpositionPresentation;

		/** Model elements which are shown/ hidden based on the value of the referenced field. */
		readonly dependentControls?: DependentControls;

		/**
		 * Runtime-only reference counter
		 * If a document model element is referenced more than
		 * once by {@link FormModel.Control}s
		 * then this number specifies the occurrence of the model element.
		 */
		readonly occurrence: number;

		/** Defines if tooltips should be displayed above the input field. */
		readonly tooltipsOnTop?: boolean;

		/**
		 * Whether the label should be hidden but readable for screen readers
		 */
		readonly labelHiddenButRead?: boolean;

		/**
		 * Whether a TextOutput or a readonly Input should be shown for Controls
		 * which are readonly
		 */
		readonly readonlyPresentation?: ReadonlyPresentation;

		/**
		 * If a control is used outside of it data context, then this provides the
		 * numeric or semantic index in order to find its data context.
		 */
		readonly index?: ControlIndex;
	}

	export type ControlIndex =
		| {
				readonly type: "NUMERIC";
				readonly value: string;

				/** Runtime-only typed value */
				readonly typedValue: number;
		  }
		| {
				readonly type: "SEMANTIC";
				readonly value: string;

				/** Runtime-only typed value */
				readonly typedValue: FieldInstanceValue;
		  };

	export namespace Control {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.Control}.
		 * @param element the object to check
		 */

		export function isInstance(element: object | FormModel.Cell): element is FormModel.Control {
			const target: Partial<FormModel.Cell> = element;
			return target.type === "Control";
		}
	}

	/**
	 * Configuration for the Date and DateTimePicker
	 */
	export interface DatePickerConfig {
		/**
		 * The minium year which should be shown in the
		 * year selection.
		 */
		readonly minYear?: number;

		/**
		 * The maximum year which should be shown in the year selection.
		 */
		readonly maxYear?: number;

		/**
		 * Defines if the range is given as an absolute value or relative
		 * to the current year.
		 * If not given, a relative value will be assumed.
		 */
		readonly absolute?: boolean;

		/**
		 * Preselected year for the year picker.
		 */
		readonly preselectionYear?: number;
	}

	/**
	 * A localizable text, which contains an entry for each
	 * supported language and the matching localized text.
	 */
	export interface MultilingualText {
		readonly text?: LocalizedModelText;
	}

	/**
	 * Default labels for buttons
	 */
	export interface Defaults {
		readonly buttonLabels?: RepeatButtonLabels;
		readonly confirmationTexts?: ConfirmationTexts;
	}

	/**
	 * Container for buttons
	 */
	export interface ButtonPanel extends BasicScreenElement {
		readonly type: "ButtonPanel";
		/** Children of the container. */
		readonly button?: ReadonlyArray<ButtonType>;
	}

	/**
	 * Container for buttons
	 */
	export namespace ButtonPanel {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.ButtonPanel}.
		 * @param element the object to check
		 */

		export function isInstance(
			element: object | FormModel.ScreenElement
		): element is FormModel.ButtonPanel {
			const target: Partial<FormModel.ScreenElement> = element;
			return target.type === "ButtonPanel";
		}
	}

	/**
	 * Data structure for a button.
	 */
	export interface ButtonStyling extends Stylable {
		/** Localizable text */
		readonly label?: Label;

		/** A multilingual text describing the button */
		readonly description?: MultilingualText;

		/** The icon to be shown next to the button label. */
		readonly icon?: Icon;

		/** If set to 'PRIMARY' the primary prop of the widget will be set to true */
		readonly priority?: ButtonPriorityEnum;

		/** If set to true the destructive prop of
		 * the button widget will be set to true
		 */
		readonly destructive?: boolean;

		/** Whether the label of the button should be shown */
		readonly labelHidden?: boolean;
	}

	export interface EventButton extends IdNamed, Annotated {
		readonly type: "EVENT";

		/** Defines the button's visual appearance */
		readonly buttonStyling?: ButtonStyling;

		/** The validation mode used for this button */
		readonly validation?: ButtonValidationEnum;

		/** The event name of an event button */
		readonly event?: string;

		/** The enablement scope of this button */
		readonly scope: ScopeEnum;

		/**
		 * Defines the enablement of the button if no
		 * data as been entered/changed yet.
		 * If the property is not set the button will
		 * by default be shown and be enabled.
		 */
		readonly enablement?: ButtonEnablementEnum;
	}

	export type NavigationButtonTarget = "#next" | "#previous" | (string & {});

	export interface NavigationButton extends IdNamed, Annotated {
		readonly type: "NAVIGATION";

		/** Defines the button's visual appearance */
		readonly buttonStyling?: ButtonStyling;

		/** The validation mode used for this button */
		readonly validation?: ButtonValidationEnum;

		/**
		 * The id of the target screen of a navigation button.
		 * The target can be "#next", "#previous" or the name of the screen.
		 */
		readonly target: NavigationButtonTarget;

		/** The enablement scope of this button */
		readonly scope: ScopeEnum;
	}

	export type ButtonType = EventButton | NavigationButton;

	/**
	 * Data structure for a button.
	 */
	export namespace ButtonType {
		/**
		 * Function to check if a given object is an instance of {@link FormModel.ButtonType}.
		 * @param element the object to check
		 */

		export function isInstance(element: object): element is FormModel.ButtonType {
			return isNavigationButton(element) || isEventButton(element);
		}

		/**
		 * Checks if the button is a navigation button
		 */
		export function isNavigationButton(
			element: object | FormModel.ButtonType
		): element is FormModel.NavigationButton {
			const target: Partial<FormModel.ButtonType> = element;
			return target.type === "NAVIGATION";
		}

		/**
		 * Checks if the button is an event button
		 */
		export function isEventButton(
			element: object | FormModel.ButtonType
		): element is FormModel.EventButton {
			const target: Partial<FormModel.ButtonType> = element;
			return target.type === "EVENT";
		}
	}

	export type ButtonEnum = "EVENT" | "NAVIGATION";

	export type ButtonPriorityEnum = "PRIMARY" | "SECONDARY";

	export type ButtonValidationEnum = "partial" | "full";

	export type ButtonEnablementEnum = "HIDDEN" | "DISABLED";

	export type ScopeEnum =
		| "ALWAYS"
		| "DISABLED_IN_EDIT_MODE"
		| "DISABLED_IN_READONLY_MODE"
		| "HIDDEN_IN_EDIT_MODE"
		| "HIDDEN_IN_READONLY_MODE";

	// Specific Dependencies
	/**
	 * Data structure to define dependencies for screen element.
	 * The screen element is dependent on the value of
	 * a control.
	 */
	export interface DependentControls {
		readonly screenElement: ReadonlyArray<ScreenElementRef>;
	}

	/**
	 * Reference to a screen element.
	 * This structure is used for {@link DependentControls}.
	 */
	export interface ScreenElementRef {
		/** Reference to the screen element. */
		readonly idref: string;
		/** The value of the master control for which the screen element should be visible. */
		readonly masterValue: string | null;
	}

	/**
	 * Data structure to define which enumeration values
	 * should be shown dependent on a master field.
	 */
	export interface DependentEnumeration {
		/** Reference to the master field. */
		readonly masterField: string;

		/** Runtime-only path to master Field */
		readonly masterFieldPath: ModelPath;

		/** The constraint which defines the dependency. */
		readonly constraint?: ReadonlyArray<DependentEnumerationConstraint>;
	}

	/**
	 * Constraint for a dependent enumeration.
	 */
	export interface DependentEnumerationConstraint {
		/**
		 * The constraint is fulfilled if the master field
		 * has this value.
		 */
		readonly masterValue: string | null;

		/**
		 * If the constraint is fulfilled these values
		 * are shown inside the Enumeration.
		 */
		readonly constraintValues: ReadonlyArray<{ readonly value: string }>;

		/** This value is set if the master value changes */
		readonly valueForMasterChange?: string;
	}

	/**
	 * Data structure for an external enumeration.
	 * Enumeration values for an external enumeration must be
	 * provided by an external source via an `ExternalEnumerationProvider`
	 * and are not defined in the model.
	 */
	export interface ExternalEnumeration {
		/** External source for the enumeration values. */
		readonly src: string;

		/**
		 * Setting this to true allows
		 * the user to add custom values.
		 * Handling of these values has to be
		 * done by the application!
		 */
		readonly customValuesAllowed?: boolean;

		/**
		 * Defines if custom values are matched
		 * case sensitive.
		 */
		readonly caseSensitive?: boolean;
	}

	/**
	 * Sets a dependency for a group
	 */
	export interface DependentGroup {
		/** Reference to the master field. */
		readonly masterField: string;

		/** Runtime-only path to master Field */
		readonly masterFieldPath: ModelPath;

		/** Defines the dependency */
		readonly case: ReadonlyArray<DependentGroupCase>;
	}

	/**
	 * Data structure to define the dependency for a group.
	 */
	export interface DependentGroupCase {
		/**
		 * Value of the master field for which
		 * the dependency is set.
		 */
		readonly masterValue: string | null;

		/** Runtime-only JS typed version of master value */
		readonly masterValueTyped: FieldInstanceValue;

		/**
		 * Hides the group if the master field has the defined master value.
		 * Removes the group from the document "on save".
		 */
		readonly notRelevant?: boolean;

		/**
		 * Sets the group readonly if the master field
		 * has the defined master value.
		 */
		readonly readonly?: boolean;
	}

	/**
	 * Sets a dependency for a field.
	 */
	export interface DependentField {
		/**
		 * The master field on which the field
		 * is dependent.
		 */
		readonly masterField: string;

		/** Runtime-only JS typed version of master value */
		readonly masterFieldPath: ModelPath;

		/** Defines the dependency */
		readonly case: ReadonlyArray<DependentFieldCase>;
	}

	/**
	 * Data structure to define the dependency field.
	 */
	export interface DependentFieldCase {
		/**
		 * Value of the master field for which
		 * the dependency is set.
		 */
		readonly masterValue: string | null;

		/** Runtime-only JS typed version of master value */
		readonly masterValueTyped: FieldInstanceValue;

		/**
		 * Hides the field if the master field has the defined master value.
		 * Removes the field from the document "on save".
		 */
		readonly notRelevant?: boolean;

		/**
		 * Sets all controls which are referencing
		 * the field to readonly.
		 */
		readonly readonly?: boolean;

		/**
		 * Sets the value of the fields
		 */
		readonly value?: string;

		/** Runtime-only JS typed version of value */
		readonly valueTyped: FieldInstanceValue;

		/**
		 * Reference to the dependent field.
		 */
		readonly fieldRef?: string;

		/** Runtime-only path for the dependent field */
		readonly fieldPath?: ModelPath;
	}

	/**
	 * Data structure to define a hide condition for a screen element.
	 * The screen element is hidden when the condition is fulfilled.
	 */
	export interface HideCondition {
		/** Reference to the master field. */
		readonly masterField: string;

		/** The cases defining the hide condition. Master values from cases are
		 * logically combined using the OR operator
		 */
		readonly cases: readonly HideConditionCase[];
	}

	/**
	 * Data structure to define a case for a condition.
	 */
	export interface HideConditionCase {
		/**
		 * Value of the master field for which
		 * the hide condition is fulfilled.
		 */
		readonly masterValue: string | null;
	}

	/**
	 * Runtime-only map, which contains information about the master
	 * controls of a dependent screen element.
	 */
	export interface DependentScreenElement {
		readonly controls: ReadonlyObjectMap<DependentControlMaster>;
	}

	/**
	 * Runtime-only object, containing information about a master
	 * control of a control dependency for a specific screen element.
	 */
	export interface DependentControlMaster {
		/** The document model path to the master field */
		readonly elementPath: ModelPath;
		/** Index information of the master control */
		readonly controlIndex?: FormModel.ControlIndex;
		/**
		 * Values of the underlying field, that will trigger the control
		 * dependency for a specific screen element.
		 */
		readonly values: (string | boolean | null)[];
	}

	/**
	 * Runtime-only object, containing information about the master field of an element hide condition.
	 */
	export interface ConditionallyHiddenElementMaster {
		/** The document model path to the master field */
		readonly masterFieldModelPath: ModelPath;

		/**
		 * Values of the master field, for which an element is hidden.
		 */
		readonly values: (string | boolean | null)[];
	}

	export type ExpositionPresentation =
		| "AREA"
		| "COMPACT"
		| "AUTOCOMPLETE"
		| "FULL"
		| "INLINE"
		| "BOOLEAN_SELECT"
		| "CHECKBOX"
		| "SWITCH"
		| "SWITCH_WITH_VALUES"
		| "THUMBNAIL_OR_ICON";
	export type MessageExpositionPresentation = "TOOLTIP";
	export type ReadonlyPresentation = "INPUT" | "TEXT";
	export type ControlGridVerticalAlignment = "TOP" | "MIDDLE" | "BOTTOM";
	export type MarkingOfRequiredFields = "NONE" | "REQUIRED" | "ALWAYS";
	export type DisableRuleConfirmation = "WARNING" | "INFO";
	export type TextCellDecoration = "INFO" | "WARNING" | "SUCCESS" | "ERROR";
	export type OpenDocumentPreProcessing = "NONE" | "COMPUTATIONS" | "COMPUTATIONS_AND_DEPENDENCIES";

	export type TypedComponent =
		| Screen
		| FieldOverviewColumn
		| Cell
		| Section
		| MultiColumnSection
		| ControlGrid
		| Control
		| ButtonType
		| ExpressionCell
		| InlineRepeat
		| DetachedRepeat
		| EmbeddedRepeat
		| RepeatOverviewColumn
		| ScreenElement;

	export type TitledComponent =
		| Screen
		| ButtonPanel
		| Section
		| MultiColumnSection
		| ControlGrid
		| Row
		| Repeat
		| CustomScreenElement;

	export namespace TitledComponent {
		export function isInstance(component: object): component is TitledComponent {
			return "title" in component;
		}
	}

	export type LabeledComponent =
		| ButtonType
		| RowAction
		| FieldBasedInput
		| ExpressionCell
		| ExpressionOverviewColumn;

	export namespace LabeledComponent {
		export function isInstance(component: object): component is LabeledComponent {
			const target: Partial<LabeledComponent> = component;

			return (
				"label" in target ||
				("buttonStyling" in target &&
					target.buttonStyling !== undefined &&
					"label" in target.buttonStyling)
			);
		}
	}

	export type ComponentWithDescription = ButtonType | RowAction;

	export namespace ComponentWithDescription {
		export function isInstance(component: object): component is ComponentWithDescription {
			const target: Partial<ComponentWithDescription> = component;

			return (
				"buttonStyling" in target &&
				target.buttonStyling !== undefined &&
				"description" in target.buttonStyling
			);
		}
	}
}
