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

import type { ReactElement } from "react";
import { useContext } from "react";

import {
	DataRoles,
	isMenuGroup,
	NavigationContentboxContext
} from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	ActionContentboxProps,
	AttachedPortalProps,
	AutocompleteProps,
	BodyProps,
	BreadcrumbProps,
	BulletListProps,
	ButtonGroupContainerProps,
	ButtonGroupProps,
	ButtonProps,
	CheckboxGroupProps,
	CheckboxItemProps,
	CheckboxProps,
	ClearfixProps,
	ContentBoxProps,
	CounterProps,
	CssEllipsisProps,
	DatePickerDialogProps,
	DatePickerProps,
	DateTimePickerHeaderProps,
	DateTimePickerProps,
	DefaultFileUploadProps,
	ErrorTooltipProps,
	FlyoutMenuProps,
	GlobalMessageBoxProps,
	HeadlineProps,
	HiddenTextProps,
	HintTooltipProps,
	IconProps,
	IndeterminateCheckboxProps,
	LayoutGridProps,
	ListItemProps,
	ListProps,
	ListSubHeaderProps,
	MenuItem as MenuItemMock,
	MenuItemType,
	MessageBoxProps,
	MessageProps,
	MobileValidationProps,
	ModalNotificationProps,
	ModalOverlayProps,
	MultiselectProps,
	PaginationProps,
	PopUpMenuProps,
	QuickAccessButtonProps,
	RadioItemProps,
	RadioProps,
	ResponsiveImageContainerProps,
	SectionProps,
	SelectProps,
	SwitchProps,
	TextAffixProps,
	TextAreaStatelessProps,
	TextFieldProps,
	TextOutputProps,
	TimePickerProps,
	ValidationBarProps,
	WarningTooltipProps
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { WithDataTestId } from "../../back-end/utils/internal/types.js";
import { DefaultWidgetMap } from "../../view/index.js";
import { WidgetMapContext } from "../../view/internal/configuration/widget-map-context.js";
import type { WidgetMap } from "../../view/internal/configuration/widget-map.js";

import { DisableMockComponents } from "../utils/disable-mocks.js";

import {
	ACTION_CONTENTBOX,
	ATTACHED_PORTAL,
	AUTO_COMPLETE,
	BREADCRUMB,
	BREADCRUMB_ITEM,
	BULLET_LIST_ITEM,
	BULLET_LIST_UNORDERED,
	BUTTON,
	BUTTON_GROUP,
	BUTTON_GROUP_CONTAINER,
	CHECKBOX,
	CHECKBOX_GROUP,
	CHECKBOX_GROUP_ITEM,
	CHECKBOX_INDETERMINATE,
	CLEARFIX,
	CONTENT_BOX_FOOTER,
	CONTENT_BOX_SUBTILE,
	CONTENT_BOX_TITLE,
	COUNTER,
	CSS_ELLIPSIS,
	DATE_PICKER,
	DATE_PICKER_DIALOG,
	DATE_TIME_PICKER,
	DEFAULT_FILE_UPLOAD,
	ERROR_TOOLTIP,
	FLYOUT_MENU,
	GLOBAL_MESSAGE_BOX,
	HIDDEN_TEXT,
	HINT_TOOLTIP,
	ICON,
	LAYOUT_GRID,
	LAYOUT_GRID_COLUMN,
	LAYOUT_GRID_ROW,
	LIST,
	LIST_ITEM,
	LIST_ITEM_CONTENT,
	LIST_ITEM_TEXT,
	LIST_SUBHEADER,
	MESSAGE,
	MESSAGE_BOX,
	MOBILE_ACTION,
	MOBILE_ACTION_ITEM,
	MOBILE_PREVIEW_LIST,
	MOBILE_PREVIEW_LIST_ITEM,
	MOBILE_VALIDATION_BAR,
	MOBILE_VALIDATION_BAR_CONTENT,
	MOBILE_VALIDATION_BAR_GRAPHIC,
	MOBILE_VALIDATION_BAR_OVERVIEW,
	MODAL_OVERLAY,
	MULTI_SELECT,
	NOTIFICATION_AREA,
	PAGINATION,
	POPUP_MENU,
	QUICK_ACCESS_BUTTON,
	RADIO,
	RADIO_ITEM,
	RESPONSIVE_IMAGE_CONTAINER,
	SELECT,
	SWITCH,
	TEXT_AREA,
	TEXT_LINE,
	TEXT_OUTPUT,
	TIME_PICKER,
	TYPOGRAPHY_BODY,
	TYPOGRAPHY_HEADLINE,
	TYPOGRAPHY_SECTION,
	VALIDATION_BAR,
	VALIDATION_BAR_CONTENT,
	WARNING_TOOLTIP
} from "./data-roles.js";
import type { Mocked } from "./mock-map.js";
import { MockComponent } from "./mockComponent.js";

