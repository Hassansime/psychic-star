import { ReadingResponse, BigFiveProfile } from '../types';

const BASE_SYSTEM_INSTRUCTION = 
We are the Archetypal Guidance Collective. We provide deep psychological reflection based on Big Five, Jungian Archetypes, and CBT principles.

We refer to ourselves as "We" or "The Collective". We speak with empathy and wisdom.
;

const OUTPUT_STRUCTURE = 
Respond ONLY with valid JSON in this exact structure:
{
  "energeticOverview": {
    "symbolic": "A poetic symbolic description",
    "translation": "Plain language translation"
  },
  "coreTraits": [
    {"trait": "Trait name", "confidence": 85, "description": "Description"},
    {"trait": "Trait name", "confidence": 78, "description": "Description"},
    {"trait": "Trait name", "confidence": 72, "description": "Description"}
  ],
  "dominantArchetypes": [
    {
      "name": "Archetype name",
      "description": "Description of archetype",
      "behavioralIndicators": ["Indicator 1", "Indicator 2", "Indicator 3"]
    }
  ],
  "actionPlan": {
    "shortTerm": "Action for 1-6 weeks",
    "mediumTerm": "Action for medium term",
    "longTerm": "Action for 6+ months"
  },
  "redFlags": ["Warning 1", "Warning 2", "Warning 3"],
  "futureProjection": {
    "pathA": {
      "pathName": "Path with action",
      "description": "Description",
      "probability": "65%"
    },
    "pathB": {
      "pathName": "Path without action",
      "description": "Description",
      "probability": "35%"
    }
  },
  "closingWisdom": "A profound closing statement"
}
;

export const generateReading = async (userContext: string, userProfile?: BigFiveProfile | null): Promise<ReadingResponse> => {
  try {
    let systemPrompt = BASE_SYSTEM_INSTRUCTION;

    if (userProfile) {
      systemPrompt += 

USER PROFILE (Big Five):
- Openness: \/100
- Conscientiousness: \/100
- Extraversion: \/100
- Agreeableness: \/100
- Neuroticism: \/100

Tailor your response to this psychological profile.
;
    }

    systemPrompt += OUTPUT_STRUCTURE;

    const mockResponse: ReadingResponse = {
      energeticOverview: {
        symbolic: "The Crossroads of Integration - Where shadow meets light",
        translation: "You stand at a pivotal moment where past patterns intersect with future possibilities. Your journey invites wholeness."
      },
      coreTraits: [
        { trait: "Introspective", confidence: 88, description: "Deep self-awareness and tendency for reflection" },
        { trait: "Resilient", confidence: 82, description: "Capacity to bounce back from adversity" },
        { trait: "Conscientious", confidence: 79, description: "Detail-oriented and value-driven approach" }
      ],
      dominantArchetypes: [
        {
          name: "The Seeker",
          description: "One who pursues truth and meaning with dedication",
          behavioralIndicators: ["Asks deep questions", "Seeks understanding", "Values growth"]
        },
        {
          name: "The Sage",
          description: "The wisdom keeper within you",
          behavioralIndicators": ["Analytical thinking", "Pattern recognition", "Knowledge pursuit"]
        }
      ],
      actionPlan: {
        shortTerm: "Create a daily reflection practice. Spend 10 minutes journaling about your insights and emotions.",
        mediumTerm: "Develop deeper connections with like-minded seekers. Share your journey and learn from others' paths.",
        longTerm: "Integrate your learnings into a coherent life philosophy that guides your decisions and relationships."
      },
      redFlags: [
        "Overthinking can become paralysis - balance analysis with action",
        "Perfectionism may block your progress - embrace 'good enough'",
        "Isolation during reflection - ensure you maintain meaningful connections"
      ],
      futureProjection: {
        pathA: {
          pathName: "Path of Integration",
          description: "By embracing your insights and taking consistent action, you'll experience profound personal growth and authentic relationships.",
          probability: "68%"
        },
        pathB: {
          pathName: "Path of Stagnation",
          description: "Without active engagement with your insights, patterns may repeat and opportunities for growth will diminish.",
          probability: "32%"
        }
      },
      closingWisdom: "Remember: transformation begins with awareness, continues through action, and crystallizes through community. The Collective sees your potential."
    };

    mockResponse.timestamp = Date.now();
    return mockResponse;

  } catch (error) {
    console.error("Reading generation error:", error);
    throw new Error("Unable to generate reading at this time");
  }
};
