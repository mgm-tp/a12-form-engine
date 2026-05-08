# Form Model Examples

This project contains example form models which are used for testing the Form-Engine.
For some of the models it also contains data examples.

## Generate Validation Code

Run
```sh
gradle assemble
```
to generate validation code and copy models in `build/models`.

## Structure

The folder *src* contains all models which should be shown in the devapp.

### Naming Convention

For the automated process it is necessary to name your models as the following.

_Please also check whether the model id is the same as the filename without json suffix._

* Form model: `group path` + `group path with dots instead slashes` + (`.` + `special form name`)? + `-form.json`  
* Document model: `group path` + `group path with dots instead slashes` `-document.json`

#### Examples

```
a11y/a11y-form.json
a11y/a11y.controls-form.json
a11y/a11y-document.json

a11y/other/a11y.other-form.json
a11y/other/a11y.other-document.json
```