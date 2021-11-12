# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.0.1](https://github.com/tmorin/ceb/compare/v5.0.0...v5.0.1) (2021-11-12)

**Note:** Version bump only for package @tmorin/ceb-templating-literal





# [5.0.0](https://github.com/tmorin/ceb/compare/v4.0.2...v5.0.0) (2021-11-11)


### Bug Fixes

* **ceb-templating-literal:** attribute name with matching value should not be handled as boolean ([8b37edf](https://github.com/tmorin/ceb/commit/8b37edff5ce62db09295eed2b5d10d8cfa3412f4))
* **ceb-templating-parser:** parser cannot work on repetitive structure ([d9a8b1d](https://github.com/tmorin/ceb/commit/d9a8b1d296bee632ea07ac0c17f0c35cdd58ee58))


### Features

* **ceb-messaging-adapter-electron:** handle the `MESSAGE_TYPE` static field of `Message` ([0e64d24](https://github.com/tmorin/ceb/commit/0e64d2456e7d0b729643b419a29c49231a856e3c))





# [4.0.0](https://github.com/tmorin/ceb/compare/v3.5.0...v4.0.0) (2021-08-25)


### Features

* npm packages are compliant `CommonJS` and `ES Module` ([fe955fb](https://github.com/tmorin/ceb/commit/fe955fb6257b0750f93c477e76f8593af335da6d))
* refactor the codebase to provide NPM packages by features ([1e65b1f](https://github.com/tmorin/ceb/commit/1e65b1fd968dff22f30338550ba4b705b04ddc59))


### BREAKING CHANGES

* the following features are no more available by default with the package `@tmorin/ceb` -> `messaging`, `inversion`
