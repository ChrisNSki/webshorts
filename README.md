# WebShorts

A lightweight React shortcut system for global + page-level hotkeys. Drop in a provider, register with a component, and let the keys do the work.

## Peer Dependencies

WebShorts requires @radix-ui/react-dialog, sonner, and tailwindcss as dependencies.

**Note:** If you're not using Tailwind CSS, you can still use WebShorts - just make sure to install the other peer dependencies.

## Quick Start

### 1. Generate the config file

After installing, run:

```bash
npx webshorts init
```

This will create a `webshorts.config.js` file in your project root.

### 2. Wrap your app with ShortcutProvider

```jsx
import { ShortcutProvider, HelpDialog } from 'webshorts';

function App() {
  return (
    <ShortcutProvider>
      <YourApp />
      <HelpDialog />
    </ShortcutProvider>
  );
}
```

### 3. Add page-specific shortcuts

```jsx
import { ShortcutListener } from 'webshorts';

function MyPage() {
  const handleSave = () => {
    console.log('Saving...');
  };

  return (
    <div>
      <h1>My Page</h1>

      {/* Register shortcuts for this page */}
      <ShortcutListener keys='CTRL + S' action={handleSave} />
      <ShortcutListener keys='ALT + N' action={() => console.log('New item')} />

      {/* Your page content */}
    </div>
  );
}
```

### 4. Configure your shortcuts

Create a `webshorts.config.js` file in your project root:

```js
// webshorts.config.js
const shortcutsConfig = {
  WEBSHORTS_OPTIONS: {
    debug: true, // Show toast notifications
    showDescriptions: true, // Show descriptions in help dialog
    helpDialogColumns: 2, // Number of columns in help dialog
    dialogWidth: 800, // Help dialog width
    dialogHeight: 600, // Help dialog height
  },

  // Global shortcuts (work everywhere)
  '*': [
    {
      keys: 'SHIFT + ?',
      shortName: 'Show Shortcuts',
      description: 'Open the shortcuts help dialog',
      action: () => console.log('Help dialog opened'),
    },
    {
      keys: 'ALT + 1',
      shortName: 'Home Page',
      description: 'Navigate to the home page',
      action: () => (window.location.href = '/'),
    },
  ],

  // Page-specific shortcuts
  '/dashboard': [
    {
      keys: 'CTRL + S',
      shortName: 'Save Dashboard',
      description: 'Save current dashboard state',
      action: () => saveDashboard(),
    },
  ],

  '/editor': [
    {
      keys: 'CTRL + B',
      shortName: 'Bold Text',
      description: 'Make selected text bold',
      action: () => formatText('bold'),
    },
  ],
};

export default shortcutsConfig;
```

## Features

### 🔥 Universal Help Dialog

Press `Shift + ?` from anywhere to see all available shortcuts for the current page.

### 🎯 Page-Specific Shortcuts

Register shortcuts that only work on specific pages or components.

### 🐛 Debug Mode

Get toast notifications showing:

- When shortcuts are registered
- When shortcuts are executed
- When shortcuts fail
- When no shortcut is found

### 🎨 Flexible Styling

Works with Tailwind CSS, styled-components, or any CSS solution.

### 📱 Framework Agnostic

Works with Next.js, Create React App, Vite, Remix, and any React framework.

## API Reference

### ShortcutProvider

The main provider component that wraps your app.

```jsx
<ShortcutProvider currentPage='/dashboard' className='my-custom-class' style={{ padding: '1rem' }} />
```

**Props:**

- `config` - Shortcut configuration object (optional, will auto-load from webshorts.config.js if not provided)
- `currentPage` - Current page/route (default: '/')
- `className` - CSS class name
- `style` - Inline styles

### ShortcutListener

Register page-specific shortcuts.

```jsx
<ShortcutListener
  keys='CTRL + S'
  action={handleSave}
  page='/dashboard' // Optional, defaults to current page
/>
```

**Props:**

