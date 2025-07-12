import * as React from 'react';
import { eventToKeyObj, matchShortcut } from '../utils/matchShortcut.js';
import { parseKeys, keysToString } from '../utils/parseKeys.js';
import { debugShortcutExecution, debugShortcutNotFound, debugHelpDialog } from '../utils/debugTools.js';

const ShortcutContext = React.createContext();

export const useShortcuts = () => {
  const context = React.useContext(ShortcutContext);
  if (!context) {
    throw new Error('useShortcuts must be used within a ShortcutProvider');
  }
  return context;
};

const ShortcutProvider = ({ children, config = null, currentPage = '/', className = '', style = {} }) => {
  const [shortcuts, setShortcuts] = React.useState(new Map());
  const [helpDialogOpen, setHelpDialogOpen] = React.useState(false);
  const [options, setOptions] = React.useState({
    debug: false,
    showDescriptions: true,
    helpDialogColumns: 2,
    dialogWidth: 800,
    dialogHeight: 600,
  });

  // Register a shortcut
  const registerShortcut = React.useCallback(
    (shortcut, page = currentPage) => {
      const keyObj = parseKeys(shortcut.keys);
      if (!keyObj) {
        console.warn(`Invalid shortcut keys: ${shortcut.keys}`);
        return;
      }

      const shortcutId = `${page}:${shortcut.keys}`;
      setShortcuts((prev) => {
        const newShortcuts = new Map(prev);
        newShortcuts.set(shortcutId, {
          ...shortcut, // Preserve all shortcut metadata
          keys: keyObj,
          keysString: shortcut.keys,
          page,
          timestamp: Date.now(),
        });
        return newShortcuts;
      });

      if (options.debug) {
        debugShortcutRegistration(shortcut.keys, shortcut.action.name || 'anonymous', page);
      }
    },
    [currentPage, options.debug]
  );

  // Unregister a shortcut
  const unregisterShortcut = React.useCallback(
    (keys, page = currentPage) => {
      const shortcutId = `${page}:${keys}`;
      setShortcuts((prev) => {
        const newShortcuts = new Map(prev);
        newShortcuts.delete(shortcutId);
        return newShortcuts;
      });
    },
    [currentPage]
  );

  // Handle keyboard events
  const handleKeyDown = React.useCallback(
    (event) => {
      // Ignore if typing in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.contentEditable === 'true') {
        return;
      }

      const pressedKeys = eventToKeyObj(event);
      const pressedKeysString = keysToString(pressedKeys);

      // Check for help dialog shortcut (Shift + ?)
      if (pressedKeys.shift && pressedKeys.key === '?') {
        event.preventDefault();
        setHelpDialogOpen(true);
        if (options.debug) {
          const currentShortcuts = Array.from(shortcuts.values()).filter((s) => s.page === currentPage || s.page === '*');
          debugHelpDialog(currentShortcuts.length);
        }
        return;
      }

      // Check registered shortcuts
      for (const [id, shortcut] of shortcuts) {
        if (matchShortcut(pressedKeys, shortcut.keys)) {
          event.preventDefault();

          try {
            if (typeof shortcut.action === 'function') {
              shortcut.action();
              if (options.debug) {
                debugShortcutExecution(pressedKeysString, shortcut.action.name || 'anonymous', true);
              }
            } else {
              console.warn(`Shortcut action is not a function: ${shortcut.action}`);
              if (options.debug) {
                debugShortcutExecution(pressedKeysString, 'invalid', false, 'Action is not a function');
              }
            }
          } catch (error) {
            console.error('Error executing shortcut:', error);
            if (options.debug) {
              debugShortcutExecution(pressedKeysString, shortcut.action.name || 'anonymous', false, error.message);
            }
          }
          return;
        }
      }

      // No shortcut found
      if (options.debug) {
        debugShortcutNotFound(pressedKeysString, currentPage);
      }
    },
    [shortcuts, currentPage, options.debug]
  );

  // Load shortcuts from config prop if provided
  React.useEffect(() => {
    if (!config) return;

    // Clear all shortcuts before registering new ones
    setShortcuts(new Map());

    // Load global shortcuts
    if (config['*']) {
      config['*'].forEach((shortcut) => {
        if (shortcut.keys && shortcut.action) {
          registerShortcut(shortcut, '*');
        }
      });
    }

    // Load only the current page's shortcuts
    if (config[currentPage]) {
      config[currentPage].forEach((shortcut) => {
        if (shortcut.keys && shortcut.action) {
          registerShortcut(shortcut, currentPage);
        }
      });
    }
  }, [config, currentPage, registerShortcut]);

  // Add global keyboard listener
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const contextValue = {
    shortcuts: Array.from(shortcuts.values()),
    registerShortcut,
    unregisterShortcut,
    helpDialogOpen,
    setHelpDialogOpen,
    options,
    currentPage,
  };

  return (
    <ShortcutContext.Provider value={contextValue}>
      <div className={className} style={style}>
        {children}
      </div>
    </ShortcutContext.Provider>
  );
};

export default ShortcutProvider;
