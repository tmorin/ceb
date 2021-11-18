# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [6.0.0](https://github.com/tmorin/ceb/compare/v5.0.2...v6.0.0) (2021-11-18)


### Features

* **ceb-bundle-web:** rename the package ([39b8234](https://github.com/tmorin/ceb/commit/39b82341e4af1e3f68ad21785ea3c23b1fef5eb2))
* **ceb-elements-core:** rename the package ([bed57e2](https://github.com/tmorin/ceb/commit/bed57e26a2d9904ba98d9d45cfc5bbcef4262eb1))
* **ceb-elements-testing:** rename the package ([7918392](https://github.com/tmorin/ceb/commit/79183922d5e9e58fe92924f07db35ae3fa4629a7))
* **ceb-inversion-core:** rename the package ([0d81ed2](https://github.com/tmorin/ceb/commit/0d81ed27d528890a5fc58e5410122a9480622c1e))
* **ceb-messaging-core:** improve the API with a map of internal events ([3f5d1b9](https://github.com/tmorin/ceb/commit/3f5d1b9fb14b2c50750703a334ee428b36f03f68))


### BREAKING CHANGES

* **ceb-bundle-web:** the package `ceb` has been renamed to `ceb-bundle-web`
* **ceb-inversion-core:** the package `ceb-inversion` has been renamed to `ceb-inversion-core`
* **ceb-elements-testing:** the package `ceb-testing` has been renamed to `ceb-elements-testing`
* **ceb-elements-core:** the package `ceb-core` has been renamed to `ceb-elements-core`





# [5.0.0](https://github.com/tmorin/ceb/compare/v4.0.2...v5.0.0) (2021-11-11)


### Features

* **ceb-messaging-adapter-electron:** handle the `MESSAGE_TYPE` static field of `Message` ([0e64d24](https://github.com/tmorin/ceb/commit/0e64d2456e7d0b729643b419a29c49231a856e3c))
* **ceb-messaging-core-builder:** extract the base Builder in a dedicated package ([0a137b6](https://github.com/tmorin/ceb/commit/0a137b67413f2735618e56de274f1641a3108d8d))
* **ceb-messaging-dom:** `Bus` can handles `MessageType` and `MessageConstructor` ([53b40f3](https://github.com/tmorin/ceb/commit/53b40f37bfdee87ce3bdbfd13eeea44de1dbcd36))
* **ceb-messaging-dom:** add options to the inversion module ([dbae0e0](https://github.com/tmorin/ceb/commit/dbae0e07675be5add53beeaf3b69a37c1803e07b))
* **ceb-messaging-dom:** add support for internal event like `error` or `dispose` ([f6c38b9](https://github.com/tmorin/ceb/commit/f6c38b9213541db46ac4ad633c762194b85f8da2))
* **ceb-messaging-dom:** refactor the package to embrace messaging guidelines ([d99c0d7](https://github.com/tmorin/ceb/commit/d99c0d7eeba82fca71e383389658aaad1e77f697))


### BREAKING CHANGES

* **ceb-messaging-core-builder:** the class `AbstractBusBuilder` is now located in the package `ceb-messaging-simple-builder-builder`
* **ceb-messaging-dom:** the class `DomMessage` and descendants have been impacted





## [4.0.2](https://github.com/tmorin/ceb/compare/v4.0.1...v4.0.2) (2021-08-25)


### Bug Fixes

* **ceb-messaging-dom:** DomBus cannot be used properly from Custom Element ([086d5f6](https://github.com/tmorin/ceb/commit/086d5f6376e4d98364ada5aa9bed6f4e47c41251))





# [4.0.0](https://github.com/tmorin/ceb/compare/v3.5.0...v4.0.0) (2021-08-25)


### Features

* npm packages are compliant `CommonJS` and `ES Module` ([fe955fb](https://github.com/tmorin/ceb/commit/fe955fb6257b0750f93c477e76f8593af335da6d))
* refactor the codebase to provide NPM packages by features ([1e65b1f](https://github.com/tmorin/ceb/commit/1e65b1fd968dff22f30338550ba4b705b04ddc59))


### BREAKING CHANGES

* the following features are no more available by default with the package `@tmorin/ceb` -> `messaging`, `inversion`
