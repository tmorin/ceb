# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.0.0](https://github.com/tmorin/ceb/compare/v6.1.0...v7.0.0) (2021-12-19)


### Bug Fixes

* fix imports in examples ([429cb82](https://github.com/tmorin/ceb/commit/429cb8261626f443f590853a43b613bcdadce3a5))


### Features

* improve the ESM integration ([476a297](https://github.com/tmorin/ceb/commit/476a297575e2311ba599ca678784f71d34666afd))





# [6.0.0](https://github.com/tmorin/ceb/compare/v5.0.2...v6.0.0) (2021-11-18)


### Features

* **ceb-elements-core:** rename the package ([bed57e2](https://github.com/tmorin/ceb/commit/bed57e26a2d9904ba98d9d45cfc5bbcef4262eb1))
* **ceb-messaging-core:** improve the API with a map of internal events ([3f5d1b9](https://github.com/tmorin/ceb/commit/3f5d1b9fb14b2c50750703a334ee428b36f03f68))


### BREAKING CHANGES

* **ceb-elements-core:** the package `ceb-core` has been renamed to `ceb-elements-core`





# [5.0.0](https://github.com/tmorin/ceb/compare/v4.0.2...v5.0.0) (2021-11-11)


### Features

* **ceb-messaging-adapter-electron:** handle the `MESSAGE_TYPE` static field of `Message` ([0e64d24](https://github.com/tmorin/ceb/commit/0e64d2456e7d0b729643b419a29c49231a856e3c))





# [4.0.0](https://github.com/tmorin/ceb/compare/v3.5.0...v4.0.0) (2021-08-25)


### Features

* npm packages are compliant `CommonJS` and `ES Module` ([fe955fb](https://github.com/tmorin/ceb/commit/fe955fb6257b0750f93c477e76f8593af335da6d))
* refactor the codebase to provide NPM packages by features ([1e65b1f](https://github.com/tmorin/ceb/commit/1e65b1fd968dff22f30338550ba4b705b04ddc59))


### BREAKING CHANGES

* the following features are no more available by default with the package `@tmorin/ceb` -> `messaging`, `inversion`
