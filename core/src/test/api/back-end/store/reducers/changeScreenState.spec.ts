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

import { deepStrictEqual } from "node:assert/strict";

import type { Action, Store } from "redux";

import { Commands, UiStateSelectors } from "../../../../../back-end/store/index.js";
import type { EngineState, EngineStore } from "../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { createTestStore } from "../../../../utils/setup.js";

describe("api.back-end.store.reducers", () => {
	const firstScreen: EngineStore.ScreenState = {
		locationPath: createModelPath("My", "First", "Location", "Path"),
		path: []
	};

	const secondScreen: EngineStore.ScreenState = {
		locationPath: createModelPath("My", "Second", "Location", "Path"),
		path: []
	};

	const thirdScreen: EngineStore.ScreenState = {
		locationPath: createModelPath("My", "Third", "Location", "Path"),
		path: []
	};

	describe("changeScreenState", () => {
		function setup(
			screenToChange: EngineStore.ScreenState
		): Store<EngineState, Action> & { readonly dispatch: unknown } {
			const storeConfig = {
				data: { dirty: false, document: {} },
				ui: {
					screenLocation: [firstScreen, secondScreen, screenToChange, thirdScreen]
				}
			};

			return createTestStore({ storeConfig });
		}

		describe("given the index of the screen to change", () => {
			const focusedComponentPath = createModelPath("My", "Focused", "Component");
			describe("and a focusedComponent given in the payload", () => {
				it("sets the focusedComponent for this screen using the one from the payload", () => {
					const screenToChange: EngineStore.ScreenState = {
						locationPath: createModelPath("My", "Screen", "Location", "Path"),
						path: []
					};

					const store = setup(screenToChange);

					const myFocusedComponent: EngineStore.FocusedComponent = {
						formModelPath: focusedComponentPath
					};
					store.dispatch(
						Commands.changeScreenState({
							index: 2,
							focusedComponent: myFocusedComponent
						})
					);

					const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
					deepStrictEqual(actualScreen.focusedComponent, myFocusedComponent);
				});

				describe("if no focusedComponentRequestCount is set yet", () => {
					it("sets the focusedComponentRequestCount to 1", () => {
						const screenToChange: EngineStore.ScreenState = {
							locationPath: createModelPath("My", "Screen", "Location", "Path"),
							path: [],
							focusedComponentRequestCount: undefined
						};

						const store = setup(screenToChange);

						const myFocusedComponent: EngineStore.FocusedComponent = {
							formModelPath: focusedComponentPath
						};
						store.dispatch(
							Commands.changeScreenState({ index: 2, focusedComponent: myFocusedComponent })
						);

						const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
						deepStrictEqual(actualScreen.focusedComponentRequestCount, 1);
					});
				});

				describe("if a focusedComponentRequestCount is already set", () => {
					it("increases the focusedComponentRequestCount by one", () => {
						const screenToChange: EngineStore.ScreenState = {
							locationPath: createModelPath("My", "Screen", "Location", "Path"),
							path: [],
							focusedComponentRequestCount: 5
						};

						const store = setup(screenToChange);

						const myFocusedComponent: EngineStore.FocusedComponent = {
							formModelPath: focusedComponentPath
						};
						store.dispatch(
							Commands.changeScreenState({ index: 2, focusedComponent: myFocusedComponent })
						);

						const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
						deepStrictEqual(actualScreen.focusedComponentRequestCount, 6);
					});
				});
			});

			describe("and  no focusedComponent given in the payload", () => {
				it("keeps the focusedComponent from the screen", () => {
					const myFocusedComponent: EngineStore.FocusedComponent = {
						formModelPath: focusedComponentPath
					};
					const screenToChange: EngineStore.ScreenState = {
						locationPath: createModelPath("My", "Screen", "Location", "Path"),
						path: [],
						focusedComponent: myFocusedComponent
					};

					const store = setup(screenToChange);

					store.dispatch(Commands.changeScreenState({ index: 2 }));

					const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
					deepStrictEqual(actualScreen.focusedComponent, myFocusedComponent);
				});

				it("does not increase the focusedComponentRequestCount", () => {
					const myFocusedComponent: EngineStore.FocusedComponent = {
						formModelPath: focusedComponentPath
					};
					const screenToChange: EngineStore.ScreenState = {
						locationPath: createModelPath("My", "Screen", "Location", "Path"),
						path: [],
						focusedComponent: myFocusedComponent,
						focusedComponentRequestCount: 5
					};

					const store = setup(screenToChange);
					store.dispatch(Commands.changeScreenState({ index: 2 }));

					const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
					deepStrictEqual(actualScreen.focusedComponentRequestCount, 5);
				});
			});

			describe("and a locationPath given in the payload", () => {
				it("sets the locationPath  using the one from the payload", () => {
					const screenToChange: EngineStore.ScreenState = {
						locationPath: createModelPath("My", "Screen", "Location", "Path"),
						path: []
					};

					const myLocationPath = createModelPath("My", "New", "Location", "Path");

					const store = setup(screenToChange);
					store.dispatch(Commands.changeScreenState({ index: 2, locationPath: myLocationPath }));

					const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
					deepStrictEqual(actualScreen.locationPath, myLocationPath);
				});
			});

			describe("and no locationPath given in the payload", () => {
				it("keeps the locationPath from screen", () => {
					const myLocationPath = createModelPath("My", "Screen", "Location", "Path");

					const screenToChange: EngineStore.ScreenState = {
						locationPath: myLocationPath,
						path: []
					};

					const store = setup(screenToChange);
					store.dispatch(Commands.changeScreenState({ index: 2 }));

					const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
					deepStrictEqual(actualScreen.locationPath, myLocationPath);
				});
			});

			describe("and a path given in the payload", () => {
				it("sets the path for the screen using the one from the payload", () => {
					const screenToChange: EngineStore.ScreenState = {
						locationPath: createModelPath("My", "Screen", "Location", "Path"),
						path: []
					};

					const myPath = createDocumentPath(["My"], ["Document"], ["Path"]);

					const store = setup(screenToChange);
					store.dispatch(Commands.changeScreenState({ index: 2, path: myPath }));

					const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
					deepStrictEqual(actualScreen.path, myPath);
				});
			});

			describe("and no path given in the payload", () => {
				it("keeps the path from the screen", () => {
					const myPath = createDocumentPath(["My"], ["Document"], ["Path"]);

					const screenToChange: EngineStore.ScreenState = {
						locationPath: createModelPath("My", "Screen", "Location", "Path"),
						path: myPath
					};

					const store = setup(screenToChange);
					store.dispatch(Commands.changeScreenState({ index: 2 }));

					const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
					deepStrictEqual(actualScreen.path, myPath);
				});
			});

			describe("and a repeatState given in the payload", () => {
				it("sets the repeatState for the screen using the one from the payload", () => {
					const screenToChange: EngineStore.ScreenState = {
						locationPath: createModelPath("My", "Screen", "Location", "Path"),
						path: []
					};

					const myRepeatState: ReadonlyObjectMap<EngineStore.Repeat.Entry> = {
						repeat1: { page: 2 }
					};

					const store = setup(screenToChange);
					store.dispatch(Commands.changeScreenState({ index: 2, repeatState: myRepeatState }));

					const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
					deepStrictEqual(actualScreen.repeatInstanceState, myRepeatState);
				});
			});

			describe("and no repeatState given in the payload", () => {
				it("keeps the repeatState from the screen", () => {
					const myRepeatState: ReadonlyObjectMap<EngineStore.Repeat.Entry> = {
						repeat1: { page: 2 }
					};

					const screenToChange: EngineStore.ScreenState = {
						locationPath: createModelPath("My", "Screen", "Location", "Path"),
						path: [],
						repeatInstanceState: myRepeatState
					};

					const store = setup(screenToChange);
					store.dispatch(Commands.changeScreenState({ index: 2 }));

					const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
					deepStrictEqual(actualScreen.repeatInstanceState, myRepeatState);
				});
			});

			describe("and a dirty state given in the payload", () => {
				it("sets the dirty state for the screen using the one from the payload", () => {
					const screenToChange: EngineStore.ScreenState = {
						locationPath: createModelPath("My", "Screen", "Location", "Path"),
						path: []
					};

					const store = setup(screenToChange);
					store.dispatch(Commands.changeScreenState({ index: 2, dirty: true }));

					const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
					deepStrictEqual(actualScreen.dirty, true);
				});
			});

			describe("and no dirty state given in the payload", () => {
				it("keeps the dirty state from the screen", () => {
					const screenToChange: EngineStore.ScreenState = {
						locationPath: createModelPath("My", "Screen", "Location", "Path"),
						path: [],
						dirty: true
					};

					const store = setup(screenToChange);
					store.dispatch(Commands.changeScreenState({ index: 2 }));

					const actualScreen = UiStateSelectors.screenLocationStack()(store.getState())[2];
					deepStrictEqual(actualScreen.dirty, true);
				});
			});

			it("keeps the screens in order", () => {
				const screenToChange: EngineStore.ScreenState = {
					locationPath: createModelPath("My", "Screen", "Location", "Path"),
					path: []
				};
				const myFocusedComponent: EngineStore.FocusedComponent = {
					formModelPath: createModelPath("FocusComponent")
				};
				const store = setup(screenToChange);
				store.dispatch(
					Commands.changeScreenState({
						index: 2,
						focusedComponent: myFocusedComponent,
						locationPath: [],
						path: [],
						repeatState: {}
					})
				);

				const screens = UiStateSelectors.screenLocationStack()(store.getState());
				deepStrictEqual(
					screens[0].locationPath,
					firstScreen.locationPath,
					"Wrong location path for screen 1"
				);
				deepStrictEqual(
					screens[1].locationPath,
					secondScreen.locationPath,
					"Wrong location path for screen 2"
				);
				deepStrictEqual(screens[2].locationPath, [], "Wrong location path for the changed screen");
				deepStrictEqual(
					screens[3].locationPath,
					thirdScreen.locationPath,
					"Wrong location path for screen 3"
				);
			});
		});
	});
});
