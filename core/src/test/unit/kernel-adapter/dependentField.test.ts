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

import { deepStrictEqual } from "node:assert/strict";

import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { computeAndEvaluateDependencies } from "../../../back-end/store/internal/computation.js";
import { DocumentPath } from "../../../models/index.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

describe("unit.back-end.store.kernel-adapter", () => {
	describe("dependentField", () => {
		const models = setupModelsFixture("dependencies.field");

		function evaluateAndAssert(
			path: EntityInstancePath,
			documentBefore: GroupInstance,
			documentAfter: GroupInstance
		) {
			const result = computeAndEvaluateDependencies({
				document: documentBefore,
				models,
				changes: {
					[DocumentPath.toString(path)]: { type: "ValueChanged", path }
				},
				kernelConfiguration: {}
			});

			deepStrictEqual(result.document, documentAfter);
		}

		describe("for fields defined within the same granularity", () => {
			describe("that is a non-repeatable group", () => {
				it("sets a constant field value when triggered from an enum master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "enum1", index: 1 }
					];

					const documentBefore = {
						base: {
							enum1: "a"
						}
					};
					const documentAfter = {
						base: {
							enum1: "a",
							number1: 1
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});

				it("sets a constant field value when triggered from a boolean master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "bool1", index: 1 }
					];

					const documentBefore = {
						base: {
							bool1: true
						}
					};
					const documentAfter = {
						base: {
							bool1: true,
							number2: 50
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});

				it("sets a constant field value when triggered from a confirm master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "confirm1", index: 1 }
					];

					const documentBefore = {
						base: {
							confirm1: true
						}
					};
					const documentAfter = {
						base: {
							confirm1: true,
							number3: 75
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});

				it("sets a referenced field value when triggered from an enum master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "enum2", index: 1 }
					];

					const documentBefore = {
						base: {
							enum2: "one",
							string1: "test"
						}
					};
					const documentAfter = {
						base: {
							enum2: "one",
							string1: "test",
							string2: "test"
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});

				it("sets a referenced field value when triggered from a boolean master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "bool2", index: 1 }
					];

					const documentBefore = {
						base: {
							bool2: true,
							string4: "test2"
						}
					};
					const documentAfter = {
						base: {
							bool2: true,
							string4: "test2",
							string5: "test2"
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});

				it("sets a referenced field value when triggered from a confirm master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "confirm2", index: 1 }
					];

					const documentBefore = {
						base: {
							confirm2: true,
							string6: "test3"
						}
					};
					const documentAfter = {
						base: {
							confirm2: true,
							string6: "test3",
							string7: "test3"
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});
			});

			describe("that is a repeatable group", () => {
				it("sets a constant field value when triggered from an enum master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "list", index: 2 },
						{ elementName: "enum1", index: 1 }
					];

					const documentBefore = {
						base: {
							list: [{}, { enum1: "a" }]
						}
					};
					const documentAfter = {
						base: {
							list: [{}, { enum1: "a", number1: 1 }]
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});

				it("sets a constant field value when triggered from a boolean master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "list", index: 2 },
						{ elementName: "bool1", index: 1 }
					];

					const documentBefore = {
						base: {
							list: [{}, { bool1: true }]
						}
					};
					const documentAfter = {
						base: {
							list: [{}, { bool1: true, number2: 50 }]
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});

				it("sets a constant field value when triggered from a confirm master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "list", index: 2 },
						{ elementName: "confirm1", index: 1 }
					];

					const documentBefore = {
						base: {
							list: [{}, { confirm1: true }]
						}
					};
					const documentAfter = {
						base: {
							list: [{}, { confirm1: true, number3: 75 }]
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});

				it("sets a referenced field value when triggered from an enum master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "list", index: 2 },
						{ elementName: "enum2", index: 1 }
					];

					const documentBefore = {
						base: {
							list: [{}, { enum2: "one", string1: "test" }]
						}
					};
					const documentAfter = {
						base: {
							list: [{}, { enum2: "one", string1: "test", string2: "test" }]
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});

				it("sets a referenced field value when triggered from a boolean master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "list", index: 2 },
						{ elementName: "bool2", index: 1 }
					];

					const documentBefore = {
						base: {
							list: [{}, { bool2: true, string4: "test2" }]
						}
					};
					const documentAfter = {
						base: {
							list: [{}, { bool2: true, string4: "test2", string5: "test2" }]
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});

				it("sets a referenced field value when triggered from a confirm master field", () => {
					const path: EntityInstancePath = [
						{ elementName: "base", index: 1 },
						{ elementName: "list", index: 2 },
						{ elementName: "confirm2", index: 1 }
					];

					const documentBefore = {
						base: {
							list: [{}, { confirm2: true, string6: "test3" }]
						}
					};
					const documentAfter = {
						base: {
							list: [{}, { confirm2: true, string6: "test3", string7: "test3" }]
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});
			});
		});

		describe("for fields defined in a deeper nested repeatable group", () => {
			it("sets a constant field value for all existent repetitions when triggered from an enum master field", () => {
				const path: EntityInstancePath = [
					{ elementName: "toMany", index: 1 },
					{ elementName: "enum1", index: 1 }
				];

				const documentBefore = {
					toMany: {
						enum1: "a",
						rep: [{}, {}, {}]
					}
				};
				const documentAfter = {
					toMany: {
						enum1: "a",
						rep: [{ number1: 1 }, { number1: 1 }, { number1: 1 }]
					}
				};

				evaluateAndAssert(path, documentBefore, documentAfter);
			});

			it("sets a constant field value for all existent repetitions when triggered from a boolean master field", () => {
				const path: EntityInstancePath = [
					{ elementName: "toMany", index: 1 },
					{ elementName: "bool1", index: 1 }
				];

				const documentBefore = {
					toMany: {
						bool1: true,
						rep: [{}, {}, {}]
					}
				};
				const documentAfter = {
					toMany: {
						bool1: true,
						rep: [{ number2: 50 }, { number2: 50 }, { number2: 50 }]
					}
				};

				evaluateAndAssert(path, documentBefore, documentAfter);
			});

			it("sets a constant field value for all existent repetitions when triggered from a confirm master field", () => {
				const path: EntityInstancePath = [
					{ elementName: "toMany", index: 1 },
					{ elementName: "confirm1", index: 1 }
				];

				const documentBefore = {
					toMany: {
						confirm1: true,
						rep: [{}, {}, {}]
					}
				};
				const documentAfter = {
					toMany: {
						confirm1: true,
						rep: [{ number3: 75 }, { number3: 75 }, { number3: 75 }]
					}
				};

				evaluateAndAssert(path, documentBefore, documentAfter);
			});
		});

		describe("for configurations with referenced fields and differing granularities", () => {
			describe("when master, referenced field and dependent field belong to the same granularity", () => {
				it("sets the referenced field value when the fields belong to different non-repeatable groups", () => {
					const path: EntityInstancePath = [
						{ elementName: "granularity", index: 1 },
						{ elementName: "master1", index: 1 }
					];

					const documentBefore = {
						granularity: {
							master1: true,
							nested_non_rep: {
								refField1: "case #1 value"
							}
						}
					};
					const documentAfter = {
						granularity: {
							master1: true,
							nested_non_rep: {
								refField1: "case #1 value"
							},
							nested_non_rep2: {
								targetField1: "case #1 value"
							}
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});
			});

			describe("when master & referenced field are located higher than the repeatable dependent field", () => {
				it("sets the referenced field value to all instances of the dependent field", () => {
					const path: EntityInstancePath = [
						{ elementName: "granularity", index: 1 },
						{ elementName: "master2", index: 1 }
					];

					const documentBefore = {
						granularity: {
							master2: true,
							nested_non_rep: {
								refField2: "case #2 value"
							},
							rep2: [
								{
									nested_non_rep: {}
								},
								{
									nested_non_rep: {}
								},
								{
									nested_non_rep: {}
								}
							]
						}
					};
					const documentAfter = {
						granularity: {
							master2: true,
							nested_non_rep: {
								refField2: "case #2 value"
							},
							rep2: [
								{
									nested_non_rep: {
										targetField2: "case #2 value"
									}
								},
								{
									nested_non_rep: {
										targetField2: "case #2 value"
									}
								},
								{
									nested_non_rep: {
										targetField2: "case #2 value"
									}
								}
							]
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});
			});

			describe("when the master is located higher than the repeatable referenced and dependent field", () => {
				it("sets the referenced field value to all instances of the dependent field", () => {
					const path: EntityInstancePath = [
						{ elementName: "granularity", index: 1 },
						{ elementName: "master3", index: 1 }
					];

					const documentBefore = {
						granularity: {
							master3: true,
							rep3: [
								{
									nested_non_rep1: { refField3: "case value 1" }
								},
								{
									nested_non_rep1: { refField3: "case value 2" }
								},
								{
									nested_non_rep1: { refField3: "case value 3" }
								}
							]
						}
					};
					const documentAfter = {
						granularity: {
							master3: true,
							rep3: [
								{
									nested_non_rep1: { refField3: "case value 1" },
									nested_non_rep2: { targetField3: "case value 1" }
								},
								{
									nested_non_rep1: { refField3: "case value 2" },
									nested_non_rep2: { targetField3: "case value 2" }
								},
								{
									nested_non_rep1: { refField3: "case value 3" },
									nested_non_rep2: { targetField3: "case value 3" }
								}
							]
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});
			});

			describe("when the master is located higher than the referenced field, which is located higher than the dependent field", () => {
				it("sets the respective referenced field instance values to all instances of the respective dependent field", () => {
					const path: EntityInstancePath = [
						{ elementName: "granularity", index: 1 },
						{ elementName: "master4", index: 1 }
					];

					const documentBefore = {
						granularity: {
							master4: true,
							rep4: [
								{
									nested_non_rep: {
										refField4: "case #4 value"
									},
									nested_rep4: [{}, {}]
								},
								{
									nested_non_rep: {
										refField4: "case #4 value 2"
									},
									nested_rep4: [{}, {}]
								}
							]
						}
					};
					const documentAfter = {
						granularity: {
							master4: true,
							rep4: [
								{
									nested_non_rep: {
										refField4: "case #4 value"
									},
									nested_rep4: [
										{
											targetField4: "case #4 value"
										},
										{
											targetField4: "case #4 value"
										}
									]
								},
								{
									nested_non_rep: {
										refField4: "case #4 value 2"
									},
									nested_rep4: [
										{
											targetField4: "case #4 value 2"
										},
										{
											targetField4: "case #4 value 2"
										}
									]
								}
							]
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});
			});

			describe("when the referenced field is located higher than the master field, which is located higher than the dependent field", () => {
				it("sets the referenced field instance value to all instances of the respective dependent field that belong to the changed master field instance", () => {
					const path: EntityInstancePath = [
						{ elementName: "granularity", index: 1 },
						{ elementName: "rep5", index: 2 },
						{ elementName: "nested_non_rep5", index: 1 },
						{ elementName: "master5", index: 1 }
					];

					const documentBefore = {
						granularity: {
							refField5: "case #5 value",
							rep5: [
								{
									nested_non_rep5: {},
									nested_rep5: [
										{
											targetField5: "999"
										},
										{
											targetField5: "999"
										}
									]
								},
								{
									nested_non_rep5: {
										master5: true
									},
									nested_rep5: [
										{
											targetField5: "123"
										},
										{
											targetField5: "123"
										}
									]
								},
								{
									nested_non_rep5: {},
									nested_rep5: [
										{
											targetField5: "777"
										},
										{
											targetField5: "777"
										}
									]
								}
							]
						}
					};
					const documentAfter = {
						granularity: {
							refField5: "case #5 value",
							rep5: [
								{
									nested_non_rep5: {},
									nested_rep5: [
										{
											targetField5: "999"
										},
										{
											targetField5: "999"
										}
									]
								},
								{
									nested_non_rep5: {
										master5: true
									},
									nested_rep5: [
										{
											targetField5: "case #5 value"
										},
										{
											targetField5: "case #5 value"
										}
									]
								},
								{
									nested_non_rep5: {},
									nested_rep5: [
										{
											targetField5: "777"
										},
										{
											targetField5: "777"
										}
									]
								}
							]
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});
			});
		});

		describe("chains", () => {
			describe("when multiple dependent fields form a chain", () => {
				it("then changing the master field value, updates all other field values in the chain", () => {
					const path: EntityInstancePath = [
						{ elementName: "chains", index: 1 },
						{ elementName: "depFields", index: 1 },
						{ elementName: "init", index: 1 }
					];

					const documentBefore = {
						chains: {
							depFields: {
								init: true
							}
						}
					};
					const documentAfter = {
						chains: {
							depFields: {
								init: true,
								intermediate: "b",
								target: 100
							}
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});
			});

			describe("when dependent fields & dependent enums form a chain", () => {
				it("then changing the master field value, updates all other field values in the chain", () => {
					const path: EntityInstancePath = [
						{ elementName: "chains", index: 1 },
						{ elementName: "formDependencies", index: 1 },
						{ elementName: "init", index: 1 }
					];

					const documentBefore = {
						chains: {
							formDependencies: {
								init: true
							}
						}
					};
					const documentAfter = {
						chains: {
							formDependencies: {
								init: true,
								intermediate: "b",
								depEnum: "two",
								target: 100
							}
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});
			});

			describe("when dependent fields & computations form a chain", () => {
				describe("and the first part of the chain is a dependent field", () => {
					it("then changing the master field value, updates all other field values in the chain", () => {
						const path: EntityInstancePath = [
							{ elementName: "chains", index: 1 },
							{ elementName: "computations", index: 1 },
							{ elementName: "init", index: 1 }
						];

						const documentBefore = {
							chains: {
								computations: {
									init: true
								}
							}
						};
						const documentAfter = {
							chains: {
								computations: {
									init: true,
									intermediate: "b",
									target: 123
								}
							}
						};

						evaluateAndAssert(path, documentBefore, documentAfter);
					});
				});

				describe("and the first part of the chain is a computation", () => {
					it("then changing the first field value, updates all other field values in the chain", () => {
						const path: EntityInstancePath = [
							{ elementName: "chains", index: 1 },
							{ elementName: "computations", index: 1 },
							{ elementName: "init2", index: 1 }
						];

						const documentBefore = {
							chains: {
								computations: {
									init2: true
								}
							}
						};
						const documentAfter = {
							chains: {
								computations: {
									init2: true,
									intermediate2: "a",
									target2: 50
								}
							}
						};

						evaluateAndAssert(path, documentBefore, documentAfter);
					});
				});
			});

			describe("when the chain contains dependent fields & enums & computations and traverses into multiple levels of nested repeatable groups", () => {
				it("then changing the first field value, updates all other field values in the chain in all respective levels of repetitions", () => {
					const path: EntityInstancePath = [
						{ elementName: "chains", index: 1 },
						{ elementName: "complex", index: 1 },
						{ elementName: "init", index: 1 }
					];

					const documentBefore = {
						chains: {
							complex: {
								init: true,
								level1: [
									{
										depField: 0,
										level2: [
											{
												compField: "value01",
												level3: [
													{
														level4: [{ targetField: 0 }, { targetField: 0 }],
														depEnum: "depValue01"
													},
													{
														level4: [{ targetField: 0 }, { targetField: 0 }],
														depEnum: "depValue01"
													}
												]
											},
											{
												compField: "value01",
												level3: [
													{
														level4: [{ targetField: 0 }, { targetField: 0 }],
														depEnum: "depValue01"
													},
													{
														level4: [{ targetField: 0 }, { targetField: 0 }],
														depEnum: "depValue01"
													}
												]
											}
										]
									},
									{
										depField: 0,
										level2: [
											{
												compField: "value01",
												level3: [
													{
														level4: [{ targetField: 0 }, { targetField: 0 }],
														depEnum: "depValue01"
													},
													{
														level4: [{ targetField: 0 }, { targetField: 0 }],
														depEnum: "depValue01"
													}
												]
											},
											{
												compField: "value01",
												level3: [
													{
														level4: [{ targetField: 0 }, { targetField: 0 }],
														depEnum: "depValue01"
													},
													{
														level4: [{ targetField: 0 }, { targetField: 0 }],
														depEnum: "depValue01"
													}
												]
											}
										]
									}
								]
							}
						}
					};
					const documentAfter = {
						chains: {
							complex: {
								init: true,
								level1: [
									{
										depField: 100,
										level2: [
											{
												compField: "value02",
												level3: [
													{
														level4: [{ targetField: 123 }, { targetField: 123 }],
														depEnum: "depValue02"
													},
													{
														level4: [{ targetField: 123 }, { targetField: 123 }],
														depEnum: "depValue02"
													}
												]
											},
											{
												compField: "value02",
												level3: [
													{
														level4: [{ targetField: 123 }, { targetField: 123 }],
														depEnum: "depValue02"
													},
													{
														level4: [{ targetField: 123 }, { targetField: 123 }],
														depEnum: "depValue02"
													}
												]
											}
										]
									},
									{
										depField: 100,
										level2: [
											{
												compField: "value02",
												level3: [
													{
														level4: [{ targetField: 123 }, { targetField: 123 }],
														depEnum: "depValue02"
													},
													{
														level4: [{ targetField: 123 }, { targetField: 123 }],
														depEnum: "depValue02"
													}
												]
											},
											{
												compField: "value02",
												level3: [
													{
														level4: [{ targetField: 123 }, { targetField: 123 }],
														depEnum: "depValue02"
													},
													{
														level4: [{ targetField: 123 }, { targetField: 123 }],
														depEnum: "depValue02"
													}
												]
											}
										]
									}
								]
							}
						}
					};

					evaluateAndAssert(path, documentBefore, documentAfter);
				});
			});
		});
	});
});