export function getWidgetMocks(): Mocked<WidgetMap> {
	return DisableMockComponents.components(() => DefaultWidgetMap)(widgetMockMap);
}

function widgetMockMap(): WidgetMap {
	return {
		// Control Elements
		TextAreaStateless: TextAreaStatelessMock,
		TextField: TextFieldMock,
		Autocomplete: AutocompleteMock,
		Select: SelectMock,
		Multiselect: MultiselectMock,
		Switch: SwitchMock,
		Checkbox: CheckboxMock,
		CheckboxIndeterminate: IndeterminateCheckboxMock,
		CheckboxGroup: CheckboxGroupMock,
		CheckboxGroupItem: CheckboxGroupItemMock,
		Radio: RadioMock,
		RadioItem: RadioItemMock,

		DatePicker: DatePickerMock,
		DatePickerDialog: DatePickerDialogMock,
		DateTimePicker: DateTimePickerMock,
		TimePicker: TimePickerMock,

		DefaultFileUpload: DefaultFileUploadMock,

		ErrorTooltip: ErrorTooltipMock,
		WarningTooltip: WarningTooltipMock,
		HintTooltip: HintTooltipMock,

		TextAffix: TextAffixMock,

		// Repeat
		Pagination: PaginationMock,

		// Layout Elements
		LayoutGrid: SizeContainerMock,
		LayoutGridRow: SizeContainerRowMock,
		LayoutGridColumn: SizeContainerColumnMock,
		TypographySection: TypographySectionMock,
		TypographyHeadline: TypographyHeadlineMock,
		TypographyBody: TypographyBodyMock,

		// Content Box
		ActionContentbox: ActionContentboxMock,
		ContentBoxNotificationArea: NotificationAreaMock,
		ContentBoxTitle: ContentBoxTitleMock,
		ContentBoxSubtitle: ContentBoxSubtitleMock,
		ContentBoxFooter: ContentBoxFooterMock,

		// Validation
		Message: MessageMock,
		MessageBox: MessageBoxMock,
		GlobalMessageBox: GlobalMessageBoxMock,
		ValidationBar: ValidationBarMock,
		MobileValidationContent: MobileValidationContentMock,
		MobileValidationOverview: MobileValidationBarOverviewMock,
		MobileValidationGraphic: MobileValidationBarGraphicMock,
		MobileValidationPreviewList: MobilePreviewListMock,
		MobileValidationPreviewListItem: MobilePreviewListItemMock,
		MobileValidationActions: MobileActionMock,
		MobileValidationActionItem: MobileActionItemMock,
		MobileValidation: MobileValidationBarMock,

		// Helpers
		DateTimePickerHeader: HeaderMock,
		Button: ButtonMock,
		QuickAccessButton: QuickAccessButtonMock,
		ButtonGroup: ButtonGroupMock,
		ButtonGroupContainer: ButtonGroupContainerMock,
		Icon: IconMock,
		ModalNotification: ModalNotificationMock,
		ModalOverlay: ModalOverlayMock,
		PopUpMenu: PopUpMenuMock,
		AttachedPortal: AttachedPortalMock,
		ResponsiveImageContainer: ResponsiveImageContainerMock,
		List: ListMock,
		ListSubHeader: ListSubHeaderMock,
		ListItem: ListItemMock,
		BulletListUnordered: BulletListUnorderedMock,
		BulletListItem: BulletListItemMock,
		FlyoutMenu: FlyoutMenuMock,
		TextOutput: TextOutputMock,
		Breadcrumb: BreadcrumbMock,
		BreadcrumbItem: BreadcrumbItemMock,
		Clearfix: ClearfixMock,
		HiddenText: HiddenTextMock,
		CssEllipsis: CssEllipsisMock,
		Counter: CounterMock
	};
}

