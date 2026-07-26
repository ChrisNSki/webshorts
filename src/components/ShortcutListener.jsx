import * as React from 'react';
import { useShortcuts } from './ShortcutProvider.jsx';

const ShortcutListener = ({ keys, action, description, shortName, page = null, children = null, useCode = false }) => {
  const { registerShortcut, unregisterShortcut, currentPage } = useShortcuts();
  const targetPage = page || currentPage;

  React.useEffect(() => {
    if (!keys || !action) {
      console.warn('ShortcutListener: keys and action are required');
      return;
    }

    // Register the shortcut with all metadata
    registerShortcut({ keys, action, description, shortName, useCode }, targetPage);

    // Cleanup: unregister when component unmounts
    return () => {
      unregisterShortcut(keys, targetPage, useCode);
    };
  }, [keys, action, description, shortName, targetPage, useCode, registerShortcut, unregisterShortcut]);

  return children || null;
};

export default ShortcutListener;
