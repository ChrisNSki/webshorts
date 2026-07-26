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

test('findActiveShortcut can opt into event.code for numpad-specific shortcuts', () => {
  const pressed = {
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
    key: '1',
    code: 'NUMPAD1',
  };
  const normalNumber = { page: '*', keys: parseKeys('1'), name: 'normal' };
  const numpadNumber = { page: '*', keys: parseKeys('Numpad1'), useCode: true, name: 'numpad' };

  assert.equal(findActiveShortcut([normalNumber, numpadNumber], pressed, '/home'), numpadNumber);
  assert.equal(findActiveShortcut([numpadNumber], { ...pressed, code: 'DIGIT1' }, '/home'), null);
});

test('event.key remains the default matching behavior', () => {
  const pressed = {
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
    key: '1',
    code: 'NUMPAD1',
  };
  const normalNumber = { page: '*', keys: parseKeys('1'), name: 'normal' };

  assert.equal(findActiveShortcut([normalNumber], pressed, '/home'), normalNumber);
});
