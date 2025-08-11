# TinyMCE Example Plugin

A scaffolding project for developing TinyMCE plugins with modern JavaScript tooling.

## Overview

This project provides a complete development environment for building TinyMCE plugins with:

- Modern ES6+ JavaScript
- Rollup bundling for production builds
- Vite for fast development and demo serving
- ESLint and Prettier for code quality
- pnpm for package management

## Project Structure

```
├── src/
│   └── plugins/
│       └── example/
│           └── main/
│               └── js/
│                   ├── Main.js          # Plugin entry point
│                   ├── Plugin.js        # Main plugin registration
│                   ├── api/
│                   │   └── Commands.js  # Editor commands
│                   ├── core/
│                   │   └── Utils.js     # Utility functions
│                   └── ui/
│                       └── Buttons.js   # UI components (buttons, menu items)
├── demo/                                # Demo application
│   ├── index.html                       # Demo HTML page
│   └── src/
│       └── main.js                      # Demo initialization
├── dist/                                # Built plugin files
└── demo/public/dist/                    # Demo build output
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

Build the plugin for production:
```bash
pnpm build
```

This creates minified plugin files in:
- `dist/plugins/example/plugin.min.js` - Production build
- `demo/public/dist/plugins/example/plugin.min.js` - Demo build

Build the demo application:
```bash
pnpm build:demo
```

### Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build plugin for production
- `pnpm build:dev` - Build plugin for development
- `pnpm build:demo` - Build demo application
- `pnpm preview` - Preview built demo
- `pnpm clean` - Clean build directories
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

## Customizing the Plugin

1. **Rename the plugin**: Update the plugin name in:
   - `src/plugins/example/` directory name
   - `Plugin.js` - plugin registration name
   - `package.json` - package name and main field
   - `rollup.config.js` - input and output paths

2. **Add functionality**: 
   - Add new commands in `api/Commands.js`
   - Create UI components in `ui/Buttons.js`
   - Add utilities in `core/Utils.js`

3. **Configure the demo**:
   - Update `demo/src/main.js` to configure TinyMCE
   - Modify `demo/index.html` as needed

## Distribution

The built plugin can be distributed as:

1. **NPM package**: The `files` field in `package.json` includes the `dist` directory
2. **Direct file**: Use `dist/plugins/example/plugin.min.js`
3. **Self-hosted**: Deploy the demo as a complete example

## Usage in TinyMCE

Include the built plugin in your TinyMCE configuration:

```javascript
tinymce.init({
  selector: 'textarea',
  external_plugins: {
    example: '/path/to/plugin.min.js'
  },
  toolbar: 'example'
});
```

## Technologies Used

- **Rollup**: Module bundler for building the plugin
- **Vite**: Fast development server and build tool for the demo
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **pnpm**: Fast, disk space efficient package manager

## Future Enhancements

### TypeScript Support

TypeScript support will be added in a future version of this scaffolding project. This will include:

- TypeScript configuration and build setup
- Type definitions for TinyMCE APIs
- Enhanced development experience with IntelliSense
- Type-safe plugin development
- Automatic type checking in the build process

Stay tuned for updates that will make TinyMCE plugin development even more robust with static typing!

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm lint` and `pnpm format`
5. Submit a pull request

---

This scaffolding provides a solid foundation for TinyMCE plugin development. Modify the plugin structure and build configuration as needed for your specific use case.
