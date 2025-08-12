import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";

const isProduction = process.env.NODE_ENV === "production";
const suffix = isProduction ? ".min.js" : ".js";

// JavaScript build configuration
const jsConfig = {
  input: "src/plugins/example/main/js/Main.js",
  output: [
    {
      file: `dist/plugins/example/plugin${suffix}`,
      format: "iife",
      globals: {
        tinymce: "tinymce",
      },
      banner: "/*! TinyMCE Example Plugin (JavaScript) */",
      sourcemap: !isProduction,
    },
    {
      file: `demo/public/dist/plugins/example/plugin${suffix}`,
      format: "iife",
      globals: {
        tinymce: "tinymce",
      },
      banner: "/*! TinyMCE Example Plugin (JavaScript) */",
      sourcemap: !isProduction,
    },
  ],
  external: ["tinymce"],
  plugins: [
    del({ targets: ["dist/*", "demo/public/dist/*"], verbose: true }),
    nodeResolve(),
    commonjs(),
    isProduction && terser(),
  ].filter(Boolean),
};

// TypeScript build configuration
const tsConfig = {
  input: "src/plugins/example/main/ts/Main.ts",
  output: [
    {
      file: `dist/plugins/example/plugin-ts${suffix}`,
      format: "iife",
      globals: {
        tinymce: "tinymce",
      },
      banner: "/*! TinyMCE Example Plugin (TypeScript) */",
      sourcemap: !isProduction,
    },
    {
      file: `demo/public/dist/plugins/example/plugin-ts${suffix}`,
      format: "iife",
      globals: {
        tinymce: "tinymce",
      },
      banner: "/*! TinyMCE Example Plugin (TypeScript) */",
      sourcemap: !isProduction,
    },
  ],
  external: ["tinymce"],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: false, // Don't use tsconfig.json for this build
      target: "ES2020",
      module: "ESNext",
      moduleResolution: "node",
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      declaration: false,
      declarationMap: false,
      outDir: undefined, // Let Rollup handle the output
    }),
    isProduction && terser(),
  ].filter(Boolean),
};

export default [jsConfig, tsConfig];
