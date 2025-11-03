import React, { useState, useCallback, useEffect } from 'react';
import type { KeywordData, SearchOptions, KeywordCluster, SearchHistoryItem } from './types';
import { streamLowCompetitionKeywords, clusterKeywords } from './services/geminiService';
import KeywordInput from './components/KeywordInput';
import ResultsTable from './components/ResultsTable';
import ResultsClusters from './components/ResultsClusters';
import LoadingSpinner from './components/LoadingSpinner';
import CompassIcon from './components/icons/CompassIcon';
import HistoryPanel from './components/HistoryPanel';

const App: React.FC = () => {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [clusters, setClusters] = useState<KeywordCluster[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClustering, setIsClustering] = useState<boolean>(false);
  const [isStreamFinished, setIsStreamFinished] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [activeSearchQuery, setActiveSearchQuery] = useState<{ seedKeyword: string; options: SearchOptions } | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('keywordCompassHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
      localStorage.removeItem('keywordCompassHistory');
    }
  }, []);

  const handleSearch = useCallback(async (seedKeyword: string, options: SearchOptions, fromHistory: boolean = false) => {
    if (!fromHistory) {
      const newHistoryItem: SearchHistoryItem = {
        id: `${seedKeyword}-${new Date().getTime()}`,
        seedKeyword,
        options,
        timestamp: Date.now(),
      };
      
      setHistory(prev => {
        if (prev[0]?.seedKeyword === newHistoryItem.seedKeyword && JSON.stringify(prev[0]?.options) === JSON.stringify(newHistoryItem.options)) {
          return prev;
        }
        const updatedHistory = [newHistoryItem, ...prev].slice(0, 20);
        localStorage.setItem('keywordCompassHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    }

    setIsLoading(true);
    setIsClustering(false);
    setIsStreamFinished(false);
    setError(null);
    setKeywords([]);
    setClusters([]);
    
    try {
      for await (const result of streamLowCompetitionKeywords(seedKeyword, options)) {
        if (isLoading) setIsLoading(false);
        setKeywords(prev => [...prev, result]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setIsStreamFinished(true);
    }
  }, [isLoading]);

  const handleRerunSearch = useCallback((item: SearchHistoryItem) => {
    setActiveSearchQuery({ seedKeyword: item.seedKeyword, options: item.options });
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('keywordCompassHistory');
  }, []);

  useEffect(() => {
    const performClustering = async () => {
      if (keywords.length < 5) return;

      setIsClustering(true);
      try {
        const clusterResults = await clusterKeywords(keywords);
        setClusters(clusterResults);
      } catch (err) {
        console.error("Clustering failed:", err);
      } finally {
        setIsClustering(false);
      }
    };

    if (isStreamFinished && keywords.length > 0) {
      performClustering();
    }
  }, [isStreamFinished, keywords]);

  const renderContent = () => {
    if (isLoading && keywords.length === 0) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <div className="text-center p-8 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">{error}</div>;
    }
    
    const hasKeywords = keywords.length > 0;
    const hasClusters = clusters.length > 0;

    return (
      <div className="w-full">
        {hasClusters ? (
          <ResultsClusters clusters={clusters} />
        ) : hasKeywords ? (
          <ResultsTable keywords={keywords} />
        ) : (
          <div className="text-center text-slate-500 mt-8">
            <p>Enter a keyword to discover low-competition opportunities.</p>
            <p>Let AI be your guide to better SEO.</p>
          </div>
        )}

        {isClustering && (
           <div className="mt-6 flex items-center justify-center gap-3 text-slate-400 animate-fade-in">
             <div className="w-5 h-5 rounded-full animate-spin border-2 border-solid border-sky-400 border-t-transparent"></div>
             <span>Grouping keywords into topical clusters...</span>
           </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-4 sm:p-8 pt-16 sm:pt-24 bg-grid-slate-700/[0.2]">
        <div className="absolute inset-0 -z-10 h-full w-full bg-slate-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <header className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-3 mb-2">
            <CompassIcon className="w-10 h-10 text-sky-400"/>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
            Keyword Compass
            </h1>
        </div>
        <p className="max-w-2xl text-slate-400">
          Unearth hidden gems. Find low-competition keywords with AI-powered analysis to boost your site's ranking.
        </p>
      </header>
      
      <div className="w-full flex justify-center mb-8 px-4">
        <KeywordInput onSearch={handleSearch} isLoading={isLoading || isClustering} initialQuery={activeSearchQuery} />
      </div>

      <div className="w-full flex justify-center px-4">
        {renderContent()}
      </div>

      <HistoryPanel
        history={history}
        onRerunSearch={handleRerunSearch}
        onClearHistory={handleClearHistory}
      />
    </main>
  );
};

export default App;
