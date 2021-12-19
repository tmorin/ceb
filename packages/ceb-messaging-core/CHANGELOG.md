# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.0.0](https://github.com/tmorin/ceb/compare/v6.1.0...v7.0.0) (2021-12-19)


### Bug Fixes

* action results must be always defined ([ac6f335](https://github.com/tmorin/ceb/commit/ac6f3352db2e91b226bdbda6849b5c21dd6759c8))


### Features

* **ceb-messaging-adapter-purify:** add support to inversion ([6e512af](https://github.com/tmorin/ceb/commit/6e512af0463f0d27b203f1a09f9fddc680d4b60a))
* **ceb-messaging-core:** add an option to customize the registry key used to resolve the `Gateway` instance ([e5b937f](https://github.com/tmorin/ceb/commit/e5b937f249903566778a49cdad7c0ed82ed0c8be))
* **ceb-messaging-core:** received messages should be observable ([f9d4205](https://github.com/tmorin/ceb/commit/f9d42056b281ddaeae59239199a4b7442ed73ffa))
* **ceb-messaging-core:** simplify the bus interface ([6145e07](https://github.com/tmorin/ceb/commit/6145e07fddba77030984ab341944e4cc5e79c5c1))
* **ceb-messaging-inversion:** `ceb-messaging-inversion` should not depend on Inversion ([cb52ef3](https://github.com/tmorin/ceb/commit/cb52ef3d3068a97cf83d17728c1d15e8e6924fd0))
* **ceb-messaging:** provide a new implementation with a better integration of functional programming concerns ([f2963ed](https://github.com/tmorin/ceb/commit/f2963edc916eda4a0db1d1bd6e6bb534804a5271))
* improve the ESM integration ([476a297](https://github.com/tmorin/ceb/commit/476a297575e2311ba599ca678784f71d34666afd))


### BREAKING CHANGES

* **ceb-messaging-inversion:** the package `ceb-messaging-inversion` is not more able to discover handlers and listener with Inversion, the feature has been migrated to `ceb-messaging-inversion`
* **ceb-messaging:** the concepts still remain the same, but the new implementation break almost everything.





# [6.0.0](https://github.com/tmorin/ceb/compare/v5.0.2...v6.0.0) (2021-11-18)


### Features

* **ceb-bundle-web:** rename the package ([39b8234](https://github.com/tmorin/ceb/commit/39b82341e4af1e3f68ad21785ea3c23b1fef5eb2))
* **ceb-inversion-core:** rename the package ([0d81ed2](https://github.com/tmorin/ceb/commit/0d81ed27d528890a5fc58e5410122a9480622c1e))
* **ceb-messaging-core:** improve the API with a map of internal events ([3f5d1b9](https://github.com/tmorin/ceb/commit/3f5d1b9fb14b2c50750703a334ee428b36f03f68))


### BREAKING CHANGES

* **ceb-bundle-web:** the package `ceb` has been renamed to `ceb-bundle-web`
* **ceb-inversion-core:** the package `ceb-inversion` has been renamed to `ceb-inversion-core`





# [5.0.0](https://github.com/tmorin/ceb/compare/v4.0.2...v5.0.0) (2021-11-11)


### Features

* **ceb-messaging-adapter-electron:** handle the `MESSAGE_TYPE` static field of `Message` ([0e64d24](https://github.com/tmorin/ceb/commit/0e64d2456e7d0b729643b419a29c49231a856e3c))
* **ceb-messaging-core-builder:** extract the base Builder in a dedicated package ([0a137b6](https://github.com/tmorin/ceb/commit/0a137b67413f2735618e56de274f1641a3108d8d))
* **ceb-messaging-core:** `Bus` can handles `MessageType` and `MessageConstructor` ([305ea02](https://github.com/tmorin/ceb/commit/305ea02ffb391852a5e3c7e0561831d904a7b11b))
* **ceb-messaging-core:** add support for internal event like `error` or `dispose` ([d3ba020](https://github.com/tmorin/ceb/commit/d3ba020cddbad9d79f599f4103f511f68b497334))
* **ceb-messaging-core:** refactor the interface `Bus` to embrace messaging guidelines ([fcbb68d](https://github.com/tmorin/ceb/commit/fcbb68d10d71db174129ebdec061cfe55145ba34))
* **ceb-messaging-core:** refactor the interface `Message` to embrace messaging guidelines ([bf6cda3](https://github.com/tmorin/ceb/commit/bf6cda3c875d86c0c7871f040b681d0a719e271a))


### BREAKING CHANGES

* **ceb-messaging-core-builder:** the class `AbstractBusBuilder` is now located in the package `ceb-messaging-simple-builder-builder`
* **ceb-messaging-core:** the following new methods must be implemented `Bus.emit`, `Bus.on`, `Bus.off`, `Bus.dispose`
* **ceb-messaging-core:** the methods `Bus.handle` and `Bus.subscribe` accept only `MessageType` and no more a constructor
* **ceb-messaging-core:** the field `Message.messageId` has been moved to `Message.headers.messageId`





# [4.0.0](https://github.com/tmorin/ceb/compare/v3.5.0...v4.0.0) (2021-08-25)


### Features

* npm packages are compliant `CommonJS` and `ES Module` ([fe955fb](https://github.com/tmorin/ceb/commit/fe955fb6257b0750f93c477e76f8593af335da6d))
* refactor the codebase to provide NPM packages by features ([1e65b1f](https://github.com/tmorin/ceb/commit/1e65b1fd968dff22f30338550ba4b705b04ddc59))


### BREAKING CHANGES

* the following features are no more available by default with the package `@tmorin/ceb` -> `messaging`, `inversion`
