# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.0.0](https://github.com/tmorin/ceb/compare/v6.1.0...v7.0.0) (2021-12-19)


### Bug Fixes

* action results must be always defined ([ac6f335](https://github.com/tmorin/ceb/commit/ac6f3352db2e91b226bdbda6849b5c21dd6759c8))
* enable skipLibCheck to handle conflict between jest and mocha :( ([263a504](https://github.com/tmorin/ceb/commit/263a5043babbd8d8c9b77f223cea1fc33d79cb02))


### Features

* **book:** review the book ([e3bd1e1](https://github.com/tmorin/ceb/commit/e3bd1e16da1b1f07c3a4a49be603a11bc434d72f))
* **ceb-messaging-adapter-purify:** add support to inversion ([6e512af](https://github.com/tmorin/ceb/commit/6e512af0463f0d27b203f1a09f9fddc680d4b60a))
* **ceb-messaging-core:** received messages should be observable ([f9d4205](https://github.com/tmorin/ceb/commit/f9d42056b281ddaeae59239199a4b7442ed73ffa))
* **ceb-messaging-core:** simplify the bus interface ([6145e07](https://github.com/tmorin/ceb/commit/6145e07fddba77030984ab341944e4cc5e79c5c1))
* **ceb-messaging-inversion:** `ceb-messaging-inversion` should not depend on Inversion ([cb52ef3](https://github.com/tmorin/ceb/commit/cb52ef3d3068a97cf83d17728c1d15e8e6924fd0))
* **ceb-messaging-simple-inversion:** `ceb-messaging-simple` should not depend on Inversion ([8d0b70f](https://github.com/tmorin/ceb/commit/8d0b70f72f04d268a16a3ce7105da7e8ca8f4f1b))
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
* **ceb-messaging-simple-builder:** extract the Builder in a dedicated package ([abb6c9d](https://github.com/tmorin/ceb/commit/abb6c9dc024d0dbc5e2d1140b2c5b0ce0cf46207))
* **ceb-messaging-simple:** `Bus` can handles `MessageType` and `MessageConstructor` ([0ed3a29](https://github.com/tmorin/ceb/commit/0ed3a2929c0f3e9a3d62230ec6427d9b91571560))
* **ceb-messaging-simple:** add options to the inversion module ([c72273b](https://github.com/tmorin/ceb/commit/c72273b6c4ffa128fa77b157c6db52429d1907a1))
* **ceb-messaging-simple:** add support for internal event like `error` or `dispose` ([87bca25](https://github.com/tmorin/ceb/commit/87bca25a96d3b5f7184ab97c65c86649f062a18d))
* **ceb-messaging-simple:** refactor the package to embrace messaging guidelines ([83829ab](https://github.com/tmorin/ceb/commit/83829ab70aeeb84f7b34b0bee91772f731e35dc4))


### BREAKING CHANGES

* **ceb-messaging-simple-builder:** the class `SimpleBusBuilder` is now located in the package `ceb-messaging-simple-builder`
* **ceb-messaging-simple:** the class `AbstractSimpleMessage` and descendants have been impacted





# [4.0.0](https://github.com/tmorin/ceb/compare/v3.5.0...v4.0.0) (2021-08-25)


### Features

* npm packages are compliant `CommonJS` and `ES Module` ([fe955fb](https://github.com/tmorin/ceb/commit/fe955fb6257b0750f93c477e76f8593af335da6d))
* refactor the codebase to provide NPM packages by features ([1e65b1f](https://github.com/tmorin/ceb/commit/1e65b1fd968dff22f30338550ba4b705b04ddc59))


### BREAKING CHANGES

* the following features are no more available by default with the package `@tmorin/ceb` -> `messaging`, `inversion`
