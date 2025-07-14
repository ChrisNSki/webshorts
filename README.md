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

> **Note:** Default styles are included automatically. Upcoming releases will allow you to override any part of the dialog with your own classes.
>
> **Config Loading:** For production builds, it's recommended to import and pass the config as a prop rather than relying on auto-loading.

### 3. Add page-specific shortcuts

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
import { WebShortsProvider, WebShortsDialog } from '@chrisnski/webshorts';
export default function WebShortsProviderWrapper({ children }) {
  return (
    <WebShortsProvider>
      {children}
      <WebShortsDialog />
    </WebShortsProvider>
  );
}
```

> This pattern is required for all context/hook-based libraries in Next.js App Router. See the [Next.js docs](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#using-context-in-server-components) for more details.

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

### 📱 Framework Agnostic

Works with Next.js, Create React App, Vite, Remix, and any React framework.

## API Reference

### WebShortsProvider

The main provider component that wraps your app.

```jsx
<WebShortsProvider currentPage='/dashboard' className='my-custom-class' style={{ padding: '1rem' }} />
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

### WebShortsDialog

The help dialog component that shows all available shortcuts.

```jsx
<WebShortsDialog />
```

No props required - automatically uses context from WebShortsProvider.

#### Customizing the Help Dialog

WebShortsDialog supports comprehensive style customization through props. You can override any part of the dialog's appearance:

```jsx
<WebShortsDialog
  // General styling
  className='my-custom-dialog'
  style={{ '--webshorts-content-bg': '#1a1a1a' }}
  // Overlay styling
  overlayClassName='my-overlay'
  overlayStyle={{ '--webshorts-overlay-bg': 'rgba(0,0,0,0.8)' }}
  // Content styling
  contentClassName='my-content'
  contentStyle={{
    '--webshorts-content-bg': '#1a1a1a',
    '--webshorts-content-border-radius': '12px',
    '--webshorts-content-padding': '2rem',
  }}
  // Header styling
  headerClassName='my-header'
  headerStyle={{
    '--webshorts-header-font-size': '1.5rem',
    '--webshorts-header-font-weight': '700',
  }}
  // Close button styling
  closeButtonClassName='my-close-btn'
  closeButtonStyle={{
    '--webshorts-close-button-bg': '#333',
    '--webshorts-close-button-hover-bg': '#555',
  }}
  // Shortcut key styling
  shortcutKeyStyle={{
    '--webshorts-shortcut-key-bg': '#333',
    '--webshorts-shortcut-key-color': '#fff',
    '--webshorts-shortcut-key-border-radius': '6px',
  }}
  // Shortcut text styling
  shortcutNameStyle={{
    '--webshorts-shortcut-name-color': '#fff',
  }}
  shortcutDescriptionStyle={{
    '--webshorts-shortcut-description-color': '#ccc',
  }}
/>
```

#### Available Style Props

| Prop                                                        | Description                      |
| ----------------------------------------------------------- | -------------------------------- |
| `className` / `style`                                       | General dialog styling           |
| `overlayClassName` / `overlayStyle`                         | Background overlay styling       |
| `contentClassName` / `contentStyle`                         | Main dialog content styling      |
| `headerClassName` / `headerStyle`                           | Header section styling           |
| `closeButtonClassName` / `closeButtonStyle`                 | Close button styling             |
| `sectionsClassName` / `sectionsStyle`                       | Sections container styling       |
| `sectionTitleClassName` / `sectionTitleStyle`               | Section title styling            |
| `gridClassName` / `gridStyle`                               | Grid layout styling              |
| `shortcutItemClassName` / `shortcutItemStyle`               | Individual shortcut item styling |
| `shortcutKeyClassName` / `shortcutKeyStyle`                 | Keyboard key styling             |
| `shortcutContentClassName` / `shortcutContentStyle`         | Shortcut content area styling    |
| `shortcutNameClassName` / `shortcutNameStyle`               | Shortcut name styling            |
| `shortcutDescriptionClassName` / `shortcutDescriptionStyle` | Shortcut description styling     |
| `footerClassName` / `footerStyle`                           | Footer styling                   |
| `emptyIconClassName` / `emptyIconStyle`                     | Empty state icon styling         |
| `emptyTextClassName` / `emptyTextStyle`                     | Empty state text styling         |

#### CSS Custom Properties

All styles use CSS custom properties that can be overridden. Only the properties you explicitly set will override the defaults:

```jsx
// Only changes the background - everything else stays default
<WebShortsDialog
  contentStyle={{
    '--webshorts-content-bg': '#1a1a1a'
  }}
/>

// Multiple overrides
<WebShortsDialog
  contentStyle={{
    '--webshorts-content-bg': '#1a1a1a',
    '--webshorts-content-border-radius': '12px'
  }}
  shortcutKeyStyle={{
    '--webshorts-shortcut-key-bg': '#333',
    '--webshorts-shortcut-key-color': '#fff'
  }}
/>
```

#### Dark Theme Example

```jsx
<WebShortsDialog
  contentStyle={{
    '--webshorts-content-bg': '#1a1a1a',
    '--webshorts-content-border-radius': '12px',
  }}
  headerStyle={{
    '--webshorts-header-font-weight': '600',
  }}
  shortcutKeyStyle={{
    '--webshorts-shortcut-key-bg': '#333',
    '--webshorts-shortcut-key-color': '#fff',
    '--webshorts-shortcut-key-border-radius': '6px',
  }}
  shortcutNameStyle={{
    '--webshorts-shortcut-name-color': '#fff',
  }}
  shortcutDescriptionStyle={{
    '--webshorts-shortcut-description-color': '#ccc',
  }}
  footerStyle={{
    '--webshorts-footer-color': '#ccc',
  }}
/>
```

### useShortcuts Hook

Access the shortcuts context.

```jsx
import { useShortcuts } from '@chrisnski/webshorts';

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
