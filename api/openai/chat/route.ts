

// File: web/app/api/openai/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // Validate payload
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload: 'messages' must be an array." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    // Fallback to dummy response if no API key
    if (!apiKey) {
      const lastMessage = messages[messages.length - 1]?.content || '';
      return NextResponse.json({
        message: `🤖 (dummy response): ${lastMessage}`
      });
    }

    // Call OpenAI Chat Completion API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data.error?.message || 'OpenAI API error';
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      return NextResponse.json({ error: 'No assistant response.' }, { status: 500 });
    }

    return NextResponse.json({ message: reply });
  } catch (err: any) {
    console.error('Chat route error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}