## Form-Engine

This package contains the Form-Engine which can be used to render form models.

### Build

The package can be build by running:

- `pnpm install` (in the repository root)
- `node --run build` (in this directory)

### Typescript

The compile step will use the typescript version specified in the workspace to compile the sources. Since the used TS version here might be newer than the current minimum version of A12 (as defined in devtools), this step will additionally check that the generated .d.ts files are "valid" in that TS version as well (e.g. trying to use the TS type `NoInfer` that was introduced in 5.4 will fail compilation when using TS 5.3).

### Models

The models for the devapp are stored in the folder **exampleModels** in the client project.
They need to be converted before executing the tests.
The models can be converted by running

```sh
gradle convert -p ../exampleModels/
```
