<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://www.mgm-tp.com/global-content/cd/logos/a12/app-icons/dark/A12-Dark.svg" />
  <img src="https://www.mgm-tp.com/global-content/cd/logos/a12/app-icons/light/A12-Light.svg" height="200" alt="A12 logo" />
</picture>

# Form Engine

This repository contains an engine to interpret an A12 form model and a set of Java libraries to provide backend support on the model level.

Refer to https://geta12.com/#/docs to get started with A12 development

---

## License

Parts of the A12 platform are made available under a **dual license**.
Please check the [LICENSE](./LICENSE) file for details.

---

## Packages Documentation

### Java

- **form-model** - contains the Java code part of the repository.
- **computation-relevancy-analyzer** - CLI tool that analyzes and validates form computation dependencies

### TypeScript

- **formengine-core** - contains the form engine which interprets the A12 form model
- **form-model-generator** - code generator for form models
- **formengine-content-elements** - Experimental content elements for content models
- **formengine-content-elements-editor** - Editor UI components for content elements
- **migrationTool** - CLI tool for migrating form models
- **codemod** - CLI tool for automated code transformations

### Other

- **documentation** - Developer documentation and TypeDoc API references
- **exampleModels** - contains form models that are shown by the form engine dev application and which are used for the testing the form engine features.

## Getting Started

### How to Use It

To install the latest Java dependency, add them to you `dependencies` section in your build.gradle.

```groovy
dependencies {
	implementation 'com.mgmtp.a12.com.mgmtp.a12.formengine:formengine-model'
}
```

To install the latest npm package, use npm/pnpm:

```sh
npm install @com.mgmtp.a12.formengine/formengine-core
```

### How to Build and Run

This repository uses [Gradle] as the leading build tool. The following tasks
can be executed in the repository root or in individual folders to build specific
sub-projects. In the repository root, gradle tasks include TypeScript projects.

#### Prerequisites

The following tools are required in order to build this repository.

| Tool     | Version |
| -------- | ------- |
| [JDK]    | `^21`   |
| [Gradle] | `^8.11.0` |
| [Node]   | `^24`   |
| [pnpm]   | `^11`   |

#### How to Build

```sh
gradle assemble
```

#### How to Test

```sh
gradle check
```

#### Cleaning Build Artifacts

```sh
gradle clean
```

#### Code Quality

```sh
gradle verify
```

#### How to Run

In the `devapp` subpackage, use following npm scripts to start the application.

To start the application in mock mode (no backend, all requests stubbed), use

```sh
node --run start:mock // or simply node --run start
```

To start the application in server mode (using a real DataServices backend), use

```sh
node --run start:services
```

### Helpful Tasks for Development

#### Make updates to example models available to dev server

```sh
gradle onlyBuildModels
```

#### Rebuild only the developer documentation

```sh
gradle onlyBuildDocumentation
```

---

### Documentation

- Full technical documentation is available at [GetA12.com](https://GetA12.com).
- The website also provides access to the **A12 Discourse Community Forum**.

---

**The mgm A12 Team**

[mgm technology partners GmbH](https://www.mgm-tp.com) | [Imprint](https://www.mgm-tp.com/imprint.html)

<!-- References -->

[JDK]: https://www.oracle.com/technetwork/java/javase/overview/index.html
[Gradle]: https://docs.gradle.org/
[Node]: https://nodejs.org/en/docs/
[pnpm]: https://pnpm.io/motivation
