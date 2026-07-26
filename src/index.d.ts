import type { CSSProperties, ReactNode } from 'react';

export interface KeyObject {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  key: string | null;
  code?: string | null;
}

export interface Shortcut {
  keys: string;
  action: () => void;
  description?: string;
  shortName?: string;
  /**
   * Match KeyboardEvent.code instead of KeyboardEvent.key.
   * Useful for physical-key and numpad-specific shortcuts.
   * @default false
   */
  useCode?: boolean;
  [key: string]: unknown;
}

export interface WebShortsOptions {
  debug?: boolean;
  showDescriptions?: boolean;
  helpDialogColumns?: number;
  dialogWidth?: number | string;
  dialogHeight?: number | string;
}

export type WebShortsConfig = {
  WEBSHORTS_OPTIONS?: WebShortsOptions;
  [page: string]: WebShortsOptions | Shortcut[] | undefined;
};

export interface WebShortsProviderProps {
  children: ReactNode;
  config?: WebShortsConfig | null;
  currentPage?: string;
  className?: string;
  style?: CSSProperties;
}

export function WebShortsProvider(props: WebShortsProviderProps): ReactNode;

export interface ShortcutListenerProps extends Shortcut {
  page?: string | null;
  children?: ReactNode;
}

export function ShortcutListener(props: ShortcutListenerProps): ReactNode;

export interface WebShortsDialogProps {
  className?: string;
  style?: CSSProperties;
  description?: string;
  [key: string]: unknown;
}

export function WebShortsDialog(props: WebShortsDialogProps): ReactNode;

export function useShortcuts(): {
  shortcuts: Array<Shortcut & { page: string; keysString: string; keys: unknown }>;
  registerShortcut: (shortcut: Shortcut, page?: string) => void;
  unregisterShortcut: (keys: string, page?: string, useCode?: boolean) => void;
  helpDialogOpen: boolean;
  setHelpDialogOpen: (open: boolean) => void;
  options: WebShortsOptions;
  currentPage: string;
};

export function parseKeys(keyString: string): KeyObject | null;
export function keysToString(keyObj: KeyObject | null): string;
export function matchShortcut(pressed: KeyObject, shortcut: KeyObject | string): boolean;
export function eventToKeyObj(event: KeyboardEvent): KeyObject;
export function isValidKeyCombination(keyString: string): boolean;
export function findActiveShortcut<T extends { page: string; keys: KeyObject | string; useCode?: boolean }>(
  shortcuts: Iterable<T>,
  pressedKeys: KeyObject,
  currentPage: string,
): T | null;
export function debugToast(message: string, type?: 'success' | 'error' | 'warning' | 'info'): void;
export function debugShortcutRegistration(keys: string, action: string, page: string): void;
export function debugShortcutExecution(keys: string, action: string, success: boolean, error?: string | null): void;
export function debugShortcutNotFound(keys: string, page: string): void;
export function debugHelpDialog(shortcutCount: number): void;
