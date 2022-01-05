# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.1.0](https://github.com/tmorin/ceb/compare/v7.0.2...v7.1.0) (2022-01-05)

**Note:** Version bump only for package @tmorin/ceb-messaging-simple-builder





## [7.0.2](https://github.com/tmorin/ceb/compare/v7.0.1...v7.0.2) (2021-12-21)

**Note:** Version bump only for package @tmorin/ceb-messaging-simple-builder





# [7.0.0](https://github.com/tmorin/ceb/compare/v6.1.0...v7.0.0) (2021-12-19)


### Features

* **ceb-messaging-core:** simplify the bus interface ([6145e07](https://github.com/tmorin/ceb/commit/6145e07fddba77030984ab341944e4cc5e79c5c1))
* **ceb-messaging:** provide a new implementation with a better integration of functional programming concerns ([f2963ed](https://github.com/tmorin/ceb/commit/f2963edc916eda4a0db1d1bd6e6bb534804a5271))
* improve the ESM integration ([476a297](https://github.com/tmorin/ceb/commit/476a297575e2311ba599ca678784f71d34666afd))


### BREAKING CHANGES

* **ceb-messaging:** the concepts still remain the same, but the new implementation break almost everything.





# [6.0.0](https://github.com/tmorin/ceb/compare/v5.0.2...v6.0.0) (2021-11-18)


### Features

* **ceb-elements-core:** rename the package ([bed57e2](https://github.com/tmorin/ceb/commit/bed57e26a2d9904ba98d9d45cfc5bbcef4262eb1))


### BREAKING CHANGES

* **ceb-elements-core:** the package `ceb-core` has been renamed to `ceb-elements-core`





# [5.0.0](https://github.com/tmorin/ceb/compare/v4.0.2...v5.0.0) (2021-11-11)


### Features

* **ceb-messaging-core-builder:** extract the base Builder in a dedicated package ([0a137b6](https://github.com/tmorin/ceb/commit/0a137b67413f2735618e56de274f1641a3108d8d))
* **ceb-messaging-simple-builder:** extract the Builder in a dedicated package ([abb6c9d](https://github.com/tmorin/ceb/commit/abb6c9dc024d0dbc5e2d1140b2c5b0ce0cf46207))


### BREAKING CHANGES

* **ceb-messaging-core-builder:** the class `AbstractBusBuilder` is now located in the package `ceb-messaging-simple-builder-builder`
* **ceb-messaging-simple-builder:** the class `SimpleBusBuilder` is now located in the package `ceb-messaging-simple-builder`
