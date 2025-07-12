import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useShortcuts } from './ShortcutProvider.jsx';
import { keysToString } from '../utils/parseKeys.js';

const HelpDialog = () => {
  const { helpDialogOpen, setHelpDialogOpen, shortcuts, options, currentPage } = useShortcuts();

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

  return (
    <Dialog.Root open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
          style={{
            animation: 'fadeIn 150ms ease-out',
          }}
        />
        <Dialog.Content
          className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 p-6 max-h-[90vh] overflow-y-auto'
          style={{
            width: options.dialogWidth || 800,
            height: options.dialogHeight || 600,
            animation: 'slideIn 200ms ease-out',
          }}
        >
          <div className='flex items-center justify-between mb-6'>
            <Dialog.Title className='text-2xl font-bold text-gray-900'>Keyboard Shortcuts</Dialog.Title>
            <Dialog.Close className='text-gray-400 hover:text-gray-600 transition-colors'>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </Dialog.Close>
          </div>

          {currentShortcuts.length === 0 ? (
            <div className='text-center text-gray-500 py-8'>
              <svg className='mx-auto h-12 w-12 text-gray-400 mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
              <p>No shortcuts available for this page</p>
              <p className='text-sm mt-2'>Press Shift + ? to open this dialog from anywhere</p>
            </div>
          ) : (
            <div className='space-y-6'>
              {Object.entries(groupedShortcuts).map(([page, pageShortcuts]) => (
                <div key={page} className='space-y-3'>
                  <h3 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2'>{page === 'Global' ? 'Global Shortcuts' : `Page: ${page}`}</h3>
                  <div className='grid gap-3' style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
                    {pageShortcuts.map((shortcut, index) => (
                      <div key={`${shortcut.page}:${shortcut.keysString}:${index}`} className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'>
                        <div className='flex-shrink-0'>
                          <kbd className='px-2 py-1 text-sm font-mono bg-white border border-gray-300 rounded text-gray-700 shadow-sm'>{shortcut.keysString}</kbd>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium text-gray-900'>{shortcut.shortName || shortcut.action.name || 'Unnamed Action'}</div>
                          {options.showDescriptions && shortcut.description && <div className='text-sm text-gray-600 mt-1'>{shortcut.description}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='mt-6 pt-4 border-t border-gray-200'>
            <p className='text-sm text-gray-500 text-center'>
              Press <kbd className='px-1 py-0.5 text-xs font-mono bg-gray-100 border border-gray-300 rounded'>Shift + ?</kbd> to open this dialog from anywhere
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
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
    </Dialog.Root>
  );
};

export default HelpDialog;
