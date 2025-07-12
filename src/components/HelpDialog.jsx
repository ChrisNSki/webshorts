import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useShortcuts } from './ShortcutProvider.jsx';
import { keysToString } from '../utils/parseKeys.js';

const HelpDialog = () => {
  const { helpDialogOpen, setHelpDialogOpen, shortcuts, options, currentPage } = useShortcuts();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Filter shortcuts for current page and global shortcuts
  const currentShortcuts = shortcuts.filter((shortcut) => shortcut.page === currentPage || shortcut.page === '*');

  // Group shortcuts by page
  const groupedShortcuts = currentShortcuts.reduce((acc, shortcut) => {
    const page = shortcut.page === '*' ? 'Global' : shortcut.page;
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
          background-color: color-mix(in oklab, var(--color-black) /* #000 = #000000 */ 50%, transparent);
          pointer-events: auto;
        }

        .webshorts-content {
          background-color: #ffffff;
          position: fixed;
          display: grid;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10000;
          animation: webshorts-slideIn 200ms ease-out;
          pointer-events: auto;
          width: 100%;
          gap: 1rem;
          border-radius: 0.5rem;
          padding: 0 3rem 1.5rem 3rem;
        }

        .webshorts-header {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .webshorts-close-button {
          background-color: transparent;
          border: none;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .webshorts-close-button:hover {
          background-color: #f0f0f0;
        }

        .webshorts-empty-icon {
          margin: 0 auto;
          height: 3rem;
          width: 3rem;
          margin-bottom: 1rem;
        }

        .webshorts-empty-text {
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .webshorts-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .webshorts-section-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid #e0e0e0;
        }



        .webshorts-grid {
          display: grid;
          gap: 0.75rem;
        }

        .webshorts-shortcut-item {
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
        }

        .webshorts-shortcut-key {
          font-family: monospace;
          flex-shrink: 0;
          font-size: 0.875rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          background-color: #f0f0f0;
          color: #000000;
        }

        .webshorts-shortcut-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #000000;
        }

        .webshorts-shortcut-description {
          font-size: 0.875rem;
          color: #000000;
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
          font-size: 0.875rem;
          color: #000000;
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
          <Dialog.Overlay className='webshorts-overlay' />
          <Dialog.Content
            className='webshorts-content'
            style={{
              width: options.dialogWidth || 800,
              height: options.dialogHeight || 600,
            }}
          >
            <div className='webshorts-header'>
              <Dialog.Title>Keyboard Shortcuts</Dialog.Title>
              <Dialog.Close className='webshorts-close-button'>
                <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <line x1='18' y1='6' x2='6' y2='18'></line>
                  <line x1='6' y1='6' x2='18' y2='18'></line>
                </svg>
              </Dialog.Close>
            </div>

            {currentShortcuts.length === 0 ? (
              <div>
                <svg className='webshorts-empty-icon' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
                <p>No shortcuts available for this page</p>
                <p className='webshorts-empty-text'>Press Shift + ? to open this dialog from anywhere</p>
              </div>
            ) : (
              <div className='webshorts-sections'>
                {Object.entries(groupedShortcuts).map(([page, pageShortcuts]) => (
                  <div key={page}>
                    <h3 className='webshorts-section-title'>{page === 'Global' ? 'Global Shortcuts' : `Page: ${page}`}</h3>
                    <div className='webshorts-grid' style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
                      {pageShortcuts.map((shortcut, index) => (
                        <div key={`${shortcut.page}:${shortcut.keysString}:${index}`} className='webshorts-shortcut-item'>
                          <div className='webshorts-shortcut-key'>
                            <kbd>{shortcut.keysString}</kbd>
                          </div>
                          <div className='webshorts-shortcut-content'>
                            <div className='webshorts-shortcut-name'>{shortcut.shortName || shortcut.action.name || 'Unnamed Action'}</div>
                            {options.showDescriptions && shortcut.description && <div className='webshorts-shortcut-description'>{shortcut.description}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className='webshorts-footer'>
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
