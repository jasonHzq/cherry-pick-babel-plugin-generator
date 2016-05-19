function validatePkgMap(pkgMap) {
  if (!pkgMap || typeof pkgMap !== 'object') {
    throw new Error('pkgMap can\'t be null');
    return false;
  }

  return true;
}

function validatePkgsMap(pkgsMap) {
  const pkgNames = Object.keys(pkgsMap);
  const pkgMaps = pkgNames.map(pkgName => pkgsMap[pkgName]);

  return pkgMaps.every(validatePkgMap);
}

export default pkgsMap => ({types: t}) => {
  if (!pkgsMap || !Object.keys(pkgsMap).length) {
    return;
  }

  if (!validatePkgsMap(pkgsMap)) {
    return;
  }

  const pkgNames = Object.keys(pkgsMap);

  return {
    visitor: {
      ImportDeclaration(path) {
        const { node } = path;
        const { specifiers, source } = node;
        const { value: currPkgName } = source;
        const specs = [];

        if (pkgNames.indexOf(currPkgName) === -1) {
          return ;
        }

        const pkgMap = pkgsMap[currPkgName];

        if (!specifiers.filter(t.isImportSpecifier).length) {
          return;
        }

        node.specifiers = node.specifiers.filter(t.isImportSpecifier)
          .filter(spec => {
            const { imported } = spec;
            const { name: importedName } = imported;

            if (!pkgMap[importedName]) {
              throw new Error(`the ${importedName} module in ${currPkgName} was not in known pkgMap.`);
              return true;
            }

            return false;
          });

        specifiers.forEach(spec => {
          const { local , imported } = spec;
          const { name: localName } = local;

          let importedPath = currPkgName;

          if (t.isImportSpecifier(spec)) {
            const { name: importedName } = imported;

            if (!pkgMap[importedName]) {
              return;
            }

            spec = t.importDefaultSpecifier(t.identifier(localName));
            importedPath = pkgMap[importedName] || currPkgName;
          }

          path.insertAfter(t.importDeclaration([spec], t.stringLiteral(importedPath)));
        });
      }
    }
  };
}
