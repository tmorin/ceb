# From npm or bower

`<ceb/>` distributed files are available from npm and bower.

From npm:
```shell
npm install ceb
```

From bower:
```shell
bower install ceb
```

Both packages expose `<ceb/>` from the directories:

- `dist/`
 - [UMD](https://github.com/umdjs/umd) (ES5) (all in one and multiple files)
 - [SystemJS](https://github.com/systemjs/systemjs) (ES5)
 - [AMD](https://github.com/amdjs/amdjs-api) (ES5)
- `lib/`
 - [CommonJS](http://www.commonjs.org/) (ES5)
- `src/`
 - [babel](http://babeljs.io) + preset-es2015 (ES2015)
