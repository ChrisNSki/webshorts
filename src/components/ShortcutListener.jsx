import React, { useEffect } from 'react';
import { useShortcuts } from './ShortcutProvider.jsx';

const ShortcutListener = ({ keys, action, page = null, children = null }) => {
  const { registerShortcut, unregisterShortcut, currentPage } = useShortcuts();

  const targetPage = page || currentPage;

  useEffect(() => {
    if (!keys || !action) {
      console.warn('ShortcutListener: keys and action are required');
      return;
    }

    // Register the shortcut
    registerShortcut(keys, action, targetPage);

    // Cleanup: unregister when component unmounts
    return () => {
      unregisterShortcut(keys, targetPage);
    };
  }, [keys, action, targetPage, registerShortcut, unregisterShortcut]);

  // This component doesn't render anything visible
  return children || null;
};

export default ShortcutListener;