function TextAreaStatelessMock(props: TextAreaStatelessProps) {
	return <MockComponent id={props.id} dataRole={TEXT_AREA} />;
}

function TextFieldMock(props: TextFieldProps) {
	return <MockComponent id={props.id} dataRole={TEXT_LINE} />;
}

function AutocompleteMock(props: AutocompleteProps) {
	return <MockComponent id={props.id} dataRole={AUTO_COMPLETE} />;
}

function SelectMock(props: SelectProps) {
	return <MockComponent id={props.id} dataRole={SELECT} />;
}

function MultiselectMock(props: MultiselectProps) {
	return <MockComponent id={props.id} dataRole={MULTI_SELECT} />;
}

function SwitchMock(props: SwitchProps) {
	return <MockComponent id={props.id} dataRole={SWITCH} />;
}

function CheckboxMock(props: CheckboxProps) {
	return <MockComponent id={props.id} dataRole={CHECKBOX} />;
}

function IndeterminateCheckboxMock(props: IndeterminateCheckboxProps) {
	return <MockComponent id={props.id} dataRole={CHECKBOX_INDETERMINATE} />;
}

function CheckboxGroupMock(props: CheckboxGroupProps) {
	return (
		<MockComponent id={props.id} dataRole={CHECKBOX_GROUP}>
			{props.children}
		</MockComponent>
	);
}

function CheckboxGroupItemMock(props: CheckboxItemProps) {
	return <MockComponent id={props.id} dataRole={CHECKBOX_GROUP_ITEM} />;
}

function RadioMock(props: RadioProps) {
	return (
		<MockComponent id={props.id} dataRole={RADIO}>
			{props.children}
		</MockComponent>
	);
}

function RadioItemMock(props: RadioItemProps) {
	return <MockComponent id={props.id} dataRole={RADIO_ITEM} />;
}

function DatePickerMock(props: DatePickerProps) {
	return <MockComponent id={props.id} dataRole={DATE_PICKER} />;
}

function DatePickerDialogMock(props: DatePickerDialogProps) {
	return <MockComponent id={props.id} dataRole={DATE_PICKER_DIALOG} />;
}

function DateTimePickerMock(props: DateTimePickerProps) {
	return (
		<MockComponent id={props.id} dataRole={DATE_TIME_PICKER}>
			{!(props.customHeaderElement instanceof Function) && props.customHeaderElement}
		</MockComponent>
	);
}

function TimePickerMock(props: TimePickerProps) {
	return <MockComponent id={props.id} dataRole={TIME_PICKER} />;
}

function DefaultFileUploadMock(props: DefaultFileUploadProps) {
	return (
		<MockComponent id={props.id} dataRole={DEFAULT_FILE_UPLOAD}>
			{props.actionItem}
			{props.image}
			{props.errorMessage}
		</MockComponent>
	);
}

function ErrorTooltipMock(props: ErrorTooltipProps) {
	return <MockComponent id={props.id} dataRole={ERROR_TOOLTIP} />;
}

function WarningTooltipMock(props: WarningTooltipProps) {
	return <MockComponent id={props.id} dataRole={WARNING_TOOLTIP} />;
}

function HintTooltipMock(props: HintTooltipProps) {
	return <MockComponent id={props.id} dataRole={HINT_TOOLTIP} />;
}

function TextAffixMock(props: TextAffixProps) {
	return <MockComponent id={props.id} dataRole={DataRoles.TextField.TextAffix} />;
}

function PaginationMock(props: PaginationProps) {
	return <MockComponent id={props.id} dataRole={PAGINATION} />;
}

