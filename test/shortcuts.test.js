import test from 'node:test';
import assert from 'node:assert/strict';
import { parseKeys } from '../src/utils/parseKeys.js';
import { findActiveShortcut, isValidKeyCombination, matchShortcut } from '../src/utils/matchShortcut.js';

test('parseKeys normalizes a valid shortcut', () => {
  assert.deepEqual(parseKeys('ctrl + Shift + a'), {
    ctrl: true,
    shift: true,
    alt: false,
    meta: false,
    key: 'A',
  });
});

test('parseKeys rejects modifier-only and ambiguous shortcuts', () => {
  assert.equal(parseKeys('Ctrl + Shift'), null);
  assert.equal(parseKeys('Ctrl + A + B'), null);
  assert.equal(parseKeys('Ctrl +'), null);
  assert.equal(isValidKeyCombination('Alt + K'), true);
  assert.equal(isValidKeyCombination('Alt'), false);
});

test('matchShortcut requires exact modifiers and key', () => {
  const pressed = { ctrl: true, shift: false, alt: false, meta: false, key: 'K' };
  assert.equal(matchShortcut(pressed, 'Ctrl + K'), true);
  assert.equal(matchShortcut(pressed, 'Ctrl + Shift + K'), false);
});

test('findActiveShortcut ignores inactive pages and prefers the current page', () => {
  const pressed = parseKeys('Ctrl + K');
  const inactive = { page: '/settings', keys: parseKeys('Ctrl + K'), name: 'inactive' };
  const global = { page: '*', keys: parseKeys('Ctrl + K'), name: 'global' };
  const current = { page: '/home', keys: parseKeys('Ctrl + K'), name: 'current' };

  assert.equal(findActiveShortcut([inactive, global, current], pressed, '/home'), current);
  assert.equal(findActiveShortcut([inactive, global], pressed, '/home'), global);
});
