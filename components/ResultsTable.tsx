import React, { useState, useMemo } from 'react';
import type { KeywordData, CompetitionLevel, SortConfig, SortableKey, SortDirection } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import SortIcon from './icons/SortIcon';

interface ResultsTableProps {
  keywords: KeywordData[];
}

const competitionStyles: Record<CompetitionLevel, string> = {
  Low: 'bg-green-500/10 text-green-400 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  High: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const CompetitionBadge: React.FC<{ level: CompetitionLevel }> = ({ level }) => (
  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${competitionStyles[level]}`}>
    {level}
  </span>
);

const parseVolume = (volumeStr: string): number => {
    if (!volumeStr) return 0;
    const lowerBound = volumeStr.split('-')[0].toLowerCase().trim().replace(/,/g, '');
    let num = parseFloat(lowerBound);
    if (isNaN(num)) return 0;
    if (lowerBound.includes('k')) num *= 1000;
    if (lowerBound.includes('m')) num *= 1000000;
    return num;
};

const competitionOrder: Record<CompetitionLevel, number> = { 'Low': 0, 'Medium': 1, 'High': 2 };

const ResultsTable: React.FC<ResultsTableProps> = ({ keywords }) => {
  const [filter, setFilter] = useState<CompetitionLevel | 'All'>('All');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'competition', direction: 'asc' });

  const processedKeywords = useMemo(() => {
    let filtered = keywords.filter(k => filter === 'All' || k.competition === filter);

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch(sortConfig.key) {
            case 'searchVolume':
                aValue = parseVolume(a.searchVolume);
                bValue = parseVolume(b.searchVolume);
                break;
            case 'competition':
                aValue = competitionOrder[a.competition];
                bValue = competitionOrder[b.competition];
                break;
            default: // keyword
                aValue = a.keyword.toLowerCase();
                bValue = b.keyword.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [keywords, filter, sortConfig]);

  const requestSort = (key: SortableKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExportCSV = () => {
    const headers = ['"Keyword"', '"Search Volume"', '"Competition"', '"Justification"'];
    const escapeCsvField = (field: string) => `"${String(field).replace(/"/g, '""')}"`;
    const rows = processedKeywords.map(row => 
      [row.keyword, row.searchVolume, row.competition, row.justification]
      .map(escapeCsvField).join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'keyword-compass-results.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const SortableHeader: React.FC<{ sortKey: SortableKey, children: React.ReactNode, className?: string }> = ({ sortKey, children, className }) => (
    <th className={`p-4 ${className}`}>
        <button onClick={() => requestSort(sortKey)} className="flex items-center gap-1.5 group">
            <span>{children}</span>
            <SortIcon
                className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors"
                direction={sortConfig?.key === sortKey ? sortConfig.direction : undefined}
            />
        </button>
    </th>
  );
  
  if (keywords.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg overflow-hidden">
       <div className="p-4 flex flex-wrap justify-between items-center gap-4 border-b border-slate-700 bg-slate-800/20">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-400">Filter by competition:</span>
                {(['All', 'Low', 'Medium', 'High'] as const).map(level => (
                    <button
                        key={level}
                        onClick={() => setFilter(level)}
                        className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${filter === level ? 'bg-sky-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                    >
                        {level}
                    </button>
                ))}
            </div>
            <button
                onClick={handleExportCSV}
                aria-label="Export results to CSV"
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-md text-sm font-medium hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-all"
            >
                <DownloadIcon className="w-4 h-4" />
                <span>Export CSV</span>
            </button>
        </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-700 text-sm text-slate-400">
            <tr>
              <SortableHeader sortKey="keyword" className="w-1/3">Keyword</SortableHeader>
              <SortableHeader sortKey="searchVolume">Search Volume</SortableHeader>
              <SortableHeader sortKey="competition">Competition</SortableHeader>
              <th className="p-4 w-1/3">Justification</th>
              <th className="p-4 text-center">SERP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {processedKeywords.map((item, index) => (
              <tr key={index} className="hover:bg-slate-800 transition-colors duration-200 animate-fade-in">
                <td className="p-4 font-medium text-slate-200">{item.keyword}</td>
                <td className="p-4 text-slate-300">{item.searchVolume}</td>
                <td className="p-4">
                  <CompetitionBadge level={item.competition} />
                </td>
                <td className="p-4 text-sm text-slate-400">{item.justification}</td>
                <td className="p-4 text-center">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(item.keyword)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Check SERP"
                    aria-label={`Check SERP for ${item.keyword}`}
                    className="inline-block text-slate-500 hover:text-sky-400 transition-colors duration-200"
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
