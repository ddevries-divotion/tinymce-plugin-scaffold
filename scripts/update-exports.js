import { readdir, readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

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
          });
        }
      }
    }
  } catch (error) {
    console.warn("Could not scan plugins directory:", error);
  }

  return plugins;
}

// Update package.json exports
async function updatePackageExports() {
  try {
    const packageJson = JSON.parse(await readFile("package.json", "utf8"));
    const plugins = await getPlugins();

    // Generate new exports
    const newExports = {};

    // Add root export (points to first plugin found or example as fallback)
    const firstPlugin = plugins.find((p) => p.hasJs) ||
      plugins.find((p) => p.hasTs) || { name: "example", hasJs: true };
    newExports["."] = `./dist/plugins/${firstPlugin.name}/plugin.min.js`;

    // Add exports for each plugin
    for (const plugin of plugins) {
      if (plugin.hasJs) {
        newExports[`./${plugin.name}`] =
          `./dist/plugins/${plugin.name}/plugin.min.js`;
        newExports[`./${plugin.name}/js`] =
          `./dist/plugins/${plugin.name}/plugin.min.js`;
      }
      if (plugin.hasTs) {
        newExports[`./${plugin.name}/ts`] =
          `./dist/plugins/${plugin.name}/plugin-ts.min.js`;
      }
    }

    // Update main field to point to the first plugin
    packageJson.main = `dist/plugins/${firstPlugin.name}/plugin.min.js`;

    // Update exports
    packageJson.exports = newExports;

    // Write updated package.json
    await writeFile(
      "package.json",
      JSON.stringify(packageJson, null, 2) + "\n",
    );

    console.log("✅ Updated package.json exports:");
    console.log(JSON.stringify(newExports, null, 2));
  } catch (error) {
    console.error("❌ Failed to update package.json exports:", error);
    process.exit(1);
  }
}

updatePackageExports();
