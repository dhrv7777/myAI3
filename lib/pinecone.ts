import { Pinecone } from '@pinecone-database/pinecone';
import { PINECONE_TOP_K } from '@/config';
import { searchResultsToChunks, getSourcesFromChunks, getContextFromSources } from '@/lib/sources';
import { PINECONE_INDEX_NAME } from '@/config';

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not set');
}

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

export async function searchPinecone(
    query: string,
): Promise<string> {
    const results = await pineconeIndex.namespace('default').searchRecords({
        query: {
            inputs: {
                text: query,
            },
            topK: PINECONE_TOP_K,
        },
        fields: ['text', 'pre_context', 'post_context', 'source_url', 'source_description', 'source_type', 'order'],
    });

    const chunks = searchResultsToChunks(results);
    const sources = getSourcesFromChunks(chunks);
    const context = getContextFromSources(sources);
    return `< results > ${context} </results>`;
}

import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function upsertReport(text: string) {
    const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-small'),
        value: text,
    });

    const id = `report-${Date.now()}`;

    await pineconeIndex.namespace('default').upsertRecords({
        records: [
            {
                id,
                values: embedding,
                metadata: {
                    text,
                    type: 'medical_report',
                    date: new Date().toISOString(),
                },
            },
        ],
    });

    return id;
}