# From source

<code>&lt;ceb/&gt;</code> is hosted on [GitHub](https://github.com/tmorin/ceb).

Checkout sources:
```shell
git clone https://github.com/tmorin/ceb.git
```

Install dependencies and build <code>&lt;ceb/&gt;</code>:
```shell
npm install
```

## Other npm tasks

Clean working directory:
```shell
npm run clean
```

Lint JavaScript source files:
```shell
npm run lint
```

Build distributions files:
```shell
npm run build
```

Launch karma against PhantomJS:
```shell
npm run test:local
```

```shell
npm run test:local -- --browsers PhantomJS,Chrome,Firefox,IE
```

Launch karma against PhantomJS with hot reload:
```shell
npm run test:local:watch
```

Launch karma against saucelab browsers:
```shell
npm run test
```

Zip sources files:
```shell
npm run zip
```

Start webpack dev server with hot reload:
```shell
npm start
```

Release (version + tag + npm) the project:
```shell
npm release:[pre|patch|minor|major]
```

