# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.0.0](https://github.com/tmorin/ceb/compare/v6.1.0...v7.0.0) (2021-12-19)


### Features

* **ceb-messaging-inversion:** `ceb-messaging-inversion` should not depend on Inversion ([cb52ef3](https://github.com/tmorin/ceb/commit/cb52ef3d3068a97cf83d17728c1d15e8e6924fd0))
* **ceb-messaging-simple-inversion:** `ceb-messaging-simple` should not depend on Inversion ([8d0b70f](https://github.com/tmorin/ceb/commit/8d0b70f72f04d268a16a3ce7105da7e8ca8f4f1b))


### BREAKING CHANGES

* **ceb-messaging-inversion:** the package `ceb-messaging-inversion` is not more able to discover handlers and listener with Inversion, the feature has been migrated to `ceb-messaging-inversion`
