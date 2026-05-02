import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getSystemPrompt = (topic, difficulty) => `
Return ONLY valid JSON. No conversational text. No markdown formatting (no \`\`\`json).
Topic: ${topic}
Difficulty: ${difficulty}

Format:
{
  "questions": [
    { "type":"mcq", "question":"text", "options":["a","b","c","d"], "answer":"correct option text" },
    { "type":"true_false", "question":"text", "answer": true },
    { "type":"short", "question":"text", "answer":"sample short answer" }
  ]
}

Generate exactly 5 questions based on the topic.
`;

// Helper to extract JSON from raw string
const extractJSON = (text) => {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI failed to return valid JSON");
  return JSON.parse(text.slice(start, end + 1));
};

export const generateQuestions = async ({ topic, difficulty }) => {
  const mode = process.env.AI_MODE || "ollama"; // 'ollama' or 'gemini'
  const prompt = getSystemPrompt(topic, difficulty);

  if (mode === "gemini") {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return extractJSON(response.text());
  } else {
    // Default to Ollama (Local)
    const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
      model: process.env.OLLAMA_MODEL || "gemma3:1b",
      prompt,
      stream: false,
    });
    return extractJSON(response.data.response);
  }
};
