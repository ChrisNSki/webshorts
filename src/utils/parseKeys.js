/**
 * Parse shortcut key combinations into normalized objects
 * @param {string} keyString - String like "CTRL + SHIFT + A"
 * @returns {object} Normalized key object
 */
export function parseKeys(keyString) {
  if (!keyString) return null;

  const parts = keyString.split('+').map((part) => part.trim().toUpperCase());

  const keyObj = {
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
    key: null,
  };

  for (const part of parts) {
    switch (part) {
      case 'CTRL':
      case 'CONTROL':
        keyObj.ctrl = true;
        break;
      case 'SHIFT':
        keyObj.shift = true;
        break;
      case 'ALT':
        keyObj.alt = true;
        break;
      case 'META':
      case 'CMD':
      case 'COMMAND':
        keyObj.meta = true;
        break;
      default:
        keyObj.key = part;
    }
  }

  return keyObj;
}

/**
 * Convert a key object back to a readable string
 * @param {object} keyObj - Normalized key object
 * @returns {string} Readable key string
 */
export function keysToString(keyObj) {
  if (!keyObj) return '';

  const modifiers = [];
  if (keyObj.ctrl) modifiers.push('Ctrl');
  if (keyObj.shift) modifiers.push('Shift');
  if (keyObj.alt) modifiers.push('Alt');
  if (keyObj.meta) modifiers.push('Cmd');

  if (keyObj.key) {
    modifiers.push(keyObj.key);
  }

  return modifiers.join(' + ');
}
