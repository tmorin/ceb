# custom-elements-builder.js

[![Circle CI](https://circleci.com/gh/tmorin/custom-elements-builder/tree/development.svg?style=svg)](https://circleci.com/gh/tmorin/custom-elements-builder/tree/development)
[![Dependency Status](https://david-dm.org/tmorin/custom-elements-builder/development.svg)](https://david-dm.org/tmorin/custom-elements-builder/development)
[![devDependency Status](https://david-dm.org/tmorin/custom-elements-builder/development/dev-status.svg)](https://david-dm.org/tmorin/custom-elements-builder/development#info=devDependencies)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)

ceb is just a builder, natively scalable and designed for FRP.

- [Home page](http://tmorin.github.io/custom-elements-builder/)

## Gulp tasks

Launch babel and browserify.
```shell
gulp karma
```

Single run of karma.
```shell
gulp karma
```

Start karma in watching mode handling babel and browserify.
```shell
gulp karma:watch
```

Single run of karma with saucelabs browsers.
```shell
gulp karma:sauce
```

