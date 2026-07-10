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

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { EngineStore } from "../../../back-end/store/index.js";
import type { ReadonlyObjectMap } from "../../../models/index.js";
import { DocumentPath } from "../../../models/internal/utils/document-utils.js";
import { createDocumentPath } from "../../utils/createDocumentPath.js";
import { setupFixture, setupModelsFixture } from "../../utils/setupFixture.js";
import { FieldInValidatonMessage } from "../../utils/test-model-helpers/referencedFieldsInValidationMessage.js";

describe("unit.back-end.store.updatesMessagesPaths", () => {
	const baseErrorInformation = {
		errorCode: "zahlHatUngueltigeZeichen",
		errorKey: "formalePruefung",
		errorText: [
			{ key: "numberContainsIllegalSymbols", defaults: { en: "The value must be integer." } }
		],
		severity: "ERROR" as "ERROR" | "WARNING"
	};

	// Should never be touched
	const elementWhichInNotInSameContext = createDocumentPath(
		[FieldInValidatonMessage.rootGroup],
		[FieldInValidatonMessage.REPEAT_2.repeatName, 3],
		[FieldInValidatonMessage.REPEAT_2.N1]
	);

	const models = setupModelsFixture(
		"computation-validation.referenced_fields_in_validation_message"
	);

	function createEntry(options: {
		keyPath: EntityInstancePath;
		referencedFields: EntityInstancePath[];
		value?: string;
	}): ReadonlyObjectMap<EngineStore.Validation.Entry> {
		const { keyPath, referencedFields, value } = options;
		return {
			[DocumentPath.toString(keyPath)]: {
				parseError: {
					value: value ? value : "test",
					message: {
						...baseErrorInformation,
						element: keyPath,
						referencedFields: referencedFields
					}
				},
				validationMessages: []
			}
		};
	}

	function createRowPath(index: number): EntityInstancePath {
		return createDocumentPath(
			[FieldInValidatonMessage.rootGroup],
			[FieldInValidatonMessage.REPEAT_1.repeatName, index]
		);
	}

	function createPathToF6(index: number): EntityInstancePath {
		return createDocumentPath(
			[FieldInValidatonMessage.rootGroup],
			[FieldInValidatonMessage.REPEAT_1.repeatName, index],
			[FieldInValidatonMessage.REPEAT_1.nestedGroup],
			[FieldInValidatonMessage.REPEAT_1.F6]
		);
	}

	function createPathToF7(index: number): EntityInstancePath {
		return createDocumentPath(
			[FieldInValidatonMessage.rootGroup],
			[FieldInValidatonMessage.REPEAT_1.repeatName, index],
			[FieldInValidatonMessage.REPEAT_1.nestedGroup],
			[FieldInValidatonMessage.REPEAT_1.F7]
		);
	}

	function createPathToN2(indexRepeat1: number, indexNestedRepet: number): EntityInstancePath {
		return createDocumentPath(
			[FieldInValidatonMessage.rootGroup],
			[FieldInValidatonMessage.REPEAT_3.repeatName, indexRepeat1],
			[FieldInValidatonMessage.REPEAT_3.nestedGroup],
			[FieldInValidatonMessage.REPEAT_3.nestedRepeat, indexNestedRepet],
			[FieldInValidatonMessage.REPEAT_3.nestedNestedGroup1],
			[FieldInValidatonMessage.REPEAT_3.N2]
		);
	}

	function createPathToN3(indexRepeat1: number, indexNestedRepet: number): EntityInstancePath {
		return createDocumentPath(
			[FieldInValidatonMessage.rootGroup],
			[FieldInValidatonMessage.REPEAT_3.repeatName, indexRepeat1],
			[FieldInValidatonMessage.REPEAT_3.nestedGroup],
			[FieldInValidatonMessage.REPEAT_3.nestedRepeat, indexNestedRepet],
			[FieldInValidatonMessage.REPEAT_3.nestedNestedGroup2],
			[FieldInValidatonMessage.REPEAT_3.N3]
		);
	}

	function createPathToN4(indexRepeat1: number, indexNestedRepet: number): EntityInstancePath {
		return createDocumentPath(
			[FieldInValidatonMessage.rootGroup],
			[FieldInValidatonMessage.REPEAT_4.repeatName, indexRepeat1],
			[FieldInValidatonMessage.REPEAT_4.nestedRepeat, indexNestedRepet],
			[FieldInValidatonMessage.REPEAT_4.N4]
		);
	}

	function createPathToN1(index: number): EntityInstancePath {
		return createDocumentPath(
			[FieldInValidatonMessage.rootGroup],
			[FieldInValidatonMessage.REPEAT_2.repeatName, index],
			[FieldInValidatonMessage.REPEAT_2.N1]
		);
	}
	describe("Given a set of messages", () => {
		describe("and no delta is given (remove)", () => {
			// first row
			describe("and a row index of 1", () => {
				describe("and a change in a not nested repeat", () => {
					const changedRowIndex = 1;
					function createMessages(
						indexChange: number
					): ReadonlyObjectMap<EngineStore.Validation.Entry> {
						return {
							...createEntry({
								keyPath: createPathToF6(2 - indexChange),
								referencedFields: [createPathToF6(2 - indexChange)],
								value: "m2"
							}),
							...createEntry({
								keyPath: createPathToF6(3 - indexChange),
								referencedFields: [
									createPathToF6(3 - indexChange),
									createPathToF7(3 - indexChange),
									elementWhichInNotInSameContext
								],
								value: "m3"
							}),
							...createEntry({
								keyPath: createPathToF6(4 - indexChange),
								referencedFields: [createPathToF6(4 - indexChange)],
								value: "m4"
							}),
							...createEntry({
								keyPath: createPathToF6(5 - indexChange),
								referencedFields: [createPathToF6(5 - indexChange)],
								value: "m5"
							}),
							...createEntry({
								keyPath: createPathToF6(6 - indexChange),
								referencedFields: [
									createPathToF6(6 - indexChange),
									createPathToF6(2 - indexChange)
								],
								value: "m6"
							}),
							...createEntry({
								keyPath: createPathToN1(2),
								referencedFields: [createPathToN1(2)],
								value: "m7"
							})
						};
					}

					const fixture = setupFixture(() => {
						const oldMessages = createMessages(0);
						const expectedMessages = createMessages(1);

						const newMessages = EngineStore.Validation.Message.updateMessagesPaths(
							oldMessages,
							createRowPath(changedRowIndex),
							models.documentModel
						);

						return {
							newMessages,
							expectedMessages
						};
					});

					it(
						"updates all document paths which reference a field in a row with index > 1 " +
							"by setting the index to oldIndex - 1",
						() => {
							deepStrictEqual(
								fixture.newMessages[DocumentPath.toString(createPathToF6(1))],
								fixture.expectedMessages[DocumentPath.toString(createPathToF6(1))],
								"Did not update message m2 correctly"
							);

							deepStrictEqual(
								fixture.newMessages[DocumentPath.toString(createPathToF6(2))],
								fixture.expectedMessages[DocumentPath.toString(createPathToF6(2))],
								"Did not update message m3 correctly"
							);

							deepStrictEqual(
								fixture.newMessages[DocumentPath.toString(createPathToF6(3))],
								fixture.expectedMessages[DocumentPath.toString(createPathToF6(3))],
								"Did not update mesasge m4 correctly"
							);

							deepStrictEqual(
								fixture.newMessages[DocumentPath.toString(createPathToF6(4))],
								fixture.expectedMessages[DocumentPath.toString(createPathToF6(4))],
								"Did not update mesasge m5 correctly"
							);

							deepStrictEqual(
								fixture.newMessages[DocumentPath.toString(createPathToF6(5))],
								fixture.expectedMessages[DocumentPath.toString(createPathToF6(5))],
								"Did not update mesasge m6 correctly"
							);
						}
					);

					it("does not update any messages from another repeat", () => {
						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToN1(2))],
							fixture.expectedMessages[DocumentPath.toString(createPathToN1(2))],
							"It should not change a message from another repeat"
						);
					});
				});

				describe("and a change in a nested repeat", () => {
					describe("with nested groups", () => {
						const changedRowIndex = 1;
						function createMessages(
							indexChange: number
						): ReadonlyObjectMap<EngineStore.Validation.Entry> {
							return {
								...createEntry({
									keyPath: createPathToN2(2, 2 - indexChange),
									referencedFields: [createPathToN2(2, 2 - indexChange)],
									value: "m2"
								}),
								...createEntry({
									keyPath: createPathToN2(2, 3 - indexChange),
									referencedFields: [
										createPathToN2(2, 3 - indexChange),
										createPathToN2(2, 3 - indexChange),
										elementWhichInNotInSameContext
									],
									value: "m3"
								}),
								...createEntry({
									keyPath: createPathToN2(4, 2),
									referencedFields: [createPathToN2(4, 2)],
									value: "m4"
								}),
								...createEntry({
									keyPath: createPathToN2(5, 2),
									referencedFields: [createPathToN2(5, 2)],
									value: "m5"
								}),
								...createEntry({
									keyPath: createPathToN2(6, 2),
									referencedFields: [createPathToN2(6, 2)],
									value: "m6"
								}),
								...createEntry({
									keyPath: createPathToN3(2, 3 - indexChange),
									referencedFields: [
										createPathToN3(2, 3 - indexChange),
										createPathToN3(2, 3 - indexChange),
										elementWhichInNotInSameContext
									],
									value: "m7"
								})
							};
						}

						const fixture = setupFixture(() => {
							const oldMessages = createMessages(0);
							const expectedMessages = createMessages(1);

							const newMessages = EngineStore.Validation.Message.updateMessagesPaths(
								oldMessages,
								createDocumentPath(
									[FieldInValidatonMessage.rootGroup],
									[FieldInValidatonMessage.REPEAT_3.repeatName, 2],
									[FieldInValidatonMessage.REPEAT_3.nestedGroup],
									[FieldInValidatonMessage.REPEAT_3.nestedRepeat, changedRowIndex]
								),
								models.documentModel
							);

							return {
								newMessages,
								expectedMessages
							};
						});

						it(
							"updates all document paths which reference a field in the same context and in a row with index > 1 " +
								"by setting the index to oldIndex - 1",
							() => {
								deepStrictEqual(
									fixture.newMessages[DocumentPath.toString(createPathToN2(2, 1))],
									fixture.expectedMessages[DocumentPath.toString(createPathToN2(2, 1))],
									"Did not update message m2 correctly"
								);

								deepStrictEqual(
									fixture.newMessages[DocumentPath.toString(createPathToN2(2, 2))],
									fixture.expectedMessages[DocumentPath.toString(createPathToN2(2, 2))],
									"Did not update message m3 correctly"
								);

								deepStrictEqual(
									fixture.newMessages[DocumentPath.toString(createPathToN3(2, 2))],
									fixture.expectedMessages[DocumentPath.toString(createPathToN3(2, 2))],
									"Did not update message m7 correctly"
								);
							}
						);

						it("does not update any messages from another context", () => {
							deepStrictEqual(
								fixture.newMessages[DocumentPath.toString(createPathToN2(4, 2))],
								fixture.expectedMessages[DocumentPath.toString(createPathToN2(4, 2))],
								"Should not update m4"
							);

							deepStrictEqual(
								fixture.newMessages[DocumentPath.toString(createPathToN2(5, 2))],
								fixture.expectedMessages[DocumentPath.toString(createPathToN2(5, 2))],
								"Should not update m4"
							);

							deepStrictEqual(
								fixture.newMessages[DocumentPath.toString(createPathToN2(6, 2))],
								fixture.expectedMessages[DocumentPath.toString(createPathToN2(6, 2))],
								"Should not update m4"
							);
						});
					});

					describe("with no nested groups", () => {
						const changedRowIndex = 1;
						function createMessages(
							indexChange: number
						): ReadonlyObjectMap<EngineStore.Validation.Entry> {
							return {
								...createEntry({
									keyPath: createPathToN4(2, 2 - indexChange),
									referencedFields: [createPathToN4(2, 2 - indexChange)],
									value: "m2"
								}),
								...createEntry({
									keyPath: createPathToN4(2, 3 - indexChange),
									referencedFields: [
										createPathToN4(2, 3 - indexChange),
										createPathToN4(2, 3 - indexChange),
										elementWhichInNotInSameContext
									],
									value: "m3"
								}),
								...createEntry({
									keyPath: createPathToN4(4, 2),
									referencedFields: [createPathToN4(4, 2)],
									value: "m4"
								}),
								...createEntry({
									keyPath: createPathToN4(5, 2),
									referencedFields: [createPathToN4(5, 2)],
									value: "m5"
								}),
								...createEntry({
									keyPath: createPathToN4(6, 2),
									referencedFields: [createPathToN4(6, 2)],
									value: "m6"
								})
							};
						}

						const fixture = setupFixture(() => {
							const oldMessages = createMessages(0);
							const expectedMessages = createMessages(1);

							const newMessages = EngineStore.Validation.Message.updateMessagesPaths(
								oldMessages,
								createDocumentPath(
									[FieldInValidatonMessage.rootGroup],
									[FieldInValidatonMessage.REPEAT_4.repeatName, 2],
									[FieldInValidatonMessage.REPEAT_4.nestedRepeat, changedRowIndex]
								),
								models.documentModel
							);

							return {
								newMessages,
								expectedMessages
							};
						});

						it(
							"updates all document paths which reference a field in the same context and in a row with index > 1 " +
								"by setting the index to oldIndex - 1",
							() => {
								deepStrictEqual(
									fixture.newMessages[DocumentPath.toString(createPathToN4(2, 1))],
									fixture.expectedMessages[DocumentPath.toString(createPathToN4(2, 1))],
									"Did not update message m2 correctly"
								);

								deepStrictEqual(
									fixture.newMessages[DocumentPath.toString(createPathToN4(2, 2))],
									fixture.expectedMessages[DocumentPath.toString(createPathToN4(2, 2))],
									"Did not update message m3 correctly"
								);

								deepStrictEqual(
									fixture.newMessages[DocumentPath.toString(createPathToN3(2, 2))],
									fixture.expectedMessages[DocumentPath.toString(createPathToN3(2, 2))],
									"Did not update message m7 correctly"
								);
							}
						);

						it("does not update any messages from another context", () => {
							deepStrictEqual(
								fixture.newMessages[DocumentPath.toString(createPathToN4(4, 2))],
								fixture.expectedMessages[DocumentPath.toString(createPathToN4(4, 2))],
								"Should not update m4"
							);

							deepStrictEqual(
								fixture.newMessages[DocumentPath.toString(createPathToN4(5, 2))],
								fixture.expectedMessages[DocumentPath.toString(createPathToN4(5, 2))],
								"Should not update m5"
							);

							deepStrictEqual(
								fixture.newMessages[DocumentPath.toString(createPathToN4(6, 2))],
								fixture.expectedMessages[DocumentPath.toString(createPathToN4(6, 2))],
								"Should not update m6"
							);
						});
					});
				});
			});

			// a row in the middle
			describe("and a row index of 3", () => {
				const changedRowIndex = 3;
				function createMessages(
					indexChange: number
				): ReadonlyObjectMap<EngineStore.Validation.Entry> {
					return {
						...createEntry({
							keyPath: createPathToF6(1),
							referencedFields: [createPathToF6(1)],
							value: "m1"
						}),
						...createEntry({
							keyPath: createPathToF6(2),
							referencedFields: [createPathToF6(2), createPathToF6(4 - indexChange)],
							value: "m2"
						}),
						...createEntry({
							keyPath: createPathToF6(4 - indexChange),
							referencedFields: [
								createPathToF6(4 - indexChange),
								createPathToF7(4 - indexChange),
								elementWhichInNotInSameContext
							],
							value: "m4"
						}),
						...createEntry({
							keyPath: createPathToF6(5 - indexChange),
							referencedFields: [createPathToF6(5 - indexChange)],
							value: "m5"
						}),
						...createEntry({
							keyPath: createPathToF6(6 - indexChange),
							referencedFields: [createPathToF6(6 - indexChange), createPathToF6(4 - indexChange)],
							value: "m6"
						}),
						...createEntry({
							keyPath: createPathToN1(changedRowIndex),
							referencedFields: [createPathToN1(changedRowIndex)],
							value: "m7"
						})
					};
				}

				const fixture = setupFixture(() => {
					const oldMessages = createMessages(0);
					const expectedMessages = createMessages(1);

					const newMessages = EngineStore.Validation.Message.updateMessagesPaths(
						oldMessages,
						createRowPath(changedRowIndex),
						models.documentModel
					);

					return {
						newMessages,
						expectedMessages
					};
				});

				it("updates all document paths which reference a field in a row with index > 3 by setting the index to oldIndex - 1", () => {
					deepStrictEqual(
						fixture.newMessages[DocumentPath.toString(createPathToF6(2))],
						fixture.expectedMessages[DocumentPath.toString(createPathToF6(2))],
						"Did not update message m2 correctly"
					);

					deepStrictEqual(
						fixture.newMessages[DocumentPath.toString(createPathToF6(3))],
						fixture.expectedMessages[DocumentPath.toString(createPathToF6(3))],
						"Did not update message m4 correctly"
					);

					deepStrictEqual(
						fixture.newMessages[DocumentPath.toString(createPathToF6(4))],
						fixture.expectedMessages[DocumentPath.toString(createPathToF6(4))],
						"Did not update message m5 correctly"
					);

					deepStrictEqual(
						fixture.newMessages[DocumentPath.toString(createPathToF6(5))],
						fixture.expectedMessages[DocumentPath.toString(createPathToF6(5))],
						"Did not update message m6 correctly"
					);
				});

				it("does not update document paths which reference a field in a row with index <= 3", () => {
					deepStrictEqual(
						fixture.newMessages[DocumentPath.toString(createPathToF6(1))],
						fixture.expectedMessages[DocumentPath.toString(createPathToF6(1))],
						"Should not update m1"
					);

					deepStrictEqual(
						fixture.newMessages[DocumentPath.toString(createPathToF6(3))],
						fixture.expectedMessages[DocumentPath.toString(createPathToF6(3))],
						"Should not update m3"
					);
				});

				it("does not update any messages from another repeat", () => {
					deepStrictEqual(
						fixture.newMessages[DocumentPath.toString(createPathToN1(changedRowIndex))],
						fixture.expectedMessages[DocumentPath.toString(createPathToN1(changedRowIndex))],
						"It should not change a message from another repeat"
					);
				});
			});
		});

		describe("and a delta", () => {
			describe("which is postive", () => {
				describe("and a row index of 3", () => {
					const changedRowIndex = 3;

					function createMessages(
						index1: number,
						index2: number
					): ReadonlyObjectMap<EngineStore.Validation.Entry> {
						return {
							// Entries which should not be changed:
							...createEntry({
								keyPath: createPathToF6(2),
								referencedFields: [createPathToF6(2)],
								value: "m2"
							}),
							...createEntry({
								keyPath: createPathToF6(5),
								referencedFields: [createPathToF6(5)],
								value: "m5"
							}),
							...createEntry({
								keyPath: createPathToN1(changedRowIndex),
								referencedFields: [createPathToN1(changedRowIndex)],
								value: "m7"
							}),

							// Entries where the keyPath and referenced elements are changed:
							...createEntry({
								keyPath: createPathToF6(index1),
								referencedFields: [
									createPathToF6(index1),
									createPathToF7(index1),
									elementWhichInNotInSameContext
								],
								value: "m3"
							}),
							...createEntry({
								keyPath: createPathToF6(index2),
								referencedFields: [createPathToF6(index2)],
								value: "m4"
							}),

							// Entries where a referenced field is changed:
							...createEntry({
								keyPath: createPathToF6(1),
								referencedFields: [createPathToF6(1), createPathToF6(index1)],
								value: "m1"
							}),
							...createEntry({
								keyPath: createPathToF6(6),
								referencedFields: [createPathToF6(6), createPathToF6(index2)],
								value: "m6"
							})
						};
					}

					const fixture = setupFixture(() => {
						const oldMessages = createMessages(changedRowIndex, changedRowIndex + 1);
						const expectedMessages = createMessages(changedRowIndex + 1, changedRowIndex);

						const newMessages = EngineStore.Validation.Message.updateMessagesPaths(
							oldMessages,
							createRowPath(changedRowIndex),
							models.documentModel,
							1
						);

						return {
							newMessages,
							expectedMessages
						};
					});

					it("updates all document paths which reference a field in row 3 by setting the index to oldIndex + delta", () => {
						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(1))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(1))],
							"Did not update message m1 correctly"
						);

						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(4))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(4))],
							"Did not update mesasge m3 correctly"
						);
					});

					it("updates all document paths which reference a field in row 4 by setting the index to oldIndex - delta", () => {
						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(6))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(6))],
							"Did not update message m6 correctly"
						);

						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(3))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(3))],
							"Did not update mesasge m4 correctly"
						);
					});

					it("does not update any other messages which reference fields in other rows", () => {
						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(2))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(2))],
							"It should not update m2"
						);

						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(5))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(5))],
							"It should not update m5"
						);
					});

					it("does not update any messages from another repeat", () => {
						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToN1(changedRowIndex))],
							fixture.expectedMessages[DocumentPath.toString(createPathToN1(changedRowIndex))],
							"It should not change a message from another repeat"
						);
					});
				});
			});

			describe("which is negative", () => {
				// first row
				describe("and a row index of 4", () => {
					const changedRowIndex = 4;

					function createMessages(
						index1: number,
						index2: number
					): ReadonlyObjectMap<EngineStore.Validation.Entry> {
						return {
							// Entries which should not be changed:
							...createEntry({
								keyPath: createPathToF6(2),
								referencedFields: [createPathToF6(2)],
								value: "m2"
							}),
							...createEntry({
								keyPath: createPathToF6(5),
								referencedFields: [createPathToF6(5)],
								value: "m5"
							}),
							...createEntry({
								keyPath: createPathToN1(changedRowIndex),
								referencedFields: [createPathToN1(changedRowIndex)],
								value: "m7"
							}),

							// Entries where the keyPath and referenced elements are changed:
							...createEntry({
								keyPath: createPathToF6(index1),
								referencedFields: [
									createPathToF6(index1),
									createPathToF7(index1),
									elementWhichInNotInSameContext
								],
								value: "m3"
							}),
							...createEntry({
								keyPath: createPathToF6(index2),
								referencedFields: [createPathToF6(index2)],
								value: "m4"
							}),

							// Entries where a referenced field is changed:
							...createEntry({
								keyPath: createPathToF6(1),
								referencedFields: [createPathToF6(1), createPathToF6(index1)],
								value: "m1"
							}),
							...createEntry({
								keyPath: createPathToF6(6),
								referencedFields: [createPathToF6(6), createPathToF6(index2)],
								value: "m6"
							})
						};
					}

					const fixture = setupFixture(() => {
						const oldMessages = createMessages(changedRowIndex, changedRowIndex - 1);
						const expectedMessages = createMessages(changedRowIndex - 1, changedRowIndex);

						const newMessages = EngineStore.Validation.Message.updateMessagesPaths(
							oldMessages,
							createRowPath(changedRowIndex),
							models.documentModel,
							-1
						);

						return {
							newMessages,
							expectedMessages
						};
					});

					it("updates all document paths which reference a field in row 3 by setting the index to oldIndex - delta", () => {
						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(1))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(1))],
							"Did not update message m1 correctly"
						);

						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(4))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(4))],
							"Did not update mesasge m3 correctly"
						);
					});

					it("updates all document paths which reference a field in row 4 by setting the index to oldIndex + delta", () => {
						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(6))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(6))],
							"Did not update message m6 correctly"
						);

						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(3))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(3))],
							"Did not update mesasge m4 correctly"
						);
					});

					it("does not update any other messages which reference fields in other rows", () => {
						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(2))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(2))],
							"It should not update m2"
						);

						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToF6(5))],
							fixture.expectedMessages[DocumentPath.toString(createPathToF6(5))],
							"It should not update m5"
						);
					});

					it("does not update any messages from another repeat", () => {
						deepStrictEqual(
							fixture.newMessages[DocumentPath.toString(createPathToN1(changedRowIndex))],
							fixture.expectedMessages[DocumentPath.toString(createPathToN1(changedRowIndex))],
							"It should not change a message from another repeat"
						);
					});
				});
			});
		});
	});
});
