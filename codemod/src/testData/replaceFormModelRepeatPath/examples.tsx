namespace Events {
	export namespace Attachments {
		export interface UploadAttachmentsPayload {
			formModelElementPath: string;
		}
	}
}

// Test case 1: Variable Declaration -------------------------------------------
const shouldBeChanged: Events.Attachments.UploadAttachmentsPayload = {
	formModelRepeatPath: "/some/path"
};

// Test case 2: Destructuring from UploadAttachmentsPayload ------------------------------------------------------------
const { formModelRepeatPath: someName } = shouldBeChanged;

// Test case 3: Function parameter destructuring from UploadAttachmentsPayload type ------------------------------------
function handlePayloadDestructure({
	formModelRepeatPath
}: Events.Attachments.UploadAttachmentsPayload) {
	return formModelRepeatPath;
}

// Test case 4: Function with return type of UploadAttachmentsPayload --------------------------------------------------
function createPayload(): Events.Attachments.UploadAttachmentsPayload {
	return { formModelRepeatPath: "/method/path" };
}

// Test case 5: Type alias that references UploadAttachmentsPayload (fallback type check) -------------------------
type PayloadAlias = Events.Attachments.UploadAttachmentsPayload;
const aliasedPayload: PayloadAlias = {
	formModelRepeatPath: "/alias/path"
};

// Test case 6: Union types containing UploadAttachmentsPayload (fallback type check) -----------------------------
type MaybePayload = Events.Attachments.UploadAttachmentsPayload | null;
const unionPayload: MaybePayload = {
	formModelRepeatPath: "/union/path"
};

// Test case 7: Intersection types with UploadAttachmentsPayload (fallback type check) ----------------------------
interface ExtraProperties {
	extraProperty: string;
}
type ExtendedPayload = Events.Attachments.UploadAttachmentsPayload & ExtraProperties;
// Should be changed
const intersectionPayload: ExtendedPayload = {
	formModelRepeatPath: "/intersection/path",
	extraProperty: "extra"
};

// Test case 8: Generic types with UploadAttachmentsPayload (fallback type check) ---------------------------------
type Container<T> = {
	data: T;
};
type GenericPayload = Container<Events.Attachments.UploadAttachmentsPayload>;
function processGeneric(container: GenericPayload) {
	return container.data.formModelRepeatPath;
}

// Test case 9: Conditional types with UploadAttachmentsPayload (fallback type check) -----------------------------
type ConditionalType<T> = T extends Events.Attachments.UploadAttachmentsPayload ? T : never;

const conditionalPayload: ConditionalType<Events.Attachments.UploadAttachmentsPayload> = {
	formModelRepeatPath: "/conditional/path"
};
function useConditional(payload: ConditionalType<Events.Attachments.UploadAttachmentsPayload>) {
	return payload.formModelRepeatPath;
}
const { formModelRepeatPath: conditionalPath } = conditionalPayload;

// Test case 10: Property Access Expression (obj.property) --------------------------------------------------------
const payloadVar10: Events.Attachments.UploadAttachmentsPayload = {
	formModelRepeatPath: "/test/path"
};
const accessPath1 = payloadVar10.formModelRepeatPath;

// Test case 11: Element Access Expression (obj['property']) -------------------------------------------------------
const bracketPath1 = payloadVar10["formModelRepeatPath"];

// Test case 12: Shorthand Property Assignment in Object Literals --------------------------------------------------
const existingPath = "/existing/path";
const newPayload1: Events.Attachments.UploadAttachmentsPayload = {
	formModelRepeatPath: existingPath
};

// Test case 13: 'in' Operator for Property Existence Checks -------------------------------------------------------
const hasProperty1 = "formModelRepeatPath" in payloadVar10;
const hasProperty2 = "formModelRepeatPath" in payloadVar10;

// Test case 15: Class Members ---------------------------------------------------------------------------------

// Class implementing target interface
class PayloadHandlerWithProperty implements Events.Attachments.UploadAttachmentsPayload {
	// Should be changed - property in class implementing target interface
	public formModelRepeatPath: string = "/class/path";

	getPath(): string {
		return this.formModelRepeatPath;
	}
}

