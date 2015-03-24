# custom-elements-builder

[![Circle CI](https://circleci.com/gh/tmorin/custom-elements-builder.svg?style=svg)](https://circleci.com/gh/tmorin/custom-elements-builder)
[![Dependency Status](https://david-dm.org/tmorin/custom-elements-builder.png)](https://david-dm.org/tmorin/custom-elements-builder)
[![devDependency Status](https://david-dm.org/tmorin/custom-elements-builder/dev-status.png)](https://david-dm.org/tmorin/custom-elements-builder#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/tmorin/custom-elements-builder/badge.svg)](https://coveralls.io/r/tmorin/custom-elements-builder)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)

ceb is just a builder, natively scalable and designed for FRP.

- [Home page](http://tmorin.github.io/custom-elements-builder/)

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
