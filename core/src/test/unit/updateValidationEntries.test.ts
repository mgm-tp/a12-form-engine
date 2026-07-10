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

import { IMetaKeys } from "@com.mgmtp.a12.kernel/kernel-core-runtime-api-ts/a12internal";

import type { EngineStore } from "../../back-end/store/index.js";
import { updateValidationEntries } from "../../back-end/store/internal/validation.js";
import type { ReadonlyObjectMap } from "../../models/index.js";
import { DocumentPath } from "../../models/internal/utils/document-utils.js";

import { createDocumentPath } from "../utils/createDocumentPath.js";
import { setupArrayFixture, setupFixture } from "../utils/setupFixture.js";
import { createParsingError, createValidationMessage } from "../utils/validation.js";
import { getValidatorProvider } from "../utils/validatorProvider.js";

const fieldA = createDocumentPath(["root"], ["group"], ["fieldA"]);
const fieldB = createDocumentPath(["root"], ["group"], ["fieldB"]);
const fieldC = createDocumentPath(["root"], ["group"], ["fieldC"]);
const fieldD = createDocumentPath(["root"], ["group"], ["fieldD"]);
const fieldE = createDocumentPath(["root"], ["group"], ["fieldE"]);

const validationMessageA = createValidationMessage({
	path: fieldA,
	errorCode: "errorA",
	errorKey: "keyA",
	errorText: [{ key: "foo", defaults: { en: "textA" } }]
});
const validationMessageB = createValidationMessage({
	path: fieldB,
	errorCode: "errorB",
	errorKey: "keyB",
	errorText: [{ key: "foo", defaults: { en: "textB" } }]
});
const validationMessageC = createValidationMessage({
	path: fieldC,
	errorCode: "errorC",
	errorKey: "keyC",
	errorText: [{ key: "foo", defaults: { en: "textC" } }]
});
const validationMessageD = createValidationMessage({
	path: fieldD,
	errorCode: "errorD",
	errorKey: "keyD",
	errorText: [{ key: "foo", defaults: { en: "textD" } }]
});
const validationMessageD2 = createValidationMessage({
	path: fieldD,
	errorCode: "errorD2",
	errorKey: "keyD2",
	errorText: [{ key: "foo", defaults: { en: "textD2" } }]
});

const parsingErrorA = createParsingError(fieldA, "a", "numberContainsIllegalSymbols");

