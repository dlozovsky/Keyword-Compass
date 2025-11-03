import React, { useState } from 'react';
import type { KeywordCluster, CompetitionLevel } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface ResultsClustersProps {
  clusters: KeywordCluster[];
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

const ClusterAccordion: React.FC<{ cluster: KeywordCluster, isInitiallyOpen: boolean }> = ({ cluster, isInitiallyOpen }) => {
    const [isOpen, setIsOpen] = useState(isInitiallyOpen);
    
    return (
        <div className="border-b border-slate-700 last:border-b-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-800 transition-colors"
                aria-expanded={isOpen}
                aria-controls={`cluster-content-${cluster.clusterName.replace(/\s+/g, '-')}`}
            >
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-sky-400">{cluster.clusterName}</h3>
                    <span className="text-sm px-2 py-0.5 bg-slate-700 text-slate-300 rounded-md">{cluster.keywords.length} keywords</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}/>
            </button>
            {isOpen && (
                <div id={`cluster-content-${cluster.clusterName.replace(/\s+/g, '-')}`} className="bg-slate-900/50 animate-fade-in overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-400">
                             <tr>
                                <th className="p-3 w-1/3">Keyword</th>
                                <th className="p-3">Search Volume</th>
                                <th className="p-3">Competition</th>
                                <th className="p-3 text-center">SERP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                             {cluster.keywords.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-800 transition-colors duration-200">
                                    <td className="p-3 font-medium text-slate-200">{item.keyword}</td>
                                    <td className="p-3 text-slate-300">{item.searchVolume}</td>
                                    <td className="p-3">
                                        <CompetitionBadge level={item.competition} />
                                    </td>
                                    <td className="p-3 text-center">
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
            )}
        </div>
    );
};

const ResultsClusters: React.FC<ResultsClustersProps> = ({ clusters }) => {
    
    const handleExportCSV = () => {
        const headers = ['"Cluster"', '"Keyword"', '"Search Volume"', '"Competition"', '"Justification"'];
        const escapeCsvField = (field: string) => `"${String(field).replace(/"/g, '""')}"`;
        const rows = clusters.flatMap(cluster => 
            cluster.keywords.map(row => 
                [cluster.clusterName, row.keyword, row.searchVolume, row.competition, row.justification]
                .map(escapeCsvField).join(',')
            )
        );
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'keyword-clusters.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (clusters.length === 0) return null;

    return (
        <div className="w-full max-w-6xl mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-slate-700 bg-slate-800/20">
                 <h2 className="text-xl font-semibold text-white">Keyword Clusters</h2>
                 <button
                    onClick={handleExportCSV}
                    aria-label="Export clustered results to CSV"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-md text-sm font-medium hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-all"
                >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Export CSV</span>
                </button>
            </div>
            <div>
                {clusters.map((cluster, index) => (
                    <ClusterAccordion key={cluster.clusterName} cluster={cluster} isInitiallyOpen={index < 3} />
                ))}
            </div>
        </div>
    );
};

export default ResultsClusters;