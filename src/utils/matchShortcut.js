import { parseKeys } from './parseKeys.js';

/**
 * Check if two key objects match
 * @param {object} pressed - The pressed key object
 * @param {object} shortcut - The shortcut key object
 * @returns {boolean} Whether they match
 */
export function matchShortcut(pressed, shortcut) {
  if (!pressed || !shortcut) return false;

  // Parse shortcut if it's a string
  const shortcutObj = typeof shortcut === 'string' ? parseKeys(shortcut) : shortcut;

  return pressed.ctrl === shortcutObj.ctrl && pressed.shift === shortcutObj.shift && pressed.alt === shortcutObj.alt && pressed.meta === shortcutObj.meta && pressed.key === shortcutObj.key;
}

/**
 * Convert keyboard event to normalized key object
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {object} Normalized key object
 */
export function eventToKeyObj(event) {
  return {
    ctrl: event.ctrlKey,
    shift: event.shiftKey,
    alt: event.altKey,
    meta: event.metaKey,
    key: event.key.toUpperCase(),
  };
}

/**
 * Check if a key combination is valid
 * @param {string} keyString - Key combination string
 * @returns {boolean} Whether the combination is valid
 */
export function isValidKeyCombination(keyString) {
  if (!keyString) return false;

  const keyObj = parseKeys(keyString);
  return keyObj && keyObj.key; // Must have at least one key
}
