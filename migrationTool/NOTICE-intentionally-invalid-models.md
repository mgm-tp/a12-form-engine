# Manual Migration Required

The following models cannot be migrated with the migration tool since they are intentionally invalid.
The schema validation of the migration tool will fail and thus any migration has to be performed manually (for now).

- form-model/src/test/resources/com/mgmtp/a12/formengine/consistency/rules/condition/TestFormNoCases.json
- form-model/src/test/resources/com/mgmtp/a12/formengine/consistency/rules/label/InvalidWrongLabelTypeTestForm.json
- form-model/src/test/resources/com/mgmtp/a12/formengine/consistency/rules/label/InvalidBothTextsSetTestForm.json
- form-model/src/test/resources/com/mgmtp/a12/formengine/consistency/rules/label/InvalidMissingTextTestForm.json
- form-model/src/test/resources/com/mgmtp/a12/formengine/consistency/rules/label/InvalidMissingTypeTestForm.json
- form-model/src/test/resources/com/mgmtp/a12/formengine/consistency/general/ProductFormWithWrongNavigationButtons.json
- form-model/src/test/resources/com/mgmtp/a12/formengine/consistency/rules/layout/button/ProductFormWithWrongNavigationButtons.json
- form-model/src/test/resources/com/mgmtp/a12/formengine/consistency/rules/other/DependentControlWithNoScreenElement.json
- form-model/src/test/resources/com/mgmtp/a12/formengine/consistency/rules/repeat/multiFileUpload/TestForm.json
- form-model/src/test/resources/com/mgmtp/a12/formengine/consistency/rules/repeat/ProductFormWithInvalidIconLabelEvent.json
