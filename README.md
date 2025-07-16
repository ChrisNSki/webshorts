# <img src="https://github.com/ChrisNSki/webshorts-demo/raw/aef3354281ff115a62df1cd503e21c6dafcc9b14/public/WebShorts.svg" alt="WebShorts Logo" width="40" height="35"/> WebShorts

WebShorts is a developer tool for creating, managing, and triggering custom keyboard shortcuts in web apps. Easily bind actions, preview events, and streamline UX testing or feature demos.

A lightweight React shortcut system for global + page-level hotkeys. Drop in a provider, register with a component, and let the keys do the work.

## WebShorts Package

- **GitHub**: [https://github.com/ChrisNSki/webshorts](https://github.com/ChrisNSki/webshorts)
- **NPM**: [https://www.npmjs.com/package/@chrisnski/webshorts](https://www.npmjs.com/package/@chrisnski/webshorts)
- **Demo**: [https://webshorts.dev](https://webshorts.dev)
- **Support**: ☕ [Buy Me a Coffee](https://buymeacoffee.com/chrisnski)
<p align="center">
<img src="https://github.com/ChrisNSki/webshorts-demo/raw/aef3354281ff115a62df1cd503e21c6dafcc9b14/public/DialogScreenshot.png" alt="WebShorts Screenshot" width="600"/>
<br>
(Screenshot of WebShorts Dialog)
</p>

## Quick Start

Get WebShorts up and running in your React project in just a few steps.

### ⚠️ Next.js App Router Users

Next.js requires additional configuration to work with WebShorts. See the [Compatibility](#compatibility) section for important integration details.

### 1. Install WebShorts and Dependencies

Install WebShorts and let it automatically install the required dependencies:

```bash
npm i @chrisnski/webshorts
npx webshorts init
```

**What the `npx webshorts init` command does:**

- Creates a `webshorts.config.js` file in your project root
- Automatically installs `@radix-ui/react-dialog` and `sonner` as dependencies
- Detects your package manager (npm, yarn, or pnpm) to use the appropriate install command

**Note:** You must already have `react` and `react-dom` installed (required for all React projects).

### 2. Wrap your app with WebShortsProvider

```jsx
import { WebShortsProvider, WebShortsDialog } from '@chrisnski/webshorts';
import shortcutsConfig from './webshorts.config.js';

function App() {
  return (
    <WebShortsProvider config={shortcutsConfig} currentPage={pathname}>
      <YourApp />
      <WebShortsDialog />
    </WebShortsProvider>
  );
}
```

**Quick Notes:**

- Default styles are included automatically, but can be overridden.
- The config must be included!
- The currentPage prop must be included for proper route-based shortcuts!

### 3. Adding page-specific shortcuts (Optional)

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

## Compatibility

WebShorts is designed to work with any React framework. Learn about specific setup requirements for different frameworks.

### ⚠️ Next.js App Router

**⚠️ CRITICAL: Client Wrappers Required**

If you are using Next.js App Router (the `/app` directory), you MUST use client wrappers for both the WebShortsProvider and ShortcutListener components. This is not optional - you WILL encounter SSR/hydration issues without them.

#### Setup Instructions

**1. Create the Client Provider Wrapper**

```jsx
// components/ClientWebShortsProvider.jsx
'use client';
import { useEffect, useState } from 'react';
import { WebShortsProvider, WebShortsDialog } from '@chrisnski/webshorts';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';

export default function ClientWebShortsProvider({ children, config, className }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return children without the provider during SSR
    return children;
  }

  return (
    <WebShortsProvider config={config} currentPage={pathname} className={className}>
      {children}
      <WebShortsDialog />
      <Toaster position='bottom-right' richColors />
    </WebShortsProvider>
  );
}
```

**2. Create the App Wrapper**

```jsx
// components/WebShortsProviderWrapper.jsx
'use client';
import ClientWebShortsProvider from './ClientWebShortsProvider';
import webshortsConfig from '../webshorts.config';

export default function WebShortsProviderWrapper({ children, className }) {
  return (
    <ClientWebShortsProvider config={webshortsConfig} className={className}>
      {children}
    </ClientWebShortsProvider>
  );
}
```

**3. Use in Root Layout**

```jsx
// app/layout.js (Server Component)
export const metadata = {
  title: 'My App',
  description: 'My app description',
};

import WebShortsProviderWrapper from '../components/WebShortsProviderWrapper';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebShortsProviderWrapper>{children}</WebShortsProviderWrapper>
      </body>
    </html>
  );
}
```

**4. Create Client Wrapper for ShortcutListener (REQUIRED)**

```jsx
// components/ClientShortcutListener.jsx
'use client';
import { useEffect, useState } from 'react';
import { ShortcutListener } from '@chrisnski/webshorts';

export default function ClientShortcutListener({ children, keys, action, shortName, description }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return the children without the ShortcutListener wrapper during SSR
    return children;
  }

  return (
    <ShortcutListener keys={keys} action={action} shortName={shortName} description={description}>
      {children}
    </ShortcutListener>
  );
}
```

**5. Usage Example**

```jsx
// Instead of using ShortcutListener directly:
<ShortcutListener keys='CTRL + S' action={handleSave} shortName='Save' description='Save content'>
  <div>Press CTRL + S to save</div>
</ShortcutListener>;

// Use the client wrapper:
import ClientShortcutListener from '@/components/ClientShortcutListener';

<ClientShortcutListener keys='CTRL + S' action={handleSave} shortName='Save' description='Save content'>
  <div>Press CTRL + S to save</div>
</ClientShortcutListener>;
```

#### Why Both Wrappers Are Required

- **Server Components** - Next.js App Router uses server components by default
- **Context Providers** - WebShortsProvider is a client-side context provider
- **Shortcut Listeners** - ShortcutListener components need client-side mounting
- **SSR/Hydration Race** - Both components will fail in production without wrappers
- **Guaranteed Issues** - This is not optional - you WILL encounter problems without these wrappers

## Customizing the Dialog

WebShorts provides extensive customization options for the help dialog, including custom text, styling, and behavior.

### Dialog Props & CSS Customization

The `WebShortsDialog` component supports several props and CSS classes for deep customization:

- **description**: Custom help text for the dialog (prop or config)
- **className**: Custom CSS class for the dialog container
- **style**: Inline styles for the dialog container
- **triggerKey**: Change the key combination to open the dialog
- **title**: Custom dialog title
- **footer**: Custom dialog footer

```jsx
<WebShortsDialog description="Custom help text for your app's shortcuts." className='my-dialog' style={{ backgroundColor: '#222' }} />
```

```js
// webshorts.config.js
export default {
  dialog: {
    className: 'my-custom-dialog',
    style: { backgroundColor: '#f0f0f0', borderRadius: '12px' },
    title: 'Keyboard Shortcuts',
    description: 'Use these shortcuts to navigate and interact with the app',
    footer: 'Press ESC to close',
    triggerKey: 'CTRL + SHIFT + H',
  },
  // ... rest of config
};
```

### Customizing the Description

You can style the help dialog description using the `.webshorts-help-dialog-description` CSS class:

```css
.webshorts-help-dialog-description {
  font-weight: 400;
  font-size: 1rem;
  color: #555;
  margin-top: 0.5rem;
}
```

### Available CSS Classes

- `.webshorts-dialog` – Main dialog container
- `.webshorts-dialog-header` – Dialog header section
- `.webshorts-dialog-content` – Dialog content area
- `.webshorts-dialog-footer` – Dialog footer section
- `.webshorts-help-dialog-description` – Help dialog description
- `.webshorts-shortcut-item` – Individual shortcut item
- `.webshorts-shortcut-keys` – Key combination display
- `.webshorts-shortcut-description` – Shortcut description text
- `.webshorts-shortcut-group` – Group of related shortcuts

## Documentation

For complete documentation, visit the [WebShorts GitHub repository](https://github.com/ChrisNSki/webshorts) or the [live demo](https://webshorts.dev), which includes:

- **Quick Start** - Installation and basic setup
- **Features** - Overview of WebShorts capabilities
- **Compatibility** - Framework-specific setup instructions
- **Configuring WebShorts** - Configuration options and examples
- **WebShorts Provider** - Provider component documentation
- **Shortcut Listener** - Adding page-specific shortcuts
- **WebShorts Dialog** - Customizing the help dialog
- **Custom Styling** - Styling and theming options
- **useShortcuts Hooks** - Available hooks and their usage
