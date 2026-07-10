import { FormModel } from "@com.mgmtp.a12.formengine/formengine-core";

declare const model: unknown;
declare const element: unknown;
declare const cell: unknown;
declare const button: unknown;
declare const elements: unknown[];

// Simple isInstance calls
if (FormModel.isInstance(model)) {
	console.log("is form model");
}

if (FormModel.Content.isInstance(element)) {
	console.log("is content");
}

if (FormModel.Screen.isInstance(element)) {
	console.log("is screen");
}

if (FormModel.ScreenElement.isInstance(element)) {
	console.log("is screen element");
}

if (FormModel.Section.isInstance(element)) {
	console.log("is section");
}

if (FormModel.MultiColumnSection.isInstance(element)) {
	console.log("is multi column section");
}

if (FormModel.ControlGrid.isInstance(element)) {
	console.log("is control grid");
}

if (FormModel.Row.isInstance(element)) {
	console.log("is row");
}

if (FormModel.Control.isInstance(cell)) {
	console.log("is control");
}

if (FormModel.TextCell.isInstance(cell)) {
	console.log("is text cell");
}

if (FormModel.ExpressionCell.isInstance(cell)) {
	console.log("is expression cell");
}

if (FormModel.CustomCell.isInstance(cell)) {
	console.log("is custom cell");
}

if (FormModel.ButtonPanel.isInstance(element)) {
	console.log("is button panel");
}

if (FormModel.ButtonType.isInstance(button)) {
	console.log("is button type");
}

// ButtonType special methods
if (FormModel.ButtonType.isNavigationButton(button)) {
	console.log("is navigation button");
}

if (FormModel.ButtonType.isEventButton(button)) {
	console.log("is event button");
}

// More isInstance calls
if (FormModel.InlineRepeat.isInstance(element)) {
	console.log("is inline repeat");
}

if (FormModel.EmbeddedRepeat.isInstance(element)) {
	console.log("is embedded repeat");
}

if (FormModel.CustomScreenElement.isInstance(element)) {
	console.log("is custom screen element");
}

if (FormModel.HeaderFooterType.isInstance(element)) {
	console.log("is header footer type");
}

if (FormModel.ExpressionOverviewColumn.isInstance(element)) {
	console.log("is expression overview column");
}

if (FormModel.FieldBasedInputType.isInstance(cell)) {
	console.log("is field based input type");
}

if (FormModel.TitledComponent.isInstance(element)) {
	console.log("is titled component");
}

if (FormModel.LabeledComponent.isInstance(element)) {
	console.log("is labeled component");
}

if (FormModel.ComponentWithDescription.isInstance(element)) {
	console.log("is component with description");
}

// Additional isInstance calls
if (FormModel.RowAction.isInstance(element)) {
	console.log("is row action");
}

if (FormModel.Repeat.isInstance(element)) {
	console.log("is repeat");
}

if (FormModel.DetachedRepeat.isInstance(element)) {
	console.log("is detached repeat");
}

if (FormModel.RepeatOverviewColumn.isInstance(element)) {
	console.log("is repeat overview column");
}

if (FormModel.FieldOverviewColumn.isInstance(element)) {
	console.log("is field overview column");
}

// With ignoreRuntimeProperties parameter
if (FormModel.isInstance(model, true)) {
	console.log("is form model ignoring runtime");
}

if (FormModel.Content.isInstance(element, true)) {
	console.log("is content ignoring runtime");
}

// isInstance used as callback reference (not direct call)
const foundRepeat = elements.find(FormModel.DetachedRepeat.isInstance);
const foundSection = elements.filter(FormModel.Section.isInstance);
const hasScreen = elements.some(FormModel.Screen.isInstance);
