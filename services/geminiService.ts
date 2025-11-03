import { GoogleGenAI, Type } from "@google/genai";
import type { KeywordData, SearchOptions, KeywordCluster } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function* streamLowCompetitionKeywords(seedKeyword: string, options: SearchOptions): AsyncGenerator<KeywordData> {
    let prompt = `Based on the seed keyword "${seedKeyword}", generate a list of ${options.count} related long-tail keywords.`;

    if (options.type !== 'Any') {
        switch(options.type) {
            case 'Questions':
                prompt += ` The keywords should be phrased as questions.`;
                break;
            case 'Commercial':
                prompt += ` The keywords should have commercial or transactional intent.`;
                break;
            case 'Informational':
                prompt += ` The keywords should have informational intent.`;
                break;
        }
    }

    if (options.negatives && options.negatives.trim() !== '') {
        prompt += ` Do not include any keywords that contain the following terms: ${options.negatives}.`;
    }
    
    prompt += ` For each keyword, provide an estimated monthly search volume, analyze its competition level (Low, Medium, or High), and briefly justify your competition analysis. Prioritize keywords with lower competition that present a good ranking opportunity.`;
    prompt += `\n\nFor each keyword, return a single line containing a valid JSON object with the following keys: "keyword", "searchVolume", "competition", "justification". The "searchVolume" should be a string range (e.g., '100-1k'). The "competition" must be one of "Low", "Medium", or "High". Do NOT use markdown code blocks, and do not wrap the output in a JSON array. Each JSON object must be on its own line.`;

    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.5,
            },
        });
        
        let buffer = '';
        for await (const chunk of response) {
            buffer += chunk.text;
            let newlineIndex;
            while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                const line = buffer.substring(0, newlineIndex).trim();
                buffer = buffer.substring(newlineIndex + 1);
                if (line) {
                    try {
                        const keyword = JSON.parse(line);
                        yield keyword as KeywordData;
                    } catch (e) {
                        console.warn("Failed to parse streaming JSON line:", line, e);
                    }
                }
            }
        }

        if (buffer.trim()) {
            try {
                const keyword = JSON.parse(buffer);
                yield keyword as KeywordData;
            } catch (e) {
                console.warn("Failed to parse final JSON buffer:", buffer, e);
            }
        }
    } catch (error) {
        console.error("Error streaming keywords from Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate keywords: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching keywords.");
    }
};

export async function clusterKeywords(keywords: KeywordData[]): Promise<KeywordCluster[]> {
    if (keywords.length === 0) return [];
    
    const keywordList = keywords.map(k => k.keyword);

    const prompt = `Analyze the following list of keywords and group them into semantically related clusters based on user intent. For each cluster, provide a concise, descriptive name that summarizes the topic. The keywords for each cluster should be an array of the exact keyword strings from the input list.

Keyword List:
${JSON.stringify(keywordList)}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        clusters: {
                            type: Type.ARRAY,
                            description: "An array of keyword clusters.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    clusterName: {
                                        type: Type.STRING,
                                        description: "A descriptive name for the keyword cluster."
                                    },
                                    keywords: {
                                        type: Type.ARRAY,
                                        description: "An array of keyword strings belonging to this cluster.",
                                        items: { type: Type.STRING }
                                    }
                                },
                                required: ['clusterName', 'keywords']
                            }
                        }
                    },
                    required: ['clusters']
                },
            }
        });

        const keywordMap = new Map(keywords.map(kw => [kw.keyword, kw]));
        const parsedResponse = JSON.parse(response.text);
        
        const clusters: KeywordCluster[] = parsedResponse.clusters.map((cluster: any) => ({
            clusterName: cluster.clusterName,
            keywords: cluster.keywords
                .map((kwString: string) => keywordMap.get(kwString))
                .filter((kw: KeywordData | undefined): kw is KeywordData => kw !== undefined)
        })).filter((c: KeywordCluster) => c.keywords.length > 0);

        return clusters;
    } catch (error) {
        console.error("Error clustering keywords:", error);
        throw new Error("Failed to group keywords into clusters.");
    }
}
