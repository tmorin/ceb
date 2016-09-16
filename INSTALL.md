{% include "./doc/_urls.md" %}
# Installation

`<ceb/>` is distributed from [npm] and [bower].

From [npm]:
```bash
npm install ceb
```

From [bower]:
```bash
bower install ceb
```

Both packages expose `<ceb/>` from the following directories:

* `dist/`
  * [UMD] (ES5)
  * [SystemJS] (ES5)
  * [AMD] (ES5)
* `lib/`
  * [CommonJS] (ES5)
* `src/`
  * [babel] + preset-es2015 (ES2015)


## Setting up development environment

Get the source:
```bash
git clone https://github.com/tmorin/ceb.git
cd ceb 
```

Install dependencies and build:
```bash
npm install 
```

## NPM tasks

Clean the working directory:
```bash
npm run clean
```

Lint the JavaScript files:
```bash
npm run lint
```

Run test against PhantomJS:
```bash
npm run test:local
```
Build all distributed files
```bash
npm run build
```

Build documentation and start server with hot reload
```bash
npm run site:doc:watch
```

Build the site, i.e. https://tmorin.github.io/ceb
```bash
npm run site
```

Start a server with hot reload bound to the example pages
```bash
npm run start
```

Clean the working directory, lint, test and build.
```bash
npm run prepublish
```

## Release

Build all stuff and create version
```bash
npm version [major|minor|patch]
```

Publish to npm repo
```bash
npm publish
```
