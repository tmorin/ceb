# custom-elements-builder

[![Build Status](https://travis-ci.org/tmorin/custom-elements-builder.svg)](https://travis-ci.org/tmorin/custom-elements-builder)
[![Dependency Status](https://david-dm.org/tmorin/custom-elements-builder.png)](https://david-dm.org/tmorin/custom-elements-builder)
[![devDependency Status](https://david-dm.org/tmorin/custom-elements-builder/dev-status.png)](https://david-dm.org/tmorin/custom-elements-builder#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/tmorin/custom-elements-builder/badge.svg)](https://coveralls.io/r/tmorin/custom-elements-builder)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)

## Presentation

Custom Elements Builder (ceb) is ... a builder for Custom Elements.

[Home page](http://tmorin.github.io/custom-elements-builder/)

## Grunt tasks

### Editing source code

Make available specs and site into the browser
```shell
    grunt
```
- the test suite: http://localhost:9000
- the site: http://localhost:9000/site
- the coverage: http://localhost:9000/cov

Start karma in watching mode karma
```shell
    grunt testing
```

### Building artifacts

Check quality, build dist files and site
```shell
    grunt build
```
- dist: the minified sources
- build/site: the web site
- build/coverage: the code coverage result

Check quality and build dist files for continuous build
```shell
    grunt build-ci
```

### Update site

Build and push the site on github
```shell
    grunt push-site
```
