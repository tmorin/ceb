{% include "/doc/_urls.md" %}
# Installation

`<ceb/>` is distributed from [npm] and [bower].

From [npm]:
```shell
npm install ceb
```

From [bower]:
```shell
bower install ceb
```

Both packages expose `<ceb/>` from the following directories:

* `dist/`
  * [UMD] (ES5) (all in one and multiple files)
  * [SystemJS] (ES5)
  * [AMD] (ES5)
* `lib/`
  * [CommonJS] (ES5)
* `src/`
  * [babel] + preset-es2015 (ES2015)
