# Manual Migration Required

The following models cannot be migrated with the migration tool since they are intentionally invalid.
The schema validation of the migration tool will fail and thus any migration has to be performed manually (for now).

- form-model/src/test/resources/com/mgmtp/a12/model/ui/form/consistency/rules/metadata/ProductFormWrongVersion.json
- form-model/src/test/resources/com/mgmtp/a12/model/ui/form/consistency/rules/metadata/ProductFormWrongVersionPreRelease.json
