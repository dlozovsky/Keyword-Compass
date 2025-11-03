export type CompetitionLevel = 'Low' | 'Medium' | 'High';
export type KeywordType = 'Any' | 'Questions' | 'Commercial' | 'Informational';

export interface KeywordData {
  keyword: string;
  searchVolume: string;
  competition: CompetitionLevel;
  justification: string;
}

export interface SearchOptions {
  count: number;
  type: KeywordType;
  negatives: string;
}

export type SortableKey = 'keyword' | 'searchVolume' | 'competition';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: SortableKey;
  direction: SortDirection;
}

export interface KeywordCluster {
  clusterName: string;
  keywords: KeywordData[];
}
