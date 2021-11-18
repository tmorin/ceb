# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
