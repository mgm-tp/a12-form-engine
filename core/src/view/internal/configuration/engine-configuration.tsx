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

import type { ComponentType, ReactElement, RefObject } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { LayoutGridProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/layout-grid/main/layout-grid.api.js";
import type { Column } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";

import type ExternalEnumerationProvider from "../../../back-end/services/external-enumeration-provider.js";
import type { createEngineMiddlewares } from "../../../back-end/store/internal/middleware/middleware-factory.js";
import type { EngineState } from "../../../back-end/store/internal/store.js";
import type { FormModel } from "../../../models/index.js";

import type { ScrollApi } from "../components/scroll-api.js";
import type { Value } from "../utilities/value.js";

import type { DefaultFormModelMap } from "./Defaults.js";
import type { DefaultWidgetMap } from "./DefaultWidgetMap.js";
import type { DispatchConfiguration } from "./dispatch-configuration.js";
import type { DefaultSelectorMap, SelectorMap } from "./selectorContext.js";
import type { WidgetMap } from "./widget-map.js";

export namespace FormModelMap {
	/**
	 * Props for the React component
	 */
	export interface FormModelComponentProps<T> {
		/** The model element for which the React component is created. */
		readonly modelElement: T;
		/** Render configuration, including the current form model path and the {@link RenderOptions}. */
		readonly config: FormModelMap.RenderConfiguration;
	}

	/**
	 * Data structure for an entry of the {@link FormModelMap}
	 */
	export interface FormModelMapEntry<T, P = {}> {
		/** React component which is rendered. */
		readonly component: ComponentType<FormModelComponentProps<T> & P>;
	}

	/**
	 * Render options, including the configuration, state, and event handlers.
	 */
	export interface RenderOptions {
		readonly state: EngineState;
		readonly eventHandlers: DispatchConfiguration;
		readonly config: Config;
	}

	/**
	 * Data structure for the render configurations.
	 */
	export interface RenderConfiguration {
		readonly renderOptions: FormModelMap.RenderOptions;
		/**
		 * Current form model path to the parent of the current
		 * form model element.
		 */
		readonly parentPath: ModelPath;
	}
}

/**
 * Map to define which React components should be rendered for which form model
 * elements.
 *
 * Please note that adding new mandatory properties to this interface is not considered as a breaking change.
 * For this reason instances of this interface must always be created by spreading its default implementation
 * {@link DefaultFormModelMap}.
 */
export interface FormModelMap {
	/** Entry for the form */
	readonly Form: FormModelMap.FormModelMapEntry<
		FormModel,
		{
			readonly scrollRef?: RefObject<ScrollApi | null | undefined>;
		}
	>;

	/** Entry for {@link FormModel.Control} */
	readonly Control: FormModelMap.FormModelMapEntry<FormModel.Control>;

	/**
	 * Entry for {@link FormModel.FieldOverviewColumn}
	 *
	 * Please note: Only columns of inline repeats can be customized with this entry.
	 */
	readonly FieldOverviewColumn: FormModelMap.FormModelMapEntry<
		FormModel.FieldOverviewColumn,
		{
			readonly repeat: FormModel.Repeat;
			readonly alignment?: Column.HorizontalAlignment;
		}
	>;

	/** Entry for {@link FormModel.Screen} */
	readonly Screen: FormModelMap.FormModelMapEntry<FormModel.Screen>;

	/** Entry for {@link FormModel.Section} */
	readonly Section: FormModelMap.FormModelMapEntry<FormModel.Section>;

	/** Entry for {@link FormModel.ControlGrid} */
	readonly ControlGrid: FormModelMap.FormModelMapEntry<FormModel.ControlGrid>;

	/** Entry for {@link FormModel.MultiColumnSection} */
	readonly MultiColumnSection: FormModelMap.FormModelMapEntry<FormModel.MultiColumnSection>;

	/** Entry for {@link FormModel.ButtonPanel} */
	readonly ButtonPanel: FormModelMap.FormModelMapEntry<FormModel.ButtonPanel>;

	/** Entry for {@link FormModel.Row} */
	readonly Row: FormModelMap.FormModelMapEntry<
		FormModel.Row,
		{ readonly layout: LayoutGridProps.ResponsiveConfig }
	>;

	/** Entry for {@link FormModel.TextCell} */
	readonly TextCell: FormModelMap.FormModelMapEntry<FormModel.TextCell>;

	/** Entry for {@link FormModel.ExpressionCell} */
	readonly ExpressionCell: FormModelMap.FormModelMapEntry<
		FormModel.ExpressionCell,
		{ readonly context?: EntityInstancePath }
	>;

	/** Entry for {@link FormModel.ExpressionOverviewColumn} */
	readonly ExpressionOverviewColumn: FormModelMap.FormModelMapEntry<
		FormModel.ExpressionOverviewColumn,
		{ readonly context?: EntityInstancePath; readonly displayPartialText?: boolean }
	>;

	/** Entry for {@link FormModel.InlineRepeat} */
	readonly InlineRepeat: FormModelMap.FormModelMapEntry<FormModel.InlineRepeat>;

	/** Entry for {@link FormModel.DetachedRepeat} */
	readonly DetachedRepeat: FormModelMap.FormModelMapEntry<FormModel.DetachedRepeat>;

	/** Entry for {@link FormModel.EmbeddedRepeat} */
	readonly EmbeddedRepeat: FormModelMap.FormModelMapEntry<FormModel.EmbeddedRepeat>;

	/** Entry for {@link FormModel.ButtonType} with type `EVENT` */
	readonly EventButton: FormModelMap.FormModelMapEntry<FormModel.EventButton>;

	/**
	 * Entry for {@link FormModel.ButtonType} with type `NAVIGATION`
	 *
	 * Please mind: Menu entries created in the form sub header for navigation buttons
	 * cannot be customized using this entry, since they are no separate react components
	 * but merely props handed to the menu widget.
	 */
	readonly NavigationButton: FormModelMap.FormModelMapEntry<FormModel.NavigationButton>;

	/** Entry for {@link FormModel.CustomCell} */
	readonly CustomCell: FormModelMap.FormModelMapEntry<FormModel.CustomCell>;

	/** Entry for {@link FormModel.CustomScreenElement} */
	readonly CustomScreenElement: FormModelMap.FormModelMapEntry<FormModel.CustomScreenElement>;
}

/** @internal */
export namespace Inputs {
	/**
	 * Props for the React component
	 */
	export interface InputProps<T extends DocumentModel.FieldType | DocumentModel.Group> {
		/** The data type of the referenced document model element */
		readonly documentElementDataType: T;
		/** The referenced document model element. */
		readonly documentElement: DocumentModel.Element;
		/** The HTML id which should be set to the React component. */
		readonly uiId: string;
		/** The value of the referenced document model element. */
		readonly value: Value;
		/** The {@link FormModelMap.RenderConfiguration} for the component. */
		readonly renderConfiguration: FormModelMap.RenderConfiguration;

		/** Information taken or inferred from the form and document model about this element. */
		readonly modelElement: ModelElement;

		/** The path to the form model element. */
		readonly formModelPath: ModelPath;

		/** The validation messages of the referenced document model element. */
		readonly validationMessages: {
			readonly errors: Localizable[][];
			readonly warnings: Localizable[][];
			readonly infos: Localizable[][];
		};

		/** The reference of the input field. */
		readonly inputRef?: RefObject<HTMLElement | null>;
	}

	/** Information taken or inferred from the form and document model about this element. */
	export interface ModelElement {
		/** The reference to the document model element. */
		readonly elementRef: string;
		/** The path to the document model element. */
		readonly elementPath: ModelPath;

		/** The already localized label. */
		readonly label?: ReactElement | string;

		/** The already localized text for a hint. */
		readonly hintText?: string;

		/** The exposition of the element (e.g. full, inline) */
		readonly exposition: FormModel.ExpositionPresentation;

		/** Whether the select all option for a MultiSelect with exposition
		 * inline or full should be shown
		 */
		readonly enableSelectAll?: boolean;

		/** This property is set to true if the input is read-only */
		readonly readonly?: boolean;

		/** The secret information form the model element. */
		readonly secret?: boolean;

		/** Configuration for widgets. */
		readonly datePickerConfig?: FormModel.DatePickerConfig;

		/**
		 * If a document model element is referenced more than
		 * once by {@link FormModel.Control}s or {@link FormModel.FieldOverviewColumn}s
		 * then this number specifies the occurrence of the model element.
		 */
		readonly occurrence?: number;

		/**
		 * Defines how validation messages should be rendered.
		 * Validation messages can be rendered in a message box above the control
		 * or as tooltips.
		 */
		readonly messageExposition?: FormModel.MessageExpositionPresentation;

		/** This property is set to true if tooltips should be displayed above the input field. */
		readonly tooltipsOnTop?: boolean;

		/** Whether the label of the input should be hidden but readable for screen readers */
		readonly labelHiddenButRead?: boolean;

		/** This property is set to true if the text-area is auto expandable */
		readonly autoExpand?: boolean;

		/** This property is set to true if the input is disabled */
		readonly disabled?: boolean;

		/** Suffix to be displayed at the end of the input field */
		readonly suffix?: string;

		/** Whether the suffix should be rendered truncated */
		readonly truncateSuffix?: boolean;

		/* The already localized placeholder. */
		readonly placeholder?: string;

		/** Whether the field is required. */
		readonly required?: boolean;

		/** Already localized helper text */
		readonly helperText?: string;

		/** Defines the horizontal alignment for this column */
		readonly specificHorizontalAlignment?: FormModel.SpecificHorizontalAlignment;

		/** Defines the vertical alignment for this column */
		readonly specificVerticalAlignment?: FormModel.SpecificVerticalAlignment;

		/** Configuration for an attachment */
		readonly attachmentConfig?: FormModel.AttachmentConfig;

		/** If true, a multi-select value is shown as comma separated string. */
		readonly showCommaSeparated?: boolean;

		/** The time zone, that's defined in the document model */
		readonly timeZone?: string;

		/** The styles, that have been defined for the input */
		readonly style?: ReadonlyArray<FormModel.Style>;

		/** Defines the autocomplete behavior */
		readonly autoComplete?: string;
	}

	/**
	 * Data structure for an entry of the {@link Inputs}
	 * @param T document model type of the input element
	 * @param D additional props
	 */
	export interface InputElement<T extends DocumentModel.FieldType | DocumentModel.Group, D = {}> {
		/** React component which is rendered for type T. */
		readonly component: ComponentType<InputProps<T> & D>;
	}
}

/**
 * Configuration options for the renderer.
 */
export interface Config {
	/**
	 * Provides enumeration values for external enumerations. Must be given if the model contains external enumerations.
	 * The providers must be implemented synchronously.
	 * Asynchronous operations will result in misbehavior of the application.
	 *
	 * Mind: You need to register your external enumeration provider here, as well as
	 * in the middlewares ({@link createEngineMiddlewares})!
	 */
	readonly externalEnumerationProvider: ExternalEnumerationProvider;

	/**
	 * Boolean, that specifies, if the date picker should be disabled.
	 */
	readonly disableDatePicker: boolean;

	/**
	 * Per default, the Form Engine renders a enumeration fields value, even if
	 * the value is not part of the enumeration options. This option disables this behavior.
	 *
	 * Note: This can only happen if you modify documents programmatically or a data migration
	 * was missed after enumeration options were changed. In most cases, you want the user
	 * to see the invalid value.
	 */
	readonly hideCustomEnumerationValue: boolean;

	/**
	 * Boolean, that specifies, whether the UI state should be set to dirty, once an input field has been touched.
	 */
	readonly earlyDetectDirtyControl: boolean; // for new architecture

	/**
	 * Boolean, that specifies, whether the card view should be used for repeats.
	 */
	readonly cardView: boolean;

	/**
	 * Boolean, that specifies, whether dirty handling should be disabled for detached repeat detail screens.
	 */
	readonly disableDirtyHandlingForDetachedRepeat?: boolean;

	/**
	 * timeMode for the TimePicker
	 */
	readonly timeMode: ClockMode;

	/**
	 * String, which will be set in front of component ids if it is specified.
	 */
	readonly uiIdPrefix?: string;

	/**
	 * The top aria-level, which will be set on the title element of the engine's content box. Defaults to 1.
	 *
	 * @default 1
	 */
	readonly ariaLevel?: number;

	/**
	 * Map to exchange React components for form model elements.
	 * The map contains one entry for each form model element.
	 *
	 * When customizing, always spread the {@link DefaultFormModelMap} into the map object.
	 * Adding new mandatory properties to {@link FormModelMap} is not considered as a breaking change.
	 */
	readonly formModelMap: FormModelMap;

	/**
	 * Map to replace the A12 Widget implementation used inside
	 * the Form Engine.
	 *
	 * When customizing, always spread the {@link DefaultWidgetMap} into the map object.
	 * Adding new mandatory properties to {@link WidgetMap} is not considered as a breaking change.
	 */
	readonly widgetMap?: WidgetMap;

	/**
	 * @experimental
	 * Map to replace selectors used inside the Form Engine.
	 *
	 * When customizing, always spread the {@link DefaultSelectorMap} into the map object.
	 * Adding new mandatory properties to {@link SelectorMap} is not considered as a breaking change.
	 */
	readonly selectorMap?: SelectorMap;

	/**
	 * Definition of enablements
	 */
	readonly enablements?: {
		/** Enablement definition for event and navigation buttons */
		readonly byButtonName?: EnablementByButtonName;
		/** Enablement definition for row action buttons */
		readonly byRow?: EnablementByRow;
	};
}

/** Possible modes for the time picker. */
export type ClockMode = "12h" | "24h";

/**
 * Names of the default repeat buttons
 * which can be used for the "byButtonName" map of
 * {@link Config.enablements}
 *
 * Mind: If you want to set the enablement for the "add" button
 * you need to use a row index of 0, as the add button exists for a whole repeat.
 */
export enum DefaultRepeatButtonNames {
	edit = "defaultButton/edit",
	delete = "defaultButton/delete",
	copy = "defaultButton/copy",
	move = "defaultButton/move",
	add = "defaultButton/add",
	download = "defaultButton/download",
	commit_detached_repeat = "defaultButton/commit_detached_repeat",
	cancel_detached_repeat = "defaultButton/cancel_detached_repeat"
}

/**
 * Definition of the enablement of row action buttons
 * in a repeat, for one event and row.
 * A row of 0 means the enablement should be set for all rows.
 * A row of 1..n means the enablement should be set for exactly this rows.
 * If a 0-entry as well as an exact entry is set for a row, than the exact
 * definition will win.
 */
export type EnablementByRow = {
	readonly [repeatName: string]:
		| {
				readonly [eventName: string]:
					| {
							readonly [rowIndex: string]: EnablementEntry | undefined;
					  }
					| undefined;
		  }
		| undefined;
};

/**
 * An entry for an enablement.
 */
export type EnablementEntry = { readonly disabled?: boolean; readonly hidden?: boolean };

/**
 * Definition of the enablement for event and navigation buttons
 * which are defined by their names.
 */
export type EnablementByButtonName = {
	readonly [buttonName: string]: EnablementEntry | undefined;
};
