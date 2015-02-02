# custom-elements-builder

[![Build Status](https://travis-ci.org/tmorin/custom-elements-builder.svg)](https://travis-ci.org/tmorin/custom-elements-builder)
[![Dependency Status](https://david-dm.org/tmorin/custom-elements-builder.png)](https://david-dm.org/tmorin/custom-elements-builder)
[![devDependency Status](https://david-dm.org/tmorin/custom-elements-builder/dev-status.png)](https://david-dm.org/tmorin/custom-elements-builder#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/tmorin/custom-elements-builder/badge.svg)](https://coveralls.io/r/tmorin/custom-elements-builder)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)

Custom Elements Builder (ceb) is ... a builder for Custom Elements.

- [Home page](http://tmorin.github.io/custom-elements-builder/)

## Installation

- npm: `npm install ceb --save`
- bower: `npm bower ceb --save`
- amd: `require(['ceb', ...`

## CDN

CDN files can be found on [cdnjs](https://cdnjs.com/libraries/custom-elements-builder)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.0/ceb.min.js"></script>
```
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/custom-elements-builder/0.2.0/ceb-feature-template.min.js"></script>
```

## Grunt tasks

### Editing source code

Start karma in background, watching sources and specs then
start a connect server watching most of the projects files. The URLs list:
- the specs: http://localhost:9000
- the site: http://localhost:9000/site
- the coverage: http://localhost:9000/cov
```shell
grunt
```
or
```shell
grunt serve
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
- build/site: the web site
- build/cov/html: the code coverage result

Check quality and build dist files for continuous build.
```shell
grunt build-ci
```

### Update site

Build and push the site on gh-pages.
```shell
grunt push-site
```