- `keys` - Key combination (e.g., "CTRL + SHIFT + A")
- `action` - Function to execute when shortcut is pressed
- `page` - Page where this shortcut is active (optional)
- `children` - Optional children to render

### HelpDialog

The help dialog component that shows all available shortcuts.

```jsx
<HelpDialog />
```

No props required - automatically uses context from ShortcutProvider.

### useShortcuts Hook

Access the shortcuts context.

```jsx
import { useShortcuts } from 'webshorts';

function MyComponent() {
  const { shortcuts, registerShortcut, unregisterShortcut, helpDialogOpen, setHelpDialogOpen, options, currentPage } = useShortcuts();

  // Use the context values
}
```

**Note:** The `registerShortcut` function expects a shortcut object with `keys` and `action` properties, not separate parameters.

## Configuration

### Configuration File

WebShorts uses a configuration file to define shortcuts. Create a `webshorts.config.js` file in your project root:

```js
// webshorts.config.js
const shortcutsConfig = {
  WEBSHORTS_OPTIONS: {
    debug: false,
    showDescriptions: true,
    helpDialogColumns: 2,
    dialogWidth: 800,
    dialogHeight: 600,
  },
  '*': [
    // Global shortcuts here
  ],
  '/dashboard': [
    // Page-specific shortcuts here
  ],
};

export default shortcutsConfig;
```

WebShorts will automatically load this file when the ShortcutProvider initializes. No need to import it manually!

### WEBSHORTS_OPTIONS

```js
{
  debug: false,              // Enable debug toasts
  showDescriptions: true,    // Show descriptions in help dialog
  helpDialogColumns: 2,      // Number of columns in help dialog
  dialogWidth: 800,          // Help dialog width (px)
  dialogHeight: 600,         // Help dialog height (px)
}
```

### Shortcut Configuration

```js
{
  keys: "CTRL + S",           // Key combination
  shortName: "Save",          // Display name in help dialog
  description: "Save the file", // Description (optional)
  action: () => saveFile(),   // Function to execute
  hiddenNotes: "Internal note" // Hidden notes (optional)
}
```

## Key Combinations

Supported key combinations:

- `CTRL + SHIFT + A`
- `ALT + 1`
- `META + S` (Cmd on Mac, Ctrl on Windows)
- `SHIFT + ?` (Universal help dialog)

## Examples

### Next.js App Router

```jsx
// app/layout.jsx
import { ShortcutProvider, HelpDialog } from 'webshorts';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ShortcutProvider>
          {children}
          <HelpDialog />
        </ShortcutProvider>
      </body>
    </html>
  );
}
```

### Create React App

```jsx
// App.jsx
import { ShortcutProvider, HelpDialog } from 'webshorts';

function App() {
  return (
    <ShortcutProvider>
      <div className='App'>
        <Header />
        <Main />
        <Footer />
      </div>
      <HelpDialog />
    </ShortcutProvider>
  );
}
```

### With React Router

```jsx
import { useLocation } from 'react-router-dom';
import { ShortcutProvider } from 'webshorts';

function App() {
  const location = useLocation();

  return (
    <ShortcutProvider config={shortcutsConfig} currentPage={location.pathname}>
      <Router>{/* Your routes */}</Router>
    </ShortcutProvider>
  );
}
```

## Troubleshooting

### Common Issues

**1. "Module not found" errors**
Make sure you've installed all peer dependencies:

```bash
npm install @radix-ui/react-dialog sonner tailwindcss
```

**2. Toasts not showing**
Ensure Sonner is properly configured in your app:

```jsx
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <YourApp />
      <Toaster />
    </>
  );
}
```

**3. Dialog not styling correctly**
Make sure Tailwind CSS is configured in your project. If you're not using Tailwind, you can override the styles with your own CSS.

**4. Shortcuts not working**

- Check that the ShortcutProvider wraps your entire app
- Verify key combinations are valid (e.g., "CTRL + S" not "Ctrl + S")
- Enable debug mode to see registration and execution feedback

## License

MIT