function SizeContainerMock(props: LayoutGridProps.LayoutGridProps) {
	return (
		<MockComponent id={props.id} dataRole={LAYOUT_GRID}>
			{props.children}
		</MockComponent>
	);
}

function SizeContainerRowMock(props: WithDataTestId<LayoutGridProps.RowProps>) {
	return (
		<MockComponent id={props.id} dataRole={LAYOUT_GRID_ROW} dataTestId={props["data-testid"]}>
			{props.children}
		</MockComponent>
	);
}

function SizeContainerColumnMock(props: LayoutGridProps.ColumnProps) {
	return (
		<MockComponent id={props.id} dataRole={LAYOUT_GRID_COLUMN}>
			{props.children}
		</MockComponent>
	);
}

function TypographySectionMock(props: SectionProps) {
	return (
		<MockComponent id={props.id} dataRole={TYPOGRAPHY_SECTION}>
			{props.children}
		</MockComponent>
	);
}

function TypographyHeadlineMock(props: WithDataTestId<HeadlineProps>) {
	return (
		<MockComponent id={props.id} dataRole={TYPOGRAPHY_HEADLINE} dataTestId={props["data-testid"]}>
			{props.children}
		</MockComponent>
	);
}

function TypographyBodyMock(props: BodyProps) {
	return (
		<MockComponent id={props.id} dataRole={TYPOGRAPHY_BODY}>
			{props.children}
		</MockComponent>
	);
}

function ActionContentboxMock(props: ActionContentboxProps) {
	const { Button } = useContext(WidgetMapContext);
	const backButtonClicked = useContext(NavigationContentboxContext).onBackButtonClicked;
	const backButton = backButtonClicked ? (
		<Button onClick={backButtonClicked} title="Back" />
	) : undefined;
	return (
		<MockComponent id={props.id} dataRole={ACTION_CONTENTBOX}>
			{props.headingElements}
			{props.navigation}
			{props.notificationArea}
			{props.buttons as ReactElement}
			{backButton}
			{props.children}
			{props.breadcrumbs}
			{props.footer}
		</MockComponent>
	);
}

function NotificationAreaMock(props: ContentBoxProps.FooterProps) {
	return (
		<MockComponent id={props.id} dataRole={NOTIFICATION_AREA}>
			{props.children}
		</MockComponent>
	);
}

function ContentBoxTitleMock(props: ContentBoxProps.TitleProps) {
	return (
		<MockComponent id={props.id} dataRole={CONTENT_BOX_TITLE}>
			{props.text}
		</MockComponent>
	);
}

function ContentBoxSubtitleMock(props: ContentBoxProps.TitleProps) {
	return (
		<MockComponent id={props.id} dataRole={CONTENT_BOX_SUBTILE}>
			{props.text}
		</MockComponent>
	);
}

function ContentBoxFooterMock(props: ContentBoxProps.FooterProps) {
	return (
		<MockComponent id={props.id} dataRole={CONTENT_BOX_FOOTER}>
			{props.children}
		</MockComponent>
	);
}

function MessageMock(props: MessageProps) {
	return (
		<MockComponent id={props.id} dataRole={MESSAGE}>
			{props.children}
		</MockComponent>
	);
}

function MessageBoxMock(props: MessageBoxProps) {
	return (
		<MockComponent id={props.id} dataRole={MESSAGE_BOX}>
			{props.action}
			{props.children}
		</MockComponent>
	);
}

function GlobalMessageBoxMock(props: GlobalMessageBoxProps) {
	return (
		<MockComponent id={props.id} dataRole={GLOBAL_MESSAGE_BOX}>
			{props.actions}
			{props.content}
		</MockComponent>
	);
}

function ValidationBarMock(props: ValidationBarProps) {
	return (
		<MockComponent id={props.id} dataRole={VALIDATION_BAR}>
			<div data-role={VALIDATION_BAR_CONTENT}>{props.children}</div>
			{props.pagination}
			{props.quickAccessMenu}
		</MockComponent>
	);
}

