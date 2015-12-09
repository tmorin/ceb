# Contributing

## Setting up development environment

Get the source:
```shell
git clone https://github.com/tmorin/ceb.git
cd ceb 
```

Install dependencies and build:
```shell
npm install 
```

## npm tasks

Clean the working directory:
```shell
npm run clean
```

Lint the JavaScript files:
```shell
npm run lint
```

Run test against PhantomJS:
```shell
npm run test:local
```
Build all distributed files
```shell
npm run build
```

Build documentation and start server with hot reload
```shell
npm run site:doc:watch
```

Build the site, i.e. https://tmorin.github.io/ceb
```shell
npm run site
```

Start a server with hot reload bound to the example pages
```shell
npm run start
```

Clean the working directory, lint, test and build.
```shell
npm run prepublish
```
