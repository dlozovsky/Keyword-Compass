import React, { useState, useEffect } from 'react';
import SearchIcon from './icons/SearchIcon';
import type { SearchOptions, KeywordType } from '../types';

interface KeywordInputProps {
  onSearch: (seedKeyword: string, options: SearchOptions, fromHistory?: boolean) => void;
  isLoading: boolean;
  initialQuery?: { seedKeyword: string; options: SearchOptions } | null;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ onSearch, isLoading, initialQuery }) => {
  const [seedKeyword, setSeedKeyword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [options, setOptions] = useState<SearchOptions>({
    count: 20,
    type: 'Any',
    negatives: '',
  });

  useEffect(() => {
    if (initialQuery) {
      setSeedKeyword(initialQuery.seedKeyword);
      setOptions(initialQuery.options);
      if (initialQuery.seedKeyword.trim() && !isLoading) {
        onSearch(initialQuery.seedKeyword.trim(), initialQuery.options, true);
      }
    }
  }, [initialQuery]);

  const handleOptionChange = <K extends keyof SearchOptions>(key: K, value: SearchOptions[K]) => {
    setOptions(prev => ({...prev, [key]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seedKeyword.trim() && !isLoading) {
      onSearch(seedKeyword.trim(), options, false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3">
      <div className="relative">
        <input
          type="text"
          value={seedKeyword}
          onChange={(e) => setSeedKeyword(e.target.value)}
          placeholder="Enter a seed keyword, e.g., 'digital marketing'"
          className="w-full pl-4 pr-36 py-4 bg-slate-800 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow duration-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !seedKeyword.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white rounded-full font-semibold hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <SearchIcon className="w-5 h-5" />
          <span>Find</span>
        </button>
      </div>

      <div className="text-center">
          <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm text-sky-400 hover:text-sky-300 font-medium py-1">
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>
      </div>

      {showAdvanced && (
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-2xl space-y-4 animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="keyword-count" className="block text-sm font-medium text-slate-300 mb-1">Number of Keywords</label>
                <input 
                    type="number"
                    id="keyword-count"
                    value={options.count}
                    onChange={e => handleOptionChange('count', Math.max(5, Math.min(50, parseInt(e.target.value, 10) || 5)))}
                    min="5"
                    max="50"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
            </div>
            <div>
                <label htmlFor="keyword-type" className="block text-sm font-medium text-slate-300 mb-1">Keyword Type</label>
                <div className="relative">
                    <select 
                        id="keyword-type"
                        value={options.type}
                        onChange={e => handleOptionChange('type', e.target.value as KeywordType)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none"
                    >
                        <option>Any</option>
                        <option>Questions</option>
                        <option>Commercial</option>
                        <option>Informational</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-300">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
           </div>
            <div>
                <label htmlFor="negative-keywords" className="block text-sm font-medium text-slate-300 mb-1">Negative Keywords</label>
                <input 
                    type="text"
                    id="negative-keywords"
                    value={options.negatives}
                    onChange={e => handleOptionChange('negatives', e.target.value)}
                    placeholder="e.g., free, cheap, course"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                 <p className="text-xs text-slate-500 mt-1">Comma-separated keywords to exclude from results.</p>
            </div>
        </div>
      )}
    </form>
  );
};

export default KeywordInput;