function MobileValidationContentMock(props: MobileValidationProps.ContentProps) {
	return (
		<MockComponent id={props.id} dataRole={MOBILE_VALIDATION_BAR_CONTENT}>
			{props.children}
		</MockComponent>
	);
}

function MobileValidationBarOverviewMock(props: MobileValidationProps.OverviewProps) {
	return (
		<MockComponent id={props.id} dataRole={MOBILE_VALIDATION_BAR_OVERVIEW}>
			{props.leftElement}
			{props.rightElement}
		</MockComponent>
	);
}

function MobileValidationBarGraphicMock(props: MobileValidationProps.GraphicProps) {
	return (
		<MockComponent id={props.id} dataRole={MOBILE_VALIDATION_BAR_GRAPHIC}>
			{props.children}
		</MockComponent>
	);
}

function MobilePreviewListMock(props: MobileValidationProps.PreviewListProps) {
	return (
		<MockComponent id={props.id} dataRole={MOBILE_PREVIEW_LIST}>
			{props.children}
		</MockComponent>
	);
}

function MobilePreviewListItemMock(props: MobileValidationProps.PreviewListItemProps) {
	return <MockComponent id={props.id} dataRole={MOBILE_PREVIEW_LIST_ITEM} />;
}

function MobileActionMock(props: MobileValidationProps.ActionsProps) {
	return (
		<MockComponent id={props.id} dataRole={MOBILE_ACTION}>
			{props.children}
		</MockComponent>
	);
}

function MobileActionItemMock(props: MobileValidationProps.ActionsItemProps) {
	return (
		<MockComponent id={props.id} dataRole={MOBILE_ACTION_ITEM}>
			{props.children}
		</MockComponent>
	);
}

function MobileValidationBarMock(props: MobileValidationProps) {
	return (
		<MockComponent id={props.id} dataRole={MOBILE_VALIDATION_BAR} ref={props.wrapperRef}>
			{props.children}
			{props.headingTitle}
			{props.headingSuffixes}
			{props.footer}
		</MockComponent>
	);
}

function HeaderMock(props: DateTimePickerHeaderProps) {
	return (
		<MockComponent id={props.id} dataRole={DataRoles.DateTimePicker.Header}>
			{props.actionButtons}
			{props.children}
		</MockComponent>
	);
}

function ButtonMock(props: ButtonProps) {
	return (
		<MockComponent
			id={props.id}
			role="button"
			dataRole={BUTTON}
			ref={props.buttonRef}
			onClick={props.onClick}
		>
			{props.label}
			{props.icon}
			{props.children}
		</MockComponent>
	);
}

function QuickAccessButtonMock(props: QuickAccessButtonProps) {
	// Resolving the deprecation would mean that customizing of the buttons via WidgetMap would no longer be possible.
	// eslint-disable-next-line @typescript-eslint/no-deprecated
	const children = props.children;
	return (
		<MockComponent id={props.id} dataRole={QUICK_ACCESS_BUTTON}>
			{props.mainAction}
			{children}
		</MockComponent>
	);
}

function ButtonGroupMock(props: ButtonGroupProps) {
	return (
		<MockComponent id={props.id} dataRole={BUTTON_GROUP}>
			{props.children}
		</MockComponent>
	);
}

function ButtonGroupContainerMock(props: ButtonGroupContainerProps) {
	const buttons = [
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		...(props.leftSlot ?? []),
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		...(props.rightSlot ?? [])
	];

	return (
		<MockComponent id={props.id} dataRole={BUTTON_GROUP_CONTAINER}>
			{buttons}
			{props.children}
		</MockComponent>
	);
}

function IconMock(props: WithDataTestId<IconProps>) {
	return (
		<MockComponent
			id={props.id}
			dataRole={ICON}
			data-icon-theme={props.iconTheme}
			dataTestId={props["data-testid"]}
		>
			{props.children}
		</MockComponent>
	);
}

function ModalNotificationMock(props: ModalNotificationProps) {
	return (
		<MockComponent id={props.id} dataRole={MODAL_OVERLAY}>
			{props.title}
			<hr />
			{props.children}
			<hr />
			{props.footer}
		</MockComponent>
	);
}

