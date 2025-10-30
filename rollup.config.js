import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import { readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
const suffix = isProduction ? ".min.js" : ".js";

// Scan for plugins in src/plugins directory
async function getPlugins() {
  const pluginsDir = "src/plugins";
  const plugins = [];

  try {
    const entries = await readdir(pluginsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const pluginName = entry.name;
        const jsMainPath = path.join(pluginsDir, pluginName, "main/js/Main.js");
        const tsMainPath = path.join(pluginsDir, pluginName, "main/ts/Main.ts");

        if (existsSync(jsMainPath) || existsSync(tsMainPath)) {
          plugins.push({
            name: pluginName,
            hasJs: existsSync(jsMainPath),
            hasTs: existsSync(tsMainPath),
            jsInput: jsMainPath,
            tsInput: tsMainPath,
          });
        }
      }
    }
  } catch (error) {
    console.warn("Could not scan plugins directory:", error);
  }

  return plugins;
}

// Create configuration for a single plugin
function createPluginConfig(plugin, isTypeScript = false) {
  const lang = isTypeScript ? "TypeScript" : "JavaScript";
  const langSuffix = isTypeScript ? "-ts" : "";
  const input = isTypeScript ? plugin.tsInput : plugin.jsInput;

  const config = {
    input,
    output: [
      {
        file: `dist/plugins/${plugin.name}/plugin${langSuffix}${suffix}`,
        format: "iife",
        globals: {
          tinymce: "tinymce",
        },
        banner: `/*! TinyMCE ${plugin.name.charAt(0).toUpperCase() + plugin.name.slice(1)} Plugin (${lang}) */`,
        sourcemap: !isProduction,
      },
      {
        file: `demo/public/dist/plugins/${plugin.name}/plugin${langSuffix}${suffix}`,
        format: "iife",
        globals: {
          tinymce: "tinymce",
        },
        banner: `/*! TinyMCE ${plugin.name.charAt(0).toUpperCase() + plugin.name.slice(1)} Plugin (${lang}) */`,
        sourcemap: !isProduction,
      },
    ],
    external: ["tinymce"],
    plugins: [nodeResolve(), commonjs(), isProduction && terser()].filter(
      Boolean,
    ),
  };

  if (isTypeScript) {
    config.plugins.splice(
      -1,
      0,
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
    );
  }

  return config;
}

// Generate all configurations
async function generateConfigs() {
  const plugins = await getPlugins();
  const configs = [];

  // Add cleanup plugin to the first config only
  let isFirstConfig = true;

  for (const plugin of plugins) {
    if (plugin.hasJs) {
      const jsConfig = createPluginConfig(plugin, false);
      if (isFirstConfig) {
        jsConfig.plugins.unshift(
          del({ targets: ["dist/*", "demo/public/dist/*"], verbose: true }),
        );
        isFirstConfig = false;
      }
      configs.push(jsConfig);
    }

    if (plugin.hasTs) {
      const tsConfig = createPluginConfig(plugin, true);
      if (isFirstConfig) {
        tsConfig.plugins.unshift(
          del({ targets: ["dist/*", "demo/public/dist/*"], verbose: true }),
        );
        isFirstConfig = false;
      }
      configs.push(tsConfig);
    }
  }

  return configs;
}

export default generateConfigs();