// Class implementing target interface with getter/setter
class PayloadHandlerWithAccessor implements Events.Attachments.UploadAttachmentsPayload {
	private _formModelRepeatPath: string = "/class/path";

	// Should be changed - getter implementing interface property
	get formModelRepeatPath(): string {
		return this._formModelRepeatPath;
	}

	// Should be changed - setter implementing interface property
	set formModelRepeatPath(value: string) {
		this._formModelRepeatPath = value;
	}
}

// Test case 17: Computed Property Names -----------------------------------------------------------------------
const computedPayload1: Events.Attachments.UploadAttachmentsPayload = {
	["formModelRepeatPath"]: "/computed/path"
};
const computedPayload2: Events.Attachments.UploadAttachmentsPayload = {
	["formModelRepeatPath"]: "/computed/path"
};

// Test case 18: Complex Destructuring Patterns ----------------------------------------------------------------

const complexPayload: Events.Attachments.UploadAttachmentsPayload = {
	formModelRepeatPath: "/complex/path"
};
const { formModelRepeatPath: extractedPath } = complexPayload;
function processPayload({ formModelRepeatPath }: Events.Attachments.UploadAttachmentsPayload) {
	return formModelRepeatPath.toUpperCase();
}
function processPayloadWithRename({
	formModelRepeatPath: customPath
}: Events.Attachments.UploadAttachmentsPayload) {
	return customPath.toLowerCase();
}

// Test case 19: Array and Object Method Calls -----------------------------------------------------------------
const payloads: Events.Attachments.UploadAttachmentsPayload[] = [
	{ formModelRepeatPath: "/array1" }
];

// Test case 20: Optional Chaining -----------------------------------------------------------------------------
const maybePayload: Events.Attachments.UploadAttachmentsPayload | undefined = (
	[] as Events.Attachments.UploadAttachmentsPayload[]
).find(elem => elem.formModelRepeatPath === "mock");
const safePath1 = maybePayload?.formModelRepeatPath;
const safePath2 = maybePayload?.["formModelRepeatPath"];

// Test case 21: Runtime Checks ---------------------------------------------------------------
const hasTargetProperty = "formModelRepeatPath" in payloadVar10;

// Test case 22: Generic Functions and Constraints -------------------------------------------------------------
function processTypedPayload<T extends Events.Attachments.UploadAttachmentsPayload>(
	payload: T
): string {
	return payload.formModelRepeatPath;
}

// Test case 23: Spread Operators and Rest Parameters ----------------------------------------------------------
const basePayload: Events.Attachments.UploadAttachmentsPayload = {
	formModelRepeatPath: "/base/path"
};
const extendedPayload1: Events.Attachments.UploadAttachmentsPayload = {
	...basePayload,
	formModelRepeatPath: "/extended/path" // override
};

// Test case 24: JSX Components and Attributes -------------------------------------------------------------

// Component that expects UploadAttachmentsPayload as props
interface ComponentProps extends Events.Attachments.UploadAttachmentsPayload {
	extraProp?: string;
}

function TestComponent(props: ComponentProps): JSX.Element {
	return <div>{props.formModelRepeatPath}</div>;
}

// JSX with direct attribute
const jsxElement1 = <TestComponent formModelRepeatPath="/jsx/path" extraProp="test" />;

// JSX with dynamic attribute
const dynamicPath = "/dynamic/path";
const jsxElement3 = <TestComponent formModelRepeatPath={dynamicPath} />;

// JSX with computed property access
const jsxElement4 = <TestComponent formModelRepeatPath={basePayload.formModelRepeatPath} />;

// JSX with destructured props
function AnotherComponent({ formModelRepeatPath, ...rest }: ComponentProps): JSX.Element {
	return <div data-path={formModelRepeatPath} {...rest}></div>;
}

// Test case 25: Should replace all references
function complexTest() {
	const data: Events.Attachments.UploadAttachmentsPayload = { formModelRepeatPath };
	const { formModelRepeatPath } = data;

	// These should all reference the same symbol and be renamed together
	console.log(formModelRepeatPath);
	const result = formModelRepeatPath.substring(0, 5);
	return { path: formModelRepeatPath, length: formModelRepeatPath.length };
}
