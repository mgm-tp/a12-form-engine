import { isFormModel } from "@com.mgmtp.a12.formengine/formengine-core";

declare const models: unknown[];
declare const model: unknown;

// Should be wrapped: isFormModel passed directly to array methods
const found = models.find(isFormModel);
const filtered = models.filter(isFormModel);
const hasModel = models.some(isFormModel);
const allModels = models.every(isFormModel);
const index = models.findIndex(isFormModel);
models.forEach(isFormModel);
const mapped = models.map(isFormModel);
const flatMapped = models.flatMap(isFormModel);

// Should NOT be wrapped: already called with explicit argument
const found2 = models.find(m => isFormModel(m));
const filtered2 = models.filter(m => isFormModel(m, true));

// Should NOT be wrapped: direct call, not a callback
if (isFormModel(model)) {
	console.log("is form model");
}

// Should NOT be wrapped: direct call with second parameter
if (isFormModel(model, true)) {
	console.log("is form model ignoring runtime");
}
