import { FormModel } from "@com.mgmtp.a12.formengine/formengine-core";

declare const element: FormModel.Stylable;
declare const styles: readonly FormModel.Style[];

// stylableToClassName usage
const className1 = FormModel.stylableToClassName(element);

// styleToClassName usage
const className2 = FormModel.styleToClassName(styles);

// With optional parameter
const className3 = FormModel.stylableToClassName(undefined);
const className4 = FormModel.styleToClassName(undefined);
