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

// internal input components
export const DATE_CONTROL = "date-control";
export const DATE_RANGE_CONTROL = "date-range-control";
export const DATE_TIME_TEXT_LINE = "date-time-text-line";
export const ATTACHMENT_UPLOAD = "attachment-upload";
export const MULTI_ATTACHMENT_UPLOAD = "multi-attachment-upload";

// internal components
export const BUFFERED_TEXT_LINE = "buffered-textline";
export const BUFFERED_TEXT_AREA = "buffered-textarea";
export const PICKER_WRAPPER = "picker-wrapper";
export const SUFFIX = "suffix";
export const TOOLTIPS = "tooltips";
export const VALIDATION_MESSAGES = "validation-messages";
export const ACTION_BUTTONS = "action-buttons";
export const EXPANDED_ROW = "expanded-row";
export const HTML_TEXT_DIV = "html-text-div";
export const HTML_TEXT_SPAN = "html-text-span";
export const CONTENT_WITH_NEW_LINES = "content-with-new-lines";

/**
 * Widgets
 *
 * The data roles for widgets match the real data roles, that are rendered by
 * widgets, so that they still work when real widgets are used in a test. Since
 * they are not exported from widgets anywhere, they might become outdated at
 * some point.
 */
export const BUTTON = "button";
export const ICON = "plasma-icon";
export const HEAD_CELL = "table-header-cell";

// data-type="table-action-cell", used together with
// data-role="table-header-cell"
export const ACTION_CELL = "table-action-cell";

export const HEAD_CELL_CONTENT = "table-header-cell-content";
export const TABLE_HEAD = "table-header";
export const TABLE_BODY = "table-body";
export const BODY_CELL = "table-body-cell";
export const BODY_ROW = "table-body-row";
export const EXPANDABLE_ROW_BODY = "table-expandable-row-body";
export const TEXT_AREA = "textarea";
export const TEXT_LINE = "textline";
export const AUTO_COMPLETE = "autocomplete";
export const SELECT = "select";
export const MULTI_SELECT = "multiselect";
export const SWITCH = "switch";
export const CHECKBOX = "checkbox";
export const CHECKBOX_INDETERMINATE = "checkbox-indeterminate";
export const CHECKBOX_GROUP = "checkbox-group";
export const CHECKBOX_GROUP_ITEM = "checkbox-group-item";
export const RADIO = "radio-group";
export const RADIO_ITEM = "radio-control";
export const DATE_PICKER = "date-picker";
export const DATE_PICKER_DIALOG = "date-picker-dialog";
export const DATE_TIME_PICKER = "date-time-picker";
export const TIME_PICKER = "time-picker";
export const DEFAULT_FILE_UPLOAD = "default-file-upload";
export const ACTION_CONTENTBOX = "action-contentbox";
export const ERROR_TOOLTIP = "tooltip-error";
export const WARNING_TOOLTIP = "tooltip-warning";
export const HINT_TOOLTIP = "tooltip-hint";
export const LAYOUT_GRID = "layout-grid";
export const LAYOUT_GRID_COLUMN = "layout-grid-column";
export const LAYOUT_GRID_ROW = "layout-grid-row";

export const PAGINATION = "pagination";
export const TYPOGRAPHY_SECTION = "typography-section";
export const TYPOGRAPHY_HEADLINE = "typography-headline";
export const TYPOGRAPHY_BODY = "typography-body";
export const NOTIFICATION_AREA = "contentbox-notification";
export const MESSAGE_BOX = "messagebox";
export const VALIDATION_BAR = "validation-bar";
export const VALIDATION_BAR_CONTENT = "validation-bar-content";
export const MOBILE_VALIDATION_BAR_CONTENT = "mobile-validation-content";
export const MOBILE_VALIDATION_BAR_OVERVIEW = "mobile-validation-overview";
export const MOBILE_VALIDATION_BAR_GRAPHIC = "mobile-validation-graphic";
export const MOBILE_PREVIEW_LIST = "mobile-validation-preview-list";
export const MOBILE_PREVIEW_LIST_ITEM = "mobile-validation-preview-item";
export const MOBILE_ACTION = "mobile-validation-actions";
export const MOBILE_ACTION_ITEM = "mobile-validation-actions-item";
export const MOBILE_VALIDATION_BAR = "mobile-validation";
export const QUICK_ACCESS_BUTTON = "quick-access-button";
export const BUTTON_GROUP = "button-group";
export const BUTTON_GROUP_CONTAINER = "button-group-container";
export const MODAL_OVERLAY = "modal-overlay";
export const POPUP_MENU = "popup";
export const ATTACHED_PORTAL = "portal";
export const RESPONSIVE_IMAGE_CONTAINER = "responsive-image-container";
export const LIST = "list";
export const LIST_ITEM = "list-item";
export const LIST_ITEM_TEXT = "list-item-text";
export const LIST_ITEM_CONTENT = "list-item-content";
export const TEXT_OUTPUT = "text-output";
export const BREADCRUMB = "breadcrumb";
export const BREADCRUMB_ITEM = "breadcrumb-item";
export const CLEARFIX = "clearfix"; // does not have a data role in widgets
export const HIDDEN_TEXT = "hidden-text";

export const CONTENT_BOX_TITLE = "contentbox-title";
export const CONTENT_BOX_SUBTILE = "contentbox-subtitle";
export const CONTENT_BOX_FOOTER = "contentbox-footer";
export const MESSAGE = "message";
export const GLOBAL_MESSAGE_BOX = "global-message-box";
export const LIST_SUBHEADER = "list-sub-header";
export const BULLET_LIST_UNORDERED = "unordered-bullet-list";
export const BULLET_LIST_ITEM = "bullet-list-item";
export const FLYOUT_MENU = "menu";
export const CSS_ELLIPSIS = "css-ellipsis";
export const COUNTER = "counter";

export const TABLE = "table";
