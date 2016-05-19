import assert from 'assert';
import path from 'path';
import fs from 'fs';
import pluginGenerator from '../src/index';
import { transformFileSync } from 'babel-core';
import Module from 'module';

const pkgName = 'recharts';

const _module = new Module();

const pkgPath = path.dirname(Module._resolveFilename(pkgName, {
  ..._module,
  paths: Module._nodeModulePaths(process.cwd()),
}));

const indexFile = fs.readFileSync(pkgPath + '/../src/index.js', 'utf-8');
const regStr = 'export ([\\S]+) from \'([\\S]+)\';';

const regx = new RegExp(regStr);
const globalRegx = new RegExp(regStr, 'g');

const pkgMap = indexFile.match(globalRegx)
  .map(exp => exp.match(regx).slice(1))
  .reduce((result, [pkgId, path]) => {
    return {
      ...result,
      [pkgId]: pkgName + path.slice(1),
    };
  }, {});

const plugin = pluginGenerator({ recharts: pkgMap });

describe('cherry-picked modular builds', () => {

  it('should work with cherry-pick modular builds', () => {
    const actualPath = path.join(__dirname, 'feature/actual.js');
    const expectedPath = path.join(__dirname, 'feature/expect.js');

    const actual = transformFileSync(actualPath, {
      'plugins': [plugin],
    }).code;
    const expected = fs.readFileSync(expectedPath, 'utf8');

    assert.strictEqual(actual.trim(), expected.trim());
  });

  it('should throw an error', () => {
    const errorPath = path.join(__dirname, 'error/actual.js');

    assert.throws(function() {
      transformFileSync(errorPath, {
        'plugins': [plugin],
      }).code;
    });
  });
});
