const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

let groqClient = null;
if (process.env.GROQ_API_KEY) {
  try {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  } catch (e) {
    console.warn('Groq initialization warning:', e.message);
  }
}

router.post('/chat', async (req, res) => {
  try {
    const { message, problemTitle, problemDescription, language = 'English' } = req.body;
    if (!message) return res.status(400).json({ reply: 'Message is required' });

    const langInstruction = language === 'Hindi'
      ? 'Always respond in Hindi (Devanagari script).'
      : language === 'Hinglish'
      ? 'Always respond in Hinglish (mix of Hindi and English, written in Roman script). Example: "Is problem ko solve karne ke liye hum HashMap use karenge."'
      : language === 'Tamil'
      ? 'Always respond in Tamil language.'
      : language === 'Telugu'
      ? 'Always respond in Telugu language.'
      : language === 'Bengali'
      ? 'Always respond in Bengali language.'
      : 'Always respond in English.';

    const systemPrompt = problemTitle
      ? `You are an expert DSA coding mentor on CodeHub. ${langInstruction} The user is solving: "${problemTitle}". Description: "${problemDescription}". Help them with algorithmic intuition, step-by-step approach, time complexity, and edge cases. Do NOT give direct final copy-paste code unless requested. Be concise, motivating, and clear.`
      : `You are an expert DSA and technical interview assistant for CodeHub. ${langInstruction} Help users understand algorithms, data structures, complexity, and coding concepts concisely.`;

    if (groqClient) {
      try {
        const response = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 600,
        });
        const reply = response.choices[0]?.message?.content;
        if (reply) return res.json({ reply });
      } catch (groqErr) {
        console.warn('Groq API Chat call failed:', groqErr.message);
      }
    }

    const fallbackReplies = {
      English: `Here is a helpful tip for "${problemTitle || 'this problem'}": Consider breaking the problem down. First formulate the brute-force method to understand the invariant, then use a hash map, sliding window, or dynamic programming state transitions to eliminate redundant recalculation.`,
      Hinglish: `"${problemTitle || 'Is problem'}" ke liye pro-tip: Pehle brute force approach observe karo. Fir dekho kya hum HashMap ya Two Pointers use karke lookup ko O(1) me convert kar sakte hain!`
    };
    res.json({ reply: fallbackReplies[language] || fallbackReplies.English });
  } catch (err) {
    res.status(500).json({ reply: 'AI Assistant is currently busy. Please try again in a moment.' });
  }
});

router.post('/interview', async (req, res) => {
  try {
    const { message, history = [], problem } = req.body;
    const systemPrompt = `You are Alex, an expert Senior Software Engineer and Technical Interviewer at Google with 10+ years of experience. You are conducting a real technical interview.

Problem: "${problem?.title || 'Two Sum'}"
Description: "${problem?.description || 'Find two numbers that add up to target'}"
Difficulty: ${problem?.difficulty || 'Medium'}

STRICT BEHAVIORAL RULES:
1. INTRODUCTION: Greet warmly as Alex from Google. Introduce yourself and the problem briefly.
2. CLARIFICATION PHASE: Ask candidate for clarifying questions. Prompt for constraints or edge cases.
3. APPROACH GATE: The candidate MUST verbally explain their optimal approach before writing ANY code.
4. COMPLEXITY CHECK: Ask for Time and Space complexity.
5. CODING PHASE: Once approach approved, ask candidate to implement and discuss edge cases (empty input, duplicates, negative numbers).
6. END INTERVIEW: When user says "I have submitted my code" or "done", evaluate on Technical, Communication, and Logical Reasoning, followed by a clear HIRE or NO HIRE verdict.
7. Keep responses 2-4 sentences max, friendly yet rigorous.`;

    if (groqClient) {
      try {
        const response = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: message }
          ],
          max_tokens: 350,
          temperature: 0.7,
        });
        const reply = response.choices[0]?.message?.content;
        if (reply) return res.json({ reply });
      } catch (groqErr) {
        console.warn('Groq API Interview call failed:', groqErr.message);
      }
    }

    res.json({
      reply: `Hi, I'm Alex from Google! Great to meet you. Let's tackle "${problem?.title || 'this question'}". Before jumping straight into coding, could you walk me through your initial high-level approach and time complexity?`
    });
  } catch (err) {
    res.status(500).json({ reply: 'Interview session error. Please try again.' });
  }
});

module.exports = router;
