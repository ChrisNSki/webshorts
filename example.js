// Example usage of WebShorts
import React from 'react';
import { ShortcutProvider, ShortcutListener, HelpDialog } from './src/index.js';

// Example shortcut configuration
const shortcutsConfig = {
  WEBSHORTS_OPTIONS: {
    debug: true,
    showDescriptions: true,
    helpDialogColumns: 2,
    dialogWidth: 800,
    dialogHeight: 600,
  },
  '*': [
    {
      keys: 'SHIFT + /',
      shortName: 'Show Shortcuts',
      description: 'Open the shortcuts help dialog',
      action: () => console.log('Help dialog opened'),
    },
    {
      keys: 'ALT + 1',
      shortName: 'Home Page',
      description: 'Navigate to the home page',
      action: () => console.log('Navigate to home'),
    },
  ],
  '/': [
    {
      keys: 'ALT + SHIFT + W',
      shortName: 'Show WebShorts Author Info',
      description: 'Displays WebShorts author information',
      action: () => console.log('WebShorts by Chris Narowski'),
    },
  ],
};

// Example page component
function ExamplePage() {
  const handleSave = () => {
    console.log('Saving document...');
  };

  const handleNew = () => {
    console.log('Creating new document...');
  };

  const handleBold = () => {
    console.log('Making text bold...');
  };

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>WebShorts Example</h1>

      {/* Register shortcuts for this page */}
      <ShortcutListener keys='CTRL + S' action={handleSave} />
      <ShortcutListener keys='CTRL + N' action={handleNew} />
      <ShortcutListener keys='CTRL + B' action={handleBold} />

      <div className='space-y-4'>
        <p>Try these shortcuts:</p>
        <ul className='list-disc list-inside space-y-2'>
          <li>
            <kbd className='px-2 py-1 bg-gray-100 rounded'>Ctrl + S</kbd> - Save document
          </li>
          <li>
            <kbd className='px-2 py-1 bg-gray-100 rounded'>Ctrl + N</kbd> - New document
          </li>
          <li>
            <kbd className='px-2 py-1 bg-gray-100 rounded'>Ctrl + B</kbd> - Bold text
          </li>
          <li>
            <kbd className='px-2 py-1 bg-gray-100 rounded'>Shift + ?</kbd> - Show all shortcuts
          </li>
          <li>
            <kbd className='px-2 py-1 bg-gray-100 rounded'>Alt + Shift + W</kbd> - Show author info
          </li>
        </ul>

        <p className='text-sm text-gray-600 mt-4'>
          Press <kbd className='px-1 py-0.5 bg-gray-100 rounded text-xs'>Shift + ?</kbd> to see all available shortcuts!
        </p>
      </div>
    </div>
  );
}

// Main app component
function App() {
  return (
    <ShortcutProvider config={shortcutsConfig} currentPage='/'>
      <div className='min-h-screen bg-gray-50'>
        <ExamplePage />
        <HelpDialog />
      </div>
    </ShortcutProvider>
  );
}

export default App;
