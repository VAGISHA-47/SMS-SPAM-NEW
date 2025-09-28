import { GoogleGenAI, Type } from "@google/genai";
import { Classification, ClassificationResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const classificationSchema = {
    type: Type.OBJECT,
    properties: {
        classification: {
            type: Type.STRING,
            description: `The classification of the message. Must be either "${Classification.SPAM}" or "${Classification.NOT_SPAM}".`,
            enum: [Classification.SPAM, Classification.NOT_SPAM],
        },
        confidence: {
            type: Type.NUMBER,
            description: "A confidence score from 0.0 to 1.0 on the classification.",
        },
    },
    required: ["classification", "confidence"],
};

export async function classifyMessage(messageContent: string): Promise<ClassificationResult> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Classify the following SMS message: "${messageContent}"`,
            config: {
                systemInstruction: `You are an expert SMS spam classifier. Your task is to analyze an SMS message and determine if it is spam or not. Respond ONLY with a JSON object that conforms to the provided schema. The classification must be exactly "${Classification.SPAM}" or "${Classification.NOT_SPAM}".`,
                responseMimeType: "application/json",
                responseSchema: classificationSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        if (
            (parsed.classification === Classification.SPAM || parsed.classification === Classification.NOT_SPAM) &&
            typeof parsed.confidence === 'number'
        ) {
             return {
                classification: parsed.classification,
                confidence: parsed.confidence,
            };
        } else {
            console.error("Invalid classification response:", parsed);
            throw new Error("Received invalid data structure from Gemini API.");
        }

    } catch (error) {
        console.error("Error classifying message with Gemini API:", error);
        // Fallback in case of API error
        return {
            classification: Classification.NOT_SPAM,
            confidence: 0.5,
        };
    }
}
