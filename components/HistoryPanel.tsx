import React, { useState } from 'react';
import type { SearchHistoryItem } from '../types';
import HistoryIcon from './icons/HistoryIcon';
import TrashIcon from './icons/TrashIcon';

interface HistoryPanelProps {
  history: SearchHistoryItem[];
  onRerunSearch: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onRerunSearch, onClearHistory }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 right-0 -translate-y-1/2 z-30 bg-slate-800 p-3 rounded-l-lg border border-r-0 border-slate-600 shadow-lg hover:bg-slate-700 transition-colors"
        aria-label="Toggle search history"
        aria-expanded={isOpen}
      >
        <HistoryIcon className="w-6 h-6 text-sky-400" />
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-slate-900/95 backdrop-blur-sm border-l border-slate-700 shadow-2xl z-20 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Search History"
      >
        <div className="flex flex-col h-full">
          <header className="p-4 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
            <h2 className="text-lg font-semibold text-white">Search History</h2>
            <button
              onClick={onClearHistory}
              disabled={history.length === 0}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
              aria-label="Clear all search history"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </header>

          <div className="flex-grow overflow-y-auto">
            {history.length === 0 ? (
              <p className="p-4 text-slate-500 text-center">Your search history is empty.</p>
            ) : (
              <ul className="divide-y divide-slate-800">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onRerunSearch(item);
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-4 hover:bg-slate-800 transition-colors focus:outline-none focus:bg-slate-800"
                    >
                      <p className="font-medium text-sky-400 truncate">{item.seedKeyword}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.options.count} keywords &middot; Type: {item.options.type}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryPanel;
