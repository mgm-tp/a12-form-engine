import type { ComponentType } from "react";

interface WidgetMap {
	readonly Header: ComponentType<unknown>;
	readonly TextLineStateless: ComponentType<unknown>;
	readonly MultiSelect: ComponentType<unknown>;
	readonly SizeContainer: ComponentType<unknown>;
	readonly SizeContainerRow: ComponentType<unknown>;
	readonly SizeContainerColumn: ComponentType<unknown>;
	readonly NotificationArea: ComponentType<unknown>;
	readonly MobileValidationBar: ComponentType<unknown>;
	readonly MobileValidationBarOverview: ComponentType<unknown>;
	readonly MobileValidationBarGraphic: ComponentType<unknown>;
	readonly MobilePreviewList: ComponentType<unknown>;
	readonly MobilePreviewListIem: ComponentType<unknown>;
	readonly MobileAction: ComponentType<unknown>;
	readonly MobileActionItem: ComponentType<unknown>;
	readonly Button: ComponentType<unknown>;
}

declare const widgetMap: WidgetMap;

// Test case 1: Property access -----------------------------------------------
function test1() {
	const textField = widgetMap.TextLineStateless;
	const header = widgetMap.Header;
	const grid = widgetMap.SizeContainer;
	const notification = widgetMap.NotificationArea;
	const multi = widgetMap.MultiSelect;
	const validationBar = widgetMap.MobileValidationBar;
	const overview = widgetMap.MobileValidationBarOverview;
	const graphic = widgetMap.MobileValidationBarGraphic;
	const previewList = widgetMap.MobilePreviewList;
	const previewListIem = widgetMap.MobilePreviewListIem;
	const action = widgetMap.MobileAction;
	const actionItem = widgetMap.MobileActionItem;
	return {
		textField,
		header,
		grid,
		notification,
		multi,
		validationBar,
		overview,
		graphic,
		previewList,
		previewListIem,
		action,
		actionItem
	};
}

// Test case 2: Element access ------------------------------------------------
function test2() {
	const byString = widgetMap["TextLineStateless"];
	return byString;
}

// Test case 3: Destructuring (shorthand) -------------------------------------
function test3() {
	const { TextLineStateless, SizeContainer, SizeContainerRow } = widgetMap;
	return { TextLineStateless, SizeContainer, SizeContainerRow };
}

// Test case 4: Destructuring (aliased) ---------------------------------------
function test4() {
	const { Header: CustomHeader, MultiSelect: CustomMulti } = widgetMap;
	return { CustomHeader, CustomMulti };
}

// Test case 5: Property assignment in Partial<WidgetMap> ---------------------
function test5() {
	const override: Partial<WidgetMap> = {
		TextLineStateless: () => null,
		Header: () => null,
		SizeContainer: () => null,
		NotificationArea: () => null,
		MobileValidationBar: () => null,
		MobileAction: () => null,
		MobilePreviewListIem: () => null
	};
	return override;
}

// Test case 6: Shorthand property assignment ---------------------------------
declare const Header2: ComponentType<unknown>;
declare const TextLineStateless2: ComponentType<unknown>;
function test6() {
	const shortOverride: Partial<WidgetMap> = {
		Header: Header2,
		TextLineStateless: TextLineStateless2
	};
	return shortOverride;
}

// Test case 7: JSX usage — dot-access and destructured components ------------
const JsxDotAccess = () => (
	<widgetMap.Header>
		<widgetMap.TextLineStateless />
	</widgetMap.Header>
);

function test7() {
	const { Header, TextLineStateless } = widgetMap;
	return () => (
		<Header>
			<TextLineStateless />
		</Header>
	);
}

// Test case 8: Same names on an unrelated type — must NOT change -------------
interface UnrelatedShape {
	readonly Header: string;
	readonly TextLineStateless: string;
	readonly MultiSelect: number;
	readonly SizeContainer: boolean;
}

function test8() {
	const unrelated: UnrelatedShape = {
		Header: "keep-me",
		TextLineStateless: "keep-me",
		MultiSelect: 42,
		SizeContainer: true
	};

	const keepHeader = unrelated.Header;
	const keepTextLineStateless = unrelated["TextLineStateless"];
	const { MultiSelect: keepMulti, SizeContainer: keepGrid } = unrelated;
	return { keepHeader, keepTextLineStateless, keepMulti, keepGrid };
}
