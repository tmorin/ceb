# custom-elements-builder.js

[![Circle CI](https://circleci.com/gh/tmorin/custom-elements-builder.js/tree/development.svg?style=svg)](https://circleci.com/gh/tmorin/custom-elements-builder.js/tree/development)
[![Dependency Status](https://david-dm.org/tmorin/custom-elements-builder.js/development.svg)](https://david-dm.org/tmorin/custom-elements-builder.js/development)
[![devDependency Status](https://david-dm.org/tmorin/custom-elements-builder.js/development/dev-status.svg)](https://david-dm.org/tmorin/custom-elements-builder.js/development#info=devDependencies)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)

ceb is just a builder.js, natively scalable and designed for FRP.

- [Home page](http://tmorin.github.io/custom-elements-builder.js/)

## Grunt tasks

### Editing source code

Start karma in background, watching sources and specs then
start a connect server watching most of the projects files.
The URLs list:
- the specs: http://localhost:9000/specs
- the demos: http://localhost:9000/demos
- the coverage: http://localhost:9000/cov
```shell
grunt
```
Or
```shell
grunt serve
```
To only activate live reload, add the parameter `--livereload-only`:
```shell
grunt --livereload-only
```

Execute specs with karma on sauce labs.
```shell
grunt karma:build-ci-ie
grunt karma:build-ci-evergreen
grunt karma:build-ci-safari
grunt karma:build-ci-android
```

### Building artifacts

Check quality, build dist files and site.
```shell
grunt build
```
Output:
- dist: the minified sources
- .tmp/site: the web site
- .tmp/cov/html: the code coverage result

Check quality and build dist files for continuous build.
```shell
grunt build-ci
```
