
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ReadingResponse, BigFiveProfile } from '../types';

// Ensure the API key is retrieved from the environment safely
// In browser environments, direct access to 'process' can throw a ReferenceError if not polyfilled
const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_SYSTEM_INSTRUCTION = `
We are the Archetypal Guidance Collective. We do not claim supernatural powers, but we offer deep reflection based on established psychological models (Big Five, Attachment Theory, Jungian Archetypes, CBT).

Our goal is to produce an empathic, trauma-informed reading.
We use micro-language profiling to infer mood and offer guidance.
We refer to ourselves as "We" or "The Collective" or "Us". We do not use "I", "As an AI", or "The engine".
`;

const OUTPUT_STRUCTURE = `
Output Structure (JSON ONLY):
1. energeticOverview: Symbolic language followed by a plain-language translation.
2. coreTraits: List of 3 core personality traits inferred with confidence level (0-100).
3. dominantArchetypes: 1-2 Jungian archetypes with behavioral indicators.
4. actionPlan: 3 concrete steps (Short term 1-6 weeks, Medium term, Long term 6+ months).
5. redFlags: A checklist of 3 cognitive distortions or behavioral pitfalls to watch for.
6. futureProjection: Path A (if action taken) and Path B (if status quo), with estimated probabilities.
7. closingWisdom: A poetic but psychologically grounded closing statement from the Collective.

Always append this safety disclaimer in spirit, though the UI will handle the legal text: This is for educational purposes only.
`;

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    energeticOverview: {
      type: Type.OBJECT,
      properties: {
        symbolic: { type: Type.STRING },
        translation: { type: Type.STRING },
      },
      required: ["symbolic", "translation"],
    },
    coreTraits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          trait: { type: Type.STRING },
          confidence: { type: Type.INTEGER },
          description: { type: Type.STRING },
        },
        required: ["trait", "confidence", "description"],
      },
    },
    dominantArchetypes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          behavioralIndicators: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["name", "description", "behavioralIndicators"],
      },
    },
    actionPlan: {
      type: Type.OBJECT,
      properties: {
        shortTerm: { type: Type.STRING },
        mediumTerm: { type: Type.STRING },
        longTerm: { type: Type.STRING },
      },
      required: ["shortTerm", "mediumTerm", "longTerm"],
    },
    redFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    futureProjection: {
      type: Type.OBJECT,
      properties: {
        pathA: {
          type: Type.OBJECT,
          properties: {
            pathName: { type: Type.STRING },
            description: { type: Type.STRING },
            probability: { type: Type.STRING },
          },
          required: ["pathName", "description", "probability"],
        },
        pathB: {
          type: Type.OBJECT,
          properties: {
            pathName: { type: Type.STRING },
            description: { type: Type.STRING },
            probability: { type: Type.STRING },
          },
          required: ["pathName", "description", "probability"],
        },
      },
      required: ["pathA", "pathB"],
    },
    closingWisdom: { type: Type.STRING },
  },
  required: [
    "energeticOverview",
    "coreTraits",
    "dominantArchetypes",
    "actionPlan",
    "redFlags",
    "futureProjection",
    "closingWisdom",
  ],
};

export const generateReading = async (userContext: string, userProfile?: BigFiveProfile | null): Promise<ReadingResponse> => {
  try {
    if (!API_KEY) {
      throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
    }

    let personalizedInstruction = BASE_SYSTEM_INSTRUCTION;

    if (userProfile) {
      personalizedInstruction += `
      
      USER CONTEXT (Big Five Profile):
      - Openness: ${userProfile.openness}/100
      - Conscientiousness: ${userProfile.conscientiousness}/100
      - Extraversion: ${userProfile.extraversion}/100
      - Agreeableness: ${userProfile.agreeableness}/100
      - Neuroticism: ${userProfile.neuroticism}/100
      
      IMPORTANT: Tailor the advice, tone, and archetype selection specifically for a person with this psychological profile. Speak as "We".
      `;
    }

    personalizedInstruction += OUTPUT_STRUCTURE;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `Analyze this situation and provide a psychological reading: "${userContext}"` }],
        },
      ],
      config: {
        systemInstruction: personalizedInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("The collective was silent. No response received.");

    const parsed = JSON.parse(text) as ReadingResponse;
    parsed.timestamp = Date.now(); // Add timestamp on generation
    return parsed;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
