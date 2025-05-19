// File: api/src/routers/chat.js
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Configure OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /chat
 * Expects JSON body: { messages: Array<{ role: 'user'|'system'|'assistant', content: string }>, model?: string }
 * Responds with JSON: { ok: boolean, reply?: string, error?: string }
 */
router.post('/', async (req, res) => {
  try {
    const { messages, model } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid request: "messages" must be a non-empty array.',
      });
    }

    // Sanitize messages: drop any without string content
    const sanitized = messages.filter(m => typeof m.content === 'string' && m.content.trim() !== '');
    // Prepend system prompt to steer the AI as the Mentor Assistant
    const systemMessage = `You are PayoutPilot Mentor Assistant — a friendly, professional AI specialized in helping EdTech mentors use the PayoutPilot platform to track and manage their earnings. When a mentor asks a question or requests guidance, you should:

1. Understand their role
   - They need clear, concise explanations of session history, payout breakdowns (including custom rates, fees, and taxes), receipt downloads, payment status, and dispute processes.

2. Guide through key workflows
   - Show them how to filter sessions by date/type.
   - Explain how automatic payout calculations and tax breakdowns work.
   - Walk them through downloading or viewing receipts.
   - Direct them to the secure chat for clarifications or disputes.

3. Use mentor-centric language
   - Empathize with their need for transparency and timeliness.
   - Provide step-by-step instructions when they ask “how do I…?”
   - Offer gentle reminders of platform features (e.g. “Did you know you can run a dry-run simulation?”).

4. Anticipate edge cases
   - Invalid dates, missing data, or disputes.
   - If data isn’t available, explain next steps (e.g. “If you don’t see your session, contact support via chat.”).

5. Be professional, concise and positive
   - Keep tone upbeat and reassuring.
   - Use bullet points when listing steps.
   - Confirm when actions are completed (e.g. “Your receipt has been emailed.”).
`;
    sanitized.unshift({ role: 'system', content: systemMessage });
    if (sanitized.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid request: all messages must have non-empty string content.',
      });
    }

    // Fallback when API key is missing
    if (!process.env.OPENAI_API_KEY) {
      const lastUserMsg = sanitized
        .filter(m => m.role === 'user')
        .map(m => m.content)
        .pop() || '';
      return res.json({
        ok: true,
        reply: `✉️ Echo (no API key configured): ${lastUserMsg}`,
      });
    }

    // Determine model
    const chatModel = model || 'gpt-3.5-turbo';

    // Call OpenAI Chat API
    const response = await openai.chat.completions.create({
      model: chatModel,
      messages: sanitized,
    });

    const reply = response.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error('Empty response from OpenAI');
    }

    return res.json({ ok: true, reply });
  } catch (err) {
    console.error('❌ [ChatRouter] Error:', err);
    return res.status(500).json({
      ok: false,
      error: err.message || 'An unexpected error occurred.',
    });
  }
});

export default router;
