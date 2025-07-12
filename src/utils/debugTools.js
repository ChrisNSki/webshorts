import { toast } from 'sonner';

/**
 * Show debug toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, info)
 */
export function debugToast(message, type = 'info') {
  if (typeof toast === 'undefined') {
    console.warn('Sonner toast not available. Make sure sonner is installed and configured.');
    return;
  }

  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    default:
      toast.info(message);
  }
}

/**
 * Show shortcut registration debug info
 * @param {string} keys - Shortcut keys
 * @param {string} action - Action name
 * @param {string} page - Current page/route
 */
export function debugShortcutRegistration(keys, action, page) {
  debugToast(`Shortcut registered: ${keys} → ${action} (${page})`, 'success');
}

/**
 * Show shortcut execution debug info
 * @param {string} keys - Shortcut keys
 * @param {string} action - Action name
 * @param {boolean} success - Whether execution was successful
 * @param {string} error - Error message if failed
 */
export function debugShortcutExecution(keys, action, success, error = null) {
  if (success) {
    debugToast(`Shortcut executed: ${keys} → ${action}`, 'success');
  } else {
    debugToast(`Shortcut failed: ${keys} → ${action} (${error})`, 'error');
  }
}

/**
 * Show shortcut not found debug info
 * @param {string} keys - Pressed keys
 * @param {string} page - Current page/route
 */
export function debugShortcutNotFound(keys, page) {
  debugToast(`No shortcut found for: ${keys} on page: ${page}`, 'warning');
}

/**
 * Show help dialog debug info
 * @param {number} shortcutCount - Number of shortcuts shown
 */
export function debugHelpDialog(shortcutCount) {
  debugToast(`Help dialog opened with ${shortcutCount} shortcuts`, 'info');
}
