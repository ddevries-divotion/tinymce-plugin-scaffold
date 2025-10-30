# TinyMCE Plugin Scaffold

A scaffolding project for developing TinyMCE plugins with modern JavaScript tooling.

## Overview

This project provides a complete development environment for building TinyMCE plugins with:

- Modern ES6+ JavaScript and TypeScript support
- Dual build system (JavaScript and TypeScript)
- Dynamic multi-plugin build system
- Automatic plugin discovery and configuration
- Rollup bundling for production builds
- Vite for fast development and demo serving
- ESLint and Prettier for code quality
- pnpm for package management

## Project Structure

```
├── src/
│   ├── plugins/
│   │   └── [plugin-name]/               # Your plugin
│   │       └── main/
│   │           ├── js/                  # JavaScript source files
│   │           │   ├── Main.js          # Plugin entry point
│   │           │   ├── Plugin.js        # Main plugin registration
│   │           │   ├── api/
│   │           │   │   └── Commands.js  # Editor commands
│   │           │   ├── core/
│   │           │   │   └── Utils.js     # Utility functions
│   │           │   └── ui/
│   │           │       └── Buttons.js   # UI components (buttons, menu items)
│   │           └── ts/                  # TypeScript source files
│   │               ├── Main.ts          # Plugin entry point
│   │               ├── Plugin.ts        # Main plugin registration
│   │               ├── api/
│   │               │   └── Commands.ts  # Editor commands
│   │               ├── core/
│   │               │   └── Utils.ts     # Utility functions
│   │               └── ui/
│   │                   └── Buttons.ts   # UI components (buttons, menu items)
│   └── types/
│       └── globals.d.ts                 # TypeScript global declarations
├── scripts/
│   └── update-exports.js                # Auto-generates package.json exports
├── demo/                                # Demo application
│   ├── index.html                       # Demo HTML page
│   └── src/
│       └── main.js                      # Demo initialization
├── dist/
│   └── plugins/
│       └── [plugin-name]/               # Built plugin files
└── demo/public/dist/
    └── plugins/
        └── [plugin-name]/               # Demo build output
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone this repository or use it as a template
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. For the demo to work, you'll need a TinyMCE API key:
   - Get a free API key from [TinyMCE Cloud](https://www.tiny.cloud/)
   - Set the environment variable `VITE_TINYMCE_API_KEY` or update the demo HTML file

### Development

Start the development server:

```bash
# build the project first
pnpm build
# or
pnpm build:dev

# then run the Vite dev server
pnpm dev
```

This will:

- Start Vite dev server for the demo at `http://localhost:5173`
- Watch for changes and rebuild the plugin
- Hot reload the demo page

### Building

Build the plugin(s) for production:

```bash
pnpm build
```

This automatically:

1. Scans `src/plugins/` for all plugin directories
2. Updates `package.json` exports for discovered plugins
3. Creates minified plugin files for both JavaScript and TypeScript versions

Output structure for each plugin:

- `dist/plugins/[plugin-name]/plugin.min.js` - JavaScript production build
- `dist/plugins/[plugin-name]/plugin-ts.min.js` - TypeScript production build (if available)
- `demo/public/dist/plugins/[plugin-name]/plugin.min.js` - JavaScript demo build
- `demo/public/dist/plugins/[plugin-name]/plugin-ts.min.js` - TypeScript demo build

Build the demo application:

```bash
pnpm build:demo
```

### Multi-Plugin Architecture

This project supports dynamic multi-plugin development with automatic discovery:

#### Plugin Discovery

The build system automatically scans `src/plugins/` for directories containing:

- `main/js/Main.js` for JavaScript plugins
- `main/ts/Main.ts` for TypeScript plugins

#### JavaScript vs TypeScript Builds

Each discovered plugin can have both JavaScript and TypeScript versions:

- **JavaScript Build**: Built from `src/plugins/[plugin-name]/main/js/`
  - Output: `plugin.js` / `plugin.min.js`
  - Use for standard JavaScript development

- **TypeScript Build**: Built from `src/plugins/[plugin-name]/main/ts/`
  - Output: `plugin-ts.js` / `plugin-ts.min.js`
  - Includes type checking and modern TypeScript features
  - Custom TinyMCE type definitions in `src/types/globals.d.ts`

#### Automatic Package Exports

The `package.json` exports are automatically generated based on discovered plugins:

```json
{
  "exports": {
    ".": "./dist/plugins/first-plugin/plugin.min.js",
    "./plugin-name": "./dist/plugins/plugin-name/plugin.min.js",
    "./plugin-name/js": "./dist/plugins/plugin-name/plugin.min.js",
    "./plugin-name/ts": "./dist/plugins/plugin-name/plugin-ts.min.js"
  }
}
```

#### Usage in TinyMCE

