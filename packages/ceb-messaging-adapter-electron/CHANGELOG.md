# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [7.1.0](https://github.com/tmorin/ceb/compare/v7.0.2...v7.1.0) (2022-01-05)

**Note:** Version bump only for package @tmorin/ceb-messaging-adapter-electron





## [7.0.2](https://github.com/tmorin/ceb/compare/v7.0.1...v7.0.2) (2021-12-21)

**Note:** Version bump only for package @tmorin/ceb-messaging-adapter-electron





## [7.0.1](https://github.com/tmorin/ceb/compare/v7.0.0...v7.0.1) (2021-12-19)


### Bug Fixes

* NPM Workspaces expected by Typedoc doesn't work well with Lerna ([c283414](https://github.com/tmorin/ceb/commit/c283414cf776d997c3422d8a39028c80f33708ab))





# [7.0.0](https://github.com/tmorin/ceb/compare/v6.1.0...v7.0.0) (2021-12-19)


### Bug Fixes

* action results must be always defined ([ac6f335](https://github.com/tmorin/ceb/commit/ac6f3352db2e91b226bdbda6849b5c21dd6759c8))
* enable skipLibCheck to handle conflict between jest and mocha :( ([263a504](https://github.com/tmorin/ceb/commit/263a5043babbd8d8c9b77f223cea1fc33d79cb02))


### Features

* **book:** review the book ([e3bd1e1](https://github.com/tmorin/ceb/commit/e3bd1e16da1b1f07c3a4a49be603a11bc434d72f))
* **ceb-messaging-core:** simplify the bus interface ([6145e07](https://github.com/tmorin/ceb/commit/6145e07fddba77030984ab341944e4cc5e79c5c1))
* **ceb-messaging-simple-inversion:** `ceb-messaging-simple` should not depend on Inversion ([8d0b70f](https://github.com/tmorin/ceb/commit/8d0b70f72f04d268a16a3ce7105da7e8ca8f4f1b))
* **ceb-messaging:** provide a new implementation with a better integration of functional programming concerns ([f2963ed](https://github.com/tmorin/ceb/commit/f2963edc916eda4a0db1d1bd6e6bb534804a5271))
* improve the ESM integration ([476a297](https://github.com/tmorin/ceb/commit/476a297575e2311ba599ca678784f71d34666afd))


### BREAKING CHANGES

* **ceb-messaging:** the concepts still remain the same, but the new implementation break almost everything.





# [6.0.0](https://github.com/tmorin/ceb/compare/v5.0.2...v6.0.0) (2021-11-18)


### Features

* **ceb-inversion-core:** rename the package ([0d81ed2](https://github.com/tmorin/ceb/commit/0d81ed27d528890a5fc58e5410122a9480622c1e))
* **ceb-messaging-core:** improve the API with a map of internal events ([3f5d1b9](https://github.com/tmorin/ceb/commit/3f5d1b9fb14b2c50750703a334ee428b36f03f68))


### BREAKING CHANGES

* **ceb-inversion-core:** the package `ceb-inversion` has been renamed to `ceb-inversion-core`





# [5.0.0](https://github.com/tmorin/ceb/compare/v4.0.2...v5.0.0) (2021-11-11)


### Features

* **ceb-messaging-adapter-electron:** add an inversion module ([ac5ccea](https://github.com/tmorin/ceb/commit/ac5cceaa74e834dc4500eb9eb50a46a7a234e02e))
* **ceb-messaging-adapter-electron:** handle the `MESSAGE_TYPE` static field of `Message` ([0e64d24](https://github.com/tmorin/ceb/commit/0e64d2456e7d0b729643b419a29c49231a856e3c))
* **ceb-messaging-adapter-electron:** rename the package ([2517d60](https://github.com/tmorin/ceb/commit/2517d60fea9722fb17b12bfb57f0390b5dba54c3))
* **ceb-messaging-simple:** add options to the inversion module ([c72273b](https://github.com/tmorin/ceb/commit/c72273b6c4ffa128fa77b157c6db52429d1907a1))


### BREAKING CHANGES

* **ceb-messaging-adapter-electron:** the package `ceb-messaging-bus-adapter-ipc` has been renamed to `ceb-messaging-adapter-electron`
