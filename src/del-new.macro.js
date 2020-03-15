const { createMacro } = require("babel-plugin-macros");

module.exports = createMacro(function myMacro({ references, state, babel }) {
  const { types: t, traverse } = babel;
  const { default: fr = [], ...cxt } = references;

  traverse(state.file.ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      let name = "";
      if (callee.type === "Identifier") {
        name = callee.name;
      }
      if (callee.type === "MemberExpression") {
        if (!callee.computed) {
          name = callee.property.name;
        }
        if (callee.computed) {
          name = callee.property.value;
        }
      }
      let m = name.match(/[a-zA-Z]/);
      if (m) {
        if (/[A-Z]/.test(m[0])) {
          path.replaceWith(
            t.NewExpression(path.node.callee, path.node.arguments)
          );
        }
      }
    }
  });
});
