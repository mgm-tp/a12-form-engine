// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../back-end/store/index.js";
import { DataSelectors, Events } from "../../../../../../back-end/store/index.js";
import { DocumentUtils } from "../../../../../../models/internal/utils/document-utils.js";
import { DEP_ELEMENT } from "../../../../../utils/test-model-helpers/dependent-element.js";

export function executeDependentFieldTests(models: Models) {
	describe("Dependent value", () => {
		describe("MasterField: Enumeration", () => {
			describe("Master field and dependent field have the same granularity", () => {
				it("sets the value of a dependent field if the master value changes", () => {
					const store = DEP_ELEMENT.setupStore({ models });
					store.dispatch(
						Events.valueChange({
							path: DEP_ELEMENT.pathToMasterEnumerationField,
							value: DEP_ELEMENT.SET_VALUE_FIELD,
							formModelElementPath: []
						})
					);

					const document = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: document as GroupInstance,
						path: [
							...DEP_ELEMENT.ENUMERATION.DEPENDENT_FIELD_GROUP,
							{ elementName: DEP_ELEMENT.SET_VALUE_FIELD, index: 1 }
						]
					});

					strictEqual(value, 101);
				});

				it("does not set the value of a dependent field if the master value does not change", () => {
					const store = DEP_ELEMENT.setupStore({ models });

					// Change value of dependent field
					store.dispatch(
						Events.valueChange({
							path: [
								...DEP_ELEMENT.ENUMERATION.DEPENDENT_FIELD_GROUP,
								{ elementName: DEP_ELEMENT.SET_VALUE_FIELD, index: 1 }
							],
							value: 200,
							formModelElementPath: []
						})
					);

					// Change another field
					store.dispatch(
						Events.valueChange({
							path: [
								...DEP_ELEMENT.ENUMERATION.DEPENDENT_FIELD_GROUP,
								{ elementName: DEP_ELEMENT.READONLY_FIELD, index: 1 }
							],
							value: DEP_ELEMENT.READONLY_FIELD,
							formModelElementPath: []
						})
					);

					const document = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: document as GroupInstance,
						path: [
							...DEP_ELEMENT.ENUMERATION.DEPENDENT_FIELD_GROUP,
							{ elementName: DEP_ELEMENT.SET_VALUE_FIELD, index: 1 }
						]
					});
					// Value of field DependentValue should still be 200 and not 101!
					strictEqual(value, 200);
				});
			});

			describe(
				"Dependent field is nested in a deeper repeatability context " + "than the master field",
				() => {
					it("sets the value of a dependent field in each row if the master value changes", () => {
						const store = DEP_ELEMENT.setupStore({
							models,
							data: { document: DEP_ELEMENT.createDocument() }
						});
						store.dispatch(
							Events.valueChange({
								path: DEP_ELEMENT.pathToRepeatGroupMasterField,
								value: "4",
								formModelElementPath: []
							})
						);

						const document = DataSelectors.document()(store.getState());

						for (let i = 1; i < 4; i++) {
							const value = DocumentUtils.getValue({
								document: document as GroupInstance,
								path: [
									...DEP_ELEMENT.getPathToDependentRepeatableGroup(i),
									{ elementName: DEP_ELEMENT.DEPENDENT_REPEAT_FIELD_MASTER_OUTSIDE, index: 1 }
								]
							});

							strictEqual(value, "123456789");
						}
					});

					it("does not set the value of a dependent field if the master value does not change", () => {
						const store = DEP_ELEMENT.setupStore({
							models,
							data: { document: DEP_ELEMENT.createDocument() }
						});

						// Change value of dependent field
						store.dispatch(
							Events.valueChange({
								path: [
									...DEP_ELEMENT.getPathToDependentRepeatableGroup(),
									{ elementName: DEP_ELEMENT.DEPENDENT_REPEAT_FIELD_MASTER_OUTSIDE, index: 1 }
								],
								value: "200",
								formModelElementPath: []
							})
						);

						// Change another field
						store.dispatch(
							Events.valueChange({
								path: [
									...DEP_ELEMENT.ENUMERATION.DEPENDENT_FIELD_GROUP,
									{ elementName: DEP_ELEMENT.READONLY_FIELD, index: 1 }
								],
								value: DEP_ELEMENT.READONLY_FIELD,
								formModelElementPath: []
							})
						);

						const document = DataSelectors.document()(store.getState());
						const value = DocumentUtils.getValue({
							document: document as GroupInstance,
							path: [
								...DEP_ELEMENT.getPathToDependentRepeatableGroup(),
								{ elementName: DEP_ELEMENT.DEPENDENT_REPEAT_FIELD_MASTER_OUTSIDE, index: 1 }
							]
						});
						// Value of field DependentValue should still be "200" and not "123456789"!
						strictEqual(value, "200");
					});
				}
			);
		});

		describe("MasterField: Boolean", () => {
			describe("Master field and dependent field have the same granularity", () => {
				it("sets the value of a dependent field if the master value changes to true", () => {
					const store = DEP_ELEMENT.setupStore({ models });
					store.dispatch(
						Events.valueChange({
							path: DEP_ELEMENT.pathToMasterBooleanField,
							value: true,
							formModelElementPath: []
						})
					);

					const document = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: document as GroupInstance,
						path: [
							...DEP_ELEMENT.BOOLEAN.DEPENDENT_FIELD_GROUP_TRUE,
							{ elementName: DEP_ELEMENT.SET_VALUE_FIELD, index: 1 }
						]
					});

					strictEqual(value, 1);
				});

				it("sets the value of a dependent field if the master value changes to false", () => {
					const store = DEP_ELEMENT.setupStore({ models });
					store.dispatch(
						Events.valueChange({
							path: DEP_ELEMENT.pathToMasterBooleanField,
							value: false,
							formModelElementPath: []
						})
					);

					const document = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: document as GroupInstance,
						path: [
							...DEP_ELEMENT.BOOLEAN.DEPENDENT_FIELD_GROUP_FALSE,
							{ elementName: DEP_ELEMENT.SET_VALUE_FIELD, index: 1 }
						]
					});

					strictEqual(value, 12);
				});
			});

			describe(
				"Dependent field is nested in a deeper repeatability context " + "than the master field",
				() => {
					it("sets the value of a dependent field in each row if the master value changes to true", () => {
						const store = DEP_ELEMENT.setupStore({
							models,
							data: { document: DEP_ELEMENT.createDocument() }
						});
						store.dispatch(
							Events.valueChange({
								path: DEP_ELEMENT.pathToMasterBooleanField,
								value: true,
								formModelElementPath: []
							})
						);

						const document = DataSelectors.document()(store.getState());

						for (let i = 1; i < 4; i++) {
							const value = DocumentUtils.getValue({
								document: document as GroupInstance,
								path: [
									...DEP_ELEMENT.BOOLEAN.DEPENDENT_FIELD_GROUP_TRUE,
									{ elementName: "DependentFieldsInRepeatableGroup", index: i },
									{ elementName: "DepRepeatValue", index: 1 }
								]
							});

							strictEqual(value, 1);
						}
					});

					it("sets the value of a dependent field in each row if the master value changes to false", () => {
						const store = DEP_ELEMENT.setupStore({
							models,
							data: { document: DEP_ELEMENT.createDocument() }
						});
						store.dispatch(
							Events.valueChange({
								path: DEP_ELEMENT.pathToMasterBooleanField,
								value: false,
								formModelElementPath: []
							})
						);

						const document = DataSelectors.document()(store.getState());

						for (let i = 1; i < 4; i++) {
							const value = DocumentUtils.getValue({
								document: document as GroupInstance,
								path: [
									...DEP_ELEMENT.BOOLEAN.DEPENDENT_FIELD_GROUP_FALSE,
									{ elementName: "DependentFieldsInRepeatableGroup", index: i },
									{ elementName: "DepRepeatValue", index: 1 }
								]
							});

							strictEqual(value, 12);
						}
					});
				}
			);
		});
	});

	describe("Dependent field value", () => {
		describe("MasterField: Enumeration", () => {
			describe("Master field and dependent field have the same granularity", () => {
				it(
					"sets the value of a dependent field to a specified field value which is not null" +
						"if the master value changes",
					() => {
						const store = DEP_ELEMENT.setupStore({ models });
						store.dispatch(
							Events.valueChange({
								path: DEP_ELEMENT.pathToMasterEnumerationField,
								value: DEP_ELEMENT.SET_FIELD_VALUE_FIELD,
								formModelElementPath: []
							})
						);

						const document = DataSelectors.document()(store.getState());
						const value = DocumentUtils.getValue({
							document: document as GroupInstance,
							path: [
								...DEP_ELEMENT.ENUMERATION.DEPENDENT_FIELD_GROUP,
								{ elementName: DEP_ELEMENT.SET_FIELD_VALUE_FIELD, index: 1 }
							]
						});

						strictEqual(value, "FieldValue");
					}
				);

				it("sets the value of a dependent field to a specified field value which is null if the master value changes", () => {
					const store = DEP_ELEMENT.setupStore({ models });
					store.dispatch(
						Events.valueChange({
							path: [
								...DEP_ELEMENT.ENUMERATION.DEPENDENT_FIELD_GROUP,
								{ elementName: DEP_ELEMENT.READONLY_FIELD, index: 1 }
							],
							value: null,
							formModelElementPath: []
						})
					);

					store.dispatch(
						Events.valueChange({
							path: [
								...DEP_ELEMENT.ENUMERATION.DEPENDENT_FIELD_GROUP,
								{ elementName: DEP_ELEMENT.SET_FIELD_VALUE_FIELD, index: 1 }
							],
							value: "Test",
							formModelElementPath: []
						})
					);

					store.dispatch(
						Events.valueChange({
							path: DEP_ELEMENT.pathToMasterEnumerationField,
							value: DEP_ELEMENT.SET_FIELD_VALUE_FIELD,
							formModelElementPath: []
						})
					);

					const document = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: document as GroupInstance,
						path: [
							...DEP_ELEMENT.ENUMERATION.DEPENDENT_FIELD_GROUP,
							{ elementName: DEP_ELEMENT.SET_FIELD_VALUE_FIELD, index: 1 }
						]
					});

					strictEqual(value, null);
				});
			});

			describe(
				"Dependent field is nested in a deeper repeatability context " + "than the master field",
				() => {
					describe("The referenced field is outside of the repeatable group", () => {
						it(
							"sets the value of a dependent field to a specified field value in each row" +
								"if the master value changes",
							() => {
								const store = DEP_ELEMENT.setupStore({
									models,
									data: { document: DEP_ELEMENT.createDocument() }
								});
								store.dispatch(
									Events.valueChange({
										path: DEP_ELEMENT.pathToRepeatGroupMasterField,
										value: "5",
										formModelElementPath: []
									})
								);

								const document = DataSelectors.document()(store.getState());

								for (let i = 1; i < 4; i++) {
									const value = DocumentUtils.getValue({
										document: document as GroupInstance,
										path: [
											...DEP_ELEMENT.getPathToDependentRepeatableGroup(i),
											{
												elementName: DEP_ELEMENT.DEPENDENT_REPEAT_FIELD_MASTER_OUTSIDE,
												index: 1
											}
										]
									});

									strictEqual(value, "FieldValue");
								}
							}
						);
					});

					describe("The referenced field is inside of the repeatable group", () => {
						it(
							"sets the value of a dependent field to a specified field value in each row" +
								"if the master value changes",
							() => {
								const store = DEP_ELEMENT.setupStore({
									models,
									data: { document: DEP_ELEMENT.createDocument() }
								});
								store.dispatch(
									Events.valueChange({
										path: DEP_ELEMENT.pathToRepeatGroupMasterField,
										value: "6",
										formModelElementPath: []
									})
								);

								const document = DataSelectors.document()(store.getState());

								for (let i = 1; i < 4; i++) {
									const value = DocumentUtils.getValue({
										document: document as GroupInstance,
										path: [
											...DEP_ELEMENT.getPathToDependentRepeatableGroup(i),
											{
												elementName: DEP_ELEMENT.DEPENDENT_REPEAT_FIELD_MASTER_OUTSIDE,
												index: 1
											}
										]
									});

									strictEqual(value, "FieldValueInsideRepeat");
								}
							}
						);
					});
				}
			);
		});

		describe("MasterField: Boolean", () => {
			describe("Master field and dependent field have the same granularity", () => {
				it(
					"sets the value of a dependent field to a specified field value which is not null" +
						"if the master value changes to true",
					() => {
						const store = DEP_ELEMENT.setupStore({ models });
						store.dispatch(
							Events.valueChange({
								path: DEP_ELEMENT.pathToMasterBooleanField,
								value: true,
								formModelElementPath: []
							})
						);

						const document = DataSelectors.document()(store.getState());
						const value = DocumentUtils.getValue({
							document: document as GroupInstance,
							path: [
								...DEP_ELEMENT.BOOLEAN.DEPENDENT_FIELD_GROUP_TRUE,
								{ elementName: DEP_ELEMENT.SET_FIELD_VALUE_FIELD, index: 1 }
							]
						});

						strictEqual(value, "FieldValue");
					}
				);

				it(
					"sets the value of a dependent field to a specified field value which is not null" +
						"if the master value changes to false",
					() => {
						const store = DEP_ELEMENT.setupStore({ models });
						store.dispatch(
							Events.valueChange({
								path: DEP_ELEMENT.pathToMasterBooleanField,
								value: false,
								formModelElementPath: []
							})
						);

						const document = DataSelectors.document()(store.getState());
						const value = DocumentUtils.getValue({
							document: document as GroupInstance,
							path: [
								...DEP_ELEMENT.BOOLEAN.DEPENDENT_FIELD_GROUP_FALSE,
								{ elementName: DEP_ELEMENT.SET_FIELD_VALUE_FIELD, index: 1 }
							]
						});

						strictEqual(value, "FieldValue");
					}
				);
			});

			describe(
				"Dependent field is nested in a deeper repeatability context " + "than the master field",
				() => {
					it(
						"sets the value of a dependent field to a specified field value in each row" +
							"if the master value changes to true",
						() => {
							const store = DEP_ELEMENT.setupStore({
								models,
								data: { document: DEP_ELEMENT.createDocument() }
							});
							store.dispatch(
								Events.valueChange({
									path: DEP_ELEMENT.pathToMasterBooleanField,
									value: true,
									formModelElementPath: []
								})
							);

							const document = DataSelectors.document()(store.getState());

							for (let i = 1; i < 4; i++) {
								const value = DocumentUtils.getValue({
									document: document as GroupInstance,
									path: [
										...DEP_ELEMENT.BOOLEAN.DEPENDENT_FIELD_GROUP_TRUE,
										{ elementName: "DependentFieldsInRepeatableGroup", index: i },
										{ elementName: "DepRepeatFieldValue", index: 1 }
									]
								});

								strictEqual(value, "FieldValue");
							}
						}
					);

					it(
						"sets the value of a dependent field to a specified field value in each row" +
							"if the master value changes to false",
						() => {
							const store = DEP_ELEMENT.setupStore({
								models,
								data: { document: DEP_ELEMENT.createDocument() }
							});
							store.dispatch(
								Events.valueChange({
									path: DEP_ELEMENT.pathToMasterBooleanField,
									value: false,
									formModelElementPath: []
								})
							);

							const document = DataSelectors.document()(store.getState());

							for (let i = 1; i < 4; i++) {
								const value = DocumentUtils.getValue({
									document: document as GroupInstance,
									path: [
										...DEP_ELEMENT.BOOLEAN.DEPENDENT_FIELD_GROUP_FALSE,
										{ elementName: "DependentFieldsInRepeatableGroup", index: i },
										{ elementName: "DepRepeatFieldValue", index: 1 }
									]
								});

								strictEqual(value, "FieldValue");
							}
						}
					);
				}
			);
		});
	});
}
