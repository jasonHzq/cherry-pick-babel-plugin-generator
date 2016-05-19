# cherry-pick-babel-plugin-generator

A babel cherry-pick plugin generator help you generate a babel plugin which can import less modules.

[![npm version](https://badge.fury.io/js/cherry-pick-babel-plugin-generator.png)](https://badge.fury.io/js/cherry-pick-babel-plugin-generator)
[![build status](https://travis-ci.org/jasonHzq/cherry-pick-babel-plugin-generator.svg)](https://travis-ci.org/jasonHzq/cherry-pick-babel-plugin-generator)
[![npm downloads](https://img.shields.io/npm/dt/cherry-pick-babel-plugin-generator.svg?style=flat-square)](https://www.npmjs.com/package/cherry-pick-babel-plugin-generator)


## install
```
$ npm i -D cherry-pick-babel-plugin-generator
```

## Usage

### babel-plugin-recharts

```
import pluginGenerator from 'cherry-pick-babel-plugin-generator';

const rechartsMap = {
  Line: 'recharts/cartesian/Line',
  Pie: 'recharts/polar/Pie',
  ...
}

export deafult pluginGenerator({ recharts: rechartsMap });
```

## Limitations

* You must use ES2015 imports to load module

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2015-2016 Recharts Group
