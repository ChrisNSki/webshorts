import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useShortcuts } from './ShortcutProvider.jsx';
import { keysToString } from '../utils/parseKeys.js';

const HelpDialog = ({
  className = '',
  style = {},
  overlayClassName = '',
  overlayStyle = {},
  contentClassName = '',
  contentStyle = {},
  headerClassName = '',
  headerStyle = {},
  closeButtonClassName = '',
  closeButtonStyle = {},
  sectionsClassName = '',
  sectionsStyle = {},
  sectionTitleClassName = '',
  sectionTitleStyle = {},
  gridClassName = '',
  gridStyle = {},
  shortcutItemClassName = '',
  shortcutItemStyle = {},
  shortcutKeyClassName = '',
  shortcutKeyStyle = {},
  shortcutContentClassName = '',
  shortcutContentStyle = {},
  shortcutNameClassName = '',
  shortcutNameStyle = {},
  shortcutDescriptionClassName = '',
  shortcutDescriptionStyle = {},
  footerClassName = '',
  footerStyle = {},
  emptyIconClassName = '',
  emptyIconStyle = {},
  emptyTextClassName = '',
  emptyTextStyle = {},
}) => {
  const { helpDialogOpen, setHelpDialogOpen, shortcuts, options, currentPage } = useShortcuts();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Filter shortcuts for current page and global shortcuts
  const currentShortcuts = shortcuts.filter((shortcut) => shortcut.page === currentPage || shortcut.page === '*');

  // Group shortcuts by page
  const groupedShortcuts = currentShortcuts.reduce((acc, shortcut) => {
    const page = shortcut.page === '*' ? 'Global' : 'Current Page';
    if (!acc[page]) {
      acc[page] = [];
    }
    acc[page].push(shortcut);
    return acc;
  }, {});

  const gridCols = options.helpDialogColumns || 2;

  if (!mounted) {
    return null;
  }

  return (
    <>
      <style>{`
        .webshorts-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          animation: webshorts-fadeIn 150ms ease-out;
          background-color: var(--webshorts-overlay-bg, color-mix(in oklab, var(--color-black) /* #000 = #000000 */ 50%, transparent));
          pointer-events: auto;
        }

        .webshorts-content {
          background-color: var(--webshorts-content-bg, #ffffff);
          position: fixed;
          display: grid;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10000;
          animation: webshorts-slideIn 200ms ease-out;
          pointer-events: auto;
          width: 100%;
          gap: var(--webshorts-content-gap, 1rem);
          border-radius: var(--webshorts-content-border-radius, 0.5rem);
          padding: var(--webshorts-content-padding, 0 3rem 1.5rem 3rem);
        }

        .webshorts-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--webshorts-header-margin-bottom, 1.5rem);
          font-weight: var(--webshorts-header-font-weight, 600);
          font-size: var(--webshorts-header-font-size, 1.125rem);
        }

        .webshorts-close-button {
          background-color: var(--webshorts-close-button-bg, transparent);
          border: var(--webshorts-close-button-border, none);
          cursor: pointer;
          width: var(--webshorts-close-button-width, 32px);
          height: var(--webshorts-close-button-height, 32px);
          border-radius: var(--webshorts-close-button-border-radius, 0.5rem);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .webshorts-close-button:hover {
          background-color: var(--webshorts-close-button-hover-bg, #f0f0f0);
        }

        .webshorts-empty-icon {
          margin: var(--webshorts-empty-icon-margin, 0 auto);
          height: var(--webshorts-empty-icon-height, 3rem);
          width: var(--webshorts-empty-icon-width, 3rem);
          margin-bottom: var(--webshorts-empty-icon-margin-bottom, 1rem);
        }

        .webshorts-empty-text {
          font-size: var(--webshorts-empty-text-font-size, 0.875rem);
          margin-top: var(--webshorts-empty-text-margin-top, 0.5rem);
        }

        .webshorts-sections {
          display: flex;
          flex-direction: column;
          gap: var(--webshorts-sections-gap, 1.5rem);
        }

        .webshorts-section-title {
          font-size: var(--webshorts-section-title-font-size, 1rem);
          font-weight: var(--webshorts-section-title-font-weight, 600);
          margin-bottom: var(--webshorts-section-title-margin-bottom, 0.5rem);
          border-bottom: var(--webshorts-section-title-border-bottom, 1px solid #e0e0e0);
        }

        .webshorts-grid {
          display: grid;
          gap: var(--webshorts-grid-gap, 0.75rem);
        }

        .webshorts-shortcut-item {
          padding: var(--webshorts-shortcut-item-padding, 0.5rem);
          border-radius: var(--webshorts-shortcut-item-border-radius, 0.5rem);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          align-items: center;
          gap: var(--webshorts-shortcut-item-gap, 0.75rem);
        }

        .webshorts-shortcut-key {
          font-family: var(--webshorts-shortcut-key-font-family, monospace);
          flex-shrink: 0;
          font-size: var(--webshorts-shortcut-key-font-size, 0.875rem);
          padding: var(--webshorts-shortcut-key-padding, 0.25rem 0.5rem);
          border-radius: var(--webshorts-shortcut-key-border-radius, 0.25rem);
          background-color: var(--webshorts-shortcut-key-bg, #f0f0f0);
          color: var(--webshorts-shortcut-key-color, #000000);
        }

        .webshorts-shortcut-name {
          font-size: var(--webshorts-shortcut-name-font-size, 0.875rem);
          font-weight: var(--webshorts-shortcut-name-font-weight, 600);
          color: var(--webshorts-shortcut-name-color, #000000);
        }

        .webshorts-shortcut-description {
          font-size: var(--webshorts-shortcut-description-font-size, 0.875rem);
          color: var(--webshorts-shortcut-description-color, #000000);
        }

        .webshorts-shortcut-content {
          flex: 1;
          min-width: 0;
        }

        .webshorts-footer {
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: end;
          font-size: var(--webshorts-footer-font-size, 0.875rem);
          color: var(--webshorts-footer-color, #000000);
        }

        @keyframes webshorts-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes webshorts-slideIn {
          from { 
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>

      <Dialog.Root open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <Dialog.Portal container={typeof document !== 'undefined' ? document.body : undefined}>
          <Dialog.Overlay
            className={`webshorts-overlay ${overlayClassName}`}
            style={{
              '--webshorts-overlay-bg': overlayStyle['--webshorts-overlay-bg'],
              ...overlayStyle,
            }}
          />
          <Dialog.Content
            className={`webshorts-content ${contentClassName}`}
            style={{
              width: options.dialogWidth || 800,
              height: options.dialogHeight || 600,
              '--webshorts-content-bg': contentStyle['--webshorts-content-bg'],
              '--webshorts-content-gap': contentStyle['--webshorts-content-gap'],
              '--webshorts-content-border-radius': contentStyle['--webshorts-content-border-radius'],
              '--webshorts-content-padding': contentStyle['--webshorts-content-padding'],
              ...contentStyle,
            }}
            aria-describedby='webshorts-help-dialog-desc'
          >
            <span id='webshorts-help-dialog-desc' style={{ display: 'none' }}>
              This dialog lists all available keyboard shortcuts for this page.
            </span>
            <div
              className={`webshorts-header ${headerClassName}`}
              style={{
                '--webshorts-header-margin-bottom': headerStyle['--webshorts-header-margin-bottom'],
                '--webshorts-header-font-weight': headerStyle['--webshorts-header-font-weight'],
                '--webshorts-header-font-size': headerStyle['--webshorts-header-font-size'],
                ...headerStyle,
              }}
            >
              <Dialog.Title>Keyboard Shortcuts</Dialog.Title>
              <Dialog.Description>This dialog lists all available keyboard shortcuts for this page.</Dialog.Description>
              <Dialog.Close
                className={`webshorts-close-button ${closeButtonClassName}`}
                style={{
                  '--webshorts-close-button-bg': closeButtonStyle['--webshorts-close-button-bg'],
                  '--webshorts-close-button-border': closeButtonStyle['--webshorts-close-button-border'],
                  '--webshorts-close-button-width': closeButtonStyle['--webshorts-close-button-width'],
                  '--webshorts-close-button-height': closeButtonStyle['--webshorts-close-button-height'],
                  '--webshorts-close-button-border-radius': closeButtonStyle['--webshorts-close-button-border-radius'],
                  '--webshorts-close-button-hover-bg': closeButtonStyle['--webshorts-close-button-hover-bg'],
                  ...closeButtonStyle,
                }}
              >
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <line x1='18' y1='6' x2='6' y2='18'></line>
                  <line x1='6' y1='6' x2='18' y2='18'></line>
                </svg>
              </Dialog.Close>
            </div>

            {currentShortcuts.length === 0 ? (
              <div>
                <svg
                  className={`webshorts-empty-icon ${emptyIconClassName}`}
                  style={{
                    '--webshorts-empty-icon-margin': emptyIconStyle['--webshorts-empty-icon-margin'],
                    '--webshorts-empty-icon-height': emptyIconStyle['--webshorts-empty-icon-height'],
                    '--webshorts-empty-icon-width': emptyIconStyle['--webshorts-empty-icon-width'],
                    '--webshorts-empty-icon-margin-bottom': emptyIconStyle['--webshorts-empty-icon-margin-bottom'],
                    ...emptyIconStyle,
                  }}
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
                <p>No shortcuts available for this page</p>
                <p
                  className={`webshorts-empty-text ${emptyTextClassName}`}
                  style={{
                    '--webshorts-empty-text-font-size': emptyTextStyle['--webshorts-empty-text-font-size'],
                    '--webshorts-empty-text-margin-top': emptyTextStyle['--webshorts-empty-text-margin-top'],
                    ...emptyTextStyle,
                  }}
                >
                  Press Shift + ? to open this dialog from anywhere
                </p>
              </div>
            ) : (
              <div
                className={`webshorts-sections ${sectionsClassName}`}
                style={{
                  '--webshorts-sections-gap': sectionsStyle['--webshorts-sections-gap'],
                  ...sectionsStyle,
                }}
              >
                {Object.entries(groupedShortcuts).map(([page, pageShortcuts]) => (
                  <div key={page}>
                    <h3
                      className={`webshorts-section-title ${sectionTitleClassName}`}
                      style={{
                        '--webshorts-section-title-font-size': sectionTitleStyle['--webshorts-section-title-font-size'],
                        '--webshorts-section-title-font-weight': sectionTitleStyle['--webshorts-section-title-font-weight'],
                        '--webshorts-section-title-margin-bottom': sectionTitleStyle['--webshorts-section-title-margin-bottom'],
                        '--webshorts-section-title-border-bottom': sectionTitleStyle['--webshorts-section-title-border-bottom'],
                        ...sectionTitleStyle,
                      }}
                    >
                      {page === 'Global' ? 'Global Shortcuts' : 'Current Page Shortcuts'}
                    </h3>
                    <div
                      className={`webshorts-grid ${gridClassName}`}
                      style={{
                        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                        '--webshorts-grid-gap': gridStyle['--webshorts-grid-gap'],
                        ...gridStyle,
                      }}
                    >
                      {pageShortcuts.map((shortcut, index) => (
                        <div
                          key={`${shortcut.page}:${shortcut.keysString}:${index}`}
                          className={`webshorts-shortcut-item ${shortcutItemClassName}`}
                          style={{
                            '--webshorts-shortcut-item-padding': shortcutItemStyle['--webshorts-shortcut-item-padding'],
                            '--webshorts-shortcut-item-border-radius': shortcutItemStyle['--webshorts-shortcut-item-border-radius'],
                            '--webshorts-shortcut-item-gap': shortcutItemStyle['--webshorts-shortcut-item-gap'],
                            ...shortcutItemStyle,
                          }}
                        >
                          <div
                            className={`webshorts-shortcut-key ${shortcutKeyClassName}`}
                            style={{
                              '--webshorts-shortcut-key-font-family': shortcutKeyStyle['--webshorts-shortcut-key-font-family'],
                              '--webshorts-shortcut-key-font-size': shortcutKeyStyle['--webshorts-shortcut-key-font-size'],
                              '--webshorts-shortcut-key-padding': shortcutKeyStyle['--webshorts-shortcut-key-padding'],
                              '--webshorts-shortcut-key-border-radius': shortcutKeyStyle['--webshorts-shortcut-key-border-radius'],
                              '--webshorts-shortcut-key-bg': shortcutKeyStyle['--webshorts-shortcut-key-bg'],
                              '--webshorts-shortcut-key-color': shortcutKeyStyle['--webshorts-shortcut-key-color'],
                              ...shortcutKeyStyle,
                            }}
                          >
                            <kbd>{shortcut.keysString}</kbd>
                          </div>
                          <div
                            className={`webshorts-shortcut-content ${shortcutContentClassName}`}
                            style={{
                              ...shortcutContentStyle,
                            }}
                          >
                            <div
                              className={`webshorts-shortcut-name ${shortcutNameClassName}`}
                              style={{
                                '--webshorts-shortcut-name-font-size': shortcutNameStyle['--webshorts-shortcut-name-font-size'],
                                '--webshorts-shortcut-name-font-weight': shortcutNameStyle['--webshorts-shortcut-name-font-weight'],
                                '--webshorts-shortcut-name-color': shortcutNameStyle['--webshorts-shortcut-name-color'],
                                ...shortcutNameStyle,
                              }}
                            >
                              {shortcut.shortName || shortcut.action.name || 'Unnamed Action'}
                            </div>
                            {options.showDescriptions && shortcut.description && (
                              <div
                                className={`webshorts-shortcut-description ${shortcutDescriptionClassName}`}
                                style={{
                                  '--webshorts-shortcut-description-font-size': shortcutDescriptionStyle['--webshorts-shortcut-description-font-size'],
                                  '--webshorts-shortcut-description-color': shortcutDescriptionStyle['--webshorts-shortcut-description-color'],
                                  ...shortcutDescriptionStyle,
                                }}
                              >
                                {shortcut.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              className={`webshorts-footer ${footerClassName}`}
              style={{
                '--webshorts-footer-font-size': footerStyle['--webshorts-footer-font-size'],
                '--webshorts-footer-color': footerStyle['--webshorts-footer-color'],
                ...footerStyle,
              }}
            >
              <p>
                Press <kbd>Shift + ?</kbd> to open this dialog from anywhere.
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default HelpDialog;
