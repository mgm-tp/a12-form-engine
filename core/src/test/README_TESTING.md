TODO: Generalize into dev README, add "make sure that all tests run with or without mocks"

# General guidelines
* Do not re-invent the wheel!:
	- Check already written test code and adapt the approach. We do not want to have 10 middleware tests which all have another approach.
	- Check various "utils.ts" if there are utility functions which can help you
* When asserting parts which touch localization, always test that the parts get localized correctly with the default localizer and that the localization function is called with the LocalizerService from the config.
Examples:
	- getLabel in controls
	- Validation messages: localization and formatting 


# Assertions

Do not introduce new assertion libraries as dependencies!
The builtin [assertion api](https://nodejs.org/api/assert.html#strict-assertion-mode) from `node:assert/strict` should be used everywhere.

Make sure to use the "strict" version of the assert api and its specific, named exports (linting rule exists to check this).
Prefer asserting against known values (`equal(value, "something")` instead of `notEqual(value, "not this")`) if possible.

Don't use deepEqual on ReactNode - it can lead to infinite loops.


# Mocks

Do not introduce new mocking libraries as dependencies!
The builtin [mock api](https://nodejs.org/api/test.html#class-mocktracker) from `node:test` should be used for everything.

* Use `mock.fn()` for simple stubs
* Use `mock.fn(<implementation here>)` if the stub should actually do something
* Avoid using `mock.method(object, method)` to spy on existing functions (and change their behavior). Instead, try to adapt the code under test so that the spy can be passed into it, e.g. using a higher order function or react context.
* In general, check existing tests for specific usage.

NOTE: Mocks should always be set up inside the test (it) or a `beforeEach()` hook. This is because all created mocks are always cleared in a global `afterEach` hook (to prevent memory leaks).
Because of this, manually restoring/resetting a specific stub/spy is not necessary.


# Middlewares

## Things to test
* Reacts to the correct Event-Action(s)
* Dispatches the correct Command-Action (type, payload and amount!)


## Guidelines
* Write test based on approach of "clearFiltersMiddleware"
* If you need to assert more than one Command-Action from different types try not to dependent on the order. Filter the dispatched actions by the type you expect:
```
import { deepStrictEqual } from "node:assert/strict";

const action = dispatchedActions.find(a => a.type === expectedAction.type)
deepStrictEqual(action, expectedAction);
```


# Reducers

* Always test the "createCombinedReducer" function and not the sub-functions alone, to assure that the whole reducer component is working.



# Views

## What to test
* Default rendering: all props are set correctly based on the model, configuration, and state
* Default behavior: callback functions (e.g. onValueSubmit, onValueChange etc.) are calling the correct function from the dispatch configuration.
* Test that label is set correctly:
	- Test that for a component the label is correctly localized, use the default localizer for this
	- Test that the "getLabel" function is called with the localizer from the Config
* Test the visibility of elements (dependent field, dependent control, empty)
* Test that the component from the form-model map is used

## How to test
Testing simple props (strings, booleans, ...):
	- Use the corresponding mock from the WidgetMap or ComponentMap and check the props on this mock. You can filter the mock calls by id or data-testid if necessary.

Testing that ReactElements were handed to a specific property:
	- Use the corresponding mock from the WidgetMap or ComponentMap and check the props on this mock. The type of the ReactElement can be retrieved via getReactElementName() and the props can be accessed via element.props.

Testing the nesting of components and whether components are not rendered anymore:
	- Look for the component in the DOM by querying it on the render result baseElement (by data role, id or data-testid)

Interactions via callbacks:
	- Get the callbacks from the mocked components (as you would for any other prop) and directly call them.

Interactions via DOM events (e.g. blur/focus):
	- Look for the corresponding component in the DOM (by data role, id or data-testid) and trigger the DOM event with fireEvent().
		- Make sure that your mocks correctly handle the events. In some cases it might be necessary to render real widgets here, but we should try to avoid this if possible.

Testing the order of components in the DOM:
	- Look for the components you want to compare and call Node.compareDocumentPosition. Have a look at https://developer.mozilla.org/de/docs/Web/API/Node/compareDocumentPosition for more details.

General guidelines and tips:
	- Avoid using Widgets wherever possible.
	- Consider using RenderGroupFixture when multiple tests use the same render output - especially when using real Widgets.
	- Do not define big objects outside of it() statements. They are allocated upfront and kept in-memory! Mitigations:
		- define them inside of the it()
		- create functions, that return the corresponding values
		- use lazy init fixtures
	- Always use within() from rtl-extension instead of importing it from RTL directly.
	- Always use rtlRenderWrapper (or rtlRenderWrapperWithWidgets) instead of using render() directly.
	- A data-testid can be set when we need additional information at any component to identify it in a test. The id should follow
	the format "parentId-elementName" to identify it uniquely in the DOM.
	- Whenever a child component of some other component should be tested, it needs to be returned by its "parent" mock. Otherwise, the component will not be called.
	- Add your own mocks inside your test if you need some special behavior in a test. If this behavior is generally needed in a lot of tests, you can also extend the default mocks.
	- If Widgets behavior is tested, check whether we should really test this behavior.
		- If yes, then there should be some property on an ancestor that we can test instead.
