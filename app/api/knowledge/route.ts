import { upsertReport } from '@/lib/pinecone';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const id = await upsertReport(text);

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('Error saving report:', error);
        return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
    }
}