```javascript
// Use JavaScript version
tinymce.init({
  external_plugins: {
    "plugin-name": "path/to/plugin.min.js",
  },
});

// Use TypeScript version
tinymce.init({
  external_plugins: {
    "plugin-name": "path/to/plugin-ts.min.js",
  },
});
```

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build all plugins for production and auto-update exports)
- `pnpm build:dev` - Build all plugins for development and auto-update exports
- `pnpm build:demo` - Build demo application
- `pnpm preview` - Preview built demo
- `pnpm clean` - Clean build directories
- `pnpm update-exports` - Manually update package.json exports (runs automatically on build)
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm lint:check` - Check linting without fixing
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check formatting without fixing

## Plugin Architecture

The example plugin demonstrates a typical TinyMCE plugin structure:

### Commands (`api/Commands.js`)

Registers custom editor commands that can be executed via `editor.execCommand()`.

### UI Components (`ui/Buttons.js`)

Defines toolbar buttons and menu items that users can interact with.

### Utilities (`core/Utils.js`)

Contains shared utility functions and helper methods.

### Plugin Registration (`Plugin.js`)

Main plugin registration that ties all components together and exports plugin metadata.

## Adding New Plugins

The dynamic build system makes it easy to add multiple plugins:

### 1. Create Plugin Structure

```bash
# Create a new plugin directory
mkdir -p src/plugins/my-plugin/main/js
mkdir -p src/plugins/my-plugin/main/ts
```

### 2. Add Plugin Files

Create the following structure for your plugin:

```
src/plugins/my-plugin/
├── main/
│   ├── js/                   # JavaScript version
│   │   ├── Main.js           # Entry point
│   │   ├── Plugin.js         # Plugin registration
│   │   ├── api/
│   │   │   └── Commands.js
│   │   ├── core/
│   │   │   └── Utils.js
│   │   └── ui/
│   │       └── Buttons.js
│   └── ts/                   # TypeScript version
│       ├── Main.ts           # Entry point
│       ├── Plugin.ts         # Plugin registration
│       ├── api/
│       │   └── Commands.ts
│       ├── core/
│       │   └── Utils.ts
│       └── ui/
│           └── Buttons.ts
```

### 3. Build and Export

```bash
# Build all plugins (automatically detects and builds new plugin)
pnpm build
```

The system will automatically:

- ✅ Detect your new plugin
- ✅ Build both JS and TS versions
- ✅ Update package.json exports
- ✅ Create output in `dist/plugins/my-plugin/`

### 4. Plugin Customization

For each plugin, update:

- **Plugin registration name** in `Plugin.js`/`Plugin.ts`
- **Functionality** in `api/`, `core/`, and `ui/` directories
- **Demo configuration** in `demo/src/main.js` to test your plugin

## Distribution

The built plugins can be distributed in several ways:

### 1. NPM Package

The `package.json` includes all built plugins in the `files` field with automatic exports:

```json
{
  "files": ["dist", "demo/public/dist", "scripts"],
  "exports": {
    ".": "./dist/plugins/first-plugin/plugin.min.js",
    "./plugin-name": "./dist/plugins/plugin-name/plugin.min.js",
    "./plugin-name/js": "./dist/plugins/plugin-name/plugin.min.js",
    "./plugin-name/ts": "./dist/plugins/plugin-name/plugin-ts.min.js"
  }
}
```

### 2. Individual Plugin Files

Use specific plugin files directly:

- `dist/plugins/[plugin-name]/plugin.min.js` (JavaScript)
- `dist/plugins/[plugin-name]/plugin-ts.min.js` (TypeScript)

### 3. Self-hosted Demo

Deploy the complete demo with all plugins for testing and showcasing.

## Usage in TinyMCE

### Single Plugin

```javascript
tinymce.init({
  selector: "textarea",
  external_plugins: {
    "my-plugin": "/path/to/dist/plugins/my-plugin/plugin.min.js",
  },
  toolbar: "my-plugin",
});
```

### Multiple Plugins

```javascript
tinymce.init({
  selector: "textarea",
  external_plugins: {
    "plugin-one": "/path/to/dist/plugins/plugin-one/plugin.min.js",
    "plugin-two": "/path/to/dist/plugins/plugin-two/plugin-ts.min.js",
  },
  toolbar: "plugin-one plugin-two",
});
```

## Technologies Used

- **Rollup**: Module bundler with dynamic plugin discovery and building
- **Vite**: Fast development server and build tool for the demo
- **Node.js**: File system scanning and automated export generation
- **ESLint**: JavaScript and TypeScript linting
- **Prettier**: Code formatting
- **pnpm**: Fast, disk space efficient package manager

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm lint` and `pnpm format`
5. Submit a pull request

---

This scaffolding provides a scalable foundation for TinyMCE plugin development. The dynamic build system grows with your project as you add more plugins without requiring manual configuration updates.