describe("unit.back-end.utils", () => {
	describe("updateValidationEntries", () => {
		describe("type: full", () => {
			describe("given messagesFromStore", () => {
				describe("which do not contain parsing errors", () => {
					const messagesFromStore = setupFixture(() => ({
						[DocumentPath.toString(fieldA)]: {
							validationMessages: [validationMessageA]
						},
						[DocumentPath.toString(fieldB)]: {
							validationMessages: [validationMessageB, validationMessageA]
						}
					}));

					describe("and currentValidationErrors and instances", () => {
						const currentValidationErrors = setupArrayFixture(() => [
							validationMessageC,
							validationMessageD,
							validationMessageD2
						]);
						const expectedMap = setupFixture(() => ({
							[DocumentPath.toString(fieldC)]: {
								validationMessages: [validationMessageC]
							},
							[DocumentPath.toString(fieldD)]: {
								validationMessages: [validationMessageD, validationMessageD2]
							}
						}));
						describe("which contain references to elements for which no validation error exists", () => {
							it("returns a map with the currentValidationErrors", () => {
								const newMap = updateValidationEntries(
									messagesFromStore,
									currentValidationErrors,
									[fieldE],
									getValidatorProvider(),
									"full"
								);
								deepStrictEqual(newMap, expectedMap);
							});
						});

						describe("which contain references to elements for which validation errors exist", () => {
							it("returns a map with the currentValidationErrors", () => {
								const newMap = updateValidationEntries(
									messagesFromStore,
									currentValidationErrors,
									[fieldA],
									getValidatorProvider(),
									"full"
								);
								deepStrictEqual(newMap, expectedMap);
							});
						});
					});

					describe("and empty currentValidationErrors", () => {
						it("returns an empty object map", () => {
							// instances should never matter in full validation
							const instances = [fieldA];
							const newMap = updateValidationEntries(
								messagesFromStore,
								[],
								instances,
								getValidatorProvider(),
								"full"
							);
							deepStrictEqual(newMap, {});
						});
					});
				});

				describe("which do contain parsing errors", () => {
					const messagesFromStore: ReadonlyObjectMap<EngineStore.Validation.Entry> = setupFixture(
						() => ({
							[DocumentPath.toString(fieldA)]: {
								validationMessages: [validationMessageA],
								parseError: parsingErrorA
							},
							[DocumentPath.toString(fieldB)]: {
								validationMessages: [validationMessageB, validationMessageA]
							}
						})
					);

					describe("and currentValidationErrors and instances", () => {
						const currentValidationErrors = setupArrayFixture(() => [
							validationMessageC,
							validationMessageD,
							validationMessageD2
						]);
						const expectedMap = setupFixture(() => ({
							[DocumentPath.toString(fieldA)]: {
								validationMessages: [],
								parseError: parsingErrorA
							},
							[DocumentPath.toString(fieldC)]: {
								validationMessages: [validationMessageC]
							},
							[DocumentPath.toString(fieldD)]: {
								validationMessages: [validationMessageD, validationMessageD2]
							}
						}));

						describe("which contain references to elements for which no validation error exists", () => {
							it("resets all validation errors in messagesFromStore, keeps the parsing errors and adds the currentValidationErrors", () => {
								const newMap = updateValidationEntries(
									messagesFromStore,
									currentValidationErrors,
									[fieldE],
									getValidatorProvider(),
									"full"
								);
								deepStrictEqual(newMap, expectedMap);
							});
						});

						describe("which contain references to elements for which validation errors exist", () => {
							it("returns a map with the currentValidationErrors and the entries from messagesFromStore which contain a parsing error", () => {
								const newMap = updateValidationEntries(
									messagesFromStore,
									currentValidationErrors,
									[fieldA],
									getValidatorProvider(),
									"full"
								);
								deepStrictEqual(newMap, expectedMap);
							});
						});
					});

					describe("and empty currentValidationErrors", () => {
						it("returns the entries from messagesFromStore which contain a parsing error", () => {
							const expectedMap = {
								[DocumentPath.toString(fieldA)]: {
									validationMessages: [],
									parseError: parsingErrorA
								}
							};
							const newMap = updateValidationEntries(
								messagesFromStore,
								[],
								[fieldE],
								getValidatorProvider(),
								"full"
							);
							deepStrictEqual(newMap, expectedMap);
						});
					});
				});
			});

			describe("given an empty map as messagesFromStore", () => {
				describe("and currentValidationErrors", () => {
					it("returns a map with the currentValidationErrors", () => {
						const currentValidationErrors = [
							validationMessageC,
							validationMessageD,
							validationMessageD2
						];
						const expectedMap = {
							[DocumentPath.toString(fieldC)]: {
								validationMessages: [validationMessageC]
							},
							[DocumentPath.toString(fieldD)]: {
								validationMessages: [validationMessageD, validationMessageD2]
							}
						};
						const newMap = updateValidationEntries(
							{},
							currentValidationErrors,
							[fieldA],
							getValidatorProvider(),
							"full"
						);
						deepStrictEqual(newMap, expectedMap);
					});
				});
			});
		});

		describe("type: partial", () => {
			describe("given messagesFromStore", () => {
				describe("which do not contain parsing errors", () => {
					const messagesFromStore = setupFixture(() => ({
						[DocumentPath.toString(fieldA)]: {
							validationMessages: [validationMessageA]
						},
						[DocumentPath.toString(fieldB)]: {
							validationMessages: [validationMessageB, validationMessageA]
						}
					}));

					describe("and currentValidationErrors and instances", () => {
						const currentValidationErrors = setupArrayFixture(() => [
							validationMessageC,
							validationMessageD,
							validationMessageD2
						]);
						describe("which contain references to elements for which no validation error exists", () => {
							function testGlobalField(isGlobal: boolean) {
								const instances = [fieldC, fieldD, fieldE];
								const fieldABMessages = {
									[DocumentPath.toString(fieldA)]: {
										validationMessages: [validationMessageA]
									},
									[DocumentPath.toString(fieldB)]: {
										validationMessages: [validationMessageB, validationMessageA]
									}
								};
								const expectedMap = {
									...(!isGlobal ? fieldABMessages : {}),
									[DocumentPath.toString(fieldC)]: {
										validationMessages: [validationMessageC]
									},
									[DocumentPath.toString(fieldD)]: {
										validationMessages: [validationMessageD, validationMessageD2]
									}
								};

								const newMap = updateValidationEntries(
									messagesFromStore,
									currentValidationErrors,
									instances,
									getValidatorProvider({ key: IMetaKeys.FIELD_GLOBAL, value: isGlobal }),
									"partial"
								);
								deepStrictEqual(newMap, expectedMap);
							}

							describe("for global fields", () => {
								it("adds the currentValidationErrors to the messagesFromStore map", () => {
									testGlobalField(true);
								});
							});

							describe("for non-global fields", () => {
								it("adds the currentValidationErrors to the messagesFromStore map", () => {
									testGlobalField(false);
								});
							});
						});

						describe("which contain references to elements for which validation errors exist", () => {
							function testGlobalField(isGlobal: boolean) {
								const instances = [fieldA, fieldC, fieldD];
								const fieldBMessages = {
									[DocumentPath.toString(fieldB)]: {
										validationMessages: [validationMessageB, validationMessageA]
									}
								};
								const expectedMap = {
									...(!isGlobal ? fieldBMessages : {}),
									[DocumentPath.toString(fieldC)]: {
										validationMessages: [validationMessageC]
									},
									[DocumentPath.toString(fieldD)]: {
										validationMessages: [validationMessageD, validationMessageD2]
									}
								};

								const newMap = updateValidationEntries(
									messagesFromStore,
									currentValidationErrors,
									instances,
									getValidatorProvider({ key: IMetaKeys.FIELD_GLOBAL, value: isGlobal }),
									"partial"
								);
								deepStrictEqual(newMap, expectedMap);
							}

							describe("for global fields", () => {
								it("removes all the referenced messages and adds the currentValidationErrors to the messagesFromStore map", () => {
									testGlobalField(true);
								});
							});

							describe("for non-global fields", () => {
								it("removes all the referenced messages and adds the currentValidationErrors to the messagesFromStore map", () => {
									testGlobalField(false);
								});
							});
						});
					});

					describe("and empty currentValidationErrors and instances", () => {
						describe("which contain references to elements for which bo validation error exists", () => {
							it("returns messagesFromStore map", () => {
								const instances = [fieldE];
								const newMap = updateValidationEntries(
									messagesFromStore,
									[],
									instances,
									getValidatorProvider(),
									"partial"
								);
								deepStrictEqual(newMap, newMap);
							});
						});

						describe("which contain references to elements for which validation errors exist", () => {
							it("removes all the referenced messages", () => {
								const instances = [fieldA];
								const expectedMap = {
									[DocumentPath.toString(fieldB)]: {
										validationMessages: [validationMessageB, validationMessageA]
									}
								};
								const newMap = updateValidationEntries(
									messagesFromStore,
									[],
									instances,
									getValidatorProvider(),
									"partial"
								);
								deepStrictEqual(newMap, expectedMap);
							});
						});
					});
				});

				describe("which do contain parsing errors", () => {
					const messagesFromStore: ReadonlyObjectMap<EngineStore.Validation.Entry> = setupFixture(
						() => ({
							[DocumentPath.toString(fieldA)]: {
								validationMessages: [validationMessageA],
								parseError: parsingErrorA
							},
							[DocumentPath.toString(fieldB)]: {
								validationMessages: [validationMessageB, validationMessageA]
							}
						})
					);

					describe("and currentValidationErrors and instances", () => {
						const currentValidationErrors = setupArrayFixture(() => [
							validationMessageC,
							validationMessageD,
							validationMessageD2
						]);
						describe("which contain references to elements for which no validation error exists", () => {
							it("adds the currentValidationErrors to the messagesFromStore map", () => {
								const instances = [fieldE, fieldD, fieldC];
								const expectedMap = {
									[DocumentPath.toString(fieldA)]: {
										validationMessages: [validationMessageA],
										parseError: parsingErrorA
									},
									[DocumentPath.toString(fieldB)]: {
										validationMessages: [validationMessageB, validationMessageA]
									},
									[DocumentPath.toString(fieldC)]: {
										validationMessages: [validationMessageC]
									},
									[DocumentPath.toString(fieldD)]: {
										validationMessages: [validationMessageD, validationMessageD2]
									}
								};
								const newMap = updateValidationEntries(
									messagesFromStore,
									currentValidationErrors,
									instances,
									getValidatorProvider(),
									"partial"
								);
								deepStrictEqual(newMap, expectedMap);
							});
						});

						describe("which contain references to elements for which validation errors exist", () => {
							it(
								"resets the validation errors for the references elements, but keeps the parsing errors and " +
									"adds the currentValidationErrors to the messagesFromStore map",
								() => {
									const instances = [fieldA, fieldC, fieldD];
									const expectedMap = {
										[DocumentPath.toString(fieldA)]: {
											validationMessages: [],
											parseError: parsingErrorA
										},
										[DocumentPath.toString(fieldB)]: {
											validationMessages: [validationMessageB, validationMessageA]
										},
										[DocumentPath.toString(fieldC)]: {
											validationMessages: [validationMessageC]
										},
										[DocumentPath.toString(fieldD)]: {
											validationMessages: [validationMessageD, validationMessageD2]
										}
									};
									const newMap = updateValidationEntries(
										messagesFromStore,
										currentValidationErrors,
										instances,
										getValidatorProvider(),
										"partial"
									);
									deepStrictEqual(newMap, expectedMap);
								}
							);
						});
					});

					describe("and empty currentValidationErrors and instances", () => {
						describe("which contain references to elements for which no validation error exists", () => {
							it("returns the messagesFromStore map", () => {
								const instances = [fieldE];
								const newMap = updateValidationEntries(
									messagesFromStore,
									[],
									instances,
									getValidatorProvider(),
									"partial"
								);
								deepStrictEqual(newMap, newMap);
							});
						});

						describe("which contain references to elements for which validation errors exist", () => {
							it("resets all the referenced messages, but keeps the parsing errors", () => {
								const instances = [fieldA];
								const expectedMap = {
									[DocumentPath.toString(fieldA)]: {
										validationMessages: [],
										parseError: parsingErrorA
									},
									[DocumentPath.toString(fieldB)]: {
										validationMessages: [validationMessageB, validationMessageA]
									}
								};
								const newMap = updateValidationEntries(
									messagesFromStore,
									[],
									instances,
									getValidatorProvider(),
									"partial"
								);
								deepStrictEqual(newMap, expectedMap);
							});
						});
					});
				});
			});

			describe("given an empty map as messagesFromStore", () => {
				describe("and currentValidationErrors", () => {
					it("returns a map with the currentValidationErrors", () => {
						const currentValidationErrors = [
							validationMessageC,
							validationMessageD,
							validationMessageD2
						];
						const expectedMap = {
							[DocumentPath.toString(fieldC)]: {
								validationMessages: [validationMessageC]
							},
							[DocumentPath.toString(fieldD)]: {
								validationMessages: [validationMessageD, validationMessageD2]
							}
						};
						const newMap = updateValidationEntries(
							{},
							currentValidationErrors,
							[],
							getValidatorProvider(),
							"partial"
						);
						deepStrictEqual(newMap, expectedMap);
					});
				});
			});
		});

		describe("type: field", () => {
			describe("given messagesFromStore", () => {
				describe("which do not contain parsing errors", () => {
					const messagesFromStore = setupFixture(() => ({
						[DocumentPath.toString(fieldD)]: {
							validationMessages: [validationMessageA]
						},
						[DocumentPath.toString(fieldB)]: {
							validationMessages: [validationMessageB, validationMessageA]
						}
					}));
					describe("and currentValidationErrors", () => {
						it(
							"does not keep the old validation of the referenced element and " +
								"adds the currentValidationErrors to the messagesFromStore map",
							() => {
								const currentValidationErrors = [validationMessageD, validationMessageD2];

								const instances = [fieldD];
								const expectedMap = {
									[DocumentPath.toString(fieldD)]: {
										validationMessages: [validationMessageD, validationMessageD2]
									},
									[DocumentPath.toString(fieldB)]: {
										validationMessages: [validationMessageB, validationMessageA]
									}
								};
								const newMap = updateValidationEntries(
									messagesFromStore,
									currentValidationErrors,
									instances,
									getValidatorProvider(),
									"field"
								);
								deepStrictEqual(newMap, expectedMap);
							}
						);
					});

					describe("and empty currentValidationErrors and an instance", () => {
						describe("which contain references to elements for which no validation error exists", () => {
							it("returns messagesFromStore map", () => {
								const instances = [fieldE];
								const newMap = updateValidationEntries(
									messagesFromStore,
									[],
									instances,
									getValidatorProvider(),
									"field"
								);
								deepStrictEqual(newMap, newMap);
							});
						});

						describe("which contain references to elements for which validation errors exist", () => {
							it("removes the entry from the messages", () => {
								const instances = [fieldD];
								const expectedMap = {
									[DocumentPath.toString(fieldB)]: {
										validationMessages: [validationMessageB, validationMessageA]
									}
								};
								const newMap = updateValidationEntries(
									messagesFromStore,
									[],
									instances,
									getValidatorProvider(),
									"field"
								);
								deepStrictEqual(newMap, expectedMap);
							});
						});
					});
				});

				describe("which do contain parsing errors", () => {
					const messagesFromStore: ReadonlyObjectMap<EngineStore.Validation.Entry> = setupFixture(
						() => ({
							[DocumentPath.toString(fieldD)]: {
								validationMessages: [validationMessageA],
								parseError: parsingErrorA
							},
							[DocumentPath.toString(fieldB)]: {
								validationMessages: [validationMessageB, validationMessageA]
							}
						})
					);
					describe("and currentValidationErrors", () => {
						it(
							"does not keep the old validation or parsing error of the referenced element and " +
								"adds the currentValidationErrors to the messagesFromStore map",
							() => {
								const currentValidationErrors = [validationMessageD, validationMessageD2];

								const instances = [fieldD];
								const expectedMap = {
									[DocumentPath.toString(fieldD)]: {
										validationMessages: [validationMessageD, validationMessageD2]
									},
									[DocumentPath.toString(fieldB)]: {
										validationMessages: [validationMessageB, validationMessageA]
									}
								};
								const newMap = updateValidationEntries(
									messagesFromStore,
									currentValidationErrors,
									instances,
									getValidatorProvider(),
									"field"
								);
								deepStrictEqual(newMap, expectedMap);
							}
						);
					});

					describe("and empty currentValidationErrors and instances", () => {
						describe("which contain references to elements for which no validation error exists", () => {
							it("returns the messagesFromStore map", () => {
								const instances = [fieldE];
								const newMap = updateValidationEntries(
									messagesFromStore,
									[],
									instances,
									getValidatorProvider(),
									"field"
								);
								deepStrictEqual(newMap, newMap);
							});
						});

						describe("which contain references to elements for which validation errors exist", () => {
							it("does not reset any referenced messages", () => {
								const instances = [fieldD];
								const expectedMap = {
									[DocumentPath.toString(fieldB)]: {
										validationMessages: [validationMessageB, validationMessageA]
									}
								};
								const newMap = updateValidationEntries(
									messagesFromStore,
									[],
									instances,
									getValidatorProvider(),
									"field"
								);
								deepStrictEqual(newMap, expectedMap);
							});
						});
					});
				});
			});

			describe("given an empty map as messagesFromStore", () => {
				describe("and currentValidationErrors", () => {
					it("returns a map with the currentValidationErrors", () => {
						const currentValidationErrors = [
							validationMessageC,
							validationMessageD,
							validationMessageD2
						];
						const expectedMap = {
							[DocumentPath.toString(fieldC)]: {
								validationMessages: [validationMessageC]
							},
							[DocumentPath.toString(fieldD)]: {
								validationMessages: [validationMessageD, validationMessageD2]
							}
						};
						const newMap = updateValidationEntries(
							{},
							currentValidationErrors,
							[],
							getValidatorProvider(),
							"field"
						);
						deepStrictEqual(newMap, expectedMap);
					});
				});
			});
		});
	});
});
