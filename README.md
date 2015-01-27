# custom-element-builder

[![Build Status](https://travis-ci.org/tmorin/custom-element-builder.svg)](https://travis-ci.org/tmorin/custom-element-builder)
[![Dependency Status](https://david-dm.org/tmorin/custom-element-builder.png)](https://david-dm.org/tmorin/custom-element-builder)
[![devDependency Status](https://david-dm.org/tmorin/custom-element-builder/dev-status.png)](https://david-dm.org/tmorin/custom-element-builder#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/tmorin/custom-element-builder/badge.svg)](https://coveralls.io/r/tmorin/custom-element-builder)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/customelementbuilder.svg)](https://saucelabs.com/u/customelementbuilder)

## Presentation

Custom Element Builder (ceb) is ... a builder for Custom Elements.

[Homepage](https://github.com/tmorin/custom-element-builder)

## Grunt tasks

### Editing source code

Make available specs and site into the brower
    grunt

Start karma in watching mode
    grunt testing

### Building artifacts

Check quality and build dist files for local build
    grunt build

Check quality and build dist files for continous build
    grunt build-ci

Build the web site
    grunt build-site

### Update site

Build and push the site on github
    grunt push-site
