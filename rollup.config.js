import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";

const isProduction = process.env.NODE_ENV === "production";
const suffix = isProduction ? ".min.js" : ".js";

const outputPaths = [
  `dist/plugins/example/plugin${suffix}`,
  `demo/public/dist/plugins/example/plugin${suffix}`,
];

export default {
  input: "src/plugins/example/main/js/Main.js",
  output: outputPaths.map((file) => ({
    file,
    format: "iife",
    globals: {
      tinymce: "tinymce",
    },
    banner: "/*! TinyMCE Example Plugin */",
    sourcemap: !isProduction,
  })),
  external: ["tinymce"],
  plugins: [
    del({ targets: ["dist/*", "demo/public/dist/*"], verbose: true }),
    nodeResolve(),
    commonjs(),
    isProduction && terser(),
  ],
};
