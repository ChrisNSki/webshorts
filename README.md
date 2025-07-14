# WebShorts

A lightweight React shortcut system for global + page-level hotkeys. Drop in a provider, register with a component, and let the keys do the work.

🌐 **[Live Demo](https://webshorts.dev)** | 💬 **[Discord](https://discord.gg/HXg4YxJgfX)** | 🐛 **[Issues](https://github.com/ChrisNSki/webshorts/issues)**

## Quick Start

> **Note for Next.js App Router users:** Next.js requires additional configuration to work with WebShorts. See [Next.js App Router Usage](#nextjs-app-router-usage) for important integration details.

### 1. Install WebShorts and Dependencies

Install WebShorts and let it automatically install the required dependencies:

```bash
npm i @chrisnski/webshorts
npx webshorts init
```

The `npx webshorts init` command will:

- Create a `webshorts.config.js` file in your project root
- Automatically install `@radix-ui/react-dialog` and `sonner` as dependencies
- Detects your package manager (npm, yarn, or pnpm) to use the appropriate install command

> **Note:** You must already have `react` and `react-dom` installed (required for all React projects).

### 2. Wrap your app with WebShortsProvider

```jsx
import { WebShortsProvider, WebShortsDialog } from '@chrisnski/webshorts';
import shortcutsConfig from './webshorts.config.js';

function App() {
  return (
    <WebShortsProvider config={shortcutsConfig}>
      <YourApp />
      <WebShortsDialog />
    </WebShortsProvider>
  );
}
```

> **Quick Notes**
>
> - Default styles are included automatically, but can be overridden.
> - The `config` prop must be included!
> - The `currentPage` prop must be included and set to your current route (e.g., from your router) for page-specific shortcuts to work.

---

At this point the install can be used as is, and managed from the webshorts config if you are using global shortcuts only.

For page specific shortcuts, it's recommended to continue to step 3 and use Shortcut Listeners.

---

### Adding page-specific shortcuts

When you want to add a shortcut that is page specific, you can do it in the config, or add a shortcut listener to the page/component the shortcut applies to.

```jsx
import { ShortcutListener } from '@chrisnski/webshorts';

function MyPage() {
  const handleSave = () => {
    console.log('Saving...');
  };

  return (
    <div>
      <h1>My Page</h1>

      {/* Register shortcuts for this page */}
      <ShortcutListener keys='CTRL + S' shortName='Save' description='Save the document' action={handleSave} />
      <ShortcutListener keys='ALT + N' shortName='New Item' description='Create a new item' action={() => console.log('New item')} />

      {/* Your page content */}
    </div>
  );
}
```

> **Note:** For shortcuts to appear in the help dialog, always provide `shortName` and `description` props to `ShortcutListener`.

---

## Next.js App Router Usage

If you are using **Next.js App Router** (the `/app` directory), you must use a client wrapper for any context provider or hook-based library, including WebShorts. This is required to support both SSR/metadata and client context/hooks.

**Example:**

```jsx
// app/layout.js (Server Component)
export const metadata = { ... };
import WebShortsProviderWrapper from '../components/WebShortsProviderWrapper';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebShortsProviderWrapper>
          {children}
        </WebShortsProviderWrapper>
      </body>
    </html>
  );
}
```

```jsx
// components/WebShortsProviderWrapper.jsx (Client Component)
'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { WebShortsProvider, WebShortsDialog } from '@chrisnski/webshorts';
import webshortsConfig from '../../../webshorts.config';

export default function WebShortsProviderWrapper({ children, className }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render the provider to keep hook order stable
  return (
    <WebShortsProvider config={webshortsConfig} currentPage={pathname} className={className}>
      {mounted ? (
        <>
          {children}
          <WebShortsDialog />
        </>
      ) : null}
    </WebShortsProvider>
  );
}
```

> **Important:** Never return early before rendering the provider. Always call hooks in the same order every render to avoid React hook order errors.

---

## Troubleshooting

### React Hook Order Error

If you see an error like:

```
React has detected a change in the order of Hooks called by WebShortsProviderWrapper. This will lead to bugs and errors if not fixed.
```

**Solution:**

- Never return early before all hooks are called.
- Always render the provider, and conditionally render children inside it if needed.

---

## API Reference

### WebShortsProvider

The main provider component that wraps your app.

```jsx
<WebShortsProvider currentPage='/dashboard' className='my-custom-class' style={{ padding: '1rem' }} />
```

**Props:**

- `config` - Shortcut configuration object (optional, will auto-load from webshorts.config.js if not provided)
- `currentPage` - Current page/route (**required for route-based shortcuts**; e.g., use `usePathname()` in Next.js or `location.pathname` in React Router)
- `className` - CSS class name
- `style` - Inline styles

### ShortcutListener

Register page-specific shortcuts.

```jsx
<ShortcutListener
  keys='CTRL + S'
  shortName='Save'
  description='Save the document'
  action={handleSave}
  page='/dashboard' // Optional, defaults to current page
/>
```

**Props:**

- `keys` - Key combination (e.g., "CTRL + SHIFT + A")
- `action` - Function to execute when shortcut is pressed
- `shortName` - Short name for the help dialog (required for dialog display)
- `description` - Description for the help dialog (required for dialog display)
- `page` - Page where this shortcut is active (optional)
- `children` - Optional children to render

### WebShortsDialog

The help dialog component that shows all available shortcuts. Now includes accessibility improvements for screen readers.

```jsx
<WebShortsDialog />
```

No props required - automatically uses context from WebShortsProvider.

---

### useShortcuts Hook

The `useShortcuts` hook provides **programmatic access** to the WebShorts context, allowing you to register shortcuts dynamically, control the help dialog, and access the current shortcut state.

> **Note:** `registerShortcut` expects a shortcut object, not separate parameters.

```jsx
import { useShortcuts } from '@chrisnski/webshorts';

function MyComponent() {
  const {
    shortcuts, // Array of all registered shortcuts
    registerShortcut, // Function to register new shortcuts
    unregisterShortcut, // Function to remove shortcuts
    helpDialogOpen, // Boolean - is help dialog open?
    setHelpDialogOpen, // Function to open/close help dialog
    options, // Current WebShorts options
    currentPage, // Current page path
  } = useShortcuts();

  // Use the context values
}
```

---

## Accessibility

WebShortsDialog is fully accessible and includes a hidden description for screen readers, ensuring compliance with accessibility best practices.

---

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

WebShorts will automatically load this file when the WebShortsProvider initializes. No need to import it manually!

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
import { WebShortsProvider, WebShortsDialog } from '@chrisnski/webshorts';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebShortsProvider>
          {children}
          <WebShortsDialog />
        </WebShortsProvider>
      </body>
    </html>
  );
}
```

### Create React App

```jsx
// App.jsx
import { WebShortsProvider, WebShortsDialog } from '@chrisnski/webshorts';

function App() {
  return (
    <WebShortsProvider>
      <div className='App'>
        <Header />
        <Main />
        <Footer />
      </div>
      <WebShortsDialog />
    </WebShortsProvider>
  );
}
```

### With React Router

```jsx
import { useLocation } from 'react-router-dom';
import { WebShortsProvider } from '@chrisnski/webshorts';

function App() {
  const location = useLocation();

  return (
    <WebShortsProvider config={shortcutsConfig} currentPage={location.pathname}>
      <Router>{/* Your routes */}</Router>
    </WebShortsProvider>
  );
}
```

## Troubleshooting

### Common Issues

**1. "Module not found" errors**
Make sure you've installed all peer dependencies:

```bash
npm install @radix-ui/react-dialog sonner react react-dom
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

- Check that the WebShortsProvider wraps your entire app
- Verify key combinations are valid (e.g., "CTRL + S" not "Ctrl + S")
- Enable debug mode to see registration and execution feedback

## License

MIT