function ModalOverlayMock(props: ModalOverlayProps) {
	return (
		<MockComponent id={props.id} dataRole={MODAL_OVERLAY}>
			{props.children}
		</MockComponent>
	);
}

function PopUpMenuMock(props: PopUpMenuProps) {
	return (
		<MockComponent id={props.id} dataRole={POPUP_MENU}>
			{props.triggerElement}
			{props.children}
		</MockComponent>
	);
}

function AttachedPortalMock(props: AttachedPortalProps) {
	return (
		<MockComponent id={props.id} dataRole={ATTACHED_PORTAL}>
			{props.children}
		</MockComponent>
	);
}

function ResponsiveImageContainerMock(props: ResponsiveImageContainerProps) {
	return <MockComponent id={props.id} dataRole={RESPONSIVE_IMAGE_CONTAINER} />;
}

function ListMock(props: ListProps) {
	return (
		<MockComponent id={props.id} dataRole={LIST}>
			{props.children}
		</MockComponent>
	);
}

function ListSubHeaderMock(props: ListSubHeaderProps) {
	return (
		<MockComponent id={props.id} dataRole={LIST_SUBHEADER}>
			{props.children}
		</MockComponent>
	);
}

function ListItemMock(props: ListItemProps) {
	return (
		<MockComponent id={props.id} dataRole={LIST_ITEM}>
			<div data-role={LIST_ITEM_CONTENT} title={props.title}>
				{props.text && <div data-role={LIST_ITEM_TEXT}>{props.text}</div>}
				{props.graphic}
			</div>
		</MockComponent>
	);
}

function BulletListUnorderedMock(props: BulletListProps.UnorderedProps) {
	return (
		<MockComponent id={props.id} dataRole={BULLET_LIST_UNORDERED}>
			{props.children}
		</MockComponent>
	);
}

function BulletListItemMock(props: BulletListProps.ItemProps) {
	return (
		<MockComponent id={props.id} dataRole={BULLET_LIST_ITEM}>
			{props.children}
		</MockComponent>
	);
}

function FlyoutMenuMock(props: FlyoutMenuProps) {
	const menuItems = props.items.filter(isLeafMenuItem);

	return (
		<MockComponent id={props.id} dataRole={FLYOUT_MENU}>
			{menuItems.map((mi, i) => (
				<MenuItemMock key={i} {...mi} />
			))}
		</MockComponent>
	);
}

function isLeafMenuItem(item: MenuItemType): item is MenuItemMock {
	return !isMenuGroup(item);
}

function MenuItemMock(props: MenuItemMock) {
	return <ButtonMock id={props.id} icon={props.icon} label={props.label} />;
}

function TextOutputMock(props: TextOutputProps) {
	return (
		<MockComponent id={props.id} dataRole={TEXT_OUTPUT}>
			{props.label}
			{props.children}
		</MockComponent>
	);
}

function BreadcrumbMock(props: BreadcrumbProps) {
	return (
		<MockComponent id={props.id} dataRole={BREADCRUMB}>
			{props.children}
		</MockComponent>
	);
}

function BreadcrumbItemMock(props: BreadcrumbProps.ItemProps) {
	return (
		<MockComponent id={props.id} dataRole={BREADCRUMB_ITEM}>
			{props.children}
		</MockComponent>
	);
}

function ClearfixMock(props: ClearfixProps) {
	return (
		<MockComponent id={props.id} dataRole={CLEARFIX}>
			{props.children}
		</MockComponent>
	);
}

function HiddenTextMock(props: HiddenTextProps) {
	return (
		<MockComponent id={props.id} dataRole={HIDDEN_TEXT}>
			{props.children}
		</MockComponent>
	);
}

function CssEllipsisMock(props: CssEllipsisProps) {
	return (
		<MockComponent id={props.id} dataRole={CSS_ELLIPSIS}>
			{props.children}
		</MockComponent>
	);
}

// is rendered inside of <p> -> no div allowed
function CounterMock(props: CounterProps) {
	return <span id={props.id} data-role={COUNTER} />;
}
